import { useState } from 'react'
import type { MenuItem } from '../data/menu'
import { useCart } from '../context/CartContext'

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const { add } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  function handleAdd() {
    add({ id: item.id, name: item.name, price: item.price })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  const disabled = item.outOfStock

  return (
    <article
      className={`relative bg-cream border-2 border-ink p-5 flex flex-col group transition-all ${
        disabled ? 'opacity-60' : 'hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)]'
      }`}
    >
      {/* Top row: name + price */}
      <header className="flex items-baseline justify-between gap-3 mb-1">
        <h3 className="font-serif font-bold text-lg text-ink leading-tight">{item.name}</h3>
        <div className="font-display text-xl text-paprika tabular-nums whitespace-nowrap">
          ${item.price.toFixed(2)}
        </div>
      </header>

      {/* Description */}
      {item.description && (
        <p className="text-sm text-ink-soft leading-relaxed">{item.description}</p>
      )}

      {/* Flair */}
      {item.flair && (
        <p className="mt-2 text-xs italic text-teal-deep border-l-2 border-mustard pl-2">
          {item.flair}
        </p>
      )}

      {disabled && (
        <div className="mt-3 sticker bg-ink-soft text-cream border-ink-soft self-start text-[10px]">
          Out of stock
        </div>
      )}

      {/* Add button */}
      {!disabled && (
        <div className="mt-4 pt-3 border-t border-dashed border-ink/30 flex items-center justify-end">
          <button
            onClick={handleAdd}
            aria-label={`Add ${item.name} to cart`}
            className={`inline-flex items-center gap-2 font-display text-sm uppercase tracking-widest px-3 py-2 border-2 border-ink transition-all ${
              justAdded
                ? 'bg-mustard text-ink animate-[wiggle_0.6s_ease-in-out]'
                : 'bg-ink text-cream hover:bg-paprika'
            }`}
          >
            {justAdded ? 'Added!' : 'Add +'}
          </button>
        </div>
      )}
    </article>
  )
}
