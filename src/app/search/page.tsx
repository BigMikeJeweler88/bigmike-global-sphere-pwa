'use client'
import { useState } from 'react'
import { Search, Trophy, Music2, Users, Star } from 'lucide-react'
import { useSearch } from '@/lib/api/hooks'

function CategoryIcon({ type }: { type: string }) {
  const t = (type || '').toLowerCase()
  if (t === 'athlete' || t === 'sports') return <Trophy className="h-3 w-3 text-orange-400" />
  if (t === 'music') return <Music2 className="h-3 w-3 text-purple-400" />
  if (t === 'civilian') return <Users className="h-3 w-3 text-yellow-400" />
  return <Star className="h-3 w-3 text-pink-400" />
}

export default function SearchPage() {
  const [q, setQ] = useState('')
  const { data, isLoading } = useSearch(q)

  // /api/clients returns { data: [], total: N } or just an array
  const raw = data as any
  const results: any[] = Array.isArray(raw) ? raw : (raw?.data || raw?.clients || [])

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-24">
      <div>
        <h1 className="text-2xl font-bold text-white">Search</h1>
        <p className="text-white/40 text-sm">4,200+ clients across all categories</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search any client, name, team, league..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
        />
        {q && (
          <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">
            Clear
          </button>
        )}
      </div>

      {q.length < 2 && (
        <div className="text-center py-12 text-white/30">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Type at least 2 characters to search</p>
        </div>
      )}

      {isLoading && q.length >= 2 && (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}
        </div>
      )}

      {!isLoading && q.length >= 2 && results.length === 0 && (
        <div className="text-center py-12 text-white/30">
          <p className="text-sm">No results for "{q}"</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-white/40 mb-3">{results.length} results</div>
          {results.map((r: any) => (
            <div key={r.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
              <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white overflow-hidden flex-shrink-0">
                {r.headshot_url ? <img src={r.headshot_url} alt="" className="h-full w-full object-cover" /> : (r.name || '?')[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{r.name}</div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                  <CategoryIcon type={r.client_type || r.category} />
                  <span>{r.client_type || r.category}</span>
                  {r.league && <><span>·</span><span>{r.league}</span></>}
                  {r.team && <><span>·</span><span>{r.team}</span></>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
