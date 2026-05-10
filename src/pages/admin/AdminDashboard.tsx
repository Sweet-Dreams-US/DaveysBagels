import { Link } from 'react-router-dom'
import { PageHeader, StatCard, Card, CardHeader } from '../Admin'
import {
  MTD_REVENUE,
  MTD_ORDERS,
  AVG_TICKET,
  NET_PROFIT,
  PROFIT_MARGIN,
  MOCK_ORDERS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  TOP_ITEMS,
  DAILY_REVENUE,
} from '../../data/mock-admin'

export default function AdminDashboard() {
  const liveQueue = MOCK_ORDERS.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').slice(0, 6)
  const today = new Date()
  const todayMonthDay = `${today.toLocaleString('en-US', { month: 'short', day: 'numeric' })}`

  return (
    <>
      <PageHeader
        title="Good morning, Davey."
        subtitle={`${todayMonthDay} · ${liveQueue.length} live orders, ${MOCK_ORDERS.filter((o) => isToday(o.placedAt)).length} placed today.`}
        actions={
          <Link to="/admin/orders" className="bg-ink text-cream px-4 py-2 text-xs font-semibold uppercase tracking-widest border-2 border-ink hover:bg-paprika transition-colors">
            View All Orders →
          </Link>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="MTD Revenue" value={fmtUSD(MTD_REVENUE)} delta="+12.4% vs. last month" trend="up" accent="ink" />
        <StatCard label="MTD Orders" value={MTD_ORDERS.toLocaleString()} delta="+8.1% vs. last month" trend="up" accent="paprika" />
        <StatCard label="Avg Ticket" value={fmtUSD(AVG_TICKET)} delta="+$0.42 vs. last month" trend="up" accent="teal" />
        <StatCard label="Net Profit" value={fmtUSD(NET_PROFIT)} delta={`${(PROFIT_MARGIN * 100).toFixed(1)}% margin`} trend="flat" accent="mustard" />
      </div>

      {/* Two-column main grid */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Live orders queue */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Live Orders"
            subtitle="Pending, preparing, and ready for pickup"
            actions={<Link to="/admin/orders" className="text-xs font-semibold uppercase tracking-widest text-paprika hover:text-ink">View all →</Link>}
          />
          <div className="divide-y divide-ink/10">
            {liveQueue.map((o) => (
              <div key={o.id} className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-ink leading-tight">
                    {o.id} <span className="text-ink-soft font-normal">· {o.customer}</span>
                  </div>
                  <div className="text-xs text-ink-soft mt-0.5 truncate">
                    {o.items.length === 1
                      ? `${o.items[0].qty}× ${o.items[0].name}`
                      : `${o.items.reduce((s, i) => s + i.qty, 0)} items`}
                    {' · '}
                    {fmtUSD(o.total)}
                    {' · '}
                    {minutesAgo(o.placedAt)}
                  </div>
                </div>
                <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 border border-ink/20 font-semibold whitespace-nowrap ${ORDER_STATUS_COLORS[o.status]}`}>
                  {ORDER_STATUS_LABELS[o.status]}
                </span>
              </div>
            ))}
            {liveQueue.length === 0 && (
              <div className="p-6 text-center text-ink-soft text-sm">No live orders. The kitchen is breathing.</div>
            )}
          </div>
        </Card>

        {/* Top items */}
        <Card>
          <CardHeader title="Top Items (30 days)" subtitle="By units sold" />
          <ol className="divide-y divide-ink/10">
            {TOP_ITEMS.slice(0, 6).map((item, i) => (
              <li key={item.name} className="px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="font-display text-paprika tabular-nums w-5 text-right text-sm">{i + 1}</span>
                  <span className="truncate font-semibold">{item.name}</span>
                </span>
                <span className="text-ink-soft tabular-nums whitespace-nowrap">{item.unitsSold}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* Revenue trend */}
      <Card className="mb-6">
        <CardHeader
          title="Revenue · last 30 days"
          subtitle={`Total ${fmtUSD(MTD_REVENUE)} · daily avg ${fmtUSD(MTD_REVENUE / 30)}`}
        />
        <div className="p-4 sm:p-5">
          <RevenueChart />
        </div>
      </Card>
    </>
  )
}

/* ---------------------------------------------------------- */
/* SVG REVENUE CHART (no library)                             */
/* ---------------------------------------------------------- */
function RevenueChart() {
  const data = DAILY_REVENUE
  const max = Math.max(...data.map((d) => d.revenue))
  const w = 800
  const h = 180
  const padX = 0
  const padY = 16
  const innerW = w - padX * 2
  const innerH = h - padY * 2

  const points = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * innerW
    const y = padY + innerH - (d.revenue / max) * innerH
    return [x, y] as const
  })
  const path = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ')
  const area = `${path} L${points[points.length - 1][0]},${padY + innerH} L${points[0][0]},${padY + innerH} Z`

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="none" aria-label="Daily revenue, last 30 days">
        <defs>
          <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-paprika)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-paprika)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#rev-fill)" />
        <path d={path} fill="none" stroke="var(--color-paprika)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map(([x, y], i) =>
          i % 5 === 0 ? <circle key={i} cx={x} cy={y} r="3.5" fill="var(--color-cream)" stroke="var(--color-paprika)" strokeWidth="2" /> : null,
        )}
      </svg>
      <div className="flex justify-between text-[10px] text-ink-soft mt-2 px-1 tabular-nums">
        <span>{data[0].date.toLocaleString('en-US', { month: 'short', day: 'numeric' })}</span>
        <span>{data[Math.floor(data.length / 2)].date.toLocaleString('en-US', { month: 'short', day: 'numeric' })}</span>
        <span>{data[data.length - 1].date.toLocaleString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------- */
/* HELPERS                                                    */
/* ---------------------------------------------------------- */
function fmtUSD(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function isToday(d: Date) {
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

function minutesAgo(d: Date): string {
  const ms = Date.now() - d.getTime()
  const mins = Math.round(ms / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}
