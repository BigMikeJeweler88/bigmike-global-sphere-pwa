'use client'
import{useSalesDashboard,useSalesTransactions,useSalesPayouts}from'@/lib/api/hooks'
import{DollarSign,TrendingUp,Receipt,Users,ChevronRight}from'lucide-react'
import Link from'next/link'
export default function SalesPage(){
  const{data:dashboard,isLoading}=useSalesDashboard()
  const{data:transactions}=useSalesTransactions()
  const d=dashboard||{}
  const txns=transactions?.transactions||transactions||[]
  return(<div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
    <div><p className="text-[11px] text-green-400 uppercase tracking-widest font-medium">Sales Intelligence</p><h1 className="text-2xl font-bold text-white">Sales</h1><p className="text-white/40 text-sm">Transactions · Payouts · Analytics</p></div>
    <div className="grid grid-cols-2 gap-2">{isLoading?[...Array(4)].map((_,i)=><div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse"/>):
    [{label:'Total Revenue',value:d.total_revenue?'$'+(d.total_revenue/1e6).toFixed(2)+'M':'--',color:'text-green-400'},
     {label:'This Month',value:d.monthly_revenue?'$'+(d.monthly_revenue/1e3).toFixed(0)+'K':'--',color:'text-cyan-400'},
     {label:'Transactions',value:d.total_transactions?.toLocaleString()||'0',color:'text-yellow-400'},
     {label:'Avg Deal',value:d.avg_deal_size?'$'+(d.avg_deal_size/1e3).toFixed(0)+'K':'--',color:'text-purple-400'},
    ].map(({label,value,color})=>(<div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4"><div className={'text-xl font-bold '+color}>{value}</div><div className="text-[11px] text-white/40 mt-0.5">{label}</div></div>))}
    </div>
    <div className="grid grid-cols-2 gap-2">{[
      {href:'/sales/transactions',icon:Receipt,label:'All Transactions',color:'text-green-400'},
      {href:'/sales/payouts',icon:Users,label:'Payouts',color:'text-yellow-400'},
      {href:'/sales/analytics',icon:TrendingUp,label:'Analytics',color:'text-cyan-400'},
      {href:'/sales/add',icon:DollarSign,label:'Add Transaction',color:'text-purple-400'},
    ].map(({href,icon:Icon,label,color})=>(<Link key={href} href={href} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-3 active:scale-95 transition-transform"><Icon className={'h-4 w-4 '+color}/><span className="text-xs text-white/70 font-medium">{label}</span></Link>))}
    </div>
    {txns.length>0&&<div>
      <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Recent Transactions</span><Link href="/sales/transactions" className="text-[11px] text-green-400">View all</Link></div>
      <div className="space-y-2">{txns.slice(0,5).map(t=>(<div key={t.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3"><div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0"><DollarSign className="h-4 w-4 text-green-400"/></div><div className="flex-1 min-w-0"><div className="text-sm font-medium text-white truncate">{t.client_name||t.description}</div><div className="text-[10px] text-white/40">{t.date||t.created_at}</div></div><div className="text-sm font-bold text-green-400">${t.amount?.toLocaleString()}</div></div>))}</div>
    </div>}
  </div>)
}