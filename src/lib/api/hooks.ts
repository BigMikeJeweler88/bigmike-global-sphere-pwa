'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher, putter, poster } from './config'

export function useJarvisStatus() {
  return useQuery({ queryKey: ['jarvis-status'], queryFn: () => fetcher('/api/jarvis/status'), refetchInterval: 60000 })
}
export function useLiveStats() {
  return useQuery({ queryKey: ['live-stats'], queryFn: () => fetcher('/api/stats/live'), refetchInterval: 30000 })
}
export function useAthletes(params) {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  return useQuery({ queryKey: ['athletes', params], queryFn: () => fetcher('/api/athletes'+query) })
}
export function useAthlete(id) {
  return useQuery({ queryKey: ['athlete', id], queryFn: () => fetcher('/api/athletes/'+id), enabled: !!id })
}
export function useAlerts() {
  return useQuery({ queryKey: ['alerts'], queryFn: () => fetcher('/api/proactive-alerts'), refetchInterval: 60000 })
}
export function useBirthdays() {
  return useQuery({ queryKey: ['birthdays'], queryFn: () => fetcher('/api/upcoming-birthdays') })
}
export function useBonuses() {
  return useQuery({ queryKey: ['bonuses'], queryFn: () => fetcher('/api/bonuses') })
}
export function useFreeAgency() {
  return useQuery({ queryKey: ['free-agency'], queryFn: () => fetcher('/api/free-agency') })
}
export function useContractHighlights() {
  return useQuery({ queryKey: ['contract-highlights'], queryFn: () => fetcher('/api/highlights') })
}
export function useMusicDashboard() {
  return useQuery({ queryKey: ['music-dashboard'], queryFn: () => fetcher('/api/music/dashboard'), refetchInterval: 120000 })
}
export function useMusicArtists(params) {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  return useQuery({ queryKey: ['music-artists', params], queryFn: () => fetcher('/api/music/artists'+query) })
}
export function useMusicArtist(id) {
  return useQuery({ queryKey: ['music-artist', id], queryFn: () => fetcher('/api/music/artists/'+id), enabled: !!id })
}
export function useCiviliansDashboard() {
  return useQuery({ queryKey: ['civilians-dashboard'], queryFn: () => fetcher('/api/civilians/dashboard-summary'), refetchInterval: 120000 })
}
export function useCivilians(params) {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  return useQuery({ queryKey: ['civilians', params], queryFn: () => fetcher('/api/civilians/list'+query) })
}
export function useApproveOutreach() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id) => putter('/api/civilians/approve-outreach/'+id), onSuccess: () => qc.invalidateQueries({ queryKey: ['civilians-dashboard'] }) })
}
export function useInfluencersDashboard() {
  return useQuery({ queryKey: ['influencers-dashboard'], queryFn: () => fetcher('/api/influencers/dashboard'), refetchInterval: 120000 })
}
export function useInfluencers(params) {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  return useQuery({ queryKey: ['influencers', params], queryFn: () => fetcher('/api/influencers/list'+query) })
}
export function useSalesDashboard() {
  return useQuery({ queryKey: ['sales-dashboard'], queryFn: () => fetcher('/api/sales/dashboard') })
}
export function useSalesTransactions() {
  return useQuery({ queryKey: ['sales-transactions'], queryFn: () => fetcher('/api/sales/transactions') })
}
export function useSalesPayouts() {
  return useQuery({ queryKey: ['sales-payouts'], queryFn: () => fetcher('/api/sales/payouts') })
}
export function useOutreachQueue() {
  return useQuery({ queryKey: ['outreach-queue'], queryFn: () => fetcher('/api/outreach/approval-queue'), refetchInterval: 30000 })
}
export function useOutreachStats() {
  return useQuery({ queryKey: ['outreach-stats'], queryFn: () => fetcher('/api/outreach/stats') })
}
export function useSystemHealth() {
  return useQuery({ queryKey: ['system-health'], queryFn: () => fetcher('/api/system/health'), refetchInterval: 60000 })
}
export function useLogicAuditor() {
  return useQuery({ queryKey: ['logic-auditor'], queryFn: () => fetcher('/api/system/logic-auditor'), refetchInterval: 120000 })
}
export function useQABrain() {
  return useQuery({ queryKey: ['qa-brain'], queryFn: () => fetcher('/api/system/qa-brain'), refetchInterval: 120000 })
}
export function useJarvisIntelligence() {
  return useQuery({ queryKey: ['jarvis-intelligence'], queryFn: () => fetcher('/api/jarvis/intelligence'), refetchInterval: 60000 })
}
export function useSendDailyReport() {
  return useMutation({ mutationFn: () => poster('/api/reports/send-now') })
}
