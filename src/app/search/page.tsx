'use client'
import{useState}from'react'
import{Search,Users,Music2,Star,Trophy}from'lucide-react'
import{fetcher}from'@/lib/api/config'
import{useQuery}from'@tanstack/react-query'
export default function SearchPage(){
  const[q,setQ]=useState('')
  const{data,isLoading}=useQuery({queryKey:['global-search',q],queryFn:()=>fetcher('/api/search?q='+encodeURIComponent(q)+'&limit=30'),enabled:q.length>=2})
  const results=data?.results||[]
  const catIcon=(cat)=>{if(cat==='Athlete'||cat==='athlete')return<Trophy className="h-3 w-3 text-orange-400"/>;if(cat==='Music'||cat==='music')return<Music2 className="h-3 w-3 text-purple-400"/>;if(cat==='Civilian'||cat==='civilian')return<Users className="h-3 w-3 text-yellow-400"/>;return<Star className="h-3 w-3 text-pink-400"/>}
  return(<div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
    <div><h1 className="text-2xl font-bold text-white">Search</h1><p className="text-white/40 text-sm">4,200+ clients across all categories</p></div>
    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30"/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search any client, handle, team..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"/>{q&&<button onClick={()=>setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">Clear</button>}</div>
    {q.length<2&&<div className="text-center py-12 text-white/30"><Search className="h-10 w-10 mx-auto mb-3 opacity-20"/><p className="text-sm">Type at least 2 characters</p></div>}
    {isLoading&&q.length>=2&&<div className="space-y-2">{[...Array(6)].map((_,i)=><div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse"/>)}</div>}
    {!isLoading&&q.length>=2&&results.length===0&&<div className="text-center py-12 text-white/30"><p className="text-sm">No results for "{q}"</p></div>}
    {results.length>0&&<div className="space-y-1">
      <div className="text-xs text-white/40 mb-3">{results.length} results</div>
      {results.map(r=>(<div key={(r.type||r.category)+'-'+r.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
        <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white overflow-hidden flex-shrink-0">{r.headshot_url||r.profile_image?<img src={r.headshot_url||r.profile_image} alt="" className="h-full w-full object-cover"/>:(r.name||'?')[0]}</div>
        <div className="flex-1 min-w-0"><div className="text-sm font-medium text-white truncate">{r.name}</div><div className="flex items-center gap-1.5 text-[10px] text-white/40">{catIcon(r.category||r.type)}<span>{r.category||r.type}</span>{r.league&&<><span>·</span><span>{r.league}</span></>}{r.instagram&&<><span>·</span><span>@{r.instagram}</span></>}</div></div>
      </div>))}
    </div>}
  </div>)
}