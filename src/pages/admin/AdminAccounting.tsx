import { PageHeader, Card, CardHeader, StatCard } from '../Admin'
import {
  EXPENSE_CATEGORIES,
  MTD_REVENUE,
  NET_PROFIT,
  PROFIT_MARGIN,
} from '../../data/mock-admin'

export default function AdminAccounting() {
  const totalExpenses = EXPENSE_CATEGORIES.reduce((s, c) => s + c.amount, 0)
  const taxesOwed = MTD_REVENUE * 0.07
  const estimatedQuarterlyTax = NET_PROFIT * 0.25 // Federal + Indiana ballpark

  return (
    <>
      <PageHeader
        title="Accounting"
        subtitle="P&L summary, expense tracking, tax estimates · current month"
        actions={
          <button className="bg-ink text-cream px-4 py-2 text-xs font-semibold uppercase tracking-widest border-2 border-ink hover:bg-paprika transition-colors">
            Export QuickBooks CSV
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Revenue" value={fmtUSD(MTD_REVENUE)} accent="ink" />
        <StatCard label="Expenses" value={fmtUSD(totalExpenses)} accent="paprika" />
        <StatCard label="Net Profit" value={fmtUSD(NET_PROFIT)} delta={`${(PROFIT_MARGIN * 100).toFixed(1)}% margin`} trend="up" accent="mustard" />
        <StatCard label="Sales Tax Collected" value={fmtUSD(taxesOwed)} delta="Due Apr 20" accent="teal" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Expense breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader title="Expense breakdown" subtitle="Current month" />
          <div className="p-4 sm:p-5 space-y-2.5">
            {EXPENSE_CATEGORIES.map((cat) => {
              const pct = cat.pctOfTotal * 100
              return (
                <div key={cat.name}>
                  <div className="flex items-baseline justify-between text-sm gap-3 mb-0.5">
                    <span className="font-semibold">{cat.name}</span>
                    <span className="text-ink-soft tabular-nums whitespace-nowrap">{fmtUSD(cat.amount)} · {pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-cream-deep border border-ink/15 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-ink" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="border-t-2 border-ink px-4 sm:px-5 py-3 bg-cream-deep flex items-baseline justify-between">
            <span className="font-display text-lg">Total Expenses</span>
            <span className="font-display text-2xl tabular-nums">{fmtUSD(totalExpenses)}</span>
          </div>
        </Card>

        {/* Tax + obligations */}
        <Card>
          <CardHeader title="Tax & obligations" />
          <dl className="p-4 sm:p-5 space-y-3 text-sm">
            <Row label="Sales Tax (collected)" value={fmtUSD(taxesOwed)} note="Held in trust" />
            <Row label="Q1 Federal estimate" value={fmtUSD(estimatedQuarterlyTax * 0.6)} note="Due Apr 15" />
            <Row label="Indiana state estimate" value={fmtUSD(estimatedQuarterlyTax * 0.4)} note="Due Apr 15" />
            <Row label="Payroll taxes (FICA)" value={fmtUSD(985.27)} note="Filed weekly" />
            <Row label="Stripe processing" value={fmtUSD(1142.18)} note="Auto-deducted" />
          </dl>
          <div className="px-4 sm:px-5 py-3 border-t-2 border-ink/15 bg-mustard/30">
            <div className="text-xs uppercase tracking-widest font-semibold text-ink-soft mb-1">Reminder</div>
            <p className="text-xs leading-relaxed">Indiana sales tax filing due in 13 days. Connect to Avalara to auto-file.</p>
          </div>
        </Card>
      </div>

      {/* Recent transactions placeholder */}
      <Card>
        <CardHeader title="Recent transactions" subtitle="Stripe payouts + bank activity" />
        <div className="divide-y divide-ink/10 text-sm">
          {RECENT_TRANSACTIONS.map((t, i) => (
            <div key={i} className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold leading-tight">{t.label}</div>
                <div className="text-xs text-ink-soft mt-0.5">{t.date} · {t.method}</div>
              </div>
              <div className={`font-bold tabular-nums ${t.amount > 0 ? 'text-emerald-700' : 'text-paprika'}`}>
                {t.amount > 0 ? '+' : ''}{fmtUSD(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div>
        <div className="font-semibold">{label}</div>
        {note && <div className="text-xs text-ink-soft">{note}</div>}
      </div>
      <div className="font-bold tabular-nums">{value}</div>
    </div>
  )
}

const RECENT_TRANSACTIONS: { date: string; label: string; method: string; amount: number }[] = [
  { date: 'Today',     label: 'Stripe payout',                method: 'Bank · ACH',         amount: 2841.55 },
  { date: 'Today',     label: 'Wood Farms invoice',           method: 'Card · ending 4242', amount: -642.18 },
  { date: 'Yesterday', label: 'Stripe payout',                method: 'Bank · ACH',         amount: 3105.20 },
  { date: 'Yesterday', label: 'Union Coffee Roasters',        method: 'ACH',                amount: -488.00 },
  { date: '2d ago',    label: 'Stripe payout',                method: 'Bank · ACH',         amount: 2954.18 },
  { date: '3d ago',    label: 'Indiana Michigan Power',       method: 'Auto-pay',           amount: -342.55 },
  { date: '4d ago',    label: 'Payroll · 4 employees',        method: 'Gusto · ACH',        amount: -3220.00 },
]

function fmtUSD(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
