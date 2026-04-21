'use client'
import Link from 'next/link'
import { useDashboard, useAlerts, useDailyReport, useLiveStats } from '@/lib/hooks'
import { Trophy, Music2, Users, Star, DollarSign, Cpu, Bell, Cake, Send, TrendingUp, Search, Zap, AlertTriangle, ChevronRight } from 'lucide-react'
import { Skeleton } from '@/components/Skeleton'

const modes = [
  { href: '/sports',      icon: Trophy,    label: 'Sports',       color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', key: 'athletes' },
  { href: '/music',       icon: Music2,    label: 'Music',        color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', key: 'music' },
  { href: '/civilians',   icon: Users,     label: 'Civilians',    color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', key: 'civilians' },
  { href: '/influencers', icon: Star,      label: 'Influencers',  color: 'text-pink-400',   bg: 'bg-pink-500/10 border-pink-500/20',   key: 'influencers' },
  { href: '/sales',       icon: DollarSign,label: 'Sales',        color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20',  key: null },
  { href: '/system',      icon: Cpu,       label: 'System',       color: 'text-cyan-400',   bg: 'bg-cyan-500/10 border-cyan-500/20',    key: null },
]

const quick = [
  { href: '/alerts',     icon: Bell,       label: 'Alerts',    color: 'text-red-400' },
  { href: '/birthdays',  icon: Cake,       label: 'Birthdays', color: 'text-pink-400' },
  { href: '/outreach',   icon: Send,       label: 'Outreach',  color: 'text-blue-400' },
  { href: '/highlights', icon: TrendingUp, label: 'Signings',  color: 'text-cyan-400' },
  { href: '/search',     icon: Search,     label: 'Search',    color: 'text-white/50' },
  { href: '/more',       icon: Zap,        label: 'More',      color: 'text-white/50' },
]

export default function Home() {
  const { data: dash, isLoading } = useDashboard()
  const { data: alertData } = useAlerts()
  const { data: report } = useDailyReport()
  const { data: liveData } = useLiveStats()

  const alerts: any[] = Array.isArray(alertData) ? alertData : []
  const critical = alerts.filter(a => a.alert_priority === 'critical')
  const liveStats: any[] = Array.isArray(liveData) ? liveData : []
  const d = dash || { total: 0, athletes: 0, music: 0, civilians: 0, influencers: 0 }
  const r = report as any

  const countFor = (key: string | null) => {
    if (!key || isLoading) return null
    return (d as any)[key]
  }

  return (
    <div className="px-4 py-4 space-y-5 max-w-2xl mx-auto pb-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <p className="text-[11px] text-blue-400 uppercase tracking-widest font-semibold">JARVIS Intelligence</p>
        </div>
        <h1 className="text-3xl font-bold text-white">Situation Room</h1>
        {isLoading
          ? <Skeleton className="h-4 w-40 mt-1" />
          : <p className="text-white/40 text-sm mt-0.5">{d.total.toLocaleString()} clients across all categories</p>
        }
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {isLoading ? [...Array(3)].map((_,i) => <Skeleton key={i} className="h-16" />) : [
          { label: 'Athletes',    value: d.athletes,    color: 'text-orange-400' },
          { label: 'Musicians',   value: d.music,       color: 'text-purple-400' },
          { label: 'Civilians',   value: d.civilians,   color: 'text-yellow-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className={`text-xl font-bold ${color}`}>{value?.toLocaleString()}</div>
            <div className="text-[10px] text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {/* JARVIS daily briefing */}
      {r?.summary && (
        <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Today's JARVIS Briefing</span>
            <Link href="/system" className="text-[10px] text-blue-400/60">Full →</Link>
          </div>
          <p className="text-sm text-white/70 leading-relaxed line-clamp-4">{r.summary}</p>
          {r.report_date && <p className="text-[10px] text-white/30 mt-1.5">{r.report_date}</p>}
        </div>
      )}

      {/* Critical alerts */}
      {critical.length > 0 && (
        <Link href="/alerts" className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-red-300">{critical.length} Critical Alert{critical.length > 1 ? 's' : ''}</div>
            <div className="text-xs text-white/40 truncate">{critical[0]?.alert_title || critical[0]?.alert_type}</div>
          </div>
          <ChevronRight className="h-4 w-4 text-red-400/40" />
        </Link>
      )}

      {/* Live ticker */}
      {liveStats.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Live Stats</span>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-0.5">
            {liveStats.slice(0, 8).map((s: any, i: number) => (
              <div key={i} className="flex-shrink-0 text-[11px]">
                <span className="text-white/80">{(s.clients as any)?.name || s.client_id}</span>
                <span className="text-white/40 mx-1">·</span>
                <span className="text-cyan-400">{s.stat_value} {s.stat_type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode grid */}
      <div>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Sections</p>
        <div className="grid grid-cols-2 gap-2">
          {modes.map(({ href, icon: Icon, label, color, bg, key }) => (
            <Link key={href} href={href} className={`flex items-center gap-3 border rounded-xl px-3 py-3.5 active:scale-[0.97] transition-transform ${bg}`}>
              <Icon className={`h-5 w-5 flex-shrink-0 ${color}`} />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">{label}</div>
                {key && !isLoading && <div className="text-[10px] text-white/40">{(d as any)[key]?.toLocaleString()} clients</div>}
                {key && isLoading && <div className="h-2.5 w-12 bg-white/10 rounded animate-pulse mt-0.5" />}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick access */}
      <div>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Quick Access</p>
        <div className="grid grid-cols-3 gap-2">
          {quick.map(({ href, icon: Icon, label, color }) => (
            <Link key={href} href={href} className="relative flex flex-col items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl py-3 active:scale-95 transition-transform">
              <Icon className={`h-5 w-5 ${color}`} />
              {label === 'Alerts' && critical.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{critical.length}</span>
              )}
              <span className="text-[11px] text-white/60">{label}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
