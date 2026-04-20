'use client'
import{useAthlete}from'@/lib/api/hooks'
import{useParams}from'next/navigation'
import{ArrowLeft,Instagram,DollarSign,Calendar,Trophy,Activity}from'lucide-react'
import Link from'next/link'
export default function AthletePage(){
  const{id}=useParams()
  const{data:athlete,isLoading}=useAthlete(id)
  if(isLoading)return<div className="px-4 py-8 text-center text-white/40">Loading...</div>
  if(!athlete)return null
  const a=athlete.client||athlete
  return(<div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
    <Link href="/sports" className="flex items-center gap-1.5 text-white/50 text-sm"><ArrowLeft className="h-4 w-4"/>Athletes</Link>
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500/30 to-yellow-500/30 border border-white/10 flex items-center justify-center text-2xl font-bold text-white overflow-hidden flex-shrink-0">{a.headshot_url?<img src={a.headshot_url} alt="" className="h-full w-full object-cover"/>:(a.name||'?')[0]}</div>
      <div className="flex-1"><h1 className="text-xl font-bold text-white">{a.name}</h1><div className="text-sm text-white/50">{a.position} · {a.team}</div><div className="flex items-center gap-1.5 mt-1"><span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">{a.league}</span>{a.instagram&&<a href={'https://instagram.com/'+a.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-400 flex items-center gap-1"><Instagram className="h-3 w-3"/>@{a.instagram}</a>}</div></div>
    </div>
    <div className="grid grid-cols-2 gap-2">{[
      {icon:DollarSign,label:'Annual Salary',value:a.salary_annual?'$'+(a.salary_annual/1e6).toFixed(2)+'M':'--',color:'text-green-400'},
      {icon:Trophy,label:'Contract Value',value:a.contract_value?'$'+(a.contract_value/1e6).toFixed(1)+'M':'--',color:'text-yellow-400'},
      {icon:Calendar,label:'Expiry Year',value:a.contract_expiry_year||'--',color:'text-orange-400'},
      {icon:Activity,label:'Years Left',value:a.contract_years_remaining!=null?a.contract_years_remaining+' yr':'--',color:a.contract_years_remaining<=1?'text-red-400':'text-white'},
    ].map(({icon:Icon,label,value,color})=>(
      <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3"><div className="flex items-center gap-1.5 mb-1"><Icon className="h-3.5 w-3.5 text-white/30"/><span className="text-[10px] text-white/40">{label}</span></div><div className={'text-lg font-bold '+color}>{value}</div></div>
    ))}</div>
    {a.notes&&<div className="bg-white/5 border border-white/10 rounded-xl p-4"><div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Notes</div><p className="text-sm text-white/70 leading-relaxed">{a.notes}</p></div>}
  </div>)
}