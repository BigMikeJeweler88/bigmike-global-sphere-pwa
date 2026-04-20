'use client'
import { useState } from 'react'
import { useAthletes, useBonuses, useFreeAgency } from '@/lib/api/hooks'
import { Search, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function SportsPage() {
  const [search, setSearch] = useState('')
  const [league, setLeague] = useState('')

  const params: any = {}
  if (search) params.search = search
  if (league) params.league = league

  const { data, isLoading } = useAthletes(Object.keys(params).length ? params : undefined)
  const { data: bonusData } = useBonuses()
  const { data: faData } = useFreeAgency()

  // /api/clients returns { data: [], total: N } shape
  const raw = data as any
  const athletes: any[] = Array.isArray(raw) ? raw : (raw?.data || raw?.clients || [])
  const total = raw?.total || athletes.length

  const bonuses: any[] = Array.isArray(bonusData) ? bonusData : ((bonusData as any)?.data || [])
  const freeAgents: any[] = Array.isArray(faData) ? faData : ((faData as any)?.data || [])

  const leagues = ['NFL', 'NBA', 'MLB', 'NHL', 'Premier League', 'LaLiga', 'MLS', 'ATP', 'WTA']

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-24">
      <div>
        <p className="text-[11px] text-orange-400 uppercase tracking-widest font-medium">BigMike Global Sports</p>
        <h1 className="text-2xl font-bold text-white">Athletes</h1>
        <p className="text-white/40 text-sm">{total.toLocaleString()} clients</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-orange-400">{bonuses.length}</div>
          <div className="text-[10px] text-white/40">Bonus Alerts</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-yellow-400">{freeAgents.length}</div>
          <div className="text-[10px] text-white/40">Free Agency</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-blue-400">{total.toLocaleString()}</div>
          <div className="text-[10px] text-white/40">Total Athletes</div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search athletes..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button onClick={() => setLeague('')} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${league === '' ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-white/5 border-white/10 text-white/50'}`}>All</button>
        {leagues.map(l => (
          <button key={l} onClick={() => setLeague(l === league ? '' : l)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${league === l ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-white/5 border-white/10 text-white/50'}`}>{l}</button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(8)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}</div>
      ) : athletes.length === 0 ? (
        <div className="text-center py-12 text-white/30">No athletes found</div>
      ) : (
        <div className="space-y-2">
          {athletes.slice(0, 100).map((a: any) => (
            <Link key={a.id} href={`/sports/${a.id}`} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3 active:scale-[0.98] transition-transform">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500/30 to-yellow-500/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white overflow-hidden flex-shrink-0">
                {a.headshot_url ? <img src={a.headshot_url} alt="" className="h-full w-full object-cover" /> : (a.name || '?')[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{a.name}</div>
                <div className="text-[11px] text-white/40">{a.league}{a.team ? ` · ${a.team}` : ''}{a.position ? ` · ${a.position}` : ''}</div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {a.salary_annual && <div className="text-[11px] text-green-400">${(a.salary_annual / 1e6).toFixed(1)}M</div>}
                {a.contract_years_remaining != null && a.contract_years_remaining <= 1 && (
                  <div className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Expiring</div>
                )}
                <ChevronRight className="h-3 w-3 text-white/20" />
              </div>
            </Link>
          ))}
          {athletes.length > 100 && (
            <div className="text-center py-3 text-white/30 text-xs">Showing 100 of {total.toLocaleString()} — use search to filter</div>
          )}
        </div>
      )}
    </div>
  )
}
