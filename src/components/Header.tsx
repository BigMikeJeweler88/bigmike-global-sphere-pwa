'use client'
import { Zap } from 'lucide-react'
import { useSendReport } from '@/lib/hooks'

export default function Header({ title, subtitle, color = 'text-blue-400' }: { title: string; subtitle?: string; color?: string }) {
  return (
    <div className="pt-1 pb-2">
      {subtitle && <p className={`text-[11px] uppercase tracking-widest font-semibold ${color}`}>{subtitle}</p>}
      <h1 className="text-2xl font-bold text-white">{title}</h1>
    </div>
  )
}

export function TopBar() {
  const send = useSendReport()
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-[#060d1f]/95 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
          <Zap className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="font-bold text-sm text-white">BigMike CRM</span>
      </div>
      <button
        onClick={() => send.mutate()}
        disabled={send.isPending}
        className="flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 rounded-xl px-3 py-1.5 text-xs font-medium text-blue-300 active:scale-95 transition-all disabled:opacity-50"
      >
        <Zap className="h-3 w-3" />
        {send.isPending ? 'Sending...' : 'JARVIS'}
      </button>
    </header>
  )
}
