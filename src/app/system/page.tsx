'use client'
import { useSystemHealth, useLogicAuditor, useQABrain, useDailyReport } from '@/lib/hooks'
import { Activity, RefreshCw, Zap, Shield, Brain } from 'lucide-react'
import { CardSkeleton } from '@/components/Skeleton'

function StatusDot({status}:{status:string}) {
  if(status==='healthy'||status==='ok') return <div className="h-2 w-2 rounded-full bg-green-400"/>
  if(status==='degraded'||status==='warning') return <div className="h-2 w-2 rounded-full bg-yellow-400"/>
  return <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse"/>
}

export default function SystemPage() {
  const { data: healthData, isLoading, refetch } = useSystemHealth()
  const { data: auditorData } = useLogicAuditor()
  const { data: qaData }      = useQABrain()
  const { data: report }      = useDailyReport()

  const rows:    any[] = Array.isArray(healthData)   ? healthData   : []
  const auditor: any[] = Array.isArray(auditorData)  ? auditorData  : []
  const qa:      any[] = Array.isArray(qaData)       ? qaData       : []
  const r = report as any

  const hasError = rows.some(r=>r.status==='down'||r.status==='error')
  const hasDeg   = rows.some(r=>r.status==='degraded')
  const overall  = hasError?'error':hasDeg?'warning':'healthy'

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-cyan-400 uppercase tracking-widest font-semibold">System Intelligence</p>
          <h1 className="text-2xl font-bold text-white">System</h1>
        </div>
        <button onClick={()=>refetch()} className="p-2 bg-white/5 border border-white/10 rounded-xl active:scale-95">
          <RefreshCw className="h-4 w-4 text-white/60"/>
        </button>
      </div>

      {/* Overall status */}
      <div className={`rounded-xl p-4 border flex items-center gap-3 ${overall==='healthy'?'bg-green-500/10 border-green-500/20':overall==='warning'?'bg-yellow-500/10 border-yellow-500/20':'bg-red-500/10 border-red-500/20'}`}>
        <Activity className={`h-5 w-5 flex-shrink-0 ${overall==='healthy'?'text-green-400':overall==='warning'?'text-yellow-400':'text-red-400'}`}/>
        <div>
          <div className="text-sm font-semibold text-white">{overall==='healthy'?'All Systems Operational':overall==='warning'?'Degraded Performance':'Issues Detected'}</div>
          <div className="text-[10px] text-white/40">{rows.length} components monitored</div>
        </div>
      </div>

      {/* Component grid */}
      {isLoading?<CardSkeleton n={4}/>:rows.length>0&&(
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Components</p>
          <div className="grid grid-cols-2 gap-2">
            {rows.slice(0,12).map((row:any)=>(
              <div key={row.id} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-white capitalize truncate">{row.component?.replace(/_/g,' ')}</span>
                  <StatusDot status={row.status}/>
                </div>
                <div className="text-[10px] text-white/40">{row.latency_ms!=null?`${row.latency_ms}ms · `:''}{row.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JARVIS report */}
      {r?.summary&&(
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-blue-400"/>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Latest JARVIS Report</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">{r.summary}</p>
          <p className="text-[10px] text-white/30 mt-2">{r.report_date} · {r.report_type}</p>
        </div>
      )}

      {/* Logic Auditor */}
      {auditor.length>0&&(
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-cyan-400"/>
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Logic Auditor</span>
            <span className="text-[10px] text-white/30">{auditor.length} records</span>
          </div>
          <div className="space-y-1.5">
            {auditor.slice(0,5).map((r:any)=>(
              <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                <div className="text-[11px] font-medium text-white">{r.inference_type||r.subject||'Inference Record'}</div>
                {r.confidence_score!=null&&<div className="text-[10px] text-white/40 mt-0.5">Confidence: {Math.round(r.confidence_score*100)}%</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QA Brain */}
      {qa.length>0&&(
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-purple-400"/>
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">QA Brain</span>
            <span className="text-[10px] text-white/30">{qa.length} records</span>
          </div>
          <div className="space-y-1.5">
            {qa.slice(0,5).map((r:any)=>(
              <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                <div className="text-[11px] font-medium text-white">{r.fact_type||r.source||'Fact Record'}</div>
                {r.confidence!=null&&<div className="text-[10px] text-white/40 mt-0.5">Confidence: {Math.round(r.confidence*100)}%</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
