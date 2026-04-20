'use client'
import { useOutreachQueue, useOutreachStats, useApproveOutreach, useRejectOutreach } from '@/lib/api/hooks'
import { Send, CheckCircle, XCircle, MessageSquare, Clock } from 'lucide-react'

export default function OutreachPage() {
  const { data: queue, isLoading } = useOutreachQueue()
  const { data: stats } = useOutreachStats()
  const approve = useApproveOutreach()
  const reject = useRejectOutreach()

  const raw = queue as any
  const items: any[] = Array.isArray(raw) ? raw : (raw?.data || raw?.queue || raw?.messages || [])
  const s = stats as any

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-24">
      <div>
        <p className="text-[11px] text-blue-400 uppercase tracking-widest font-medium">JARVIS AI Outreach</p>
        <h1 className="text-2xl font-bold text-white">Outreach Queue</h1>
        <p className="text-white/40 text-sm">{items.length} messages awaiting approval</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Generated',  value: s?.total_generated || s?.generated || 0,  color: 'text-blue-400' },
          { label: 'Approved',   value: s?.total_approved  || s?.approved  || 0,  color: 'text-green-400' },
          { label: 'Pending',    value: items.length,                              color: 'text-yellow-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className={`text-xl font-bold ${color}`}>{value}</div>
            <div className="text-[10px] text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No messages in queue</p>
          <p className="text-xs mt-1">JARVIS generates outreach automatically</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-white">{item.client_name || item.recipient_name || item.to}</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{item.outreach_type || item.type || item.channel || 'DM'}</span>
                    {item.platform && <><span>·</span><span>{item.platform}</span></>}
                  </div>
                </div>
                <Send className="h-4 w-4 text-blue-400" />
              </div>
              <div className="bg-white/5 rounded-lg p-3 mb-3">
                <p className="text-xs text-white/70 leading-relaxed line-clamp-4">
                  {item.message || item.content || item.body || item.outreach_message}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => approve.mutate(item.id)}
                  disabled={approve.isPending}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-green-500/20 border border-green-500/30 rounded-lg py-2 text-xs font-semibold text-green-400 active:scale-95 transition-transform disabled:opacity-50"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Approve
                </button>
                <button
                  onClick={() => reject.mutate(item.id)}
                  disabled={reject.isPending}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-lg py-2 text-xs font-semibold text-red-400 active:scale-95 transition-transform disabled:opacity-50"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
