'use client'
import { useSalesSummary, useSalesTransactions } from '@/lib/hooks'
import { DollarSign, TrendingUp } from 'lucide-react'
import { CardSkeleton } from '@/components/Skeleton'

export default function SalesPage() {
  const { data: summary, isLoading } = useSalesSummary()
  const { data: txData } = useSalesTransactions()

  const s    = (summary as any) || {}
  const txns: any[] = Array.isArray(txData) ? txData : []

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-6">
      <div>
        <p className="text-[11px] text-green-400 uppercase tracking-widest font-semibold">Sales Intelligence</p>
        <h1 className="text-2xl font-bold text-white">Sales</h1>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {isLoading?[...Array(2)].map((_,i)=><div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse"/>):[
          { label:'Total Revenue',   value: s.total?`$${(s.total/1e6).toFixed(2)}M`:'--',  color:'text-green-400' },
          { label:'Transactions',    value: s.count?.toLocaleString()||txns.length.toString(), color:'text-yellow-400' },
        ].map(({label,value,color})=>(
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-[11px] text-white/40 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {s.by_category?.length>0&&(
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">By Category</p>
          <div className="space-y-1.5">
            {s.by_category.map((cat:any)=>(
              <div key={cat.category} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 text-green-400"/>
                  <span className="text-sm text-white capitalize">{cat.category}</span>
                </div>
                <span className="text-sm font-bold text-green-400">${(cat.total/1e3).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {txns.length>0&&(
        <div>
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Recent Transactions</p>
          <div className="space-y-2">
            {txns.slice(0,20).map((t:any)=>(
              <div key={t.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
                <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-4 w-4 text-green-400"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{t.client_name||t.item_description||'Transaction'}</div>
                  <div className="text-[10px] text-white/40">{t.category}{t.transaction_date?` · ${new Date(t.transaction_date).toLocaleDateString()}`:''}</div>
                </div>
                <div className="text-sm font-bold text-green-400 flex-shrink-0">${t.amount?.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
