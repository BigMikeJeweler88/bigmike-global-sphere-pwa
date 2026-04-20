'use client'

import { useJarvisStatus, useLiveStats, useAlerts, useBirthdays, useOutreachQueue } from '@/lib/api/hooks'
import { AlertTriangle, Zap, ChevronRight, Activity, Users, Music2, Star } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

export default function SituationRoomPage() {
  const { data: jarvis, isLoading: jarvisLoading } = useJarvisStatus()
  const { data: liveStats } = useLiveStats()
  const { data: alerts } = useAlerts()
  const { data: birthdays } = useBirthdays()
  const { data: outreach } = useOutreachQueue()

  const criticalAlerts = alerts?.filter((a) => a.severity === 'critical' || a.priority === 'critical') || []
  const upcomingBdays = birthdays?.slice(0, 3) || []
  const pendingOutreach = outreach?.length || 0

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
      <div>
        <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium">BigMike Global Sports · Morning Briefing</p>
        <h1 className="text-2xl font-bold text-white mt-0.5">The Situation Room</h1>
        <p className="text-white/40 text-sm">{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</p>
      </div>

      {liveStats?.games?.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">Live</span>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
            {liveStats.games.slice(0,4).map((game, i) => (
              <div key={i} className="flex-shrink-0 bg-white/5 rounded-lg px-3 py-2 min-w-[160px]">
                <div className="text-[10px] text-white/40 uppercase">{game.league||game.sport}</div>
                <div className="text-sm font-semibold text-white truncate">{game.summary||game.home+' vs '+game.away}</div>
                {game.score && <div className="text-xs text-yellow-400 font-bold">{game.score}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">JARVIS Intelligence Engine</div>
              <div className="text-[11px] text-white/40">AI Briefing System</div>
            </div>
          </div>
          {!jarvisLoading && jarvis && (
            <div className="flex gap-1.5 text-[10px]">
              <span className="bg-green-500/20 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded">{jarvis.fixes||0} fixes</span>
              <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 px-1.5 py-0.5 rounded">{jarvis.alerts||0} alerts</span>
            </div>
          )}
        </div>
        {jarvis?.briefing ? (
          <p className="text-sm text-white/70 leading-relaxed">{jarvis.briefing}</p>
        ) : (
          <p className="text-sm text-white/40 italic">No briefing available. JARVIS runs at 8:00 AM EST.</p>
        )}
      </div>

      {criticalAlerts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Critical Intelligence</span>
            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">{criticalAlerts.length} items</span>
          </div>
          <div className="space-y-2">
            {criticalAlerts.slice(0,3).map((alert) => (
              <div key={alert.id} className="bg-red-500/8 border border-red-500/20 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{alert.title||alert.alert_type}</div>
                    <div className="text-xs text-white/50 mt-0.5 line-clamp-2">{alert.message||alert.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link href="/sports" className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 active:scale-95 transition-transform">
          <div className="flex items-center gap-2 mb-2"><Activity className="h-4 w-4 text-orange-400" /><span className="text-[11px] text-orange-400 font-medium uppercase tracking-wide">Sports</span></div>
          <div className="text-2xl font-bold text-white">1,572</div>
          <div className="text-xs text-white/40">Athletes</div>
        </Link>
        <Link href="/music" className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 active:scale-95 transition-transform">
          <div className="flex items-center gap-2 mb-2"><Music2 className="h-4 w-4 text-purple-400" /><span className="text-[11px] text-purple-400 font-medium uppercase tracking-wide">Music</span></div>
          <div className="text-2xl font-bold text-white">540</div>
          <div className="text-xs text-white/40">Artists</div>
        </Link>
        <Link href="/civilians" className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 active:scale-95 transition-transform">
          <div className="flex items-center gap-2 mb-2"><Users className="h-4 w-4 text-yellow-400" /><span className="text-[11px] text-yellow-400 font-medium uppercase tracking-wide">Civilians</span></div>
          <div className="text-2xl font-bold text-white">1,987</div>
          <div className="text-xs text-white/40">Prospects</div>
        </Link>
        <Link href="/influencers" className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4 active:scale-95 transition-transform">
          <div className="flex items-center gap-2 mb-2"><Star className="h-4 w-4 text-pink-400" /><span className="text-[11px] text-pink-400 font-medium uppercase tracking-wide">Influencers</span></div>
          <div className="text-2xl font-bold text-white">140+</div>
          <div className="text-xs text-white/40">Clients</div>
        </Link>
      </div>

      {pendingOutreach > 0 && (
        <Link href="/outreach" className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 active:scale-95 transition-transform">
          <div>
            <div className="text-sm font-semibold text-white">{pendingOutreach} messages awaiting approval</div>
            <div className="text-xs text-white/40 mt-0.5">Outreach queue needs your review</div>
          </div>
          <div className="flex items-center gap-2"><span className="text-lg font-bold text-blue-400">{pendingOutreach}</span><ChevronRight className="h-4 w-4 text-blue-400" /></div>
        </Link>
      )}

      {upcomingBdays.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Upcoming Birthdays</span>
            <Link href="/birthdays" className="text-[11px] text-blue-400">View all</Link>
          </div>
          <div className="space-y-2">
            {upcomingBdays.map((b) => (
              <div key={b.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center text-sm">🎂</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{b.name}</div>
                  <div className="text-[11px] text-white/40">{b.league||b.category} · {b.birthday}</div>
                </div>
                <div className={`text-[11px] font-bold px-2 py-1 rounded-lg ${b.days_until===0?'bg-yellow-500/20 text-yellow-400':b.days_until<=3?'bg-orange-500/20 text-orange-400':'bg-white/10 text-white/50'}`}>
                  {b.days_until===0?'Today!':b.days_until+'d'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
