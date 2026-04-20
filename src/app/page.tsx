'use client'
import { useSituationRoom, useDashboardSummary, useAlerts, useSendDailyReport, useDailyReport, useLiveStats } from '@/lib/api/hooks'
import Link from 'next/link'
import { Trophy, Music2, Users, Star, Bell, DollarSign, Cpu, Search, Cake, Send, TrendingUp, Zap, RefreshCw, ChevronRight, AlertTriangle } from 'lucide-react'

export default function Home() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary()
  const { data: situation } = useSituationRoom()
  const { data: alertData } = useAlerts()
  const { data: dailyReport } = useDailyReport()
  const { data: liveStats } = useLiveStats()
  const sendReport = useSendDailyReport()

  const alerts = (alertData as any) || []
  const alertList = Array.isArray(alerts) ? alerts : (alerts?.alerts || alerts?.data || [])
  const criticalAlerts = alertList.filter((a: any) => a.severity === 'critical' || a.priority === 'critical')

  const counts = (summary as any) || {}
  const totalAthletes = counts.total_athletes ?? counts.athletes ?? '1,572'
  const totalMusicians = counts.total_musicians ?? counts.musicians ?? '540'
  const totalCivilians = counts.total_civilians ?? counts.civilians ?? '1,987'
  const totalInfluencers = counts.total_influencers ?? counts.influencers ?? '140+'
  const totalClients = counts.total_clients ?? counts.total ?? '4,200+'

  const modes = [
    { href: '/sports',     icon: Trophy,   label: 'Sports',      sub: `${totalAthletes} athletes`,    color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { href: '/music',      icon: Music2,   label: 'Music',       sub: `${totalMusicians} artists`,    color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { href: '/civilians',  icon: Users,    label: 'Civilians',   sub: `${totalCivilians} prospects`,  color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { href: '/influencers',icon: Star,     label: 'Influencers', sub: `${totalInfluencers} creators`, color: 'text-pink-400',   bg: 'bg-pink-500/10 border-pink-500/20' },
    { href: '/sales',      icon: DollarSign,label: 'Sales',      sub: 'Transactions & payouts',       color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
    { href: '/system',     icon: Cpu,      label: 'System',      sub: 'Health · JARVIS · AI',         color: 'text-cyan-400',   bg: 'bg-cyan-500/10 border-cyan-500/20' },
  ]

  return (
    <div className="px-4 py-4 space-y-5 max-w-2xl mx-auto pb-24">

      {/* Header */}
      <div className="pt-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <p className="text-[11px] text-blue-400 uppercase tracking-widest font-semibold">JARVIS Intelligence</p>
        </div>
        <h1 className="text-3xl font-bold text-white">Situation Room</h1>
        <p className="text-white/40 text-sm">BigMike Global Sports CRM · {totalClients} clients</p>
      </div>

      {/* JARVIS Daily Report Button */}
      <div className="flex gap-2">
        <button
          onClick={() => sendReport.mutate()}
          disabled={sendReport.isPending}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-xl py-3 text-sm font-semibold text-blue-300 active:scale-95 transition-all"
        >
          <Send className="h-4 w-4" />
          {sendReport.isPending ? 'Sending JARVIS Report...' : 'Send Daily JARVIS Report'}
        </button>
        <Link href="/system" className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-cyan-400">
          <Zap className="h-4 w-4" />
          AI
        </Link>
      </div>

      {/* JARVIS Daily Briefing preview */}
      {dailyReport && (
        <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Today's Briefing</span>
            <Link href="/system" className="text-[10px] text-blue-400/60">Full report →</Link>
          </div>
          <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
            {(dailyReport as any)?.summary || (dailyReport as any)?.briefing || (dailyReport as any)?.message || 'No briefing available'}
          </p>
        </div>
      )}

      {/* Critical alerts banner */}
      {criticalAlerts.length > 0 && (
        <Link href="/alerts" className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-red-300">{criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}</div>
            <div className="text-xs text-white/40">{criticalAlerts[0]?.title || criticalAlerts[0]?.alert_type || criticalAlerts[0]?.message}</div>
          </div>
          <ChevronRight className="h-4 w-4 text-red-400/40" />
        </Link>
      )}

      {/* Live games ticker */}
      {(liveStats as any)?.games?.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Live Games</span>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none">
            {(liveStats as any).games.slice(0, 5).map((g: any, i: number) => (
              <div key={i} className="flex-shrink-0 text-[11px] text-white/70">{g.summary || g.display}</div>
            ))}
          </div>
        </div>
      )}

      {/* Client count stats */}
      <div className="grid grid-cols-3 gap-2">
        {summaryLoading ? [...Array(3)].map((_,i) => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />) : [
          { label: 'Total Clients',  value: totalClients,    color: 'text-blue-400' },
          { label: 'Athletes',       value: totalAthletes,   color: 'text-orange-400' },
          { label: 'Musicians',      value: totalMusicians,  color: 'text-purple-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className={`text-xl font-bold ${color}`}>{value?.toLocaleString?.() ?? value}</div>
            <div className="text-[10px] text-white/40">{label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {summaryLoading ? [...Array(2)].map((_,i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />) : [
          { label: 'Civilians',      value: totalCivilians,  color: 'text-yellow-400' },
          { label: 'Influencers',    value: totalInfluencers,color: 'text-pink-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className={`text-lg font-bold ${color}`}>{value?.toLocaleString?.() ?? value}</div>
            <div className="text-[10px] text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {/* Mode grid */}
      <div>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Sections</p>
        <div className="grid grid-cols-2 gap-2">
          {modes.map(({ href, icon: Icon, label, sub, color, bg }) => (
            <Link key={href} href={href} className={`flex items-center gap-3 border rounded-xl px-3 py-3.5 active:scale-95 transition-transform ${bg}`}>
              <Icon className={`h-5 w-5 flex-shrink-0 ${color}`} />
              <div>
                <div className="text-sm font-semibold text-white">{label}</div>
                <div className="text-[10px] text-white/40">{sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick access */}
      <div>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Quick Access</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { href: '/alerts',     icon: Bell,         label: 'Alerts',     badge: criticalAlerts.length, color: 'text-red-400' },
            { href: '/birthdays',  icon: Cake,         label: 'Birthdays',  color: 'text-pink-400' },
            { href: '/outreach',   icon: Send,         label: 'Outreach',   color: 'text-blue-400' },
            { href: '/highlights', icon: TrendingUp,   label: 'Highlights', color: 'text-cyan-400' },
            { href: '/search',     icon: Search,       label: 'Search',     color: 'text-white/60' },
            { href: '/more',       icon: RefreshCw,    label: 'More',       color: 'text-white/60' },
          ].map(({ href, icon: Icon, label, badge, color }: any) => (
            <Link key={href} href={href} className="relative flex flex-col items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl py-3 active:scale-95 transition-transform">
              <Icon className={`h-5 w-5 ${color}`} />
              {badge > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{badge}</span>
              )}
              <span className="text-[11px] text-white/60">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Situation room intel */}
      {situation && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Intelligence Feed</p>
          {((situation as any)?.highlights || (situation as any)?.items || []).slice(0, 4).map((item: any, i: number) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <div className="text-xs font-medium text-white">{item.title || item.headline}</div>
              {item.description && <div className="text-[10px] text-white/40 mt-0.5 line-clamp-1">{item.description}</div>}
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
