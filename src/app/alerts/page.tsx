'use client'
import { useAlerts, useProactiveAlerts } from '@/lib/api/hooks'
import { Bell, AlertTriangle, Clock } from 'lucide-react'

export default function AlertsPage() {
  const { data: alertData, isLoading: a1Loading } = useAlerts()
  const { data: proactiveData, isLoading: a2Loading } = useProactiveAlerts()
  const isLoading = a1Loading && a2Loading

  const raw1 = alertData as any
  const raw2 = proactiveData as any
  const alerts1: any[] = Array.isArray(raw1) ? raw1 : (raw1?.data || raw1?.alerts || [])
  const alerts2: any[] = Array.isArray(raw2) ? raw2 : (raw2?.data || raw2?.alerts || [])
  const all = [...alerts1, ...alerts2]

  const bySeverity = {
    critical: all.filter(a => a.severity === 'critical' || a.priority === 'critical' || a.type === 'critical'),
    high: all.filter(a => (a.severity === 'high' || a.priority === 'high') && a.severity !== 'critical'),
    other: all.filter(a => !['critical', 'high'].includes(a.severity || '') && !['critical', 'high'].includes(a.priority || '')),
  }

  const sevConfig: any = {
    critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    high:     { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    other:    { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  }

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-24">
      <div>
        <p className="text-[11px] text-red-400 uppercase tracking-widest font-medium">JARVIS Intelligence</p>
        <h1 className="text-2xl font-bold text-white">Alerts</h1>
        <p className="text-white/40 text-sm">{all.length} active · {bySeverity.critical.length} critical</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}</div>
      ) : all.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No active alerts</p>
          <p className="text-xs mt-1">All clear — JARVIS is monitoring</p>
        </div>
      ) : (
        <>
          {(['critical', 'high', 'other'] as const).map(sev => {
            const items = bySeverity[sev]
            if (!items.length) return null
            const cfg = sevConfig[sev]
            return (
              <div key={sev}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${cfg.color}`}>{sev === 'other' ? 'Other' : sev}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((alert: any) => (
                    <div key={alert.id} className={`rounded-xl p-3.5 border ${cfg.bg} ${cfg.border}`}>
                      <div className="flex items-start gap-2 mb-1">
                        <AlertTriangle className={`h-4 w-4 ${cfg.color} mt-0.5 flex-shrink-0`} />
                        <div className="text-sm font-semibold text-white leading-snug flex-1">
                          {alert.title || alert.alert_type || alert.type || alert.message}
                        </div>
                      </div>
                      {(alert.message || alert.description || alert.content) && (
                        <p className="text-xs text-white/60 leading-relaxed line-clamp-3 pl-6">
                          {alert.message || alert.description || alert.content}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2 pl-6">
                        {alert.client_name && <span className="text-[10px] text-white/40">{alert.client_name}</span>}
                        {alert.created_at && (
                          <span className="text-[10px] text-white/30 flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {new Date(alert.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
