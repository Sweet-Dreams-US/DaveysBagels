import { useState } from 'react'
import { PageHeader, Card, CardHeader } from '../Admin'
import { DEFAULT_SETTINGS } from '../../data/mock-admin'

export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [dirty, setDirty] = useState(false)

  function update<K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) {
    setSettings((s) => ({ ...s, [key]: value }))
    setDirty(true)
  }

  function updateHour(idx: number, field: 'open' | 'close', val: string) {
    setSettings((s) => ({
      ...s,
      hours: s.hours.map((h, i) => (i === idx ? { ...h, [field]: val } : h)),
    }))
    setDirty(true)
  }

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Store info, hours of operation, payment & integrations"
        actions={
          dirty ? (
            <>
              <button onClick={() => { setSettings(DEFAULT_SETTINGS); setDirty(false) }} className="bg-cream text-ink-soft px-4 py-2 text-xs font-semibold uppercase tracking-widest border-2 border-ink/30 hover:border-ink hover:text-ink">
                Discard
              </button>
              <button onClick={() => setDirty(false)} className="bg-ink text-cream px-4 py-2 text-xs font-semibold uppercase tracking-widest border-2 border-ink hover:bg-paprika transition-colors">
                Save Changes
              </button>
            </>
          ) : null
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Store info */}
        <Card>
          <CardHeader title="Store Information" />
          <div className="p-4 sm:p-5 space-y-3">
            <Field label="Store Name" value={settings.storeName} onChange={(v) => update('storeName', v)} />
            <Field label="Address" value={settings.address} onChange={(v) => update('address', v)} />
            <Field label="Phone" value={settings.phone} onChange={(v) => update('phone', v)} />
            <Field label="Email" value={settings.email} onChange={(v) => update('email', v)} type="email" />
            <Field label="Sales Tax Rate" value={(settings.taxRate * 100).toFixed(2)} onChange={(v) => update('taxRate', parseFloat(v) / 100)} suffix="%" />
          </div>
        </Card>

        {/* Hours */}
        <Card>
          <CardHeader title="Hours of Operation" />
          <div className="p-4 sm:p-5 space-y-2">
            {settings.hours.map((h, i) => (
              <div key={h.day} className="grid grid-cols-[60px_1fr_auto_1fr] items-center gap-2">
                <div className="text-sm font-bold uppercase tracking-wider">{h.day}</div>
                <input
                  value={h.open}
                  onChange={(e) => updateHour(i, 'open', e.target.value)}
                  className="bg-cream-deep border-2 border-ink/20 hover:border-ink focus:border-ink px-2 py-1.5 text-sm tabular-nums focus:outline-none"
                />
                <span className="text-ink-soft text-xs">→</span>
                <input
                  value={h.close}
                  onChange={(e) => updateHour(i, 'close', e.target.value)}
                  className="bg-cream-deep border-2 border-ink/20 hover:border-ink focus:border-ink px-2 py-1.5 text-sm tabular-nums focus:outline-none"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Integrations */}
        <Card className="lg:col-span-2">
          <CardHeader title="Integrations" subtitle="Connected services" />
          <div className="divide-y divide-ink/10">
            {INTEGRATIONS.map((it) => (
              <div key={it.name} className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold">{it.name}</div>
                  <div className="text-xs text-ink-soft mt-0.5">{it.purpose}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${it.connected ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-cream-deep text-ink-soft border border-ink/20'}`}>
                    {it.connected ? 'Connected' : 'Not connected'}
                  </span>
                  <button className={`text-xs font-semibold uppercase tracking-widest px-3 py-1.5 border-2 ${it.connected ? 'bg-cream border-ink/30 hover:border-ink text-ink-soft hover:text-ink' : 'bg-ink text-cream border-ink hover:bg-paprika'}`}>
                    {it.connected ? 'Manage' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}

function Field({ label, value, onChange, suffix, type = 'text' }: {
  label: string
  value: string
  onChange: (v: string) => void
  suffix?: string
  type?: string
}) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-widest text-ink-soft font-semibold mb-1">{label}</div>
      <div className="flex items-center border-2 border-ink/20 hover:border-ink focus-within:border-ink bg-cream-deep">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
        />
        {suffix && <span className="px-3 text-ink-soft text-sm">{suffix}</span>}
      </div>
    </label>
  )
}

const INTEGRATIONS: { name: string; purpose: string; connected: boolean }[] = [
  { name: 'Toast POS', purpose: 'Order routing + kitchen display + receipt printing', connected: true },
  { name: 'Stripe', purpose: 'Online card processing + payouts', connected: true },
  { name: 'Square', purpose: 'In-store card readers', connected: true },
  { name: 'Mailchimp', purpose: 'Customer email marketing', connected: false },
  { name: 'Gusto', purpose: 'Payroll + benefits', connected: true },
  { name: 'QuickBooks', purpose: 'Accounting + tax filing', connected: true },
  { name: 'Avalara', purpose: 'Automated sales tax filing', connected: false },
  { name: 'Resy', purpose: 'Event reservation management', connected: false },
  { name: 'Instagram Business', purpose: 'Social posting + auto-tag products', connected: true },
  { name: 'Google Business Profile', purpose: 'Hours, reviews, posts on Google search', connected: true },
]
