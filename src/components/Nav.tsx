'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Bell, TrendingUp, Grid } from 'lucide-react'

const tabs = [
  { href: '/',          icon: Home,       label: 'Home'     },
  { href: '/search',    icon: Search,     label: 'Search'   },
  { href: '/alerts',    icon: Bell,       label: 'Alerts'   },
  { href: '/highlights',icon: TrendingUp, label: 'News'     },
  { href: '/more',      icon: Grid,       label: 'More'     },
]

export default function Nav() {
  const path = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#060d1f]/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16 items-center justify-around max-w-lg mx-auto px-2">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href)
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-0.5 min-w-[56px] py-1.5">
              <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-blue-500/20' : ''}`}>
                <Icon className={`h-5 w-5 ${active ? 'text-blue-400' : 'text-white/40'}`} />
              </div>
              <span className={`text-[10px] ${active ? 'text-blue-400 font-semibold' : 'text-white/40'}`}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
