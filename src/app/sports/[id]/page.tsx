'use client'
import { useAthlete } from '@/lib/hooks'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Instagram, DollarSign, Calendar, Trophy, MapPin, Phone, Mail } from 'lucide-react'

export default function AthletePage() {
  const { id } = useParams()
  const { data: a, isLoading } = useAthlete(id)

  if (isLoading) return <div className="px-4 py-4 space-y-3">{[...Array(6)].map((_,i)=><div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse"/>)}</div>
  if (!a) return <div className="px-4 py-8 text-center text-white/40">Athlete not found</div>

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-6">
      <Link href="/sports" className="flex items-center gap-1.5 text-white/50 text-sm"><ArrowLeft className="h-4 w-4"/>Athletes</Link>

      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-500/30 to-yellow-500/30 border border-white/10 flex items-center justify-center text-2xl font-bold overflow-hidden flex-shrink-0">
          {a.headshot_url?<img src={a.headshot_url} alt="" className="h-full w-full object-cover"/>:(a.name||'?')[0]}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{a.name}</h1>
          <p className="text-sm text-white/50">{[a.position,a.team].filter(Boolean).join(' · ')}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {a.league&&<span className="text-[11px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">{a.league}</span>}
            {a.instagram&&<a href={`https://instagram.com/${a.instagram}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-pink-400 flex items-center gap-1"><Instagram className="h-3 w-3"/>@{a.instagram}</a>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: DollarSign, label:'Annual Salary',   value: a.salary_annual    ?`$${(a.salary_annual/1e6).toFixed(2)}M`:'--',    color:'text-green-400' },
          { icon: Trophy,     label:'Contract Value',  value: a.contract_value   ?`$${(a.contract_value/1e6).toFixed(1)}M`:'--',    color:'text-yellow-400' },
          { icon: Calendar,   label:'Expiry Year',     value: a.contract_expiry  ?new Date(a.contract_expiry).getFullYear().toString():'--', color:'text-orange-400' },
          { icon: Trophy,     label:'Years Remaining', value: a.remaining_contract_years!=null?`${a.remaining_contract_years} yr`:'--', color: a.remaining_contract_years<=1?'text-red-400':'text-white' },
        ].map(({icon:Icon,label,value,color})=>(
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1"><Icon className="h-3.5 w-3.5 text-white/30"/><span className="text-[10px] text-white/40">{label}</span></div>
            <div className={`text-lg font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {(a.agent_name||a.phone_number||a.email||a.hometown)&&(
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Contact</p>
          {a.agent_name&&<p className="text-sm text-white/70"><span className="text-white/30">Agent: </span>{a.agent_name}</p>}
          {a.phone_number&&<div className="flex items-center gap-2 text-sm text-white/70"><Phone className="h-3.5 w-3.5 text-white/30"/>{a.phone_number}</div>}
          {a.email&&<div className="flex items-center gap-2 text-sm text-white/70"><Mail className="h-3.5 w-3.5 text-white/30"/>{a.email}</div>}
          {a.hometown&&<div className="flex items-center gap-2 text-sm text-white/70"><MapPin className="h-3.5 w-3.5 text-white/30"/>{a.hometown}</div>}
        </div>
      )}

      {(a.behavioral_archetype||a.propensity_jewelry||a.propensity_timepieces)&&(
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Psychographic Profile</p>
          {a.behavioral_archetype&&<p className="text-sm text-white mb-3 capitalize">{a.behavioral_archetype.replace(/_/g,' ')}</p>}
          <div className="space-y-2">
            {[{label:'Jewelry',value:a.propensity_jewelry,color:'bg-yellow-400'},{label:'Timepieces',value:a.propensity_timepieces,color:'bg-blue-400'},{label:'Automobiles',value:a.propensity_automobiles,color:'bg-green-400'}]
              .filter(x=>x.value!=null).map(({label,value,color})=>(
              <div key={label}>
                <div className="flex justify-between text-[10px] text-white/40 mb-1"><span>{label}</span><span>{value}%</span></div>
                <div className="h-1.5 bg-white/10 rounded-full"><div className={`h-full rounded-full ${color}`} style={{width:`${value}%`}}/></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {a.notes&&<div className="bg-white/5 border border-white/10 rounded-xl p-4"><p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Notes</p><p className="text-sm text-white/70 leading-relaxed">{a.notes}</p></div>}
    </div>
  )
}
