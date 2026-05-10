import { useMemo, useState } from 'react'
import { PageHeader, Card } from '../Admin'
import {
  MOCK_ORDERS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  ORDER_STATUSES,
} from '../../data/mock-admin'
import type { Order, OrderStatus } from '../../data/mock-admin'

/* ---------------------------------------------------------- */
/* ORDER STATE TRANSITIONS                                    */
/* ---------------------------------------------------------- */
/**
 * Defines what status an order can move to from each current status. The
 * "Mark X" button on each order row uses this to show only the legal next
 * step. This is the demo's order state machine.
 *
 * Intentional choices:
 *  - pending → preparing OR cancelled (a barista can reject an order)
 *  - preparing → ready (one-way — once it's on the press, no going back)
 *  - ready → completed (handed to customer)
 *  - completed/cancelled are terminal (no further transitions)
 */
const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'completed',
  completed: null,
  cancelled: null,
}

const NEXT_STATUS_LABEL: Record<OrderStatus, string | null> = {
  pending: 'Start preparing',
  preparing: 'Mark ready',
  ready: 'Mark picked up',
  completed: null,
  cancelled: null,
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (!q) return true
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
      )
    })
  }, [orders, statusFilter, search])

  function advanceStatus(id: string) {
    setOrders((cur) =>
      cur.map((o) => {
        if (o.id !== id) return o
        const next = NEXT_STATUS[o.status]
        return next ? { ...o, status: next } : o
      }),
    )
  }

  function cancelOrder(id: string) {
    setOrders((cur) => cur.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o)))
  }

  // Status counts for the filter pills
  const counts = useMemo(() => {
    const out: Record<OrderStatus | 'all', number> = {
      all: orders.length,
      pending: 0, preparing: 0, ready: 0, completed: 0, cancelled: 0,
    }
    for (const o of orders) out[o.status]++
    return out
  }, [orders])

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle={`${counts.all.toLocaleString()} orders · ${counts.pending + counts.preparing + counts.ready} live`}
      />

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-3">
        <FilterPill label="All" count={counts.all} active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
        {ORDER_STATUSES.map((s) => (
          <FilterPill key={s} label={ORDER_STATUS_LABELS[s]} count={counts[s]} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
        ))}
      </div>

      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by order #, customer, or item…"
        className="w-full bg-cream border-2 border-ink px-3 py-2.5 text-sm font-medium mb-3 focus:outline-none focus:bg-cream-deep"
      />

      {/* Orders list */}
      <Card>
        <div className="divide-y divide-ink/10">
          {filtered.slice(0, 100).map((o) => {
            const expanded = expandedId === o.id
            const next = NEXT_STATUS[o.status]
            return (
              <article key={o.id} className="text-sm">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : o.id)}
                  className="w-full text-left px-4 sm:px-5 py-3 flex items-center justify-between gap-3 hover:bg-cream-deep transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-ink">{o.id}</span>
                      <span className="text-ink-soft">{o.customer}</span>
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${ORDER_STATUS_COLORS[o.status]}`}>
                        {ORDER_STATUS_LABELS[o.status]}
                      </span>
                    </div>
                    <div className="text-xs text-ink-soft mt-0.5 truncate">
                      {o.items.reduce((s, i) => s + i.qty, 0)} items · {fmtUSD(o.total)} · {o.placedAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-ink-soft text-xs hidden sm:block">{expanded ? '▴' : '▾'}</div>
                </button>

                {expanded && (
                  <div className="px-4 sm:px-5 py-4 bg-cream-deep border-t border-ink/10 grid sm:grid-cols-[1fr_auto] gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-ink-soft mb-2">Items</div>
                      <ul className="space-y-1.5">
                        {o.items.map((it, i) => (
                          <li key={i} className="leading-tight">
                            <div className="flex items-baseline justify-between gap-3">
                              <div><span className="font-bold tabular-nums">{it.qty}×</span> {it.name}</div>
                              <div className="text-ink-soft tabular-nums">{fmtUSD(it.price * it.qty)}</div>
                            </div>
                            {it.mods && it.mods.length > 0 && (
                              <ul className="ml-6 text-xs text-ink-soft mt-0.5 list-disc list-inside">
                                {it.mods.map((m, j) => <li key={j}>{m}</li>)}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 pt-2 border-t border-ink/15 grid grid-cols-3 text-xs">
                        <div><span className="text-ink-soft">Subtotal: </span><span className="tabular-nums">{fmtUSD(o.subtotal)}</span></div>
                        <div><span className="text-ink-soft">Tax: </span><span className="tabular-nums">{fmtUSD(o.tax)}</span></div>
                        <div className="font-bold"><span className="text-ink-soft font-normal">Total: </span><span className="tabular-nums">{fmtUSD(o.total)}</span></div>
                      </div>
                      <div className="text-xs text-ink-soft mt-1">Paid via {o.paymentMethod.replace('-', ' ')}</div>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      {next && (
                        <button
                          onClick={() => advanceStatus(o.id)}
                          className="bg-ink text-cream px-4 py-2 text-xs font-semibold uppercase tracking-widest border-2 border-ink hover:bg-paprika transition-colors"
                        >
                          {NEXT_STATUS_LABEL[o.status]} →
                        </button>
                      )}
                      {(o.status === 'pending' || o.status === 'preparing') && (
                        <button
                          onClick={() => cancelOrder(o.id)}
                          className="text-xs font-semibold uppercase tracking-widest text-paprika hover:underline"
                        >
                          Cancel order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
        {filtered.length === 0 && <div className="p-8 text-center text-ink-soft text-sm">No orders match your filters.</div>}
        {filtered.length > 100 && (
          <div className="p-4 text-center text-xs text-ink-soft border-t border-ink/10">
            Showing first 100 of {filtered.length}. Refine your search to narrow.
          </div>
        )}
      </Card>
    </>
  )
}

function FilterPill({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 border-2 transition-colors ${
        active ? 'bg-ink text-cream border-ink' : 'bg-cream border-ink/20 hover:border-ink text-ink-soft hover:text-ink'
      }`}
    >
      {label} <span className="ml-1 opacity-70 tabular-nums">{count}</span>
    </button>
  )
}

function fmtUSD(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
