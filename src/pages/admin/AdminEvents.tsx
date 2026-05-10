import { useState } from 'react'
import { PageHeader, Card, CardHeader } from '../Admin'
import { MOCK_EVENTS, EVENT_TYPE_LABELS, EVENT_TYPE_COLORS } from '../../data/mock-admin'
import type { ShopEvent } from '../../data/mock-admin'

export default function AdminEvents() {
  const [view, setView] = useState<'list' | 'calendar'>('list')

  return (
    <>
      <PageHeader
        title="Events"
        subtitle="Art shows, open mics, tastings, community days at the Broadway location"
        actions={
          <>
            <div className="flex border-2 border-ink">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${view === 'list' ? 'bg-ink text-cream' : 'bg-cream'}`}
              >List</button>
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest border-l-2 border-ink ${view === 'calendar' ? 'bg-ink text-cream' : 'bg-cream'}`}
              >Calendar</button>
            </div>
            <button className="bg-paprika text-cream px-4 py-2 text-xs font-semibold uppercase tracking-widest border-2 border-ink hover:bg-ink transition-colors">
              + New Event
            </button>
          </>
        }
      />

      {view === 'list' ? <ListView events={MOCK_EVENTS} /> : <CalendarView events={MOCK_EVENTS} />}
    </>
  )
}

function ListView({ events }: { events: ShopEvent[] }) {
  return (
    <Card>
      <div className="divide-y divide-ink/10">
        {events.map((ev) => {
          const fillRate = ev.rsvps / ev.capacity
          return (
            <article key={ev.id} className="px-4 sm:px-5 py-4 grid sm:grid-cols-[80px_1fr_auto] gap-4 items-start">
              {/* Date block */}
              <div className="text-center bg-cream-deep border-2 border-ink py-2 self-start">
                <div className="text-[10px] uppercase tracking-widest text-paprika font-semibold leading-none">{ev.date.toLocaleString('en-US', { month: 'short' })}</div>
                <div className="font-display text-3xl text-ink leading-none my-1">{ev.date.getDate()}</div>
                <div className="text-[10px] uppercase text-ink-soft leading-none">{ev.date.toLocaleString('en-US', { weekday: 'short' })}</div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border ${EVENT_TYPE_COLORS[ev.type]}`}>
                    {EVENT_TYPE_LABELS[ev.type]}
                  </span>
                  <span className="text-xs text-ink-soft">{ev.startTime} – {ev.endTime}</span>
                </div>
                <h3 className="font-bold text-base leading-tight">{ev.title}</h3>
                <p className="text-sm text-ink-soft mt-1 leading-relaxed">{ev.description}</p>
              </div>

              <div className="sm:text-right">
                <div className="font-display text-2xl tabular-nums">{ev.rsvps}<span className="text-ink-soft">/{ev.capacity}</span></div>
                <div className="text-[10px] uppercase tracking-widest text-ink-soft">RSVPs</div>
                <div className="mt-2 h-1.5 w-24 sm:ml-auto bg-cream-deep border border-ink/15 relative overflow-hidden">
                  <div className={`absolute inset-y-0 left-0 ${fillRate > 0.85 ? 'bg-paprika' : fillRate > 0.5 ? 'bg-mustard' : 'bg-teal'}`} style={{ width: `${Math.min(100, fillRate * 100)}%` }} />
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </Card>
  )
}

/* ---------------------------------------------------------- */
/* CALENDAR VIEW                                              */
/* ---------------------------------------------------------- */
function CalendarView({ events }: { events: ShopEvent[] }) {
  const today = new Date()
  // Build a 6-week grid starting from the first day of the current month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const startOffset = firstDay.getDay() // 0 = Sun
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  const cells: { date: Date | null; events: ShopEvent[] }[] = []
  for (let i = 0; i < startOffset; i++) cells.push({ date: null, events: [] })
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(today.getFullYear(), today.getMonth(), d)
    const dayEvents = events.filter((ev) => ev.date.toDateString() === date.toDateString())
    cells.push({ date, events: dayEvents })
  }
  // Pad to a multiple of 7
  while (cells.length % 7 !== 0) cells.push({ date: null, events: [] })

  return (
    <Card>
      <CardHeader title={today.toLocaleString('en-US', { month: 'long', year: 'numeric' })} />
      <div className="p-2 sm:p-3">
        <div className="grid grid-cols-7 mb-1.5 text-[10px] uppercase tracking-widest text-ink-soft text-center font-semibold">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((c, i) => {
            const isToday = c.date?.toDateString() === today.toDateString()
            return (
              <div key={i} className={`min-h-[80px] sm:min-h-[100px] p-1.5 border ${c.date ? 'border-ink/15 bg-cream' : 'border-transparent'} ${isToday ? 'ring-2 ring-paprika' : ''}`}>
                {c.date && (
                  <>
                    <div className={`text-xs font-semibold ${isToday ? 'text-paprika' : 'text-ink-soft'}`}>{c.date.getDate()}</div>
                    <div className="mt-1 space-y-1">
                      {c.events.map((ev) => (
                        <div key={ev.id} className={`text-[10px] px-1 py-0.5 border leading-tight ${EVENT_TYPE_COLORS[ev.type]}`}>
                          <div className="font-bold truncate">{ev.title}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
