import { useEffect, useMemo, useState } from 'react'
import { useCustomizer } from '../context/CustomizerContext'
import { useCart, composeCartItemId } from '../context/CartContext'
import type { CartItem, CartModifier } from '../context/CartContext'
import type { MenuItem, ModifierGroup } from '../data/menu'

/**
 * Modal for customizing a menu item before adding it to the cart.
 * Opened via useCustomizer().open(...). Mounted once at app root.
 *
 * State design notes:
 *   - selections is keyed by groupId. For 'single' groups it's a string
 *     (the chosen optionId). For 'multi' it's a string[] of optionIds.
 *   - We compute the live total via useMemo so price + selectedMods stay
 *     in sync with the UI checkboxes/radios.
 */
export default function ItemCustomizer() {
  const { current, close } = useCustomizer()
  const { add, replace } = useCart()
  const [selections, setSelections] = useState<Record<string, string | string[]>>({})
  const [qty, setQty] = useState(1)

  const item: MenuItem | null = current?.item ?? null
  const edit = current?.edit

  // Reset selections every time we open with a new item / edit context
  useEffect(() => {
    if (!item) return
    const init: Record<string, string | string[]> = {}

    // First pass: pre-fill from edit context (if any)
    if (edit?.initialModifiers?.length) {
      for (const m of edit.initialModifiers) {
        const group = item.modifiers?.find((g) => g.id === m.groupId)
        if (!group) continue
        if (group.type === 'single') {
          init[m.groupId] = m.optionId
        } else {
          const arr = (init[m.groupId] as string[] | undefined) ?? []
          arr.push(m.optionId)
          init[m.groupId] = arr
        }
      }
    }

    // Second pass: fill remaining groups with their defaults
    for (const group of item.modifiers ?? []) {
      if (group.id in init) continue
      if (group.type === 'single') {
        const def = group.options.find((o) => o.default) ?? group.options[0]
        init[group.id] = def.id
      } else {
        init[group.id] = group.options.filter((o) => o.default).map((o) => o.id)
      }
    }

    setSelections(init)
    setQty(edit?.initialQty ?? 1)
  }, [item, edit])

  // Lock background scroll while open
  useEffect(() => {
    if (!item) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [item])

  // Close on escape
  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [item, close])

  const { selectedMods, total } = useMemo(() => {
    if (!item) return { selectedMods: [] as CartModifier[], total: 0 }
    let priceTotal = item.price
    const mods: CartModifier[] = []
    for (const group of item.modifiers ?? []) {
      const sel = selections[group.id]
      if (group.type === 'single') {
        const opt = group.options.find((o) => o.id === sel)
        if (!opt) continue
        priceTotal += opt.priceChange ?? 0
        mods.push({
          groupId: group.id,
          groupLabel: group.label,
          optionId: opt.id,
          optionLabel: opt.label,
          priceChange: opt.priceChange ?? 0,
        })
      } else {
        const ids = (sel as string[]) ?? []
        for (const id of ids) {
          const opt = group.options.find((o) => o.id === id)
          if (!opt) continue
          priceTotal += opt.priceChange ?? 0
          mods.push({
            groupId: group.id,
            groupLabel: group.label,
            optionId: opt.id,
            optionLabel: opt.label,
            priceChange: opt.priceChange ?? 0,
          })
        }
      }
    }
    return { selectedMods: mods, total: priceTotal }
  }, [item, selections])

  if (!item) return null

  const pickSingle = (groupId: string, optionId: string) =>
    setSelections((s) => ({ ...s, [groupId]: optionId }))

  const toggleMulti = (groupId: string, optionId: string) =>
    setSelections((s) => {
      const arr = (s[groupId] as string[]) ?? []
      return arr.includes(optionId)
        ? { ...s, [groupId]: arr.filter((id) => id !== optionId) }
        : { ...s, [groupId]: [...arr, optionId] }
    })

  function handleSubmit() {
    if (!item) return
    const cartItem: CartItem = {
      id: composeCartItemId(item.id, selectedMods),
      baseId: item.id,
      name: item.name,
      price: total,
      qty,
      modifiers: selectedMods.length > 0 ? selectedMods : undefined,
    }
    if (edit) {
      replace(edit.editingCartRowId, cartItem)
    } else {
      add(cartItem)
    }
    close()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Customize ${item.name}`}
      className="fixed inset-0 z-[60] flex items-stretch sm:items-center justify-center"
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close customizer"
        className="absolute inset-0 bg-ink/65 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal */}
      <div className="relative bg-cream w-full sm:max-w-xl max-h-full sm:max-h-[90vh] flex flex-col border-2 border-ink shadow-[8px_8px_0_0_var(--color-paprika)] sm:my-auto">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 p-5 border-b-2 border-ink bg-mustard">
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-[0.2em] text-ink-soft">
              {edit ? 'Editing your order' : 'Customize'}
            </div>
            <h2 className="font-display text-3xl text-ink leading-tight mt-1">{item.name}</h2>
            {item.description && (
              <p className="text-sm text-ink/80 mt-1.5 font-serif italic">{item.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="shrink-0 h-10 w-10 inline-flex items-center justify-center bg-cream border-2 border-ink rounded-full hover:rotate-90 transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {(item.modifiers ?? []).map((group) => (
            <Group
              key={group.id}
              group={group}
              selection={selections[group.id]}
              onPickSingle={(optionId) => pickSingle(group.id, optionId)}
              onToggleMulti={(optionId) => toggleMulti(group.id, optionId)}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="border-t-2 border-ink bg-cream-deep p-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center border-2 border-ink bg-cream">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-9 h-9 flex items-center justify-center text-lg font-bold hover:bg-mustard"
              >−</button>
              <span className="w-10 text-center font-bold tabular-nums">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-9 h-9 flex items-center justify-center text-lg font-bold hover:bg-mustard"
              >+</button>
            </div>
            <div className="font-display text-2xl text-paprika tabular-nums">
              ${(total * qty).toFixed(2)}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-ink text-cream font-display text-xl uppercase tracking-wider py-4 border-2 border-ink shadow-[5px_5px_0_0_var(--color-mustard)] hover:shadow-[7px_7px_0_0_var(--color-mustard)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            {edit ? 'Update order' : 'Add to cart'}
          </button>
        </footer>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------- */
/* MODIFIER GROUP RENDER                                      */
/* ---------------------------------------------------------- */
function Group({
  group,
  selection,
  onPickSingle,
  onToggleMulti,
}: {
  group: ModifierGroup
  selection: string | string[] | undefined
  onPickSingle: (optionId: string) => void
  onToggleMulti: (optionId: string) => void
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="font-display text-lg text-ink mb-1">
        {group.label}
        {group.type === 'multi' && <span className="ml-2 text-xs uppercase tracking-widest text-ink-soft font-sans">Choose any</span>}
      </legend>
      {group.helper && <p className="text-xs text-ink-soft -mt-1 mb-2 font-serif italic">{group.helper}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {group.options.map((opt) => {
          const isPicked =
            group.type === 'single'
              ? selection === opt.id
              : Array.isArray(selection) && selection.includes(opt.id)
          return (
            <label
              key={opt.id}
              className={`flex items-center justify-between gap-2 px-3 py-2 border-2 cursor-pointer transition-colors ${
                isPicked
                  ? 'border-ink bg-mustard'
                  : 'border-ink/30 bg-cream hover:border-ink hover:bg-cream-deep'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type={group.type === 'single' ? 'radio' : 'checkbox'}
                  name={group.id}
                  checked={isPicked}
                  onChange={() =>
                    group.type === 'single' ? onPickSingle(opt.id) : onToggleMulti(opt.id)
                  }
                  className="accent-ink"
                />
                <span className="text-sm font-semibold">{opt.label}</span>
              </div>
              {opt.priceChange != null && opt.priceChange !== 0 && (
                <span className="text-xs font-bold tabular-nums text-paprika">
                  {opt.priceChange > 0 ? '+' : ''}${opt.priceChange.toFixed(2)}
                </span>
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
