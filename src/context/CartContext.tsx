import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import type { ReactNode } from 'react'

/** A single selected modifier option, stored on the cart item. */
export type CartModifier = {
  groupId: string
  groupLabel: string
  optionId: string
  optionLabel: string
  priceChange: number
}

export type CartItem = {
  /** Unique cart-row id: baseId + sorted modifier ids hashed in. */
  id: string
  /** The original menu-item id, so we can re-open the customizer in edit mode. */
  baseId: string
  name: string
  /** Already includes modifier price changes. */
  price: number
  qty: number
  modifiers?: CartModifier[]
}

type CartState = {
  items: CartItem[]
}

type Action =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; qty: number }
  | {
      type: 'REPLACE'
      /** Existing cart row to replace (so we can re-customize an existing item). */
      oldId: string
      newItem: CartItem
    }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; state: CartState }

const STORAGE_KEY = 'daveys-cart-v2'

/** Compose a deterministic cart-row id from a base item + selected modifiers.
 *  Two adds with the same modifier set will collapse into a quantity bump;
 *  different modifier sets become separate cart rows. */
export function composeCartItemId(baseId: string, modifiers?: CartModifier[]): string {
  if (!modifiers || modifiers.length === 0) return baseId
  const fingerprint = modifiers
    .map((m) => `${m.groupId}:${m.optionId}`)
    .sort()
    .join('|')
  return `${baseId}::${fingerprint}`
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.item.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + action.item.qty } : i,
          ),
        }
      }
      return { items: [...state.items, action.item] }
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.id) }
    case 'UPDATE_QTY':
      return {
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i))
          .filter((i) => i.qty > 0),
      }
    case 'REPLACE': {
      // If newItem.id collides with an existing OTHER row, merge quantities.
      const others = state.items.filter((i) => i.id !== action.oldId)
      const collision = others.find((i) => i.id === action.newItem.id)
      if (collision) {
        return {
          items: others.map((i) =>
            i.id === action.newItem.id ? { ...i, qty: i.qty + action.newItem.qty } : i,
          ),
        }
      }
      const oldRow = state.items.find((i) => i.id === action.oldId)
      const replacement = oldRow ? { ...action.newItem, qty: oldRow.qty } : action.newItem
      return { items: others.concat(replacement) }
    }
    case 'CLEAR':
      return { items: [] }
    case 'HYDRATE':
      return action.state
    default:
      return state
  }
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  /** Add an item to the cart. Does NOT open the drawer — the user clicks the
   *  cart icon to view their bag. A subtle pulse animation on the icon (handled
   *  in Nav.tsx) gives feedback that something was added. */
  add: (item: CartItem) => void
  remove: (id: string) => void
  updateQty: (id: string, qty: number) => void
  /** Replace an existing cart row (used when user edits an item from the cart). */
  replace: (oldId: string, newItem: CartItem) => void
  clear: () => void
  /** Increments every time an item is added — Nav.tsx watches this so it can
   *  animate the cart icon without the count change being the trigger (which
   *  would miss "added 2 of the same thing" cases). */
  pulseTick: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [pulseTick, setPulseTick] = useState(0)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) dispatch({ type: 'HYDRATE', state: JSON.parse(raw) })
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state, hydrated])

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((s, i) => s + i.qty, 0)
    const subtotal = state.items.reduce((s, i) => s + i.qty * i.price, 0)
    return {
      items: state.items,
      count,
      subtotal,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
      add: (item) => {
        dispatch({ type: 'ADD', item })
        setPulseTick((t) => t + 1)
      },
      remove: (id) => dispatch({ type: 'REMOVE', id }),
      updateQty: (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty }),
      replace: (oldId, newItem) => dispatch({ type: 'REPLACE', oldId, newItem }),
      clear: () => dispatch({ type: 'CLEAR' }),
      pulseTick,
    }
  }, [state, isOpen, pulseTick])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
