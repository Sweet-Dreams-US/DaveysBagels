import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useCustomizer } from '../context/CustomizerContext'
import { MENU } from '../data/menu'

export default function CartDrawer() {
  const { items, isOpen, close, updateQty, remove, subtotal, clear } = useCart()
  const { open: openCustomizer } = useCustomizer()
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') close() }
    if (isOpen) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  const tax = subtotal * 0.07
  const total = subtotal + tax

  function handleCheckout() {
    setConfirming(true)
    // Simulate a brief async submit; in production this would POST to Toast / Stripe
    setTimeout(() => {
      setConfirming(false)
      setConfirmed(true)
    }, 900)
  }

  function handleDone() {
    clear()
    setConfirmed(false)
    close()
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-ink/60 z-50 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Your cart"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full w-full sm:w-[460px] bg-cream z-50 border-l-4 border-ink shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between p-5 border-b-2 border-ink bg-mustard">
          <div>
            <div className="font-display text-3xl text-ink leading-none">Your Cart</div>
            <div className="text-xs uppercase tracking-widest text-ink-soft mt-1">Pick-up at 1006 Broadway</div>
          </div>
          <button
            onClick={close}
            aria-label="Close cart"
            className="h-10 w-10 inline-flex items-center justify-center bg-cream border-2 border-ink rounded-full hover:rotate-90 transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </header>

        {confirmed ? (
          <ConfirmedView onDone={handleDone} />
        ) : items.length === 0 ? (
          <EmptyView onClose={close} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.map((item) => {
                const baseItem = MENU.find((m) => m.id === item.baseId)
                const canEdit = !!baseItem?.modifiers?.length
                return (
                  <article key={item.id} className="bg-cream-deep border-2 border-ink p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-serif font-bold text-ink leading-tight">{item.name}</div>
                        <div className="text-sm text-ink-soft mt-0.5">${item.price.toFixed(2)} each</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-ink tabular-nums">${(item.price * item.qty).toFixed(2)}</div>
                      </div>
                    </div>

                    {/* Modifier summary */}
                    {item.modifiers && item.modifiers.length > 0 && (
                      <ul className="mt-2 text-xs text-ink-soft space-y-0.5 font-serif">
                        {item.modifiers.map((m) => (
                          <li key={`${m.groupId}:${m.optionId}`} className="flex items-baseline gap-1.5">
                            <span className="text-ink-soft/70 uppercase tracking-wider text-[10px] font-sans font-semibold">
                              {m.groupLabel}:
                            </span>
                            <span>{m.optionLabel}</span>
                            {m.priceChange !== 0 && (
                              <span className="text-paprika tabular-nums ml-auto">
                                {m.priceChange > 0 ? '+' : ''}${m.priceChange.toFixed(2)}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Footer row: qty stepper + edit/remove */}
                    <div className="mt-3 pt-2 border-t border-dashed border-ink/25 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center border-2 border-ink bg-cream">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          aria-label={`Decrease ${item.name}`}
                          className="w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-mustard"
                        >−</button>
                        <span className="w-9 text-center font-bold tabular-nums">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          aria-label={`Increase ${item.name}`}
                          className="w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-mustard"
                        >+</button>
                      </div>
                      <div className="flex items-center gap-3 text-xs uppercase tracking-wider font-semibold">
                        {canEdit && baseItem && (
                          <button
                            onClick={() => {
                              openCustomizer({
                                item: baseItem,
                                edit: {
                                  editingCartRowId: item.id,
                                  initialModifiers: item.modifiers ?? [],
                                  initialQty: item.qty,
                                },
                              })
                              close()
                            }}
                            className="text-teal-deep hover:text-ink hover:underline"
                          >Edit</button>
                        )}
                        <button
                          onClick={() => remove(item.id)}
                          className="text-paprika hover:underline"
                        >Remove</button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <footer className="border-t-2 border-ink bg-cream-deep p-5 space-y-3">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Tax (7%)" value={`$${tax.toFixed(2)}`} />
              <Row label="Total" value={`$${total.toFixed(2)}`} bold />
              <button
                onClick={handleCheckout}
                disabled={confirming}
                className="w-full bg-ink text-cream font-display text-xl uppercase tracking-wider py-4 border-2 border-ink shadow-[5px_5px_0_0_var(--color-paprika)] hover:shadow-[7px_7px_0_0_var(--color-paprika)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-60"
              >
                {confirming ? 'Sending to the kitchen…' : 'Place Pickup Order'}
              </button>
              <p className="text-[11px] text-ink-soft text-center leading-relaxed">
                Demo cart — orders aren&rsquo;t actually sent. In production this connects to Toast / Stripe.
              </p>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'text-lg font-bold' : 'text-sm text-ink-soft'}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

function EmptyView({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-7xl mb-3 animate-[float-slow_6s_ease-in-out_infinite]" aria-hidden>🥯</div>
      <div className="font-display text-3xl mb-2">Empty bagel basket</div>
      <p className="text-ink-soft max-w-xs mb-6">
        Pick a few favorites and they&rsquo;ll appear here. The Sausage Celebration is calling.
      </p>
      <button
        onClick={onClose}
        className="sticker bg-paprika text-cream border-paprika"
      >Browse the Menu</button>
    </div>
  )
}

function ConfirmedView({ onDone }: { onDone: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="h-20 w-20 rounded-full bg-mustard border-2 border-ink flex items-center justify-center mb-4">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="font-display text-3xl mb-2">Order received!</div>
      <p className="text-ink-soft max-w-xs mb-6 leading-relaxed">
        We&rsquo;ll have it ready at the counter on Broadway in about 8 minutes.
        Look for the everything bagel logo.
      </p>
      <button onClick={onDone} className="sticker bg-ink text-cream border-ink">Sweet, thanks!</button>
    </div>
  )
}
