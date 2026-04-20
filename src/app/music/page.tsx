'use client'
import { useState } from 'react'
import { useMusicArtists, useMusicDashboard } from '@/lib/api/hooks'
import { Search, Music2 } from 'lucide-react'

export default function MusicPage() {
  const [search, setSearch] = useState('')
  const { data: dashData } = useMusicDashboard()
  const { data, isLoading } = useMusicArtists(search ? { search } : undefined)

  const raw = data as any
  const artists: any[] = Array.isArray(raw) ? raw : (raw?.data || raw?.clients || raw?.artists || [])
  const total = (raw?.total) || artists.length
  const d = dashData as any

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-24">
      <div>
        <p className="text-[11px] text-purple-400 uppercase tracking-widest font-medium">Music Intelligence</p>
        <h1 className="text-2xl font-bold text-white">Music</h1>
        <p className="text-white/40 text-sm">{total.toLocaleString()} artists</p>
      </div>

      {d && (
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Total Artists', value: d.total_artists || d.total || total, color: 'text-purple-400' },
            { label: 'Avg Streams', value: d.avg_monthly_streams ? `${(d.avg_monthly_streams/1e6).toFixed(1)}M` : '--', color: 'text-pink-400' },
            { label: 'New Releases', value: d.new_releases_count || d.new_releases || '--', color: 'text-cyan-400' },
            { label: 'Active Tours', value: d.active_tours || '--', color: 'text-yellow-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className={`text-lg font-bold ${color}`}>{value}</div>
              <div className="text-[10px] text-white/40">{label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search artists..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50" />
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}</div>
      ) : artists.length === 0 ? (
        <div className="text-center py-12 text-white/30"><Music2 className="h-8 w-8 mx-auto mb-2 opacity-30" /><p>No artists found</p></div>
      ) : (
        <div className="space-y-2">
          {artists.slice(0, 100).map((a: any) => (
            <div key={a.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/40 to-pink-500/40 border border-white/10 flex items-center justify-center text-base overflow-hidden flex-shrink-0">
                {a.headshot_url ? <img src={a.headshot_url} alt="" className="h-full w-full object-cover" /> : '🎤'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{a.name}</div>
                <div className="text-[10px] text-white/40">
                  {a.genre || a.category}{a.instagram_handle ? ` · @${a.instagram_handle}` : ''}
                  {a.notes ? ` · ${a.notes.slice(0, 40)}` : ''}
                </div>
              </div>
              {a.monthly_streams && <div className="text-[11px] text-purple-400 flex-shrink-0">{(a.monthly_streams / 1e6).toFixed(1)}M</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
