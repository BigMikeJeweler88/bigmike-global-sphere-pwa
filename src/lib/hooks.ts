'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const api = (type: string, extra = '') => fetch(`/api/data?type=${type}${extra}`).then(r => r.json())

export const useDashboard    = ()            => useQuery({ queryKey: ['dashboard'],          queryFn: () => api('dashboard'),                          staleTime: 30_000, refetchInterval: 60_000 })
export const useDailyReport  = ()            => useQuery({ queryKey: ['report'],              queryFn: () => api('dashboard').then((d:any) => d.report), staleTime: 60_000 })
export const useLiveStats    = ()            => useQuery({ queryKey: ['live'],                queryFn: () => api('dashboard').then((d:any) => d.liveStats), refetchInterval: 30_000 })
export const useAlerts       = ()            => useQuery({ queryKey: ['alerts'],              queryFn: () => api('alerts'),                             refetchInterval: 30_000 })
export const useBirthdays    = ()            => useQuery({ queryKey: ['birthdays'],           queryFn: () => api('birthdays') })
export const useSignings     = ()            => useQuery({ queryKey: ['highlights'],          queryFn: () => api('highlights') })

export const useAthletes = (search?: string, league?: string) => useQuery({
  queryKey: ['athletes', search, league],
  queryFn: () => {
    let qs = ''
    if (search) qs += `&search=${encodeURIComponent(search)}`
    if (league) qs += `&league=${encodeURIComponent(league)}`
    return api('athletes', qs)
  },
})
export const useAthlete = (id: any) => useQuery({
  queryKey: ['athlete', id],
  queryFn: () => api('athlete', `&id=${id}`),
  enabled: !!id,
})
export const useBonuses     = ()            => useQuery({ queryKey: ['bonuses'],    queryFn: () => api('athletes').then((d:any) => d.bonuses ?? []) })
export const useFreeAgency  = ()            => useQuery({ queryKey: ['fa'],         queryFn: () => api('athletes').then((d:any) => d.freeAgency ?? []) })
export const useMusicArtists = (search?: string) => useQuery({
  queryKey: ['music', search],
  queryFn: () => api('music', search ? `&search=${encodeURIComponent(search)}` : ''),
})
export const useCivilians = (search?: string) => useQuery({
  queryKey: ['civilians', search],
  queryFn: () => api('civilians', search ? `&search=${encodeURIComponent(search)}` : ''),
})
export const useInfluencers = (search?: string) => useQuery({
  queryKey: ['influencers', search],
  queryFn: () => api('influencers', search ? `&search=${encodeURIComponent(search)}` : ''),
})
export const useSalesSummary     = () => useQuery({ queryKey: ['sales'],      queryFn: () => api('sales') })
export const useSalesTransactions = () => useQuery({ queryKey: ['sales-txns'], queryFn: () => api('sales').then((d:any) => d.transactions ?? []) })
export const useSystemHealth     = () => useQuery({ queryKey: ['system'],     queryFn: () => api('system'), refetchInterval: 30_000 })
export const useOutreachQueue    = () => useQuery({ queryKey: ['outreach'],   queryFn: () => api('outreach') })
export const useSearch = (q: string)  => useQuery({
  queryKey: ['search', q],
  queryFn: () => api('search', `&q=${encodeURIComponent(q)}`),
  enabled: q.length >= 2,
})

export const useSendReport = () => useMutation({
  mutationFn: () => fetch('https://global-sphere--BigMike88.replit.app/api/reports/send-now', { method: 'POST' }).then(r => r.json()),
})

export const useApprove = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => fetch(`/api/data?action=approve&id=${id}`, { method: 'POST' }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outreach'] }),
  })
}
export const useReject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => fetch(`/api/data?action=reject&id=${id}`, { method: 'POST' }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outreach'] }),
  })
}

// Aliases used by some pages
export const useOutreachStats = () => useQuery({ queryKey: ['outreach-stats'], queryFn: () => api('outreach') })
export const useLogicAuditor  = () => useQuery({ queryKey: ['logic-auditor'],  queryFn: () => api('system').then((d:any) => d.inferences ?? []) })
export const useQABrain       = () => useQuery({ queryKey: ['qa-brain'],        queryFn: () => api('system').then((d:any) => d.facts ?? []) })
