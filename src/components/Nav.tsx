import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import logo from '../assets/logo.png'

export default function Nav() {
  const { count, toggle } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-cream/85 backdrop-blur-md border-b-2 border-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Davey's Delicious Bagels"
            className="h-12 w-12 sm:h-14 sm:w-14 transition-transform duration-300 group-hover:rotate-[8deg]"
          />
          <div className="leading-none hidden sm:block">
            <div className="font-display text-xl text-ink tracking-tight">Davey's</div>
            <div className="text-[11px] tracking-widest uppercase text-ink-soft">Delicious Bagels</div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                isActive ? 'text-paprika' : 'text-ink hover:text-paprika'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                isActive ? 'text-paprika' : 'text-ink hover:text-paprika'
              }`
            }
          >
            Menu & Order
          </NavLink>

          <button
            onClick={toggle}
            aria-label={`Open cart, ${count} items`}
            className="relative ml-2 inline-flex items-center gap-2 bg-ink text-cream font-display text-sm uppercase tracking-wider px-4 py-2.5 border-2 border-ink shadow-[3px_3px_0_0_var(--color-mustard)] hover:shadow-[5px_5px_0_0_var(--color-mustard)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            <CartIcon />
            <span className="hidden sm:inline">Cart</span>
            <span
              className="ml-1 inline-flex items-center justify-center min-w-[1.4rem] h-[1.4rem] rounded-full bg-paprika text-cream text-xs font-bold px-1.5"
              aria-hidden="true"
            >
              {count}
            </span>
          </button>
        </nav>
      </div>
    </header>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  )
}
