'use client'
import{useState}from'react'
import{useCiviliansDashboard,useCivilians}from'@/lib/api/hooks'
import{Search,AlertTriangle,Shield,Scan}from'lucide-react'
export default function CiviliansPage(){
  const[search,setSearch]=useState('')
  const[filter,setFilter]=useState('all')
  const{data:dashboard,isLoading:dashLoading}=useCiviliansDashboard()
  const params={}
  if(search)params.search=search
  if(filter==='defections')params.defections_only='true'
  if(filter==='dnc')params.dnc_only='true'
  if(filter==='pending')params.outreach_status='pending'
  const{data:civData,isLoading:listLoading}=useCivilians(Object.keys(params).length?params:undefined)
  const civilians=civData?.civilians||[]
  const d=dashboard||{}
  return(<div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
    <div className="flex items-start justify-between">
      <div><p className="text-[11px] text-yellow-400 uppercase tracking-widest font-medium">Civilian Acquisition Engine</p><h1 className="text-2xl font-bold text-white">Civilians</h1><p className="text-white/40 text-sm">Jewelry propensity pipeline</p></div>
      <button className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-xl px-3 py-2 text-xs text-yellow-400"><Scan className="h-3.5 w-3.5"/>Run Scan</button>
    </div>
    <div className="grid grid-cols-3 gap-2">{dashLoading?[...Array(6)].map((_,i)=><div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse"/>):
      [{label:'Total',value:d.total_civilians?.toLocaleString()||'1,987',color:'text-white'},{label:'SCAN',value:d.scan_prospects?.toLocaleString()||'1,762',color:'text-yellow-400'},{label:'OC Clients',value:d.oc_clients?.toLocaleString()||'225',color:'text-green-400'},{label:'DNC',value:d.dnc_protected?.toLocaleString()||'89',color:'text-blue-400'},{label:'Defections',value:d.defection_alerts?.toLocaleString()||'0',color:'text-red-400'},{label:'Pending',value:d.outreach_pending?.toLocaleString()||'0',color:'text-purple-400'}]
      .map(({label,value,color})=>(<div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"><div className={'text-lg font-bold '+color}>{value}</div><div className="text-[10px] text-white/40">{label}</div></div>))}
    </div>
    {d.conversion_rate!==undefined&&<div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between"><div><div className="text-xs text-white/40">Conversion Rate</div><div className={'text-xl font-bold '+(d.conversion_rate===0?'text-red-400':'text-green-400')}>{d.conversion_rate}%</div></div><div className="text-right"><div className="text-xs text-white/40">Generated → Approved</div><div className="text-sm text-white/60">{d.outreach_generated||0} → {d.outreach_approved||0}</div></div></div>}
    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by handle or name..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-500/50"/></div>
    <div className="flex gap-2">{[{id:'all',label:'All'},{id:'defections',label:'🚨 Defections'},{id:'dnc',label:'🛡 DNC'},{id:'pending',label:'📤 Pending'}].map(({id,label})=>(<button key={id} onClick={()=>setFilter(id)} className={'px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all '+(filter===id?'bg-yellow-500/20 border-yellow-500/30 text-yellow-400':'bg-white/5 border-white/10 text-white/50')}>{label}</button>))}</div>
    {d.top_jewelers?.length>0&&filter==='all'&&!search&&<div><div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Top Source Jewelers</div><div className="space-y-1.5">{d.top_jewelers.slice(0,5).map((j,i)=>(<div key={j.handle} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2"><span className="text-white/30 text-xs w-4">{i+1}</span><div className="flex-1 min-w-0"><div className="text-sm font-medium text-white truncate">@{j.handle}</div><div className="text-[10px] text-white/40">{j.city}</div></div><div className="text-sm font-bold text-yellow-400">{j.count}</div></div>))}</div></div>}
    {listLoading?<div className="space-y-2">{[...Array(5)].map((_,i)=><div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse"/>)}</div>:
    <div className="space-y-2">{civilians.map(c=>(<div key={c.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{(c.name||c.instagram_handle||'?')[0].toUpperCase()}</div>
      <div className="flex-1 min-w-0"><div className="text-sm font-medium text-white truncate">{c.name||c.instagram_handle}</div><div className="flex items-center gap-1.5 text-[10px] text-white/40"><span className={'px-1.5 py-0.5 rounded '+(c.source_type==='OC'?'bg-green-500/20 text-green-400':'bg-yellow-500/20 text-yellow-400')}>{c.source_type}</span>{c.city&&<><span>·</span><span>{c.city}</span></>}</div></div>
      <div className="flex flex-col items-end gap-1">{c.defection_alert&&<AlertTriangle className="h-3.5 w-3.5 text-red-400"/>}{c.do_not_contact&&<Shield className="h-3.5 w-3.5 text-blue-400"/>}{c.propensity_score&&<div className={'text-[10px] font-bold px-1.5 py-0.5 rounded '+(c.propensity_score>=75?'bg-green-500/20 text-green-400':c.propensity_score>=50?'bg-yellow-500/20 text-yellow-400':'bg-white/10 text-white/30')}>{c.propensity_score}</div>}</div>
    </div>))}</div>}
  </div>)
}