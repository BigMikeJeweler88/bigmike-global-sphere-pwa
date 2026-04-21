'use client'
import { useSalesDashboard, useSalesTransactions } from '@/lib/api/hooks'
import { DollarSign, TrendingUp, Receipt } from 'lucide-react'

export default function SalesPage() {
  const { data: dashboard, isLoading } = useSalesDashboard()
  const { data: txData } = useSalesTransactions()

  const d = (dashboard as any) || {}
  const txns: any[] = Array.isArray(txData) ? txData : []

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-24">
      <div>
        <p className="text-[11px] text-green-400 uppercase tracking-widest font-medium">Sales Intelligence</p>
        <h1 className="text-2xl font-bold text-white">Sales</h1>
        <p className="text-white/40 text-sm">Transactions · Analytics</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {isLoading ? [...Array(4)].map((_,i) => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse"/>) : [
          { label: 'Total Revenue',   value: d.total_revenue   ? `$${(d.total_revenue/1e6).toFixed(2)}M`  : '--', color: 'text-green-400' },
          { label: 'Transactions',    value: d.total_transactions?.toLocaleString() || txns.length.toString(), color: 'text-yellow-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-[11px] text-white/40 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {d.by_category?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">By Category</p>
          <div className="space-y-1.5">
            {d.by_category.map((cat: any) => (
              <div key={cat.category} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                <span className="text-sm text-white capitalize">{cat.category}</span>
                <span className="text-sm font-bold text-green-400">${(cat.total/1e3).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {txns.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Recent Transactions</p>
          <div className="space-y-2">
            {txns.slice(0, 10).map((t: any) => (
              <div key={t.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
                <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-4 w-4 text-green-400"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{t.client_name || t.item_description}</div>
                  <div className="text-[10px] text-white/40">{t.category} · {t.transaction_date ? new Date(t.transaction_date).toLocaleDateString() : ''}</div>
                </div>
                <div className="text-sm font-bold text-green-400">${t.amount?.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
