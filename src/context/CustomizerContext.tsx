import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { MenuItem } from '../data/menu'
import type { CartModifier } from './CartContext'

/** Optional context for opening the customizer in EDIT mode (from the cart). */
export type EditContext = {
  editingCartRowId: string
  initialModifiers: CartModifier[]
  initialQty: number
}

type OpenArgs = {
  item: MenuItem
  edit?: EditContext
}

type CustomizerContextValue = {
  open: (args: OpenArgs) => void
  close: () => void
  /** null when closed, set when open. */
  current: OpenArgs | null
}

const CustomizerContext = createContext<CustomizerContextValue | null>(null)

export function CustomizerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<OpenArgs | null>(null)

  const open = useCallback((args: OpenArgs) => setCurrent(args), [])
  const close = useCallback(() => setCurrent(null), [])

  return (
    <CustomizerContext.Provider value={{ open, close, current }}>
      {children}
    </CustomizerContext.Provider>
  )
}

export function useCustomizer() {
  const ctx = useContext(CustomizerContext)
  if (!ctx) throw new Error('useCustomizer must be used within CustomizerProvider')
  return ctx
}
