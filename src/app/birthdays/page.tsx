'use client'
import { useBirthdays } from '@/lib/api/hooks'
import { Cake, Trophy, Music2, Users, Star } from 'lucide-react'

function ClientIcon({ type }: { type: string }) {
  const t = (type || '').toLowerCase()
  if (t === 'athlete') return <Trophy className="h-3 w-3 text-orange-400" />
  if (t === 'music_artist') return <Music2 className="h-3 w-3 text-purple-400" />
  if (t === 'civilian') return <Users className="h-3 w-3 text-yellow-400" />
  return <Star className="h-3 w-3 text-pink-400" />
}

export default function BirthdaysPage() {
  const { data, isLoading } = useBirthdays()
  const birthdays: any[] = Array.isArray(data) ? data : []

  const today = birthdays.filter(b => b.days_until === 0)
  const week  = birthdays.filter(b => b.days_until > 0 && b.days_until <= 7)
  const later = birthdays.filter(b => b.days_until > 7)

  const Card = ({ b, highlight }: any) => (
    <div className={`flex items-center gap-3 rounded-xl px-3 py-3 border ${highlight ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-white/5 border-white/10'}`}>
      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${highlight ? 'bg-yellow-500/20' : 'bg-white/5'}`}>🎂</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white truncate">{b.name}</div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/40">
          <ClientIcon type={b.client_type} />
          {b.league && <span>{b.league}</span>}
          {b.team && <><span>·</span><span>{b.team}</span></>}
          {b.age != null && <><span>·</span><span>Turns {b.age}</span></>}
        </div>
      </div>
      <div className={`text-sm font-bold px-2 py-1 rounded-lg flex-shrink-0 ${b.days_until === 0 ? 'bg-yellow-500/20 text-yellow-400' : b.days_until <= 3 ? 'bg-orange-500/20 text-orange-400' : 'bg-white/10 text-white/40'}`}>
        {b.days_until === 0 ? 'Today!' : `${b.days_until}d`}
      </div>
    </div>
  )

  return (
    <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto pb-24">
      <div>
        <p className="text-[11px] text-pink-400 uppercase tracking-widest font-medium">Client Intelligence</p>
        <h1 className="text-2xl font-bold text-white">Birthdays</h1>
        <p className="text-white/40 text-sm">Next 30 days · {birthdays.length} upcoming</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(6)].map((_,i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse"/>)}</div>
      ) : birthdays.length === 0 ? (
        <div className="text-center py-16 text-white/30"><Cake className="h-10 w-10 mx-auto mb-3 opacity-30"/><p>No upcoming birthdays</p></div>
      ) : (
        <>
          {today.length > 0 && <section><p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2">🎂 Today</p><div className="space-y-2">{today.map(b=><Card key={b.id} b={b} highlight/>)}</div></section>}
          {week.length > 0  && <section><p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">This Week</p><div className="space-y-2">{week.map(b=><Card key={b.id} b={b}/>)}</div></section>}
          {later.length > 0 && <section><p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Later This Month</p><div className="space-y-2">{later.map(b=><Card key={b.id} b={b}/>)}</div></section>}
        </>
      )}
    </div>
  )
}
