import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, MapPin, Search, QrCode, Users, Clock, ArrowRight, SlidersHorizontal, Check, Navigation } from 'lucide-react'
import { businesses, categories, customer } from '../../data/mock'
import { useCustomerQueue } from '../../context/CustomerQueue'
import { Badge, BizLogo, Button, EmptyState, Skeleton, Stars } from '../../components/ui/primitives'
import { Modal } from '../../components/ui/Modal'
import Icon from '../../components/ui/Icon'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../lib/cn'

const locations = ['Gulshan 2, Dhaka', 'Banani, Dhaka', 'Dhanmondi, Dhaka', 'Uttara Sector 7, Dhaka']

export function BusinessCard({ b, wide }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/app/business/${b.id}`)}
      className={cn('group card p-4 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift shrink-0 snap-start', wide ? 'w-full' : 'w-[272px]')}
    >
      <div className="flex items-start gap-3">
        <BizLogo initials={b.initials} gradient={b.logoBg} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold tracking-tight truncate">{b.name}</h3>
          </div>
          <p className="text-xs text-ink-400 truncate">{b.categoryLabel}</p>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-500">
            <Stars value={b.rating} />
            <span className="h-1 w-1 rounded-full bg-ink-300" />
            <span className="inline-flex items-center gap-1"><Navigation className="h-3 w-3" />{b.distance}</span>
          </div>
        </div>
        <Badge tone={b.open ? 'success' : 'danger'} dot>{b.open ? 'Open' : 'Closed'}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-canvas px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 flex items-center gap-1"><Users className="h-3 w-3" /> Ahead</p>
          <p className="num text-lg font-bold mt-0.5">{b.ahead} <span className="text-xs font-medium text-ink-400 font-sans">people</span></p>
        </div>
        <div className="rounded-2xl bg-canvas px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 flex items-center gap-1"><Clock className="h-3 w-3" /> Wait</p>
          <p className="num text-lg font-bold mt-0.5">~{b.wait} <span className="text-xs font-medium text-ink-400 font-sans">min</span></p>
        </div>
      </div>

      <Button
        size="sm"
        variant={b.open ? 'primary' : 'secondary'}
        className="w-full mt-3"
        disabled={!b.open}
        onClick={(e) => { e.stopPropagation(); navigate(`/app/join/${b.id}`) }}
      >
        {b.open ? <>Join Queue <ArrowRight className="h-4 w-4" /></> : 'Opens 9:00 AM'}
      </Button>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="card p-4 w-[272px] shrink-0">
      <div className="flex gap-3"><Skeleton className="h-12 w-12 rounded-2xl" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div></div>
      <div className="grid grid-cols-2 gap-2 mt-4"><Skeleton className="h-14" /><Skeleton className="h-14" /></div>
      <Skeleton className="h-9 mt-3" />
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const toast = useToast()
  const { queue, notifications } = useCustomerQueue()
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState(null)
  const [openOnly, setOpenOnly] = useState(false)
  const [loc, setLoc] = useState(locations[0])
  const [locOpen, setLocOpen] = useState(false)
  const unread = notifications.filter((n) => n.unread).length

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 750)
    return () => clearTimeout(t)
  }, [])

  const list = businesses.filter((b) => (!cat || b.category === cat) && (!openOnly || b.open))

  return (
    <div className="animate-fade-in">
      {/* Top bar */}
      <div className="px-5 pt-4 flex items-center justify-between">
        <button onClick={() => setLocOpen(true)} className="flex items-center gap-2 group">
          <span className="h-10 w-10 rounded-2xl bg-white shadow-soft grid place-items-center text-brand-600"><MapPin className="h-[18px] w-[18px]" /></span>
          <span className="text-left">
            <span className="block text-[11px] text-ink-400 font-medium">Current location</span>
            <span className="flex items-center gap-1 text-sm font-bold">{loc}<ChevronDown className="h-4 w-4 text-ink-400 group-hover:text-ink transition" /></span>
          </span>
        </button>
        <Link to="/app/notifications" className="relative h-11 w-11 rounded-2xl bg-white shadow-soft grid place-items-center hover:shadow-lift transition" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unread > 0 && <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-coral-500 ring-2 ring-white" />}
        </Link>
      </div>

      {/* Hero */}
      <section className="px-5 pt-7">
        <p className="text-sm font-semibold text-ink-500">Good morning, {customer.first} <span className="inline-block origin-bottom-right animate-[float_3s_ease-in-out_infinite]">👋</span></p>
        <h1 className="mt-1.5 text-[34px] leading-[1.05] font-extrabold tracking-tight">
          Your time<br /><span className="text-gradient">matters.</span>
        </h1>
        <p className="mt-2 text-ink-500">Join a queue before you arrive.</p>

        <button onClick={() => navigate('/app/search')} className="mt-5 w-full h-14 rounded-[20px] bg-white shadow-soft ring-1 ring-ink-100 flex items-center gap-3 px-4 text-left text-ink-400 hover:ring-brand-200 hover:shadow-lift transition">
          <Search className="h-5 w-5 text-ink-500" />
          <span className="flex-1 text-[15px] truncate">Search clinic, salon, bank or service…</span>
          <span className="h-9 w-9 rounded-xl bg-ink text-white grid place-items-center"><SlidersHorizontal className="h-4 w-4" /></span>
        </button>
      </section>

      {/* Active queue */}
      {queue.active && (
        <section className="px-5 mt-5">
          <Link to="/app/track" className="relative block overflow-hidden rounded-[24px] bg-ink text-white p-5 shadow-lift group">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/50 blur-3xl" />
            <div className="absolute right-10 -bottom-10 h-32 w-32 rounded-full bg-mint-400/30 blur-3xl" />
            <div className="relative flex items-center justify-between">
              <Badge tone="glass"><span className="h-1.5 w-1.5 rounded-full bg-mint-400 animate-blink" /> Live · {queue.business}</Badge>
              <ArrowRight className="h-5 w-5 text-white/60 group-hover:translate-x-1 transition" />
            </div>
            <div className="relative mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-white/50">Your token</p>
                <p className="num text-5xl font-bold tracking-tight">{queue.token}</p>
              </div>
              <div className="text-right">
                <p className="num text-3xl font-bold">{queue.ahead}</p>
                <p className="text-xs text-white/50">people ahead · ~{queue.wait} min</p>
              </div>
            </div>
            <div className="relative mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-mint-400 transition-all duration-700" style={{ width: `${Math.max(6, (1 - queue.ahead / queue.total) * 100)}%` }} />
            </div>
          </Link>
        </section>
      )}

      {/* Categories */}
      <section className="mt-7">
        <div className="px-5 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Categories</h2>
          {cat && <button onClick={() => setCat(null)} className="text-xs font-semibold text-brand-600">Clear</button>}
        </div>
        <div className="mt-3 flex gap-2.5 overflow-x-auto scrollbar-none px-5 scroll-px-5 pb-1 snap-x">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(cat === c.id ? null : c.id)}
              className={cn('snap-start shrink-0 flex flex-col items-center gap-2 w-[76px] py-3 rounded-[20px] transition-all', cat === c.id ? 'bg-ink text-white shadow-lift' : 'bg-white shadow-soft hover:-translate-y-0.5')}
            >
              <span className={cn('h-10 w-10 rounded-2xl grid place-items-center', cat === c.id ? 'bg-white/10 text-mint-400' : c.tint)}>
                <Icon name={c.id === 'clinic' ? 'Stethoscope' : c.icon} className="h-5 w-5" />
              </span>
              <span className="text-[11px] font-semibold leading-tight text-center px-1">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Nearby */}
      <section className="mt-7">
        <div className="px-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Nearby now</h2>
            <p className="text-xs text-ink-400">Live wait times · updated seconds ago</p>
          </div>
          <button onClick={() => setOpenOnly((v) => !v)} className={cn('h-8 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition', openOnly ? 'bg-success-50 text-success-600' : 'bg-white shadow-soft text-ink-600')}>
            {openOnly && <Check className="h-3.5 w-3.5" />} Open now
          </button>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-none px-5 scroll-px-5 pb-3 snap-x snap-mandatory">
          {loading ? [0, 1].map((i) => <CardSkeleton key={i} />) : list.map((b) => <BusinessCard key={b.id} b={b} />)}
          {!loading && list.length === 0 && (
            <div className="card w-full">
              <EmptyState icon={Search} title="No open places here" body="Try another category or turn off “Open now”." action={<Button size="sm" variant="secondary" onClick={() => { setCat(null); setOpenOnly(false) }}>Reset filters</Button>} className="py-8" />
            </div>
          )}
        </div>
      </section>

      {/* QR */}
      <section className="px-5 mt-4">
        <button onClick={() => navigate('/app/scan')} className="w-full text-left relative overflow-hidden rounded-[24px] bg-gradient-to-br from-mint-50 to-brand-50 p-5 ring-1 ring-white hover:shadow-lift transition">
          <div className="flex items-center gap-4">
            <span className="h-14 w-14 rounded-2xl bg-white shadow-soft grid place-items-center text-brand-600"><QrCode className="h-7 w-7" /></span>
            <div className="flex-1">
              <p className="font-bold">At the entrance?</p>
              <p className="text-sm text-ink-500">Scan the QFlow code — no account needed.</p>
            </div>
            <ArrowRight className="h-5 w-5 text-ink-400" />
          </div>
        </button>
      </section>

      {/* Smart stat */}
      <section className="px-5 mt-4 grid grid-cols-2 gap-3">
        <Link to="/app/history" className="card p-4 hover:shadow-lift transition">
          <p className="text-xs text-ink-400 font-medium">Saved this month</p>
          <p className="num text-2xl font-bold mt-1">4h 32m</p>
          <p className="text-[11px] text-success-600 font-semibold mt-1">↑ 38% vs August</p>
        </Link>
        <button onClick={() => toast('Smart Arrival is on', { body: 'We’ll tell you exactly when to leave based on live traffic.', tone: 'info' })} className="card p-4 text-left hover:shadow-lift transition">
          <p className="text-xs text-ink-400 font-medium">Smart Arrival</p>
          <p className="text-2xl font-bold mt-1 flex items-center gap-2">On <span className="h-2 w-2 rounded-full bg-success-500 animate-blink" /></p>
          <p className="text-[11px] text-ink-400 mt-1">Leave-time alerts</p>
        </button>
      </section>

      <Modal open={locOpen} onClose={() => setLocOpen(false)} title="Choose location" subtitle="We’ll show live queues near you.">
        <div className="space-y-2">
          <button onClick={() => { setLoc('Gulshan 2, Dhaka'); setLocOpen(false); toast('Using your current location', { tone: 'info' }) }} className="w-full flex items-center gap-3 rounded-2xl p-3 bg-brand-50 text-brand-700 font-semibold text-sm">
            <Navigation className="h-4 w-4" /> Use current location
          </button>
          {locations.map((l) => (
            <button key={l} onClick={() => { setLoc(l); setLocOpen(false) }} className={cn('w-full flex items-center justify-between rounded-2xl p-3 text-sm font-semibold transition', loc === l ? 'bg-ink text-white' : 'hover:bg-ink-100')}>
              <span className="flex items-center gap-3"><MapPin className="h-4 w-4 opacity-60" />{l}</span>
              {loc === l && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
