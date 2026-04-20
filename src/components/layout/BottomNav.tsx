'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, Search, Bell, MoreHorizontal, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/use-store'

const nav = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/alerts', icon: Bell, label: 'Alerts' },
  { href: '/highlights', icon: TrendingUp, label: 'Highlights' },
  { href: '/more', icon: MoreHorizontal, label: 'More' },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/95 backdrop-blur-xl safe-area-bottom">
      <div className="flex h-16 items-center justify-around px-2">
        {nav.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px]',
                isActive ? 'text-blue-400' : 'text-white/40'
              )}
            >
              <div className={cn(
                'flex items-center justify-center rounded-xl p-1.5 transition-all',
                isActive && 'bg-blue-500/15'
              )}>
                <Icon className={cn('h-5 w-5', isActive && 'scale-110')} />
              </div>
              <span className={cn('text-[10px] font-medium', isActive && 'font-semibold')}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
