import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutGrid, Radio, CalendarDays, Users, MonitorSmartphone, UserCog, Layers, BarChart3, Bell, Settings, Search,
  Monitor, Plus, Menu, X, ChevronDown, LogOut, Smartphone, Command, HelpCircle,
} from 'lucide-react'
import { useBusinessQueue } from '../../context/BusinessQueue'
import { Avatar, Button, LiveDot, Logo } from '../../components/ui/primitives'
import { Modal } from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'
import { businessServices } from '../../data/mock'
import { cn } from '../../lib/cn'

const nav = [
  { to: '/business', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/business/live', label: 'Live Queue', icon: Radio, badge: 'live' },
  { to: '/business/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/business/customers', label: 'Customers', icon: Users },
  { to: '/business/counters', label: 'Counters', icon: MonitorSmartphone },
  { to: '/business/staff', label: 'Staff', icon: UserCog },
  { to: '/business/services', label: 'Services', icon: Layers },
  { to: '/business/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/business/notifications', label: 'Notifications', icon: Bell, count: 3 },
  { to: '/business/settings', label: 'Settings', icon: Settings },
]

export function WalkInModal({ open, onClose }) {
  const { addWalkIn } = useBusinessQueue()
  const [form, setForm] = useState({ customer: '', phone: '', service: businessServices[0], priority: 'none', party: 1 })
  const submit = () => {
    addWalkIn(form)
    setForm({ customer: '', phone: '', service: businessServices[0], priority: 'none', party: 1 })
    onClose()
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add walk-in customer"
      subtitle="Issue a token for someone at the front desk."
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={submit}>Issue token</Button></>}
    >
      <div className="space-y-4">
        <label className="block">
          <span className="text-xs font-semibold text-ink-500">Customer name</span>
          <input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} placeholder="e.g. Rahima Begum" className="mt-1.5 w-full h-11 rounded-xl bg-canvas px-3.5 text-sm outline-none ring-1 ring-transparent focus:ring-brand-500 focus:bg-white transition" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-ink-500">Phone (optional, for SMS alerts)</span>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+880 1•••-••• •••" className="mt-1.5 w-full h-11 rounded-xl bg-canvas px-3.5 text-sm outline-none ring-1 ring-transparent focus:ring-brand-500 focus:bg-white transition" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold text-ink-500">Service</span>
            <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="mt-1.5 w-full h-11 rounded-xl bg-canvas px-3 text-sm outline-none focus:ring-1 focus:ring-brand-500">
              {businessServices.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-ink-500">Party size</span>
            <select value={form.party} onChange={(e) => setForm({ ...form, party: Number(e.target.value) })} className="mt-1.5 w-full h-11 rounded-xl bg-canvas px-3 text-sm outline-none focus:ring-1 focus:ring-brand-500">
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
            </select>
          </label>
        </div>
        <div>
          <span className="text-xs font-semibold text-ink-500">Priority</span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {[['none', 'Standard'], ['elderly', 'Elderly'], ['pregnant', 'Pregnant'], ['disabled', 'Disabled'], ['emergency', 'Emergency'], ['vip', 'VIP']].map(([k, l]) => (
              <button key={k} onClick={() => setForm({ ...form, priority: k })} className={cn('h-8 px-3 rounded-lg text-xs font-semibold transition', form.priority === k ? 'bg-ink text-white' : 'bg-canvas text-ink-600 hover:bg-ink-100')}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

function CommandPalette({ open, onClose }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const items = [
    ...nav.map((n) => ({ label: `Go to ${n.label}`, run: () => navigate(n.to), icon: n.icon })),
    { label: 'Open TV display', run: () => navigate('/tv'), icon: Monitor },
    { label: 'Open customer app', run: () => navigate('/app'), icon: Smartphone },
  ].filter((i) => i.label.toLowerCase().includes(q.toLowerCase()))
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="-mt-12 flex items-center gap-2 h-12 rounded-2xl bg-canvas px-3.5 mr-10">
        <Search className="h-4 w-4 text-ink-400" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pages, tokens, customers…" className="flex-1 bg-transparent outline-none text-sm" />
      </div>
      <div className="mt-3 max-h-80 overflow-y-auto scrollbar-thin">
        {items.map((i) => (
          <button key={i.label} onClick={() => { i.run(); onClose(); setQ('') }} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-brand-50 hover:text-brand-700 text-left">
            <i.icon className="h-4 w-4 opacity-60" />{i.label}
          </button>
        ))}
        {items.length === 0 && <p className="text-sm text-ink-400 text-center py-8">No results for “{q}”</p>}
      </div>
    </Modal>
  )
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const toast = useToast()
  const { settings, byStatus } = useBusinessQueue()
  const [mobileNav, setMobileNav] = useState(false)
  const [walkIn, setWalkIn] = useState(false)
  const [cmd, setCmd] = useState(false)
  const [profile, setProfile] = useState(false)

  useEffect(() => setMobileNav(false), [pathname])
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmd(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const status = settings.closed ? { label: 'Queue Closed', color: 'bg-coral-500', cls: 'text-coral-600 bg-coral-50' } : settings.paused ? { label: 'Queue Paused', color: 'bg-amber-500', cls: 'text-amber-600 bg-amber-50' } : { label: 'Queue Active', color: 'bg-success-500', cls: 'text-success-600 bg-success-50' }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 h-[72px] flex items-center justify-between">
        <Link to="/"><Logo /></Link>
        <button className="lg:hidden h-9 w-9 rounded-xl grid place-items-center hover:bg-ink-100" onClick={() => setMobileNav(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
      </div>

      <button onClick={() => toast('Switch location', { body: 'CityCare Clinic has 1 location on this plan.', tone: 'info' })} className="mx-3 mb-4 flex items-center gap-3 rounded-2xl bg-canvas hover:bg-ink-100 p-2.5 text-left transition">
        <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white grid place-items-center text-xs font-bold">CC</span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-bold truncate">CityCare Clinic</span>
          <span className="block text-[11px] text-ink-400">Gulshan · Growth plan</span>
        </span>
        <ChevronDown className="h-4 w-4 text-ink-400" />
      </button>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-none">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              cn('group relative flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-semibold transition-all', isActive ? 'bg-ink text-white shadow-lift' : 'text-ink-500 hover:text-ink hover:bg-ink-100/70')
            }
          >
            {({ isActive }) => (
              <>
                <n.icon className={cn('h-[18px] w-[18px]', isActive ? 'text-mint-400' : 'text-ink-400 group-hover:text-ink')} />
                <span className="flex-1">{n.label}</span>
                {n.badge === 'live' && <span className={cn('num text-[11px] font-bold rounded-md px-1.5 py-0.5', isActive ? 'bg-white/15' : 'bg-brand-50 text-brand-700')}>{byStatus.waiting.length}</span>}
                {n.count && <span className="h-5 min-w-5 px-1 rounded-full bg-coral-500 text-white text-[10px] font-bold grid place-items-center">{n.count}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 space-y-2">
        <Link to="/tv" className="flex items-center gap-3 rounded-2xl bg-ink text-white p-3 hover:bg-ink-800 transition relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand-500/40 blur-2xl" />
          <span className="relative h-9 w-9 rounded-xl bg-white/10 grid place-items-center"><Monitor className="h-4 w-4 text-mint-400" /></span>
          <span className="relative text-sm">
            <span className="block font-bold">TV Display</span>
            <span className="block text-[11px] text-white/50">Waiting-room screen</span>
          </span>
        </Link>
        <Link to="/app" className="flex items-center gap-3 rounded-2xl p-3 hover:bg-ink-100 transition text-sm font-semibold text-ink-600">
          <Smartphone className="h-4 w-4" /> Customer app preview
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-canvas">
      {/* Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[260px] bg-white border-r border-ink-100 z-30">{sidebar}</aside>
      {mobileNav && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" onClick={() => setMobileNav(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] bg-white animate-slide-in-right shadow-lift">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-[260px]">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-[72px] bg-canvas/80 backdrop-blur-xl border-b border-ink-100/70">
          <div className="h-full px-4 sm:px-8 flex items-center gap-3">
            <button className="lg:hidden h-10 w-10 rounded-xl grid place-items-center bg-white shadow-soft" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
            <button onClick={() => setCmd(true)} className="hidden md:flex items-center gap-2.5 h-10 w-full max-w-sm rounded-xl bg-white shadow-soft px-3.5 text-sm text-ink-400 hover:text-ink-600 transition">
              <Search className="h-4 w-4" /> Search tokens, customers, pages…
              <span className="ml-auto inline-flex items-center gap-0.5 rounded-md bg-canvas px-1.5 py-0.5 text-[11px] font-semibold"><Command className="h-3 w-3" />K</span>
            </button>
            <div className="flex-1" />
            <span className={cn('hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-xl text-xs font-bold', status.cls)}>
              <LiveDot color={status.color} /> {status.label}
            </span>
            <Button size="sm" onClick={() => setWalkIn(true)} className="hidden sm:inline-flex"><Plus className="h-4 w-4" /> Add walk-in</Button>
            <Button size="icon" variant="primary" onClick={() => setWalkIn(true)} className="sm:hidden" aria-label="Add walk-in"><Plus className="h-4 w-4" /></Button>
            <Link to="/business/notifications" className="relative h-10 w-10 rounded-xl bg-white shadow-soft grid place-items-center hover:shadow-lift transition" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-coral-500 ring-2 ring-white" />
            </Link>
            <div className="relative">
              <button onClick={() => setProfile(!profile)} className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-white transition">
                <Avatar initials="NJ" gradient="from-ink-600 to-ink-800" />
                <ChevronDown className="h-4 w-4 text-ink-400 hidden sm:block" />
              </button>
              {profile && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfile(false)} />
                  <div className="absolute right-0 mt-2 w-60 z-20 rounded-2xl bg-white shadow-lift ring-1 ring-ink-100 p-2 animate-scale-in origin-top-right">
                    <div className="px-3 py-2.5 border-b border-ink-100 mb-1">
                      <p className="text-sm font-bold">Nusrat Jahan</p>
                      <p className="text-xs text-ink-400">Front desk admin</p>
                    </div>
                    {[[Settings, 'Account settings', '/business/settings'], [HelpCircle, 'Help center', null], [LogOut, 'Sign out', '/']].map(([I, l, to]) => (
                      to ? (
                        <Link key={l} to={to} onClick={() => setProfile(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium hover:bg-canvas"><I className="h-4 w-4 text-ink-400" />{l}</Link>
                      ) : (
                        <button key={l} onClick={() => { setProfile(false); toast('Help center opens in a new tab', { tone: 'info' }) }} className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium hover:bg-canvas"><I className="h-4 w-4 text-ink-400" />{l}</button>
                      )
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main key={pathname} className="px-4 sm:px-8 py-6 sm:py-8 max-w-[1440px] animate-fade-up">
          <Outlet context={{ openWalkIn: () => setWalkIn(true) }} />
        </main>
      </div>

      <WalkInModal open={walkIn} onClose={() => setWalkIn(false)} />
      <CommandPalette open={cmd} onClose={() => setCmd(false)} />
    </div>
  )
}
