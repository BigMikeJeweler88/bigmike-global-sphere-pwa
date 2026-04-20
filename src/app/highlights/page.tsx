'use client'
import{useContractHighlights}from'@/lib/api/hooks'
import{TrendingUp,ExternalLink}from'lucide-react'
export default function HighlightsPage(){
  const{data,isLoading}=useContractHighlights()
  const highlights=data?.highlights||data||[]
  return(<div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
    <div><p className="text-[11px] text-cyan-400 uppercase tracking-widest font-medium">BigMike Global Sports</p><h1 className="text-2xl font-bold text-white">Highlights</h1><p className="text-white/40 text-sm">Contract signings, moves & news</p></div>
    {isLoading?<div className="space-y-3">{[...Array(5)].map((_,i)=><div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse"/>)}</div>:highlights.length===0?<div className="text-center py-16 text-white/30"><TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-30"/><p>No highlights yet</p></div>:
    <div className="space-y-3">{highlights.map((h,i)=>(<div key={h.id||i} className="bg-white/5 border border-white/10 rounded-xl p-4"><div className="flex items-start justify-between gap-2"><div className="flex-1"><div className="text-sm font-semibold text-white leading-snug">{h.title||h.headline}</div>{h.description&&<p className="text-xs text-white/50 mt-1.5 leading-relaxed line-clamp-3">{h.description}</p>}<div className="flex items-center gap-2 mt-2">{h.client_name&&<span className="text-[10px] text-blue-400">{h.client_name}</span>}{h.league&&<span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">{h.league}</span>}{h.date&&<span className="text-[10px] text-white/30">{h.date}</span>}</div></div>{h.url&&<a href={h.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/5 rounded-lg flex-shrink-0"><ExternalLink className="h-3.5 w-3.5 text-white/40"/></a>}</div></div>))}</div>}
  </div>)
}