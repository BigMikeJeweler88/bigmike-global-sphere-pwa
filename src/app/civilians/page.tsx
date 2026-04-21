'use client'
import { useState } from 'react'
import { useCiviliansDashboard, useCivilians } from '@/lib/api/hooks'
import { Search, Users, Instagram, MapPin } from 'lucide-react'

export default function CiviliansPage() {
  const [search, setSearch] = useState('')
  const { data: dash, isLoading: dashLoading } = useCiviliansDashboard()
  const { data, isLoading } = useCivilians(search ? { search } : undefined)

  const d = (dash as any) || {}
  const raw = data as any
  const civilians: any[] = Array.isArray(raw) ? raw : (raw?.data || [])
  const total = raw?.total || civilians.length

  const propScore = (c: any) => Math.max(c.propensity_jewelry || 0, c.propensity_timepieces || 0, c.propensity_automobiles || 0)

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-24">
      <div>
        <p className="text-[11px] text-yellow-400 uppercase tracking-widest font-medium">Civilian Acquisition Engine</p>
        <h1 className="text-2xl font-bold text-white">Civilians</h1>
        <p className="text-white/40 text-sm">Jewelry propensity pipeline</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {dashLoading ? [...Array(2)].map((_,i) => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse"/>) : [
          { label: 'Total Civilians', value: d.total_civilians?.toLocaleString() || total.toLocaleString(), color: 'text-yellow-400' },
          { label: 'With Instagram',  value: d.with_instagram?.toLocaleString() || '--', color: 'text-pink-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-[10px] text-white/40 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30"/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search civilians..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-500/50"/>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(6)].map((_,i) => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse"/>)}</div>
      ) : civilians.length === 0 ? (
        <div className="text-center py-12 text-white/30"><Users className="h-8 w-8 mx-auto mb-2 opacity-30"/><p>No civilians found</p></div>
      ) : (
        <div className="space-y-2">
          {civilians.slice(0, 100).map((c: any) => {
            const score = propScore(c)
            return (
              <div key={c.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {(c.name || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{c.name}</div>
                  <div className="flex items-center gap-2 text-[10px] text-white/40 mt-0.5">
                    {c.instagram && <span className="flex items-center gap-0.5"><Instagram className="h-2.5 w-2.5"/>@{c.instagram}</span>}
                    {c.hometown && <span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5"/>{c.hometown}</span>}
                  </div>
                </div>
                {score > 0 && (
                  <div className={`text-[11px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${score >= 75 ? 'bg-green-500/20 text-green-400' : score >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white/30'}`}>
                    {score}
                  </div>
                )}
              </div>
            )
          })}
          {civilians.length > 100 && <p className="text-center text-xs text-white/30 py-2">Use search to filter</p>}
        </div>
      )}
    </div>
  )
}
