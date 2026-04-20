import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher, poster } from './config'

// ── Situation Room ─────────────────────────────────────────────────────────
export const useSituationRoom = () => useQuery({ queryKey: ['situation-room'], queryFn: () => fetcher<any>('/api/situation-room/summary'), refetchInterval: 60_000 })
export const useDailyReport   = () => useQuery({ queryKey: ['daily-report'],   queryFn: () => fetcher<any>('/api/daily-reports/latest') })
export const useLiveStats     = () => useQuery({ queryKey: ['live-stats'],     queryFn: () => fetcher<any>('/api/stats/live'), refetchInterval: 30_000 })
export const useSendDailyReport = () => useMutation({ mutationFn: () => poster('/api/reports/send-now') })

// ── Athletes ───────────────────────────────────────────────────────────────
export const useAthletes  = (p?: any) => useQuery({ queryKey: ['athletes', p],  queryFn: () => fetcher<any>('/api/athletes'   + (p ? '?' + new URLSearchParams(p) : '')) })
export const useAthlete   = (id: any) => useQuery({ queryKey: ['athlete', id],  queryFn: () => fetcher<any>(`/api/athletes/${id}`), enabled: !!id })
export const useBonuses   = ()        => useQuery({ queryKey: ['bonuses'],      queryFn: () => fetcher<any>('/api/bonuses') })
export const useFreeAgency = ()       => useQuery({ queryKey: ['free-agency'],  queryFn: () => fetcher<any>('/api/free-agency') })

// ── Music ──────────────────────────────────────────────────────────────────
export const useMusicDashboard = ()       => useQuery({ queryKey: ['music-dashboard'], queryFn: () => fetcher<any>('/api/music/dashboard') })
export const useMusicArtists   = (p?: any) => useQuery({ queryKey: ['music-artists', p], queryFn: () => fetcher<any>('/api/music/artists' + (p ? '?' + new URLSearchParams(p) : '')) })
export const useMusicIntelligence = ()    => useQuery({ queryKey: ['music-intel'],     queryFn: () => fetcher<any>('/api/music/intelligence') })

// ── Civilians ──────────────────────────────────────────────────────────────
export const useCiviliansDashboard = () => useQuery({ queryKey: ['civilians-dashboard'], queryFn: () => fetcher<any>('/api/civilians/dashboard') })
export const useCivilians = (p?: any)   => useQuery({ queryKey: ['civilians', p],        queryFn: () => fetcher<any>('/api/civilians/list' + (p ? '?' + new URLSearchParams(p) : '')) })
export const useApproveOutreach = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: any) => poster(`/api/civilians/approve-outreach/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outreach-queue'] }),
  })
}

// ── Influencers ────────────────────────────────────────────────────────────
export const useInfluencersDashboard = () => useQuery({ queryKey: ['inf-dashboard'], queryFn: () => fetcher<any>('/api/influencers/dashboard') })
export const useInfluencers = (p?: any)   => useQuery({ queryKey: ['influencers', p], queryFn: () => fetcher<any>('/api/influencers/list' + (p ? '?' + new URLSearchParams(p) : '')) })

// ── Sales ──────────────────────────────────────────────────────────────────
export const useSalesDashboard    = () => useQuery({ queryKey: ['sales-dashboard'], queryFn: () => fetcher<any>('/api/sales/dashboard') })
export const useSalesTransactions = () => useQuery({ queryKey: ['sales-txns'],     queryFn: () => fetcher<any>('/api/sales/transactions') })
export const useSalesPayouts      = () => useQuery({ queryKey: ['payouts'],        queryFn: () => fetcher<any>('/api/sales/payouts') })

// ── System ─────────────────────────────────────────────────────────────────
export const useSystemHealth  = () => useQuery({ queryKey: ['health'],    queryFn: () => fetcher<any>('/api/system/health'),        refetchInterval: 30_000 })
export const useLogicAuditor  = () => useQuery({ queryKey: ['auditor'],   queryFn: () => fetcher<any>('/api/system/logic-auditor') })
export const useQABrain       = () => useQuery({ queryKey: ['qa-brain'],  queryFn: () => fetcher<any>('/api/system/qa-brain') })
export const useJarvisIntelligence = () => useQuery({ queryKey: ['jarvis'], queryFn: () => fetcher<any>('/api/jarvis/intelligence') })
export const useJarvisStatus  = () => useQuery({ queryKey: ['jarvis-status'], queryFn: () => fetcher<any>('/api/jarvis/status') })

// ── Alerts / Birthdays / Highlights / Outreach ────────────────────────────
export const useAlerts     = () => useQuery({ queryKey: ['alerts'],     queryFn: () => fetcher<any>('/api/proactive-alerts'), refetchInterval: 30_000 })
export const useBirthdays  = () => useQuery({ queryKey: ['birthdays'],  queryFn: () => fetcher<any>('/api/upcoming-birthdays') })
export const useContractHighlights = () => useQuery({ queryKey: ['highlights'], queryFn: () => fetcher<any>('/api/highlights') })
export const useOutreachQueue = () => useQuery({ queryKey: ['outreach-queue'], queryFn: () => fetcher<any>('/api/outreach/approval-queue') })
export const useOutreachStats = () => useQuery({ queryKey: ['outreach-stats'], queryFn: () => fetcher<any>('/api/outreach/stats') })

// ── Dashboard summary (client counts) ─────────────────────────────────────
export const useDashboardSummary = () => useQuery({ queryKey: ['dashboard-summary'], queryFn: () => fetcher<any>('/api/dashboard/summary') })
