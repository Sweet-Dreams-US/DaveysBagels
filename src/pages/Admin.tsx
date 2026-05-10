import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'

/* ---------------------------------------------------------- */
/* ADMIN LAYOUT                                               */
/* ---------------------------------------------------------- */
/**
 * Wraps every admin page with a sidebar nav + topbar. Uses <Outlet /> so
 * each tab is just a route under /admin/*. The visual feel is intentionally
 * tighter and more utility-driven than the customer-facing storefront —
 * smaller type, denser tables, less ornament.
 */
export default function Admin() {
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()

  const tabs: { to: string; label: string; icon: string }[] = [
    { to: '/admin',            label: 'Dashboard',  icon: '◎' },
    { to: '/admin/orders',     label: 'Orders',     icon: '◐' },
    { to: '/admin/menu',       label: 'Menu',       icon: '☰' },
    { to: '/admin/analytics',  label: 'Analytics',  icon: '⌃' },
    { to: '/admin/accounting', label: 'Accounting', icon: '$' },
    { to: '/admin/events',     label: 'Events',     icon: '◇' },
    { to: '/admin/customers',  label: 'Customers',  icon: '◉' },
    { to: '/admin/settings',   label: 'Settings',   icon: '⚙' },
  ]

  return (
    <div className="min-h-screen bg-cream-deep text-ink flex flex-col lg:flex-row">
      {/* Mobile top bar */}
      <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b-2 border-ink bg-cream sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img src={logo} alt="" className="h-8 w-8" />
          <div>
            <div className="font-display text-lg leading-none">Davey’s</div>
            <div className="text-[10px] uppercase tracking-widest text-ink-soft -mt-0.5">Admin</div>
          </div>
        </div>
        <button
          onClick={() => setNavOpen((v) => !v)}
          aria-label="Toggle navigation"
          className="px-3 py-2 border-2 border-ink bg-mustard text-ink text-sm font-bold uppercase tracking-wider"
        >
          {navOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          navOpen ? 'block' : 'hidden lg:block'
        } lg:w-60 lg:flex-shrink-0 bg-cream border-r-2 border-ink lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto`}
      >
        {/* Desktop header */}
        <div className="hidden lg:block p-5 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="h-9 w-9" />
            <div>
              <div className="font-display text-xl leading-none">Davey’s</div>
              <div className="text-[10px] uppercase tracking-widest text-ink-soft mt-0.5">Admin · Demo</div>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-0.5">
          {tabs.map((t) => {
            // Special handling for the index route /admin → only match exactly
            const isActive =
              t.to === '/admin'
                ? location.pathname === '/admin' || location.pathname === '/admin/'
                : location.pathname.startsWith(t.to)
            return (
              <NavLink
                key={t.to}
                to={t.to}
                onClick={() => setNavOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 border-2 transition-colors text-sm font-semibold ${
                  isActive
                    ? 'bg-ink text-cream border-ink'
                    : 'border-transparent text-ink-soft hover:bg-cream-deep hover:text-ink'
                }`}
              >
                <span className="w-5 text-center text-base" aria-hidden>{t.icon}</span>
                <span>{t.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="p-4 border-t-2 border-ink/15 mt-2 text-xs text-ink-soft leading-relaxed">
          <div className="font-bold text-ink mb-1">Demo Admin</div>
          <p>This is a sample back-office. All data is generated for the demo. In production this connects to Toast (orders), Stripe (payments), and a database (customers, events).</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-screen-2xl">
        <Outlet />
      </main>
    </div>
  )
}

/* ---------------------------------------------------------- */
/* SHARED ADMIN UI HELPERS                                    */
/* ---------------------------------------------------------- */
export function PageHeader({ title, subtitle, actions }: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-ink-soft mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

export function StatCard({
  label,
  value,
  delta,
  trend = 'flat',
  accent = 'ink',
}: {
  label: string
  value: string
  delta?: string
  trend?: 'up' | 'down' | 'flat'
  accent?: 'ink' | 'paprika' | 'teal' | 'mustard'
}) {
  const accentBg = {
    ink: 'bg-ink text-cream',
    paprika: 'bg-paprika text-cream',
    teal: 'bg-teal text-ink',
    mustard: 'bg-mustard text-ink',
  }[accent]
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-paprika' : 'text-ink-soft'
  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'
  return (
    <div className="bg-cream border-2 border-ink p-4 sm:p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className={`text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 ${accentBg}`}>{label}</span>
      </div>
      <div className="font-display text-3xl sm:text-4xl text-ink leading-none tabular-nums">{value}</div>
      {delta && <div className={`text-xs font-semibold ${trendColor}`}>{trendArrow} {delta}</div>}
    </div>
  )
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-cream border-2 border-ink ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, actions }: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b-2 border-ink/15">
      <div>
        <h2 className="font-display text-lg text-ink leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-ink-soft mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  )
}
