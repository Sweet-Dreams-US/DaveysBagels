import { useMemo, useState } from 'react'
import { PageHeader, Card } from '../Admin'
import { MOCK_CUSTOMERS } from '../../data/mock-admin'
import type { Customer } from '../../data/mock-admin'

type SortKey = 'name' | 'totalOrders' | 'lifetimeSpend' | 'lastVisit' | 'loyaltyPoints'

export default function AdminCustomers() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('lifetimeSpend')
  const [dir, setDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    let list = MOCK_CUSTOMERS.slice()
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.favoriteItem.toLowerCase().includes(q),
      )
    }
    list.sort((a, b) => {
      let cmp: number
      switch (sort) {
        case 'name': cmp = a.name.localeCompare(b.name); break
        case 'totalOrders': cmp = a.totalOrders - b.totalOrders; break
        case 'lifetimeSpend': cmp = a.lifetimeSpend - b.lifetimeSpend; break
        case 'lastVisit': cmp = a.lastVisit.getTime() - b.lastVisit.getTime(); break
        case 'loyaltyPoints': cmp = a.loyaltyPoints - b.loyaltyPoints; break
      }
      return dir === 'asc' ? cmp : -cmp
    })
    return list
  }, [search, sort, dir])

  const totalSpend = MOCK_CUSTOMERS.reduce((s, c) => s + c.lifetimeSpend, 0)
  const totalOrders = MOCK_CUSTOMERS.reduce((s, c) => s + c.totalOrders, 0)

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle={`${MOCK_CUSTOMERS.length} customers · ${fmtUSD(totalSpend)} lifetime · ${totalOrders.toLocaleString()} orders`}
        actions={
          <button className="bg-ink text-cream px-4 py-2 text-xs font-semibold uppercase tracking-widest border-2 border-ink hover:bg-paprika transition-colors">
            Export CSV
          </button>
        }
      />

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, or favorite item…"
        className="w-full bg-cream border-2 border-ink px-3 py-2.5 text-sm font-medium mb-3 focus:outline-none focus:bg-cream-deep"
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-ink/15 bg-cream-deep text-[10px] uppercase tracking-widest text-ink-soft">
              <tr>
                <SortableTH label="Name" k="name" sort={sort} dir={dir} setSort={setSort} setDir={setDir} />
                <th className="text-left px-2 py-2 font-semibold hidden lg:table-cell">Contact</th>
                <SortableTH label="Orders" k="totalOrders" sort={sort} dir={dir} setSort={setSort} setDir={setDir} className="text-right" />
                <SortableTH label="Lifetime" k="lifetimeSpend" sort={sort} dir={dir} setSort={setSort} setDir={setDir} className="text-right" />
                <SortableTH label="Loyalty pts" k="loyaltyPoints" sort={sort} dir={dir} setSort={setSort} setDir={setDir} className="text-right hidden md:table-cell" />
                <SortableTH label="Last visit" k="lastVisit" sort={sort} dir={dir} setSort={setSort} setDir={setDir} className="text-right hidden sm:table-cell" />
                <th className="text-left px-2 py-2 font-semibold hidden xl:table-cell">Favorite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {filtered.map((c) => (
                <CustomerRow key={c.id} c={c} />
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-8 text-center text-ink-soft text-sm">No customers match your search.</div>}
      </Card>
    </>
  )
}

function CustomerRow({ c }: { c: Customer }) {
  const isVip = c.lifetimeSpend > 600 || c.totalOrders > 40
  return (
    <tr className="hover:bg-cream-deep">
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="font-bold">{c.name}</span>
          {isVip && <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 bg-mustard text-ink font-bold">VIP</span>}
        </div>
        {c.notes && <div className="text-xs text-ink-soft italic mt-0.5">{c.notes}</div>}
      </td>
      <td className="px-2 py-2.5 hidden lg:table-cell text-xs text-ink-soft">
        <div>{c.email}</div>
        <div>{c.phone}</div>
      </td>
      <td className="px-2 py-2.5 text-right tabular-nums">{c.totalOrders}</td>
      <td className="px-2 py-2.5 text-right tabular-nums font-bold">{fmtUSD(c.lifetimeSpend)}</td>
      <td className="px-2 py-2.5 text-right tabular-nums hidden md:table-cell">{c.loyaltyPoints.toLocaleString()}</td>
      <td className="px-2 py-2.5 text-right tabular-nums text-xs hidden sm:table-cell whitespace-nowrap">{daysAgo(c.lastVisit)}</td>
      <td className="px-2 py-2.5 hidden xl:table-cell text-xs text-ink-soft truncate max-w-[200px]">{c.favoriteItem}</td>
    </tr>
  )
}

function SortableTH({ label, k, sort, dir, setSort, setDir, className = '' }: {
  label: string
  k: SortKey
  sort: SortKey
  dir: 'asc' | 'desc'
  setSort: (k: SortKey) => void
  setDir: (d: 'asc' | 'desc') => void
  className?: string
}) {
  const active = sort === k
  return (
    <th className={`px-2 py-2 font-semibold text-left ${className}`}>
      <button
        onClick={() => {
          if (active) setDir(dir === 'asc' ? 'desc' : 'asc')
          else { setSort(k); setDir('desc') }
        }}
        className="hover:text-ink"
      >
        {label} {active ? (dir === 'asc' ? '↑' : '↓') : ''}
      </button>
    </th>
  )
}

function daysAgo(d: Date) {
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function fmtUSD(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
