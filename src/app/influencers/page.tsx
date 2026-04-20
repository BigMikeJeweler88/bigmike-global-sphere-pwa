'use client'
import{useState}from'react'
import{useInfluencersDashboard,useInfluencers}from'@/lib/api/hooks'
import{Search,Star,TrendingUp}from'lucide-react'
export default function InfluencersPage(){
  const[search,setSearch]=useState('')
  const{data:dashboard}=useInfluencersDashboard()
  const{data:infData,isLoading}=useInfluencers(search?{search}:undefined)
  const influencers=infData?.influencers||infData||[]
  const d=dashboard||{}
  return(<div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
    <div><p className="text-[11px] text-pink-400 uppercase tracking-widest font-medium">Influencer Intelligence</p><h1 className="text-2xl font-bold text-white">Influencers</h1><p className="text-white/40 text-sm">140+ creators</p></div>
    <div className="grid grid-cols-3 gap-2">{[{label:'Total',value:d.total||'140+',color:'text-pink-400'},{label:'Avg Followers',value:d.avg_followers?(d.avg_followers/1e6).toFixed(1)+'M':'--',color:'text-yellow-400'},{label:'Active Deals',value:d.active_deals||'0',color:'text-green-400'}].map(({label,value,color})=>(<div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"><div className={'text-lg font-bold '+color}>{value}</div><div className="text-[10px] text-white/40">{label}</div></div>))}</div>
    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search influencers..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none"/></div>
    {isLoading?<div className="space-y-2">{[...Array(5)].map((_,i)=><div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse"/>)}</div>:influencers.length===0?<div className="text-center py-12 text-white/30"><Star className="h-8 w-8 mx-auto mb-2 opacity-30"/><p>No influencers found</p></div>:
    <div className="space-y-2">{influencers.map(inf=>(<div key={inf.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500/40 to-yellow-500/40 border border-white/10 flex items-center justify-center text-sm font-bold text-white overflow-hidden flex-shrink-0">{inf.profile_image?<img src={inf.profile_image} alt="" className="h-full w-full object-cover"/>:'⭐'}</div>
      <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-white truncate">{inf.name}</div><div className="text-[10px] text-white/40">{inf.instagram?'@'+inf.instagram:''}{inf.niche?' · '+inf.niche:''}</div></div>
      <div>{inf.follower_count&&<div className="text-[11px] text-pink-400">{inf.follower_count>=1e6?(inf.follower_count/1e6).toFixed(1)+'M':(inf.follower_count/1e3).toFixed(0)+'K'}</div>}</div>
    </div>))}</div>}
  </div>)
}