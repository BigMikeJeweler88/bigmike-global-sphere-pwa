'use client'
import { useOutreachQueue, useOutreachStats, useApprove, useReject } from '@/lib/hooks'
import { Send, CheckCircle, XCircle, MessageSquare } from 'lucide-react'
import { CardSkeleton } from '@/components/Skeleton'

export default function OutreachPage() {
  const { data: queue, isLoading } = useOutreachQueue()
  const { data: stats } = useOutreachStats()
  const approve = useApprove()
  const reject  = useReject()

  const items: any[] = Array.isArray(queue) ? queue : []
  const s = (stats as any)||{}

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-6">
      <div>
        <p className="text-[11px] text-blue-400 uppercase tracking-widest font-semibold">JARVIS AI Outreach</p>
        <h1 className="text-2xl font-bold text-white">Outreach Queue</h1>
        <p className="text-white/40 text-sm">{items.length} messages pending approval</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label:'Generated', value:s.total??0,    color:'text-blue-400'   },
          { label:'Approved',  value:s.approved??0, color:'text-green-400'  },
          { label:'Pending',   value:s.pending??items.length, color:'text-yellow-400' },
        ].map(({label,value,color})=>(
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className={`text-xl font-bold ${color}`}>{value.toLocaleString()}</div>
            <div className="text-[10px] text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {isLoading?<CardSkeleton n={4}/>:items.length===0?(
        <div className="text-center py-16 text-white/30">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30"/>
          <p className="font-medium">Queue is empty</p>
          <p className="text-xs mt-1">JARVIS generates outreach automatically</p>
        </div>
      ):(
        <div className="space-y-3">
          {items.map((item:any)=>(
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-white">{item.client_name}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">
                    {item.persona?.replace(/_/g,' ')||'AI Generated'} · {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
                <Send className="h-4 w-4 text-blue-400 flex-shrink-0"/>
              </div>
              <div className="bg-black/20 rounded-lg p-3 mb-3">
                <p className="text-xs text-white/70 leading-relaxed">{item.message_text}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>approve.mutate(item.id)} disabled={approve.isPending}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-green-500/20 border border-green-500/30 rounded-lg py-2 text-xs font-semibold text-green-400 active:scale-95 transition-transform disabled:opacity-50">
                  <CheckCircle className="h-3.5 w-3.5"/>Approve & Send
                </button>
                <button onClick={()=>reject.mutate(item.id)} disabled={reject.isPending}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-lg py-2 text-xs font-semibold text-red-400 active:scale-95 transition-transform disabled:opacity-50">
                  <XCircle className="h-3.5 w-3.5"/>Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
