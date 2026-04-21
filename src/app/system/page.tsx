'use client'
import { useSystemHealth, useLogicAuditor, useQABrain, useJarvisIntelligence } from '@/lib/api/hooks'
import { CheckCircle, AlertTriangle, XCircle, Brain, Shield, Zap, RefreshCw, Activity } from 'lucide-react'

function StatusDot({ status }: { status: string }) {
  if (status === 'healthy' || status === 'ok') return <div className="h-2 w-2 rounded-full bg-green-400"/>
  if (status === 'warning' || status === 'degraded') return <div className="h-2 w-2 rounded-full bg-yellow-400"/>
  return <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse"/>
}

export default function SystemPage() {
  const { data: healthData, isLoading: healthLoading, refetch } = useSystemHealth()
  const { data: auditorData } = useLogicAuditor()
  const { data: qaData } = useQABrain()
  const { data: jarvis } = useJarvisIntelligence()

  // healthData is an array of system_health_log rows
  const healthRows: any[] = Array.isArray(healthData) ? healthData : []
  const overallStatus = healthRows.some(r => r.status === 'down' || r.status === 'error') ? 'error' :
                        healthRows.some(r => r.status === 'degraded') ? 'warning' : 'healthy'

  const auditorRows: any[] = Array.isArray(auditorData) ? auditorData : []
  const qaRows: any[] = Array.isArray(qaData) ? qaData : []
  const j = (jarvis as any)

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-24">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-cyan-400 uppercase tracking-widest font-medium">System Intelligence</p>
          <h1 className="text-2xl font-bold text-white">System Health</h1>
        </div>
        <button onClick={() => refetch()} className="p-2 bg-white/5 border border-white/10 rounded-xl active:scale-95">
          <RefreshCw className="h-4 w-4 text-white/60"/>
        </button>
      </div>

      {/* Overall status */}
      <div className={`rounded-xl p-4 border flex items-center gap-3 ${overallStatus === 'healthy' ? 'bg-green-500/10 border-green-500/20' : overallStatus === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
        <Activity className={`h-5 w-5 flex-shrink-0 ${overallStatus === 'healthy' ? 'text-green-400' : overallStatus === 'warning' ? 'text-yellow-400' : 'text-red-400'}`}/>
        <div>
          <div className="text-sm font-semibold text-white capitalize">{overallStatus === 'healthy' ? 'All Systems Operational' : overallStatus === 'warning' ? 'Degraded Performance' : 'System Issues Detected'}</div>
          <div className="text-[10px] text-white/40">{healthRows.length} components monitored</div>
        </div>
      </div>

      {/* Component grid */}
      {healthLoading ? (
        <div className="grid grid-cols-2 gap-2">{[...Array(4)].map((_,i) => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse"/>)}</div>
      ) : healthRows.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Components</p>
          <div className="grid grid-cols-2 gap-2">
            {healthRows.slice(0, 8).map((row: any) => (
              <div key={row.id} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-white capitalize">{row.component?.replace(/_/g, ' ')}</span>
                  <StatusDot status={row.status}/>
                </div>
                <div className="text-[10px] text-white/40">
                  {row.latency_ms != null && `${row.latency_ms}ms · `}{row.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JARVIS daily report */}
      {j && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-blue-400"/>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Latest JARVIS Report</span>
          </div>
          {j.summary && <p className="text-sm text-white/70 leading-relaxed line-clamp-4">{j.summary}</p>}
          <div className="text-[10px] text-white/30 mt-2">{j.report_date} · {j.report_type}</div>
        </div>
      )}

      {/* Logic auditor */}
      {auditorRows.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-cyan-400"/>
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Logic Auditor</span>
            <span className="text-[10px] text-white/30">{auditorRows.length} records</span>
          </div>
          <div className="space-y-1.5">
            {auditorRows.slice(0, 5).map((r: any) => (
              <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                <div className="text-[11px] font-medium text-white line-clamp-1">{r.inference_type || r.subject || r.content || JSON.stringify(r).slice(0, 80)}</div>
                {r.created_at && <div className="text-[10px] text-white/30 mt-0.5">{new Date(r.created_at).toLocaleDateString()}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QA Brain */}
      {qaRows.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-purple-400"/>
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">QA Brain</span>
            <span className="text-[10px] text-white/30">{qaRows.length} records</span>
          </div>
          <div className="space-y-1.5">
            {qaRows.slice(0, 5).map((r: any) => (
              <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                <div className="text-[11px] font-medium text-white line-clamp-1">{r.fact_type || r.source || r.content || JSON.stringify(r).slice(0, 80)}</div>
                {r.created_at && <div className="text-[10px] text-white/30 mt-0.5">{new Date(r.created_at).toLocaleDateString()}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
