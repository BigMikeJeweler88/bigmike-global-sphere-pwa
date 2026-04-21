import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, poster } from './config'

// ── Dashboard Summary ──────────────────────────────────────────────────────
export const useDashboardSummary = () => useQuery({
  queryKey: ['dashboard-summary'],
  queryFn: async () => {
    const { count: total } = await supabase.from('clients').select('*', { count: 'exact', head: true })
    const { count: athletes } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'athlete')
    const { count: music } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'music')
    const { count: civilians } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'civilian')
    const { count: influencers } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'influencer')
    return { total_clients: total, athletes, music, civilians, influencers }
  },
  staleTime: 60_000,
})

export const useSituationRoom = useDashboardSummary

// ── Live Stats / Daily Report ──────────────────────────────────────────────
export const useLiveStats = () => useQuery({
  queryKey: ['live-stats'],
  queryFn: async () => {
    const { data } = await supabase.from('exceptional_stats').select('*').order('created_at', { ascending: false }).limit(20)
    return data || []
  },
  refetchInterval: 30_000,
})

export const useDailyReport = () => useQuery({
  queryKey: ['daily-report'],
  queryFn: async () => {
    const { data } = await supabase.from('daily_reports').select('*').order('created_at', { ascending: false }).limit(1).single()
    return data
  },
})

export const useSendDailyReport = () => useMutation({
  mutationFn: () => poster('/api/reports/send-now'),
})

// ── Athletes ───────────────────────────────────────────────────────────────
export const useAthletes = (filters?: any) => useQuery({
  queryKey: ['athletes', filters],
  queryFn: async () => {
    let q = supabase.from('clients').select('*').eq('client_type', 'athlete').order('name').limit(200)
    if (filters?.search) q = q.ilike('name', `%${filters.search}%`)
    if (filters?.league) q = q.eq('league', filters.league)
    const { data, count } = await q
    return { data: data || [], total: count || (data?.length ?? 0) }
  },
})

export const useAthlete = (id: any) => useQuery({
  queryKey: ['athlete', id],
  queryFn: async () => {
    const { data } = await supabase.from('clients').select('*').eq('id', id).single()
    return data
  },
  enabled: !!id,
})

export const useBonuses = () => useQuery({
  queryKey: ['bonuses'],
  queryFn: async () => {
    const { data } = await supabase.from('bonuses').select('*, clients(name, team, league)').order('created_at', { ascending: false }).limit(50)
    return data || []
  },
})

export const useFreeAgency = () => useQuery({
  queryKey: ['free-agency'],
  queryFn: async () => {
    const now = new Date().toISOString().split('T')[0]
    const nextYear = new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0]
    const { data } = await supabase.from('clients').select('id,name,team,league,position,salary_annual,contract_end_date').eq('client_type', 'athlete').lte('contract_end_date', nextYear).gte('contract_end_date', now).order('contract_end_date').limit(50)
    return data || []
  },
})

// ── Music ──────────────────────────────────────────────────────────────────
export const useMusicDashboard = () => useQuery({
  queryKey: ['music-dashboard'],
  queryFn: async () => {
    const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'music')
    return { total_artists: count }
  },
})

export const useMusicArtists = (filters?: any) => useQuery({
  queryKey: ['music-artists', filters],
  queryFn: async () => {
    let q = supabase.from('clients').select('*').eq('client_type', 'music').order('name').limit(200)
    if (filters?.search) q = q.ilike('name', `%${filters.search}%`)
    const { data } = await q
    return { data: data || [], total: data?.length || 0 }
  },
})

// ── Civilians ──────────────────────────────────────────────────────────────
export const useCiviliansDashboard = () => useQuery({
  queryKey: ['civilians-dashboard'],
  queryFn: async () => {
    const { count: total } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'civilian')
    const { count: withInsta } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'civilian').not('instagram_handle', 'is', null)
    return { total_civilians: total, with_instagram: withInsta }
  },
})

export const useCivilians = (filters?: any) => useQuery({
  queryKey: ['civilians', filters],
  queryFn: async () => {
    let q = supabase.from('clients').select('*').eq('client_type', 'civilian').order('name').limit(200)
    if (filters?.search) q = q.ilike('name', `%${filters.search}%`)
    const { data } = await q
    return { data: data || [], total: data?.length || 0 }
  },
})

// ── Influencers ────────────────────────────────────────────────────────────
export const useInfluencersDashboard = () => useQuery({
  queryKey: ['inf-dashboard'],
  queryFn: async () => {
    const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'influencer')
    return { total_influencers: count }
  },
})

export const useInfluencers = (filters?: any) => useQuery({
  queryKey: ['influencers', filters],
  queryFn: async () => {
    let q = supabase.from('clients').select('*').eq('client_type', 'influencer').order('name').limit(200)
    if (filters?.search) q = q.ilike('name', `%${filters.search}%`)
    const { data } = await q
    return { data: data || [], total: data?.length || 0 }
  },
})

// ── Sales ──────────────────────────────────────────────────────────────────
export const useSalesDashboard = () => useQuery({
  queryKey: ['sales-dashboard'],
  queryFn: async () => {
    const { data } = await supabase.from('sales_transactions').select('amount, category, created_at').order('created_at', { ascending: false }).limit(500)
    if (!data) return {}
    const total_revenue = data.reduce((s, r) => s + (r.amount || 0), 0)
    const by_category: Record<string, number> = {}
    for (const r of data) { by_category[r.category || 'Other'] = (by_category[r.category || 'Other'] || 0) + (r.amount || 0) }
    return { total_revenue, total_transactions: data.length, by_category: Object.entries(by_category).map(([k, v]) => ({ category: k, total: v })) }
  },
})

export const useSalesTransactions = () => useQuery({
  queryKey: ['sales-txns'],
  queryFn: async () => {
    const { data } = await supabase.from('sales_transactions').select('*, clients(name)').order('created_at', { ascending: false }).limit(100)
    return data || []
  },
})

export const useSalesPayouts = () => useQuery({
  queryKey: ['payouts'],
  queryFn: async () => {
    const { data } = await supabase.from('payouts').select('*').order('created_at', { ascending: false }).limit(50)
    return data || []
  },
})

// ── System ─────────────────────────────────────────────────────────────────
export const useSystemHealth = () => useQuery({
  queryKey: ['health'],
  queryFn: async () => {
    const { data } = await supabase.from('system_logs').select('*').order('created_at', { ascending: false }).limit(1).single()
    return data || { status: 'operational' }
  },
  refetchInterval: 30_000,
})

export const useLogicAuditor = () => useQuery({
  queryKey: ['auditor'],
  queryFn: async () => {
    const { data } = await supabase.from('logic_auditor_results').select('*').order('created_at', { ascending: false }).limit(20)
    return data || []
  },
})

export const useQABrain = () => useQuery({
  queryKey: ['qa-brain'],
  queryFn: async () => {
    const { data } = await supabase.from('qa_brain_results').select('*').order('created_at', { ascending: false }).limit(20)
    return data || []
  },
})

export const useJarvisIntelligence = () => useQuery({
  queryKey: ['jarvis'],
  queryFn: async () => {
    const { data } = await supabase.from('daily_reports').select('*').order('created_at', { ascending: false }).limit(1).single()
    return data
  },
})

// ── Alerts ─────────────────────────────────────────────────────────────────
export const useAlerts = () => useQuery({
  queryKey: ['alerts'],
  queryFn: async () => {
    const { data } = await supabase.from('proactive_alerts').select('*').order('created_at', { ascending: false }).limit(100)
    return data || []
  },
  refetchInterval: 30_000,
})

export const useProactiveAlerts = useAlerts

// ── Birthdays ──────────────────────────────────────────────────────────────
export const useBirthdays = () => useQuery({
  queryKey: ['birthdays'],
  queryFn: async () => {
    const today = new Date()
    const { data } = await supabase.from('clients').select('id,name,birthday,league,team,client_type').not('birthday', 'is', null).limit(500)
    if (!data) return []
    return data
      .map(c => {
        const bday = new Date(c.birthday)
        const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate())
        if (next < today) next.setFullYear(today.getFullYear() + 1)
        const days_until = Math.round((next.getTime() - today.getTime()) / (1000*60*60*24))
        const age = today.getFullYear() - bday.getFullYear()
        return { ...c, days_until, age }
      })
      .filter(c => c.days_until <= 30)
      .sort((a, b) => a.days_until - b.days_until)
  },
})

// ── Highlights ─────────────────────────────────────────────────────────────
export const useContractHighlights = () => useQuery({
  queryKey: ['highlights'],
  queryFn: async () => {
    const { data } = await supabase.from('contract_signings').select('*').order('signing_date', { ascending: false }).limit(50)
    return data || []
  },
})

// ── Outreach ───────────────────────────────────────────────────────────────
export const useOutreachQueue = () => useQuery({
  queryKey: ['outreach-queue'],
  queryFn: async () => {
    const { data } = await supabase.from('outreach_queue').select('*, clients(name, instagram_handle)').eq('status', 'pending').order('created_at', { ascending: false }).limit(50)
    return data || []
  },
})

export const useOutreachStats = () => useQuery({
  queryKey: ['outreach-stats'],
  queryFn: async () => {
    const { count: pending } = await supabase.from('outreach_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    const { count: approved } = await supabase.from('outreach_queue').select('*', { count: 'exact', head: true }).eq('status', 'approved')
    const { count: total } = await supabase.from('outreach_queue').select('*', { count: 'exact', head: true })
    return { pending, approved, total_generated: total }
  },
})

export const useApproveOutreach = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: any) => {
      await supabase.from('outreach_queue').update({ status: 'approved' }).eq('id', id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outreach-queue'] }),
  })
}

export const useRejectOutreach = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: any) => {
      await supabase.from('outreach_queue').update({ status: 'rejected' }).eq('id', id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outreach-queue'] }),
  })
}

// ── Search ─────────────────────────────────────────────────────────────────
export const useSearch = (q: string) => useQuery({
  queryKey: ['search', q],
  queryFn: async () => {
    const { data } = await supabase.from('clients').select('id,name,client_type,league,team,position,headshot_url').ilike('name', `%${q}%`).limit(30)
    return { data: data || [], total: data?.length || 0 }
  },
  enabled: q.length >= 2,
})
