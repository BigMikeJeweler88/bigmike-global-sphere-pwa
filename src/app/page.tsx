'use client';
import{useAlerts,useAthletes,useMusicArtists,useCivilians}from'@/lib/api/hooks';
import Link from'next/link';
import{Trophy,Music2,Users,Star,Bell,DollarSign,Cpu,Search,Cake,Send,TrendingUp}from'lucide-react';
export default function Home(){
  const{data:alertData}=useAlerts();
  const{data:athleteData}=useAthletes();
  const{data:musicData}=useMusicArtists();
  const{data:civData}=useCivilians();
  const alerts=(alertData as any[])||[];
  const criticalAlerts=alerts.filter((a:any)=>a.severity==='critical'||a.priority==='critical');
  const modes=[
    {href:'/sports',icon:Trophy,label:'Sports',sub:'1,572 athletes',color:'text-orange-400',bg:'bg-orange-500/10 border-orange-500/20'},
    {href:'/music',icon:Music2,label:'Music',sub:'540 artists',color:'text-purple-400',bg:'bg-purple-500/10 border-purple-500/20'},
    {href:'/civilians',icon:Users,label:'Civilians',sub:'1,987 prospects',color:'text-yellow-400',bg:'bg-yellow-500/10 border-yellow-500/20'},
    {href:'/influencers',icon:Star,label:'Influencers',sub:'140+ creators',color:'text-pink-400',bg:'bg-pink-500/10 border-pink-500/20'},
    {href:'/sales',icon:DollarSign,label:'Sales',sub:'Transactions',color:'text-green-400',bg:'bg-green-500/10 border-green-500/20'},
    {href:'/system',icon:Cpu,label:'System',sub:'Health & AI',color:'text-cyan-400',bg:'bg-cyan-500/10 border-cyan-500/20'},
  ];
  const quick=[
    {href:'/alerts',icon:Bell,label:'Alerts',badge:criticalAlerts.length,color:'text-red-400'},
    {href:'/birthdays',icon:Cake,label:'Birthdays',color:'text-pink-400'},
    {href:'/outreach',icon:Send,label:'Outreach',color:'text-blue-400'},
    {href:'/highlights',icon:TrendingUp,label:'Highlights',color:'text-cyan-400'},
    {href:'/search',icon:Search,label:'Search',color:'text-white/60'},
    {href:'/more',icon:null,label:'More',color:'text-white/60'},
  ];
  return(<div className="px-4 py-4 space-y-5 max-w-2xl mx-auto pb-24">
    <div className="pt-2"><p className="text-[11px] text-blue-400 uppercase tracking-widest font-medium">JARVIS Intelligence</p><h1 className="text-3xl font-bold text-white">Situation Room</h1><p className="text-white/40 text-sm">BigMike Global Sports CRM</p></div>
    {criticalAlerts.length>0&&<Link href="/alerts" className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"><Bell className="h-5 w-5 text-red-400 flex-shrink-0"/><div className="flex-1"><div className="text-sm font-semibold text-red-300">{criticalAlerts.length} Critical Alert{criticalAlerts.length>1?'s':''}</div><div className="text-xs text-white/40">{criticalAlerts[0]?.title||criticalAlerts[0]?.alert_type}</div></div></Link>}
    <div>
      <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Modes</p>
      <div className="grid grid-cols-2 gap-2">{modes.map(({href,icon:Icon,label,sub,color,bg})=>(<Link key={href} href={href} className={`flex items-center gap-3 border rounded-xl px-3 py-3.5 active:scale-95 transition-transform ${bg}`}><Icon className={`h-5 w-5 flex-shrink-0 ${color}`}/><div><div className="text-sm font-semibold text-white">{label}</div><div className="text-[10px] text-white/40">{sub}</div></div></Link>))}</div>
    </div>
    <div>
      <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Quick Access</p>
      <div className="grid grid-cols-3 gap-2">{quick.map(({href,icon:Icon,label,badge,color})=>(<Link key={href} href={href} className="relative flex flex-col items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl py-3 active:scale-95 transition-transform">{Icon&&<Icon className={`h-5 w-5 ${color}`}/>}{badge&&badge>0&&<span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{badge}</span>}<span className="text-[11px] text-white/60">{label}</span></Link>))}</div>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {[{label:'Total Clients',value:'4,200+',color:'text-blue-400'},{label:'Athletes',value:'1,572',color:'text-orange-400'},{label:'Musicians',value:'540',color:'text-purple-400'}].map(({label,value,color})=>(<div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"><div className={`text-xl font-bold ${color}`}>{value}</div><div className="text-[10px] text-white/40">{label}</div></div>))}
    </div>
  </div>);
}