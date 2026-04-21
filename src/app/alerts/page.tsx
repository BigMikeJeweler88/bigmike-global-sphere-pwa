'use client'
import { useAlerts } from '@/lib/hooks'
import { Bell, AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import { CardSkeleton } from '@/components/Skeleton'

export default function AlertsPage() {
  const { data, isLoading } = useAlerts()
  const all: any[] = Array.isArray(data) ? data : []

  const critical = all.filter(a=>a.alert_priority==='critical')
  const high     = all.filter(a=>a.alert_priority==='high')
  const other    = all.filter(a=>!['critical','high'].includes(a.alert_priority||''))

  const groups = [
    { key:'critical', label:'Critical', items:critical, color:'text-red-400',    bg:'bg-red-500/10',    border:'border-red-500/20' },
    { key:'high',     label:'High',     items:high,     color:'text-orange-400', bg:'bg-orange-500/10', border:'border-orange-500/20' },
    { key:'other',    label:'Other',    items:other,    color:'text-blue-400',   bg:'bg-blue-500/10',   border:'border-blue-500/20' },
  ]

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-6">
      <div>
        <p className="text-[11px] text-red-400 uppercase tracking-widest font-semibold">JARVIS Intelligence</p>
        <h1 className="text-2xl font-bold text-white">Alerts</h1>
        <p className="text-white/40 text-sm">{all.length} active · {critical.length} critical</p>
      </div>

      {isLoading?<CardSkeleton n={5}/>:all.length===0?(
        <div className="text-center py-16 text-white/30">
          <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-30"/>
          <p className="text-sm font-medium">All Clear</p>
          <p className="text-xs mt-1">JARVIS is monitoring</p>
        </div>
      ):(
        <div className="space-y-5">
          {groups.map(({key,label,items,color,bg,border})=>items.length===0?null:(
            <div key={key}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${color}`}>{label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${bg} ${color} ${border}`}>{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((a:any)=>(
                  <div key={a.id} className={`rounded-xl p-3.5 border ${bg} ${border}`}>
                    <div className="flex items-start gap-2 mb-1">
                      <AlertTriangle className={`h-4 w-4 ${color} mt-0.5 flex-shrink-0`}/>
                      <div className="text-sm font-semibold text-white leading-snug flex-1">{a.alert_title||a.alert_type}</div>
                    </div>
                    {a.alert_message&&<p className="text-xs text-white/60 leading-relaxed line-clamp-3 pl-6">{a.alert_message}</p>}
                    {a.action_recommended&&<p className="text-[10px] text-cyan-400/80 mt-1.5 pl-6">→ {a.action_recommended}</p>}
                    <div className="flex items-center justify-between mt-2 pl-6">
                      {a.client_name&&<span className="text-[10px] text-white/40">{a.client_name}{a.league?` · ${a.league}`:''}</span>}
                      {a.created_at&&<span className="text-[10px] text-white/30 flex items-center gap-1"><Clock className="h-2.5 w-2.5"/>{new Date(a.created_at).toLocaleDateString()}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
