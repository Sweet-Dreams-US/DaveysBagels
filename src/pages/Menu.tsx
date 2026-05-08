import { useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORIES, MENU } from '../data/menu'
import type { CategoryId } from '../data/menu'
import MenuItemCard from '../components/MenuItemCard'
import { useCart } from '../context/CartContext'

export default function Menu() {
  const { count, open } = useCart()
  const [active, setActive] = useState<CategoryId>('breakfast')
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const [search, setSearch] = useState('')

  // Observe sections to highlight the active category in the side rail
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id as CategoryId)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75] },
    )
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const itemsByCategory = useMemo(() => {
    const lower = search.toLowerCase().trim()
    const filtered = lower
      ? MENU.filter(
          (i) =>
            i.name.toLowerCase().includes(lower) ||
            i.description?.toLowerCase().includes(lower) ||
            i.flair?.toLowerCase().includes(lower),
        )
      : MENU
    return CATEGORIES.map((c) => ({
      ...c,
      items: filtered.filter((i) => i.category === c.id),
    }))
  }, [search])

  function jump(id: CategoryId) {
    const el = sectionRefs.current[id]
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-cream">
      {/* Banner */}
      <section className="relative overflow-hidden border-b-2 border-ink bg-teal">
        <div className="grain-overlay absolute inset-0" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-6 py-14 sm:py-20 flex flex-col items-start gap-4">
          <span className="sticker bg-mustard text-ink border-ink">Menu & Order — pickup only</span>
          <h1 className="font-display text-[clamp(2.5rem,11vw,5.5rem)] text-ink leading-[0.9]">
            Build your<br />
            <span className="text-cream drop-shadow-[3px_3px_0_var(--color-ink)]">breakfast</span>
          </h1>
          <p className="font-serif text-lg text-ink/85 max-w-xl">
            Tap <em>add</em> to drop items in your cart. Adjust quantities anytime. Pickup at our Broadway counter — usually ready in eight minutes flat.
          </p>
        </div>
      </section>

      {/* Body — two-column on desktop. min-w-0 on the grid items lets their
          internal overflow-x-auto/object-cover constraints actually take
          effect; without it, default min-width: auto on grid items makes
          the tracks grow to fit any unbreakable content (here, the
          whitespace-nowrap category buttons), which would force the page
          to scroll horizontally on mobile. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[220px_1fr] gap-10">
        {/* Side rail / category nav */}
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-1 min-w-0">
          <div className="mb-3">
            <label htmlFor="menu-search" className="sr-only">Search the menu</label>
            <input
              id="menu-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the menu…"
              className="w-full bg-cream-deep border-2 border-ink px-3 py-2 text-sm font-medium placeholder:text-ink-soft/60 focus:outline-none focus:bg-cream"
            />
          </div>
          <nav aria-label="Menu categories" className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 -mx-2 px-2 lg:mx-0 lg:px-0">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => jump(c.id)}
                className={`whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider px-3 py-2 border-2 transition-colors ${
                  active === c.id
                    ? 'border-ink bg-ink text-cream'
                    : 'border-transparent text-ink-soft hover:bg-cream-deep hover:border-ink/20'
                }`}
              >
                {c.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Sections */}
        <div className="space-y-16 min-w-0">
          {itemsByCategory.map((cat) => (
            <section
              key={cat.id}
              id={cat.id}
              ref={(el) => { sectionRefs.current[cat.id] = el }}
              className="scroll-mt-24"
            >
              <header className="mb-5">
                <div className="flex items-baseline gap-4">
                  <h2 className="font-display text-3xl sm:text-4xl text-ink">{cat.label}</h2>
                  <div className="flex-1 border-b-2 border-dashed border-ink/30" />
                  <span className="text-xs uppercase tracking-widest text-ink-soft">
                    {cat.items.length} {cat.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <p className="font-serif italic text-ink-soft mt-1.5">{cat.blurb}</p>
              </header>
              {cat.items.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {cat.items.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-soft italic">No matches in this section.</p>
              )}
            </section>
          ))}
        </div>
      </div>

      {/* Floating cart pill on small screens */}
      {count > 0 && (
        <button
          onClick={open}
          className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-30 bg-paprika text-cream font-display uppercase tracking-wider text-sm px-5 py-3 border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] flex items-center gap-3"
        >
          <span>View cart</span>
          <span className="bg-cream text-ink px-2 py-0.5 text-xs font-bold rounded-full">{count}</span>
        </button>
      )}
    </div>
  )
}
