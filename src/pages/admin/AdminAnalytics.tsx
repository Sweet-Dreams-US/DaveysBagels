import { PageHeader, Card, CardHeader, StatCard } from '../Admin'
import {
  DAILY_REVENUE,
  TOP_ITEMS,
  HOURLY_HEATMAP,
  HOURS_OF_OPERATION,
  WEEKDAYS,
  MTD_REVENUE,
  MTD_ORDERS,
  AVG_TICKET,
} from '../../data/mock-admin'

export default function AdminAnalytics() {
  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="What's selling, when people show up, and how it's trending."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="30d Revenue" value={fmtUSD(MTD_REVENUE)} delta="+12% vs prior 30d" trend="up" accent="ink" />
        <StatCard label="Orders" value={MTD_ORDERS.toLocaleString()} delta="+8% vs prior 30d" trend="up" accent="paprika" />
        <StatCard label="Avg Ticket" value={fmtUSD(AVG_TICKET)} delta="+$0.42" trend="up" accent="teal" />
        <StatCard label="Repeat Rate" value="34%" delta="+3pp vs prior 30d" trend="up" accent="mustard" />
      </div>

      {/* Revenue trend full-width */}
      <Card className="mb-6">
        <CardHeader title="Daily revenue · 30d" subtitle="Saturday is consistently the strongest day" />
        <div className="p-4 sm:p-5">
          <BarChart data={DAILY_REVENUE.map((d) => ({ label: d.date.toLocaleString('en-US', { month: 'numeric', day: 'numeric' }), value: d.revenue, weekday: d.weekday }))} />
        </div>
      </Card>

      {/* Two-column: top items + hourly heatmap */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader title="Top items by revenue" subtitle="Last 30 days" />
          <div className="p-4 sm:p-5 space-y-2">
            {TOP_ITEMS.slice(0, 8).map((it) => {
              const pct = (it.revenue / TOP_ITEMS[0].revenue) * 100
              return (
                <div key={it.name}>
                  <div className="flex items-baseline justify-between text-xs gap-3 mb-0.5">
                    <span className="font-semibold truncate">{it.name}</span>
                    <span className="text-ink-soft tabular-nums whitespace-nowrap">{it.unitsSold.toLocaleString()} sold · {fmtUSD(it.revenue)}</span>
                  </div>
                  <div className="h-2 bg-cream-deep border border-ink/15 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-paprika" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Hourly traffic" subtitle="Avg orders per hour, by weekday" />
          <div className="p-4 sm:p-5 overflow-x-auto">
            <Heatmap />
          </div>
        </Card>
      </div>
    </>
  )
}

/* ---------------------------------------------------------- */
/* BAR CHART                                                  */
/* ---------------------------------------------------------- */
function BarChart({ data }: { data: { label: string; value: number; weekday: number }[] }) {
  const max = Math.max(...data.map((d) => d.value))
  const w = 800
  const h = 180
  const barW = w / data.length
  return (
    <svg viewBox={`0 0 ${w} ${h + 24}`} className="w-full h-auto" preserveAspectRatio="none">
      {data.map((d, i) => {
        const barH = (d.value / max) * h
        // Highlight weekends
        const fill = d.weekday >= 6 ? 'var(--color-paprika)' : 'var(--color-teal-deep)'
        return (
          <rect
            key={i}
            x={i * barW + 1}
            y={h - barH}
            width={barW - 2}
            height={barH}
            fill={fill}
            opacity={0.85}
          />
        )
      })}
      {/* Axis labels — every 5th day */}
      {data.map((d, i) => i % 5 === 0 ? (
        <text key={i} x={i * barW + barW / 2} y={h + 16} textAnchor="middle" fontSize="10" fill="var(--color-ink-soft)" className="tabular-nums">{d.label}</text>
      ) : null)}
    </svg>
  )
}

/* ---------------------------------------------------------- */
/* HOURLY HEATMAP                                             */
/* ---------------------------------------------------------- */
function Heatmap() {
  const max = Math.max(...HOURLY_HEATMAP.flat())
  return (
    <table className="text-xs border-collapse">
      <thead>
        <tr>
          <th></th>
          {HOURS_OF_OPERATION.map((h) => (
            <th key={h} className="px-2 py-1 text-ink-soft font-semibold">{formatHour(h)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {WEEKDAYS.map((day, wi) => (
          <tr key={day}>
            <th className="pr-3 py-1 text-right text-ink-soft font-semibold">{day}</th>
            {HOURLY_HEATMAP[wi].map((value, hi) => {
              const intensity = value / max
              const opacity = 0.15 + intensity * 0.85
              return (
                <td key={hi} className="p-0.5">
                  <div
                    className="h-9 w-12 sm:w-14 flex items-center justify-center text-ink font-bold tabular-nums border border-ink/10"
                    style={{ backgroundColor: `rgba(226, 91, 58, ${opacity})` }}
                    title={`${day} ${formatHour(HOURS_OF_OPERATION[hi])}: ${value} orders`}
                  >{value}</div>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function formatHour(h: number) {
  if (h === 12) return '12p'
  return h < 12 ? `${h}a` : `${h - 12}p`
}

function fmtUSD(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}
