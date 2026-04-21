import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, poster } from './config'

// ── Dashboard Summary ──────────────────────────────────────────────────────
export const useDashboardSummary = () => useQuery({
  queryKey: ['dashboard-summary'],
  queryFn: async () => {
    const [total, athletes, music, civilians] = await Promise.all([
      supabase.from('clients').select('*', { count: 'exact', head: true }),
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'athlete'),
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'music_artist'),
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'civilian'),
    ])
    const influencers = (total.count ?? 0) - (athletes.count ?? 0) - (music.count ?? 0) - (civilians.count ?? 0)
    return {
      total_clients: total.count ?? 0,
      athletes: athletes.count ?? 0,
      music: music.count ?? 0,
      civilians: civilians.count ?? 0,
      influencers: Math.max(0, influencers),
    }
  },
  staleTime: 60_000,
})

export const useSituationRoom = useDashboardSummary

export const useDailyReport = () => useQuery({
  queryKey: ['daily-report'],
  queryFn: async () => {
    const { data } = await supabase.from('daily_reports')
      .select('id,report_date,report_type,summary,sent_at')
      .order('created_at', { ascending: false }).limit(1)
    return data?.[0] ?? null
  },
})

export const useLiveStats = () => useQuery({
  queryKey: ['live-stats'],
  queryFn: async () => {
    const { data } = await supabase.from('exceptional_stats')
      .select('*, clients(name,team,league)')
      .order('created_at', { ascending: false }).limit(20)
    return data ?? []
  },
  refetchInterval: 30_000,
})

export const useSendDailyReport = () => useMutation({
  mutationFn: () => poster('/api/reports/send-now'),
})

// ── Athletes ───────────────────────────────────────────────────────────────
export const useAthletes = (filters?: any) => useQuery({
  queryKey: ['athletes', filters],
  queryFn: async () => {
    let q = supabase.from('clients')
      .select('id,name,position,team,league,salary_annual,contract_value,remaining_contract_years,headshot_url,espn_id,instagram,birthday', { count: 'exact' })
      .eq('client_type', 'athlete').order('name').limit(200)
    if (filters?.search) q = q.ilike('name', `%${filters.search}%`)
    if (filters?.league) q = q.eq('league', filters.league)
    const { data, count } = await q
    return { data: data ?? [], total: count ?? 0 }
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
    const { data } = await supabase.from('contract_bonuses')
      .select('id,client_id,client_name,league,bonus_category,bonus_description,bonus_amount,progress_percentage,status')
      .order('created_at', { ascending: false }).limit(50)
    return data ?? []
  },
})

export const useFreeAgency = () => useQuery({
  queryKey: ['free-agency'],
  queryFn: async () => {
    const { data } = await supabase.from('free_agency_status')
      .select('id,client_id,status,eligible_date,market_value_estimate,interested_teams,season,clients(name,team,league,position)')
      .order('eligible_date', { ascending: true }).limit(50)
    return data ?? []
  },
})

// ── Music ──────────────────────────────────────────────────────────────────
export const useMusicDashboard = () => useQuery({
  queryKey: ['music-dashboard'],
  queryFn: async () => {
    const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'music_artist')
    return { total_artists: count ?? 0 }
  },
})

export const useMusicArtists = (filters?: any) => useQuery({
  queryKey: ['music-artists', filters],
  queryFn: async () => {
    let q = supabase.from('clients')
      .select('id,name,genre,instagram,instagram_followers,instagram_bio,headshot_url,notes,behavioral_archetype', { count: 'exact' })
      .eq('client_type', 'music_artist').order('name').limit(200)
    if (filters?.search) q = q.ilike('name', `%${filters.search}%`)
    const { data, count } = await q
    return { data: data ?? [], total: count ?? 0 }
  },
})

// ── Civilians ──────────────────────────────────────────────────────────────
export const useCiviliansDashboard = () => useQuery({
  queryKey: ['civilians-dashboard'],
  queryFn: async () => {
    const { count: total } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'civilian')
    const { count: withInsta } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'civilian').not('instagram', 'is', null).neq('instagram', '')
    return { total_civilians: total ?? 0, with_instagram: withInsta ?? 0 }
  },
})

export const useCivilians = (filters?: any) => useQuery({
  queryKey: ['civilians', filters],
  queryFn: async () => {
    let q = supabase.from('clients')
      .select('id,name,instagram,instagram_followers,instagram_bio,behavioral_archetype,propensity_jewelry,propensity_timepieces,propensity_automobiles,notes,hometown,birthday', { count: 'exact' })
      .eq('client_type', 'civilian').order('name').limit(200)
    if (filters?.search) q = q.ilike('name', `%${filters.search}%`)
    const { data, count } = await q
    return { data: data ?? [], total: count ?? 0 }
  },
})

export const useApproveOutreach = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: any) => {
      const { error } = await supabase.from('approval_queue').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outreach-queue'] }),
  })
}

// ── Influencers ────────────────────────────────────────────────────────────
export const useInfluencersDashboard = () => useQuery({
  queryKey: ['inf-dashboard'],
  queryFn: async () => {
    const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true })
      .not('client_type', 'in', '("athlete","music_artist","civilian")')
    return { total_influencers: count ?? 0 }
  },
})

export const useInfluencers = (filters?: any) => useQuery({
  queryKey: ['influencers', filters],
  queryFn: async () => {
    let q = supabase.from('clients')
      .select('id,name,instagram,instagram_followers,instagram_bio,behavioral_archetype,notes,hometown', { count: 'exact' })
      .not('client_type', 'in', '("athlete","music_artist","civilian")').order('name').limit(200)
    if (filters?.search) q = q.ilike('name', `%${filters.search}%`)
    const { data, count } = await q
    return { data: data ?? [], total: count ?? 0 }
  },
})

// ── Sales ──────────────────────────────────────────────────────────────────
export const useSalesDashboard = () => useQuery({
  queryKey: ['sales-dashboard'],
  queryFn: async () => {
    const { data } = await supabase.from('sales_transactions')
      .select('amount,category,transaction_date').limit(1000)
    if (!data) return { total_revenue: 0, total_transactions: 0, by_category: [] }
    const total_revenue = data.reduce((s, r) => s + (r.amount || 0), 0)
    const by_cat: Record<string, number> = {}
    for (const r of data) { by_cat[r.category || 'Other'] = (by_cat[r.category || 'Other'] || 0) + (r.amount || 0) }
    return {
      total_revenue,
      total_transactions: data.length,
      by_category: Object.entries(by_cat).map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total),
    }
  },
})

export const useSalesTransactions = () => useQuery({
  queryKey: ['sales-txns'],
  queryFn: async () => {
    const { data } = await supabase.from('sales_transactions')
      .select('id,client_name,category,item_description,amount,commission_amount,transaction_date,notes')
      .order('transaction_date', { ascending: false }).limit(100)
    return data ?? []
  },
})

export const useSalesPayouts = () => useQuery({
  queryKey: ['payouts'],
  queryFn: async () => {
    const { data } = await supabase.from('salesperson_payouts')
      .select('id,amount,status,paid_at,salespersons(name)')
      .order('created_at', { ascending: false }).limit(50)
    return data ?? []
  },
})

// ── System ─────────────────────────────────────────────────────────────────
export const useSystemHealth = () => useQuery({
  queryKey: ['health'],
  queryFn: async () => {
    const { data } = await supabase.from('system_health_log')
      .select('id,component,status,latency_ms,error_message,checked_at')
      .order('checked_at', { ascending: false }).limit(20)
    return data ?? []
  },
  refetchInterval: 30_000,
})

export const useLogicAuditor = () => useQuery({
  queryKey: ['auditor'],
  queryFn: async () => {
    const { data } = await supabase.from('inference_records')
      .select('*').order('created_at', { ascending: false }).limit(20)
    return data ?? []
  },
})

export const useQABrain = () => useQuery({
  queryKey: ['qa-brain'],
  queryFn: async () => {
    const { data } = await supabase.from('fact_records')
      .select('*').order('created_at', { ascending: false }).limit(20)
    return data ?? []
  },
})

export const useJarvisIntelligence = () => useQuery({
  queryKey: ['jarvis'],
  queryFn: async () => {
    const { data } = await supabase.from('daily_reports')
      .select('id,report_date,report_type,summary,content,sent_at')
      .order('created_at', { ascending: false }).limit(1)
    return data?.[0] ?? null
  },
})

// ── Alerts ─────────────────────────────────────────────────────────────────
export const useAlerts = () => useQuery({
  queryKey: ['alerts'],
  queryFn: async () => {
    const { data } = await supabase.from('proactive_alerts')
      .select('id,client_id,client_name,league,alert_type,alert_priority,alert_title,alert_message,action_recommended,is_read,created_at')
      .order('created_at', { ascending: false }).limit(100)
    return data ?? []
  },
  refetchInterval: 30_000,
})

export const useProactiveAlerts = useAlerts

// ── Birthdays ──────────────────────────────────────────────────────────────
export const useBirthdays = () => useQuery({
  queryKey: ['birthdays'],
  queryFn: async () => {
    const { data } = await supabase.from('clients')
      .select('id,name,birthday,league,team,client_type').not('birthday', 'is', null).limit(1000)
    if (!data) return []
    const today = new Date()
    return data
      .map(c => {
        const bday = new Date(c.birthday as string)
        const thisYear = new Date(today.getFullYear(), bday.getMonth(), bday.getDate())
        if (thisYear < today) thisYear.setFullYear(today.getFullYear() + 1)
        const days_until = Math.round((thisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const age = today.getFullYear() - bday.getFullYear() + (thisYear.getFullYear() > today.getFullYear() ? 0 : 1)
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
    const { data } = await supabase.from('contract_signings')
      .select('id,client_id,client_name,team,league,contract_value,contract_years,annual_value,signing_bonus,signing_date')
      .order('signing_date', { ascending: false }).limit(50)
    return data ?? []
  },
})

// ── Outreach ───────────────────────────────────────────────────────────────
export const useOutreachQueue = () => useQuery({
  queryKey: ['outreach-queue'],
  queryFn: async () => {
    const { data } = await supabase.from('approval_queue')
      .select('id,client_id,client_name,message_text,persona,status,created_at')
      .eq('status', 'pending').order('created_at', { ascending: false }).limit(50)
    return data ?? []
  },
})

export const useOutreachStats = () => useQuery({
  queryKey: ['outreach-stats'],
  queryFn: async () => {
    const [pending, approved, total] = await Promise.all([
      supabase.from('approval_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('approval_queue').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('approval_queue').select('*', { count: 'exact', head: true }),
    ])
    return { pending: pending.count ?? 0, approved: approved.count ?? 0, total_generated: total.count ?? 0 }
  },
})

export const useRejectOutreach = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: any) => {
      const { error } = await supabase.from('approval_queue').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outreach-queue'] }),
  })
}

// ── Search ─────────────────────────────────────────────────────────────────
export const useSearch = (q: string) => useQuery({
  queryKey: ['search', q],
  queryFn: async () => {
    const { data } = await supabase.from('clients')
      .select('id,name,client_type,league,team,position,headshot_url,instagram')
      .ilike('name', `%${q}%`).limit(30)
    return { data: data ?? [], total: data?.length ?? 0 }
  },
  enabled: q.length >= 2,
})
