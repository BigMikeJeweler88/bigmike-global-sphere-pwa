'use client'
import Link from 'next/link'
import { Trophy, Music2, Users, Star, DollarSign, Cpu, Bell, Cake, Send, TrendingUp, Zap } from 'lucide-react'

const sections = [
  { title:'Sections', items:[
    { href:'/',            icon:Zap,        label:'Situation Room',  desc:'JARVIS briefing & intelligence',   color:'text-blue-400'   },
    { href:'/sports',      icon:Trophy,     label:'Sports',          desc:'Athletes across all leagues',      color:'text-orange-400' },
    { href:'/music',       icon:Music2,     label:'Music',           desc:'Artists & streaming intelligence', color:'text-purple-400' },
    { href:'/civilians',   icon:Users,      label:'Civilians',       desc:'Jewelry propensity pipeline',      color:'text-yellow-400' },
    { href:'/influencers', icon:Star,       label:'Influencers',     desc:'Content creators',                 color:'text-pink-400'   },
    { href:'/sales',       icon:DollarSign, label:'Sales',           desc:'Transactions & analytics',         color:'text-green-400'  },
    { href:'/system',      icon:Cpu,        label:'System',          desc:'Health, JARVIS & AI engines',      color:'text-cyan-400'   },
  ]},
  { title:'Intelligence', items:[
    { href:'/alerts',     icon:Bell,        label:'Alerts',          desc:'Contract & proactive alerts',      color:'text-red-400'    },
    { href:'/birthdays',  icon:Cake,        label:'Birthdays',       desc:'Upcoming client birthdays',        color:'text-pink-400'   },
    { href:'/highlights', icon:TrendingUp,  label:'Contract Signings',desc:'Latest deals & moves',            color:'text-cyan-400'   },
    { href:'/outreach',   icon:Send,        label:'Outreach Queue',  desc:'AI DMs awaiting approval',         color:'text-blue-400'   },
  ]},
]

export default function MorePage() {
  return (
    <div className="px-4 py-4 space-y-6 max-w-2xl mx-auto pb-6">
      <div><h1 className="text-2xl font-bold text-white">More</h1><p className="text-white/40 text-sm">All sections & features</p></div>
      {sections.map(section=>(
        <div key={section.title}>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">{section.title}</p>
          <div className="space-y-1.5">
            {section.items.map(({href,icon:Icon,label,desc,color})=>(
              <Link key={href+label} href={href} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3 active:scale-[0.98] transition-transform">
                <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon className={`h-4 w-4 ${color}`}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{label}</div>
                  <div className="text-[11px] text-white/40">{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
      <p className="text-center text-[10px] text-white/20 pb-2">BigMike Global Sports CRM · v3.0</p>
    </div>
  )
}
