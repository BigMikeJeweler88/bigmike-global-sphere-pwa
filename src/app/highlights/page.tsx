'use client'
import { useContractHighlights } from '@/lib/api/hooks'
import { TrendingUp, ExternalLink, DollarSign } from 'lucide-react'

export default function HighlightsPage() {
  const { data, isLoading } = useContractHighlights()
  const raw = data as any
  const highlights: any[] = Array.isArray(raw) ? raw : (raw?.data || raw?.signings || raw?.highlights || [])

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-24">
      <div>
        <p className="text-[11px] text-cyan-400 uppercase tracking-widest font-medium">BigMike Global Sports</p>
        <h1 className="text-2xl font-bold text-white">Contract Signings</h1>
        <p className="text-white/40 text-sm">Latest deals & moves</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />)}</div>
      ) : highlights.length === 0 ? (
        <div className="text-center py-16 text-white/30"><TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-30" /><p>No signings yet</p></div>
      ) : (
        <div className="space-y-3">
          {highlights.map((h: any, i: number) => (
            <div key={h.id || i} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white leading-snug">{h.title || h.player_name || h.client_name}</div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {h.team && <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded">{h.team}</span>}
                    {h.league && <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded">{h.league}</span>}
                    {h.contract_value && (
                      <span className="text-[10px] text-green-400 flex items-center gap-0.5">
                        <DollarSign className="h-2.5 w-2.5" />{(h.contract_value / 1e6).toFixed(1)}M
                      </span>
                    )}
                    {h.signing_date && <span className="text-[10px] text-white/30">{new Date(h.signing_date).toLocaleDateString()}</span>}
                  </div>
                  {h.description && <p className="text-xs text-white/50 mt-2 leading-relaxed line-clamp-2">{h.description}</p>}
                </div>
                {h.news_url && (
                  <a href={h.news_url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/5 rounded-lg flex-shrink-0">
                    <ExternalLink className="h-3.5 w-3.5 text-white/40" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
