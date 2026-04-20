import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher, poster } from './config'

// All paths are relative - fetcher prepends REPLIT_URL automatically
export const useAthletes = (p?: any) => useQuery({
  queryKey: ['athletes', p],
  queryFn: () => fetcher<any>('/api/athletes' + (p ? '?' + new URLSearchParams(p) : '')),
})
export const useAthlete = (id: any) => useQuery({
  queryKey: ['athlete', id],
  queryFn: () => fetcher<any>(`/api/athletes/${id}`),
  enabled: !!id,
})
export const useBonuses = () => useQuery({ queryKey: ['bonuses'], queryFn: () => fetcher<any>('/api/athletes/bonuses/alerts') })
export const useFreeAgency = () => useQuery({ queryKey: ['free-agency'], queryFn: () => fetcher<any>('/api/athletes/free-agency') })
export const useMusicDashboard = () => useQuery({ queryKey: ['music-dashboard'], queryFn: () => fetcher<any>('/api/music/dashboard') })
export const useMusicArtists = (p?: any) => useQuery({
  queryKey: ['music-artists', p],
  queryFn: () => fetcher<any>('/api/music/artists' + (p ? '?' + new URLSearchParams(p) : '')),
})
export const useCiviliansDashboard = () => useQuery({ queryKey: ['civilians-dashboard'], queryFn: () => fetcher<any>('/api/civilians/dashboard') })
export const useCivilians = (p?: any) => useQuery({
  queryKey: ['civilians', p],
  queryFn: () => fetcher<any>('/api/civilians' + (p ? '?' + new URLSearchParams(p) : '')),
})
export const useApproveOutreach = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: any) => poster(`/api/outreach/approve/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outreach-queue'] }),
  })
}
export const useInfluencersDashboard = () => useQuery({ queryKey: ['inf-dashboard'], queryFn: () => fetcher<any>('/api/influencers/dashboard') })
export const useInfluencers = (p?: any) => useQuery({
  queryKey: ['influencers', p],
  queryFn: () => fetcher<any>('/api/influencers' + (p ? '?' + new URLSearchParams(p) : '')),
})
export const useSalesDashboard = () => useQuery({ queryKey: ['sales-dashboard'], queryFn: () => fetcher<any>('/api/sales/dashboard') })
export const useSalesTransactions = () => useQuery({ queryKey: ['sales-txns'], queryFn: () => fetcher<any>('/api/sales/transactions') })
export const useSalesPayouts = () => useQuery({ queryKey: ['payouts'], queryFn: () => fetcher<any>('/api/sales/payouts') })
export const useSystemHealth = () => useQuery({ queryKey: ['health'], queryFn: () => fetcher<any>('/api/system/health'), refetchInterval: 30000 })
export const useLogicAuditor = () => useQuery({ queryKey: ['auditor'], queryFn: () => fetcher<any>('/api/system/logic-auditor') })
export const useQABrain = () => useQuery({ queryKey: ['qa-brain'], queryFn: () => fetcher<any>('/api/system/qa-brain') })
export const useJarvisIntelligence = () => useQuery({ queryKey: ['jarvis'], queryFn: () => fetcher<any>('/api/jarvis/intelligence') })
export const useAlerts = () => useQuery({ queryKey: ['alerts'], queryFn: () => fetcher<any>('/api/alerts'), refetchInterval: 30000 })
export const useBirthdays = () => useQuery({ queryKey: ['birthdays'], queryFn: () => fetcher<any>('/api/birthdays') })
export const useContractHighlights = () => useQuery({ queryKey: ['highlights'], queryFn: () => fetcher<any>('/api/contracts/highlights') })
export const useOutreachQueue = () => useQuery({ queryKey: ['outreach-queue'], queryFn: () => fetcher<any>('/api/outreach/queue') })
export const useOutreachStats = () => useQuery({ queryKey: ['outreach-stats'], queryFn: () => fetcher<any>('/api/outreach/stats') })
export const useLiveStats = () => useQuery({ queryKey: ['live-stats'], queryFn: () => fetcher<any>('/api/system/live-stats'), refetchInterval: 30000 })
export const useSendDailyReport = () => useMutation({ mutationFn: () => poster('/api/jarvis/send-daily-report') })
