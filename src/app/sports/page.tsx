'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAthletes, useBonuses, useFreeAgency } from '@/lib/hooks'
import { Search, ChevronRight, Trophy } from 'lucide-react'
import { CardSkeleton } from '@/components/Skeleton'

const LEAGUES = ['NFL','NBA','MLB','NHL','Premier League','LaLiga','MLS','ATP','WTA','PGA Tour','UFC','Boxing','WNBA']

export default function SportsPage() {
  const [search, setSearch] = useState('')
  const [league, setLeague] = useState('')
  const { data, isLoading } = useAthletes(search||undefined, league||undefined)
  const { data: bonuses } = useBonuses()
  const { data: fa } = useFreeAgency()

  const athletes = (data as any)?.data ?? []
  const total    = (data as any)?.total ?? 0
  const bonusList: any[] = Array.isArray(bonuses) ? bonuses : []
  const faList:    any[] = Array.isArray(fa)      ? fa      : []

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-6">
      <div>
        <p className="text-[11px] text-orange-400 uppercase tracking-widest font-semibold">BigMike Global Sports</p>
        <h1 className="text-2xl font-bold text-white">Athletes</h1>
        <p className="text-white/40 text-sm">{total.toLocaleString()} clients</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Total',       value: total,           color: 'text-orange-400' },
          { label: 'Free Agency', value: faList.length,   color: 'text-yellow-400' },
          { label: 'Bonuses',     value: bonusList.length,color: 'text-green-400'  },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className={`text-xl font-bold ${color}`}>{value.toLocaleString()}</div>
            <div className="text-[10px] text-white/40">{label}</div>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search athletes..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50" />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {['All',...LEAGUES].map(l => (
          <button key={l} onClick={()=>setLeague(l==='All'?'':l===league?'':l)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${(l==='All'?!league:league===l)?'bg-orange-500/20 border-orange-500/30 text-orange-400':'bg-white/5 border-white/10 text-white/50'}`}>
            {l}
          </button>
        ))}
      </div>

      {isLoading ? <CardSkeleton n={8}/> : athletes.length===0 ? (
        <div className="text-center py-12 text-white/30"><Trophy className="h-8 w-8 mx-auto mb-2 opacity-30"/><p>No athletes found</p></div>
      ) : (
        <div className="space-y-2">
          {athletes.map((a:any) => (
            <Link key={a.id} href={`/sports/${a.id}`} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3 active:scale-[0.98] transition-transform">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500/30 to-yellow-500/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white overflow-hidden flex-shrink-0">
                {a.headshot_url?<img src={a.headshot_url} alt="" className="h-full w-full object-cover"/>:(a.name||'?')[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{a.name}</div>
                <div className="text-[11px] text-white/40">{[a.position,a.team,a.league].filter(Boolean).join(' · ')}</div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {a.salary_annual && <span className="text-[11px] text-green-400">${(a.salary_annual/1e6).toFixed(1)}M</span>}
                {a.remaining_contract_years!=null&&a.remaining_contract_years<=1&&<span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Expiring</span>}
                <ChevronRight className="h-3 w-3 text-white/20"/>
              </div>
            </Link>
          ))}
          {total>athletes.length&&<p className="text-center text-[11px] text-white/30 py-2">Showing {athletes.length} of {total.toLocaleString()} — search to filter</p>}
        </div>
      )}
    </div>
  )
}
