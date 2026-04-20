'use client'

import { useStore, type AppMode } from '@/store/use-store'
import { useRouter, usePathname } from 'next/navigation'
import { Trophy, Music2, Users, Star, DollarSign, Cpu, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const modes: { id: AppMode; label: string; icon: React.ElementType; href: string; color: string }[] = [
  { id: 'situation-room', label: 'Situation Room', icon: Home, href: '/', color: 'text-white' },
  { id: 'sports', label: 'Sports', icon: Trophy, href: '/sports', color: 'text-orange-400' },
  { id: 'music', label: 'Music', icon: Music2, href: '/music', color: 'text-purple-400' },
  { id: 'civilians', label: 'Civilians', icon: Users, href: '/civilians', color: 'text-yellow-400' },
  { id: 'influencers', label: 'Influencers', icon: Star, href: '/influencers', color: 'text-pink-400' },
  { id: 'sales', label: 'Sales', icon: DollarSign, href: '/sales', color: 'text-green-400' },
  { id: 'system', label: 'System', icon: Cpu, href: '/system', color: 'text-cyan-400' },
]

export function TopModeBar() {
  const { activeMode, setActiveMode } = useStore()
  const router = useRouter()

  return (
    <div className="sticky top-14 z-40 border-b border-white/10 bg-background/95 backdrop-blur-xl overflow-x-auto scrollbar-none">
      <div className="flex h-10 items-center gap-0 min-w-max px-2">
        {modes.map((mode) => {
          const Icon = mode.icon
          const isActive = activeMode === mode.id
          return (
            <button
              key={mode.id}
              onClick={() => {
                setActiveMode(mode.id)
                router.push(mode.href)
              }}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all duration-150 whitespace-nowrap',
                isActive
                  ? `bg-white/10 ${mode.color} font-semibold`
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              )}
            >
              <Icon className="h-3 w-3" />
              {mode.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
