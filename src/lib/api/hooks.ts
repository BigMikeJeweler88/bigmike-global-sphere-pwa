import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher, poster } from './config'

// ── Dashboard / Situation Room ─────────────────────────────────────────────
// Returns: { total_clients, total_contract_value, avg_salary, leagues_count, by_league, recent_exceptional_performances }
export const useDashboardSummary = () => useQuery({
  queryKey: ['dashboard-summary'],
  queryFn: () => fetcher<any>('/api/dashboard/summary'),
  staleTime: 60_000,
})

// Returns: { report_text, sent_at, subject } or similar
export const useDailyReport = () => useQuery({
  queryKey: ['daily-report'],
  queryFn: () => fetcher<any>('/api/daily-reports/latest'),
})

// Returns: array of { id, client_name, league, stat_type, stat_value, game_date, opponent }
export const useLiveStats = () => useQuery({
  queryKey: ['live-stats'],
  queryFn: () => fetcher<any>('/api/stats/live'),
  refetchInterval: 30_000,
})

export const useRecentStats = () => useQuery({
  queryKey: ['recent-stats'],
  queryFn: () => fetcher<any>('/api/stats/recent'),
})

export const useSendDailyReport = () => useMutation({
  mutationFn: () => poster('/api/reports/send-now'),
})

// ── Athletes / Clients ─────────────────────────────────────────────────────
// /api/clients returns all clients; pass client_type=athlete to filter
export const useAthletes = (p?: any) => useQuery({
  queryKey: ['athletes', p],
  queryFn: () => fetcher<any>('/api/clients?' + new URLSearchParams({ client_type: 'athlete', ...p }).toString()),
})
export const useAthlete = (id: any) => useQuery({
  queryKey: ['athlete', id],
  queryFn: () => fetcher<any>(`/api/clients/${id}`),
  enabled: !!id,
})
// Returns array from /api/bonuses
export const useBonuses = () => useQuery({
  queryKey: ['bonuses'],
  queryFn: () => fetcher<any>('/api/bonuses'),
})
// Returns array from /api/free-agency
export const useFreeAgency = () => useQuery({
  queryKey: ['free-agency'],
  queryFn: () => fetcher<any>('/api/free-agency'),
})

// ── Music ──────────────────────────────────────────────────────────────────
export const useMusicDashboard = () => useQuery({
  queryKey: ['music-dashboard'],
  queryFn: () => fetcher<any>('/api/music/dashboard'),
})
export const useMusicArtists = (p?: any) => useQuery({
  queryKey: ['music-artists', p],
  queryFn: () => fetcher<any>('/api/clients?' + new URLSearchParams({ client_type: 'music', ...p }).toString()),
})

// ── Civilians ──────────────────────────────────────────────────────────────
// /api/civilians/dashboard and /api/civilians/list
export const useCiviliansDashboard = () => useQuery({
  queryKey: ['civilians-dashboard'],
  queryFn: () => fetcher<any>('/api/civilians/dashboard'),
})
export const useCivilians = (p?: any) => useQuery({
  queryKey: ['civilians', p],
  queryFn: () => fetcher<any>('/api/civilians/list?' + (p ? new URLSearchParams(p).toString() : '')),
})
export const useApproveOutreach = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: any) => poster(`/api/outreach/approve/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outreach-queue'] }),
  })
}

// ── Influencers ────────────────────────────────────────────────────────────
export const useInfluencersDashboard = () => useQuery({
  queryKey: ['inf-dashboard'],
  queryFn: () => fetcher<any>('/api/influencers/dashboard'),
})
export const useInfluencers = (p?: any) => useQuery({
  queryKey: ['influencers', p],
  queryFn: () => fetcher<any>('/api/clients?' + new URLSearchParams({ client_type: 'influencer', ...p }).toString()),
})

// ── Sales ──────────────────────────────────────────────────────────────────
// /api/analytics/sales-summary returns the full breakdown
export const useSalesDashboard = () => useQuery({
  queryKey: ['sales-dashboard'],
  queryFn: () => fetcher<any>('/api/analytics/sales-summary'),
})
export const useSalesTransactions = (p?: any) => useQuery({
  queryKey: ['sales-txns', p],
  queryFn: () => fetcher<any>('/api/sales/transactions?' + (p ? new URLSearchParams(p).toString() : '')),
})
export const useSalesPayouts = () => useQuery({
  queryKey: ['payouts'],
  queryFn: () => fetcher<any>('/api/sales/payouts'),
})
export const useAnalyticsSalesByYear = () => useQuery({
  queryKey: ['sales-by-year'],
  queryFn: () => fetcher<any>('/api/analytics/sales-by-year'),
})
export const useAnalyticsSalesByCategory = () => useQuery({
  queryKey: ['sales-by-category'],
  queryFn: () => fetcher<any>('/api/analytics/sales-by-category'),
})
export const useTopClients = () => useQuery({
  queryKey: ['top-clients'],
  queryFn: () => fetcher<any>('/api/analytics/top-clients'),
})

// ── System ─────────────────────────────────────────────────────────────────
export const useSystemHealth = () => useQuery({
  queryKey: ['health'],
  queryFn: () => fetcher<any>('/api/system-status'),
  refetchInterval: 30_000,
})
export const useLogicAuditor = () => useQuery({
  queryKey: ['auditor'],
  queryFn: () => fetcher<any>('/api/system/logic-auditor'),
})
export const useQABrain = () => useQuery({
  queryKey: ['qa-brain'],
  queryFn: () => fetcher<any>('/api/system/qa-brain'),
})
export const useJarvisIntelligence = () => useQuery({
  queryKey: ['jarvis'],
  queryFn: () => fetcher<any>('/api/jarvis/intelligence'),
})
export const useJarvisStatus = () => useQuery({
  queryKey: ['jarvis-status'],
  queryFn: () => fetcher<any>('/api/jarvis/status'),
})

// ── Alerts ─────────────────────────────────────────────────────────────────
// /api/alerts is the main alerts route
export const useAlerts = () => useQuery({
  queryKey: ['alerts'],
  queryFn: () => fetcher<any>('/api/alerts'),
  refetchInterval: 30_000,
})
export const useProactiveAlerts = () => useQuery({
  queryKey: ['proactive-alerts'],
  queryFn: () => fetcher<any>('/api/proactive-alerts'),
  refetchInterval: 60_000,
})

// ── Birthdays ──────────────────────────────────────────────────────────────
// Returns: array of { client_id, name, team, league, birthday, days_until, age }
export const useBirthdays = () => useQuery({
  queryKey: ['birthdays'],
  queryFn: () => fetcher<any>('/api/upcoming-birthdays'),
})

// ── Highlights ─────────────────────────────────────────────────────────────
// /api/contract-signings is the highlights feed
export const useContractHighlights = () => useQuery({
  queryKey: ['highlights'],
  queryFn: () => fetcher<any>('/api/contract-signings'),
})

// ── Outreach ───────────────────────────────────────────────────────────────
// /api/outreach/approval-queue returns messages awaiting approval
export const useOutreachQueue = () => useQuery({
  queryKey: ['outreach-queue'],
  queryFn: () => fetcher<any>('/api/outreach/approval-queue'),
})
export const useOutreachStats = () => useQuery({
  queryKey: ['outreach-stats'],
  queryFn: () => fetcher<any>('/api/outreach/stats'),
})
export const useRejectOutreach = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: any) => poster(`/api/outreach/reject/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outreach-queue'] }),
  })
}

// ── Draft / prospects ──────────────────────────────────────────────────────
export const useDraftProspects = (p?: any) => useQuery({
  queryKey: ['draft-prospects', p],
  queryFn: () => fetcher<any>('/api/draft-prospects?' + (p ? new URLSearchParams(p).toString() : '')),
})

// ── Global search ──────────────────────────────────────────────────────────
export const useSearch = (q: string) => useQuery({
  queryKey: ['search', q],
  queryFn: () => fetcher<any>(`/api/clients?search=${encodeURIComponent(q)}&limit=30`),
  enabled: q.length >= 2,
})

// ── Situation room (separate endpoint) ────────────────────────────────────
export const useSituationRoom = () => useQuery({
  queryKey: ['situation-room'],
  queryFn: () => fetcher<any>('/api/dashboard/summary'),
  staleTime: 60_000,
})
