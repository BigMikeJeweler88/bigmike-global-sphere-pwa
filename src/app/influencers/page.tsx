'use client'
import { useState } from 'react'
import { useInfluencers } from '@/lib/hooks'
import { Search, Star, Instagram } from 'lucide-react'
import { CardSkeleton } from '@/components/Skeleton'

export default function InfluencersPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useInfluencers(search||undefined)
  const influencers = (data as any)?.data ?? []
  const total       = (data as any)?.total ?? 0

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-6">
      <div>
        <p className="text-[11px] text-pink-400 uppercase tracking-widest font-semibold">Influencer Intelligence</p>
        <h1 className="text-2xl font-bold text-white">Influencers</h1>
        <p className="text-white/40 text-sm">{total.toLocaleString()} creators</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search influencers..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none"/>
      </div>

      {isLoading?<CardSkeleton n={5}/>:influencers.length===0?(
        <div className="text-center py-12 text-white/30"><Star className="h-8 w-8 mx-auto mb-2 opacity-30"/><p>No influencers found</p></div>
      ):(
        <div className="space-y-2">
          {influencers.map((inf:any)=>(
            <div key={inf.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500/40 to-yellow-500/40 border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {(inf.name||'?')[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{inf.name}</div>
                <div className="flex items-center gap-2 text-[10px] text-white/40">
                  {inf.instagram&&<span className="flex items-center gap-0.5"><Instagram className="h-2.5 w-2.5"/>@{inf.instagram}</span>}
                  {inf.behavioral_archetype&&<span className="capitalize">{inf.behavioral_archetype.replace(/_/g,' ')}</span>}
                </div>
              </div>
              {inf.instagram_followers!=null&&(
                <div className="text-[11px] text-pink-400 flex-shrink-0">
                  {inf.instagram_followers>=1e6?`${(inf.instagram_followers/1e6).toFixed(1)}M`:`${Math.round(inf.instagram_followers/1e3)}K`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
