'use client'

import { Zap, Send, Bell } from 'lucide-react'
import { useStore } from '@/store/use-store'
import { useLiveStats, useSendDailyReport, useAlerts } from '@/lib/api/hooks'

export function MobileHeader() {
  const { activeMode } = useStore()
  const { data: liveStats } = useLiveStats()
  const { data: alerts } = useAlerts()
  const sendReport = useSendDailyReport()

  const unreadAlerts = alerts?.filter((a: any) => !a.is_read)?.length || 0

  const modeLabels: Record<string, string> = {
    'situation-room': 'Situation Room',
    sports: 'Sports',
    music: 'Music',
    civilians: 'Civilians',
    influencers: 'Influencers',
    sales: 'Sales',
    system: 'System',
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-background/95 backdrop-blur-xl px-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="font-bold text-sm text-white">BigMike's CRM</span>
          <div className="text-[10px] text-white/40 leading-none">{modeLabels[activeMode]}</div>
        </div>
      </div>

      {/* Live ticker snippet */}
      {liveStats?.games?.length > 0 && (
        <div className="hidden sm:flex items-center gap-1 text-[10px] text-white/50 max-w-[200px] overflow-hidden">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="truncate">{liveStats.games[0]?.summary}</span>
        </div>
      )}

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {unreadAlerts > 0 && (
          <div className="relative">
            <Bell className="h-5 w-5 text-white/60" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {unreadAlerts > 9 ? '9+' : unreadAlerts}
            </span>
          </div>
        )}
        <button
          onClick={() => sendReport.mutate()}
          disabled={sendReport.isPending}
          className="flex items-center gap-1 rounded-lg bg-blue-600/20 border border-blue-500/30 px-2 py-1 text-[11px] text-blue-400 font-medium active:scale-95 transition-transform"
        >
          <Send className="h-3 w-3" />
          {sendReport.isPending ? 'Sending...' : 'Daily Report'}
        </button>
      </div>
    </header>
  )
}
