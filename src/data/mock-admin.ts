// Mock data for the admin demo. Generated deterministically (seeded random)
// so the same dashboard renders consistently across reloads — important for
// screenshots and demos where you don't want numbers jumping around.
import { MENU } from './menu'
import type { MenuItem } from './menu'

/* ---------------------------------------------------------- */
/* SEEDED RANDOM                                              */
/* ---------------------------------------------------------- */
// Mulberry32 PRNG — small, deterministic, good enough for demo data.
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(42)
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]
const range = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min

/* ---------------------------------------------------------- */
/* ORDERS                                                     */
/* ---------------------------------------------------------- */
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'preparing',
  'ready',
  'completed',
  'cancelled',
]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready for pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-mustard text-ink',
  preparing: 'bg-teal text-ink',
  ready: 'bg-paprika text-cream',
  completed: 'bg-ink-soft text-cream',
  cancelled: 'bg-cream-deep text-ink-soft',
}

export type Order = {
  id: string
  customer: string
  status: OrderStatus
  items: { name: string; qty: number; price: number; mods?: string[] }[]
  subtotal: number
  tax: number
  total: number
  /** Minutes ago (for display). */
  placedAt: Date
  paymentMethod: 'card' | 'cash' | 'apple-pay' | 'google-pay'
}

const FIRST_NAMES = ['Olivia', 'Marcus', 'Priya', 'Jordan', 'Beatrice', 'Caleb', 'Sage', 'Tomás', 'Ines', 'Wyatt', 'Hazel', 'Felix', 'Amara', 'Dean', 'Lila', 'Otis', 'Mae', 'Rashid', 'Cordelia', 'Theo']
const LAST_NAMES  = ['Walker', 'Chen', 'Patel', 'Reyes', 'Okafor', 'Kim', 'Brennan', 'Vasquez', 'Holloway', 'Yamamoto', 'Garcia', 'Sutton', 'Diallo', 'Becker', 'Romano', 'Fitch', 'Zhang', 'Mendoza']

function genItems(count: number): Order['items'] {
  const items: Order['items'] = []
  for (let i = 0; i < count; i++) {
    const item = pick(MENU.filter((m) => !m.outOfStock)) as MenuItem
    const mods: string[] = []
    if (item.modifiers && rand() > 0.5) {
      // Pick 1-3 random modifiers
      const modCount = range(1, Math.min(3, item.modifiers.length))
      for (let j = 0; j < modCount; j++) {
        const group = item.modifiers[j % item.modifiers.length]
        const opt = pick(group.options)
        mods.push(`${group.label}: ${opt.label}`)
      }
    }
    items.push({
      name: item.name,
      qty: rand() < 0.85 ? 1 : range(2, 3),
      price: item.price,
      mods: mods.length ? mods : undefined,
    })
  }
  return items
}

/** Skew timestamps toward morning rush (7-10am) and lunch (11am-1pm).
 *  60% morning rush, 30% lunch, 10% sprinkled. */
function timestampForOrderIndex(): Date {
  const now = new Date()
  // Pick a day in the last 14 days
  const daysAgo = range(0, 13)
  const date = new Date(now)
  date.setDate(date.getDate() - daysAgo)

  const r = rand()
  let hour: number, minute: number
  if (r < 0.6) {
    // Morning rush 7-10am
    hour = range(7, 10)
    minute = range(0, 59)
  } else if (r < 0.9) {
    // Lunch 11am-1pm
    hour = range(11, 13)
    minute = range(0, 59)
  } else {
    // Off-peak 9am-1pm sprinkles + the occasional 6am opener
    hour = range(6, 13)
    minute = range(0, 59)
  }
  date.setHours(hour, minute, range(0, 59), 0)
  return date
}

export const MOCK_ORDERS: Order[] = (() => {
  const list: Order[] = []
  const TOTAL = 240
  for (let i = 0; i < TOTAL; i++) {
    const itemCount = rand() < 0.6 ? 1 : rand() < 0.85 ? 2 : range(3, 5)
    const items = genItems(itemCount)
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0)
    const tax = subtotal * 0.07
    const total = subtotal + tax
    // Status distribution: most are completed; some live pending/preparing/ready
    let status: OrderStatus
    const r = rand()
    if (i < 8) {
      // Most recent batch — live queue
      status = (['pending', 'preparing', 'ready'] as const)[i % 3]
    } else if (r < 0.92) status = 'completed'
    else if (r < 0.97) status = 'cancelled'
    else status = pick(['pending', 'preparing', 'ready'])

    list.push({
      id: `DDB-${(10000 + i).toString()}`,
      customer: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)[0]}.`,
      status,
      items,
      subtotal: +subtotal.toFixed(2),
      tax: +tax.toFixed(2),
      total: +total.toFixed(2),
      placedAt: i < 8 ? new Date(Date.now() - i * 60 * 1000 * range(2, 18)) : timestampForOrderIndex(),
      paymentMethod: pick(['card', 'card', 'card', 'apple-pay', 'cash', 'google-pay']),
    })
  }
  return list.sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime())
})()

/* ---------------------------------------------------------- */
/* CUSTOMERS                                                  */
/* ---------------------------------------------------------- */
export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  lifetimeSpend: number
  lastVisit: Date
  loyaltyPoints: number
  /** Top item this customer orders. */
  favoriteItem: string
  notes?: string
}

export const MOCK_CUSTOMERS: Customer[] = Array.from({ length: 32 }, (_, i) => {
  const fn = pick(FIRST_NAMES)
  const ln = pick(LAST_NAMES)
  const orderCount = range(1, 64)
  const fav = pick(MENU.filter((m) => !m.outOfStock)) as MenuItem
  const lifetime = +(orderCount * range(8, 22)).toFixed(2)
  return {
    id: `C-${1000 + i}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@email.com`,
    phone: `260-555-${(1000 + i * 7) % 10000}`.padEnd(12, '0'),
    totalOrders: orderCount,
    lifetimeSpend: lifetime,
    lastVisit: (() => {
      const d = new Date()
      d.setDate(d.getDate() - range(0, 90))
      return d
    })(),
    loyaltyPoints: orderCount * 10,
    favoriteItem: fav.name,
    notes: i % 7 === 0 ? 'Regular — knows the staff by name.' : undefined,
  }
})

/* ---------------------------------------------------------- */
/* EVENTS                                                     */
/* ---------------------------------------------------------- */
export type ShopEvent = {
  id: string
  title: string
  type: 'art-show' | 'open-mic' | 'workshop' | 'tasting' | 'community' | 'live-music'
  date: Date
  startTime: string
  endTime: string
  description: string
  rsvps: number
  capacity: number
}

export const EVENT_TYPE_LABELS: Record<ShopEvent['type'], string> = {
  'art-show': 'Art Show',
  'open-mic': 'Open Mic',
  workshop: 'Workshop',
  tasting: 'Tasting',
  community: 'Community',
  'live-music': 'Live Music',
}

export const EVENT_TYPE_COLORS: Record<ShopEvent['type'], string> = {
  'art-show': 'bg-paprika/15 text-paprika border-paprika/30',
  'open-mic': 'bg-mustard/30 text-ink border-mustard',
  workshop: 'bg-teal/20 text-teal-deep border-teal/40',
  tasting: 'bg-cream-deep text-ink border-ink/30',
  community: 'bg-paprika/15 text-paprika border-paprika/30',
  'live-music': 'bg-mustard/30 text-ink border-mustard',
}

export const MOCK_EVENTS: ShopEvent[] = [
  { id: 'ev-1', title: '"Steam & Ink" — Local Print Show Opening', type: 'art-show', date: addDays(new Date(), 3), startTime: '6:00 PM', endTime: '9:00 PM', description: 'Featuring 8 Fort Wayne printmakers. Free wine, $4 small bites.', rsvps: 47, capacity: 60 },
  { id: 'ev-2', title: 'Open Mic Mondays', type: 'open-mic', date: addDays(new Date(), 5), startTime: '7:00 PM', endTime: '10:00 PM', description: 'Sign-ups at 6:30. Five-minute slots. Bring a poem, a song, a complaint.', rsvps: 23, capacity: 40 },
  { id: 'ev-3', title: 'Bagel Boil 101', type: 'workshop', date: addDays(new Date(), 7), startTime: '10:00 AM', endTime: '12:30 PM', description: 'Hands-on workshop. Take home a half-dozen of your own. $40/seat.', rsvps: 12, capacity: 12 },
  { id: 'ev-4', title: 'Lox & Lavender Tasting', type: 'tasting', date: addDays(new Date(), 10), startTime: '5:30 PM', endTime: '7:00 PM', description: 'Five lox preparations, paired with house lavender lemonade.', rsvps: 18, capacity: 30 },
  { id: 'ev-5', title: 'Broadway Arts Walk', type: 'community', date: addDays(new Date(), 14), startTime: '4:00 PM', endTime: '8:00 PM', description: 'Late-Friday gallery hop. Davey’s is stop #4 on the route.', rsvps: 0, capacity: 200 },
  { id: 'ev-6', title: 'Acoustic Sundays — Una Reyes', type: 'live-music', date: addDays(new Date(), 18), startTime: '11:00 AM', endTime: '1:00 PM', description: 'Local songwriter, 2-set brunch performance.', rsvps: 31, capacity: 45 },
  { id: 'ev-7', title: '"Coffee + Color" — Watercolor Class', type: 'workshop', date: addDays(new Date(), 21), startTime: '9:00 AM', endTime: '11:00 AM', description: 'BYO sketchbook. Coffee + bagel included. $35/seat.', rsvps: 9, capacity: 16 },
  { id: 'ev-8', title: 'Davey’s Birthday Block Party', type: 'community', date: addDays(new Date(), 28), startTime: '12:00 PM', endTime: '6:00 PM', description: 'Free bagels, live music, kids’ chalk art. The neighborhood comes out.', rsvps: 88, capacity: 300 },
]

function addDays(d: Date, days: number): Date {
  const out = new Date(d)
  out.setDate(out.getDate() + days)
  return out
}

/* ---------------------------------------------------------- */
/* DAILY REVENUE (last 30 days)                               */
/* ---------------------------------------------------------- */
export type DailyRevenue = {
  date: Date
  revenue: number
  orderCount: number
  /** Mon=1...Sun=7 */
  weekday: number
}

export const DAILY_REVENUE: DailyRevenue[] = (() => {
  const out: DailyRevenue[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    const wd = d.getDay() === 0 ? 7 : d.getDay()
    // Weekends slightly busier
    const baseOrders = wd >= 6 ? 130 : 95
    const noise = 0.7 + rand() * 0.6
    const orderCount = Math.floor(baseOrders * noise)
    const avgTicket = 9 + rand() * 5
    out.push({ date: d, revenue: +(orderCount * avgTicket).toFixed(2), orderCount, weekday: wd })
  }
  return out
})()

/* ---------------------------------------------------------- */
/* EXPENSES (current month)                                   */
/* ---------------------------------------------------------- */
export type ExpenseCategory = {
  name: string
  amount: number
  /** % of total budget (for the bar/donut). */
  pctOfTotal: number
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { name: 'Food cost (ingredients)', amount: 8420.55, pctOfTotal: 0 },
  { name: 'Labor / payroll',          amount: 12880.00, pctOfTotal: 0 },
  { name: 'Rent',                     amount: 3200.00,  pctOfTotal: 0 },
  { name: 'Utilities',                amount: 980.42,   pctOfTotal: 0 },
  { name: 'Toast / Stripe fees',      amount: 1142.18,  pctOfTotal: 0 },
  { name: 'Coffee + supplies',        amount: 1620.00,  pctOfTotal: 0 },
  { name: 'Marketing',                amount: 410.00,   pctOfTotal: 0 },
  { name: 'Insurance',                amount: 760.00,   pctOfTotal: 0 },
  { name: 'Maintenance / repairs',    amount: 285.00,   pctOfTotal: 0 },
]

const TOTAL_EXPENSES = EXPENSE_CATEGORIES.reduce((s, c) => s + c.amount, 0)
EXPENSE_CATEGORIES.forEach((c) => (c.pctOfTotal = c.amount / TOTAL_EXPENSES))

/* ---------------------------------------------------------- */
/* TOP-LEVEL KPIs                                             */
/* ---------------------------------------------------------- */
export const MTD_REVENUE = +DAILY_REVENUE.reduce((s, d) => s + d.revenue, 0).toFixed(2)
export const MTD_ORDERS = DAILY_REVENUE.reduce((s, d) => s + d.orderCount, 0)
export const AVG_TICKET = +(MTD_REVENUE / MTD_ORDERS).toFixed(2)
export const NET_PROFIT = +(MTD_REVENUE - TOTAL_EXPENSES).toFixed(2)
export const PROFIT_MARGIN = +(NET_PROFIT / MTD_REVENUE).toFixed(3)

/* ---------------------------------------------------------- */
/* TOP ITEMS                                                  */
/* ---------------------------------------------------------- */
export type TopItem = {
  name: string
  unitsSold: number
  revenue: number
}

export const TOP_ITEMS: TopItem[] = [
  { name: 'Sausage, Egg & Cheese',     unitsSold: 412, revenue: 3914.00 },
  { name: 'The 07',                    unitsSold: 287, revenue: 3013.50 },
  { name: 'Latte',                     unitsSold: 268, revenue: 1340.00 },
  { name: 'Sunrise Special',           unitsSold: 244, revenue: 1525.00 },
  { name: 'Brewed Coffee — Union Blend', unitsSold: 231, revenue: 577.50 },
  { name: 'El Guapo',                  unitsSold: 198, revenue: 2277.00 },
  { name: 'Loxy Lady',                 unitsSold: 167, revenue: 2338.00 },
  { name: 'Beef Bacon Bandit',         unitsSold: 142, revenue: 1917.00 },
  { name: 'TinCaps Turkey',            unitsSold: 128, revenue: 1344.00 },
  { name: 'Cappuccino',                unitsSold: 119, revenue: 595.00 },
]

/* ---------------------------------------------------------- */
/* HOURLY HEATMAP (avg orders per hour, by weekday)           */
/* ---------------------------------------------------------- */
export const HOURS_OF_OPERATION = [7, 8, 9, 10, 11, 12, 13]
export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** [weekdayIndex][hourIndex] = avg order count. */
export const HOURLY_HEATMAP: number[][] = WEEKDAYS.map((_, wi) =>
  HOURS_OF_OPERATION.map((h) => {
    // Morning rush 7-10
    let base = h <= 10 ? 18 + (10 - h) * 4 : 12
    // Lunch bump
    if (h === 12) base = 22
    // Weekend mornings busier
    if (wi >= 5 && h <= 10) base += 8
    // Friday afternoon dies
    if (wi === 4 && h >= 12) base -= 4
    return Math.max(2, base + Math.round((rand() - 0.5) * 6))
  }),
)

/* ---------------------------------------------------------- */
/* SETTINGS DEFAULTS                                          */
/* ---------------------------------------------------------- */
export const DEFAULT_SETTINGS = {
  storeName: "Davey's Delicious Bagels",
  address: '1006 Broadway, Fort Wayne, IN 46802',
  phone: '(260) 555-DAVE',
  email: 'hello@daveysdeliciousbagels.com',
  taxRate: 0.07,
  hours: [
    { day: 'Mon', open: '7:00 AM', close: '2:00 PM' },
    { day: 'Tue', open: '7:00 AM', close: '2:00 PM' },
    { day: 'Wed', open: '7:00 AM', close: '2:00 PM' },
    { day: 'Thu', open: '7:00 AM', close: '2:00 PM' },
    { day: 'Fri', open: '7:00 AM', close: '2:00 PM' },
    { day: 'Sat', open: '8:00 AM', close: '2:00 PM' },
    { day: 'Sun', open: '8:00 AM', close: '1:00 PM' },
  ],
}
