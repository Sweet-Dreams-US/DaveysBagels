import { useMemo, useState } from 'react'
import { PageHeader, Card } from '../Admin'
import { CATEGORIES, MENU } from '../../data/menu'
import type { CategoryId, MenuItem } from '../../data/menu'

/** A working copy of the menu we mutate locally so changes feel real for
 *  the demo without persisting anywhere. Refresh resets to defaults. */
type EditableItem = MenuItem & { _edited?: boolean }

export default function AdminMenu() {
  const [items, setItems] = useState<EditableItem[]>(() => MENU.map((m) => ({ ...m })))
  const [activeCat, setActiveCat] = useState<CategoryId | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return items.filter((i) => {
      if (activeCat !== 'all' && i.category !== activeCat) return false
      if (!q) return true
      return i.name.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q)
    })
  }, [items, activeCat, search])

  function update(id: string, patch: Partial<EditableItem>) {
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, ...patch, _edited: true } : i)))
  }

  const editedCount = items.filter((i) => i._edited).length
  const outOfStockCount = items.filter((i) => i.outOfStock).length

  return (
    <>
      <PageHeader
        title="Menu"
        subtitle={`${items.length} items · ${outOfStockCount} out of stock${editedCount > 0 ? ` · ${editedCount} unsaved` : ''}`}
        actions={
          editedCount > 0 ? (
            <>
              <button
                onClick={() => setItems(MENU.map((m) => ({ ...m })))}
                className="bg-cream text-ink-soft px-4 py-2 text-xs font-semibold uppercase tracking-widest border-2 border-ink/30 hover:border-ink hover:text-ink"
              >
                Discard
              </button>
              <button
                onClick={() => setItems((cur) => cur.map((i) => ({ ...i, _edited: false })))}
                className="bg-ink text-cream px-4 py-2 text-xs font-semibold uppercase tracking-widest border-2 border-ink hover:bg-paprika transition-colors"
              >
                Save Changes ({editedCount})
              </button>
            </>
          ) : null
        }
      />

      {/* Category filter + search */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Pill label="All" active={activeCat === 'all'} onClick={() => setActiveCat('all')} />
        {CATEGORIES.map((c) => (
          <Pill key={c.id} label={c.label} active={activeCat === c.id} onClick={() => setActiveCat(c.id)} />
        ))}
      </div>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search items…"
        className="w-full bg-cream border-2 border-ink px-3 py-2.5 text-sm font-medium mb-3 focus:outline-none focus:bg-cream-deep"
      />

      <Card>
        <table className="w-full text-sm">
          <thead className="border-b-2 border-ink/15 bg-cream-deep text-[10px] uppercase tracking-widest text-ink-soft">
            <tr>
              <th className="text-left px-4 py-2 font-semibold">Item</th>
              <th className="text-left px-2 py-2 font-semibold hidden sm:table-cell">Category</th>
              <th className="text-right px-2 py-2 font-semibold">Price</th>
              <th className="text-center px-2 py-2 font-semibold">Modifiers</th>
              <th className="text-center px-4 py-2 font-semibold">In Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {filtered.map((it) => (
              <tr key={it.id} className={it._edited ? 'bg-mustard/15' : ''}>
                <td className="px-4 py-2.5">
                  <div className="font-bold leading-tight">
                    {it.name}
                    {it._edited && <span className="ml-2 text-[10px] uppercase tracking-widest text-paprika">edited</span>}
                  </div>
                  {it.description && <div className="text-xs text-ink-soft truncate max-w-md">{it.description}</div>}
                </td>
                <td className="px-2 py-2.5 hidden sm:table-cell text-xs text-ink-soft uppercase tracking-wider">
                  {CATEGORIES.find((c) => c.id === it.category)?.label}
                </td>
                <td className="px-2 py-2.5 text-right">
                  <input
                    type="number"
                    step="0.01"
                    value={it.price}
                    onChange={(e) => update(it.id, { price: parseFloat(e.target.value) || 0 })}
                    className="w-20 bg-cream border-2 border-ink/20 hover:border-ink focus:border-ink focus:bg-cream-deep px-2 py-1 text-right text-sm tabular-nums focus:outline-none"
                  />
                </td>
                <td className="px-2 py-2.5 text-center text-xs text-ink-soft tabular-nums">
                  {it.modifiers ? `${it.modifiers.length} group${it.modifiers.length === 1 ? '' : 's'}` : '—'}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <button
                    onClick={() => update(it.id, { outOfStock: !it.outOfStock })}
                    className={`text-[10px] uppercase tracking-widest px-2.5 py-1 border-2 font-semibold transition-colors ${
                      it.outOfStock
                        ? 'bg-cream-deep text-ink-soft border-ink/30 hover:border-ink hover:text-ink'
                        : 'bg-ink text-cream border-ink hover:bg-paprika'
                    }`}
                  >
                    {it.outOfStock ? 'Out' : 'In'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-8 text-center text-ink-soft text-sm">No items match.</div>}
      </Card>
    </>
  )
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 border-2 transition-colors ${
        active ? 'bg-ink text-cream border-ink' : 'bg-cream border-ink/20 hover:border-ink text-ink-soft hover:text-ink'
      }`}
    >{label}</button>
  )
}
