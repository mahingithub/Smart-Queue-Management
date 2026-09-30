import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Play, Check, Plus, Minus, QrCode, Radio, MapPin, BellRing, Users, Timer, Sparkles, Menu, X,
  Smartphone, MessageCircle, Mail, Snowflake, UsersRound, Accessibility, Car, PhoneCall, CheckCircle2, Star, Monitor, ShieldCheck, Zap, Globe,
} from 'lucide-react'
import { Badge, Button, Logo, Avatar, Segmented, LiveDot } from '../components/ui/primitives'
import OrbitalRing from '../components/ui/OrbitalRing'
import Icon from '../components/ui/Icon'
import { AreaChart, BarChart, SERIES } from '../components/charts/Charts'
import { Modal } from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { faqs, hourlyVolume, industries, monthTrend, pricing, testimonials } from '../data/mock'
import { cn } from '../lib/cn'

const navLinks = [
  ['How it works', '#how'],
  ['Customers', '#customer'],
  ['Business', '#business'],
  ['Analytics', '#analytics'],
  ['Pricing', '#pricing'],
  ['FAQ', '#faq'],
]

function useScrolled() {
  const [s, setS] = useState(false)
  useEffect(() => {
    const on = () => setS(window.scrollY > 10)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return s
}

function SignupModal({ open, onClose }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [biz, setBiz] = useState('Clinic')
  const valid = /\S+@\S+\.\S+/.test(email)
  return (
    <Modal open={open} onClose={onClose} title="Start free with QFlow" subtitle="Set up your first live queue in under 5 minutes.">
      <div className="space-y-4">
        <label className="block">
          <span className="text-xs font-semibold text-ink-500">Work email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" className="mt-1.5 w-full h-12 rounded-xl bg-canvas px-4 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition" />
          {email && !valid && <span className="text-xs text-coral-600 mt-1.5 block">Please enter a valid email.</span>}
        </label>
        <div>
          <span className="text-xs font-semibold text-ink-500">Business type</span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {['Clinic', 'Bank', 'Salon', 'Diagnostics', 'Government', 'Restaurant', 'Other'].map((b) => (
              <button key={b} onClick={() => setBiz(b)} className={cn('h-9 px-3.5 rounded-xl text-xs font-semibold transition', biz === b ? 'bg-ink text-white' : 'bg-canvas hover:bg-ink-100')}>{b}</button>
            ))}
          </div>
        </div>
        <Button size="lg" className="w-full" disabled={!valid} onClick={() => { onClose(); toast('Workspace created 🎉', { body: 'Welcome to QFlow — here’s your dashboard.', tone: 'success' }); navigate('/business') }}>
          Create my workspace <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="text-[11px] text-ink-400 text-center">Free forever on Starter · No credit card required</p>
      </div>
    </Modal>
  )
}

/* ---------------- Hero visuals ---------------- */

function MiniDashboard() {
  const cols = [
    { t: 'Waiting', c: 'bg-brand-500', items: [['A-031', 'Alex Rahman', 'Consultation'], ['A-032', 'Sadia Karim', 'Skin'], ['A-033', 'Rafiq Ahmed', 'Consultation']] },
    { t: 'Called', c: 'bg-amber-500', items: [['A-029', 'Priya Sen', 'Dental'], ['A-030', 'Omar Faruk', 'VIP']] },
    { t: 'Serving', c: 'bg-success-500', items: [['A-027', 'Counter 1', 'Nadia Islam'], ['A-028', 'Counter 2', 'Tanvir H.']] },
  ]
  return (
    <div className="rounded-[26px] bg-white shadow-lift ring-1 ring-ink-100 overflow-hidden">
      <div className="h-10 flex items-center gap-1.5 px-4 border-b border-ink-100 bg-canvas/60">
        <span className="h-2.5 w-2.5 rounded-full bg-coral-500/70" /><span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" /><span className="h-2.5 w-2.5 rounded-full bg-success-500/70" />
        <span className="mx-auto h-5 w-56 rounded-md bg-white text-[10px] text-ink-400 grid place-items-center">app.qflow.io/citycare/live</span>
      </div>
      <div className="flex">
        <div className="hidden sm:flex w-40 border-r border-ink-100 p-3 flex-col gap-1">
          <Logo size="sm" className="mb-3 scale-90 origin-left" />
          {['Overview', 'Live Queue', 'Appointments', 'Counters', 'Analytics'].map((l, i) => (
            <span key={l} className={cn('h-7 rounded-lg px-2.5 text-[11px] font-semibold flex items-center', i === 1 ? 'bg-ink text-white' : 'text-ink-400')}>{l}</span>
          ))}
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-ink-400">Good morning,</p>
              <p className="text-sm font-extrabold tracking-tight">CityCare Clinic</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-success-50 text-success-600 text-[10px] font-bold px-2 py-1"><LiveDot /> Queue Active</span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[['42', 'Waiting'], ['18m', 'Avg wait'], ['184', 'Served'], ['4.8%', 'No-show']].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-canvas p-2">
                <p className="num text-base font-bold leading-none">{v}</p>
                <p className="text-[9px] text-ink-400 mt-1">{l}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {cols.map((col) => (
              <div key={col.t} className="rounded-xl bg-ink-100/60 p-1.5">
                <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1 pb-1.5"><span className={cn('h-1.5 w-1.5 rounded-full', col.c)} />{col.t}</p>
                <div className="space-y-1.5">
                  {col.items.map(([tk, a, b], i) => (
                    <div key={tk} className={cn('rounded-lg bg-white p-1.5 shadow-soft', col.t === 'Waiting' && i === 0 && 'ring-2 ring-brand-500')}>
                      <p className="num text-[11px] font-bold">{tk}</p>
                      <p className="text-[8.5px] text-ink-400 truncate">{a} · {b}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniPhone({ className }) {
  return (
    <div className={cn('w-[230px] rounded-[40px] bg-ink p-[7px] shadow-[0_40px_80px_-20px_rgba(11,16,38,0.5)]', className)}>
      <div className="relative rounded-[34px] bg-canvas overflow-hidden h-[460px]">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-5 w-20 rounded-full bg-ink z-10" />
        <div className="pt-10 px-4">
          <p className="text-[10px] text-ink-400 font-semibold">CityCare Clinic</p>
          <p className="text-sm font-extrabold tracking-tight">General Consultation</p>
        </div>
        <div className="flex justify-center -mt-1">
          <OrbitalRing token="A-031" ahead={7} total={12} serving="A-024" size={200} />
        </div>
        <div className="px-4 text-center -mt-1">
          <p className="text-sm font-extrabold">7 people ahead</p>
          <p className="text-[10px] text-ink-500">Estimated turn 11:40 AM · 18 min</p>
        </div>
        <div className="mx-3 mt-3 rounded-2xl bg-ink text-white p-3 flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg bg-mint-400 text-ink grid place-items-center"><Car className="h-3.5 w-3.5" /></span>
          <p className="text-[10px] leading-tight">Leave home in approximately <b className="text-mint-400">8 minutes</b>.</p>
        </div>
        <div className="mx-3 mt-2 h-9 rounded-xl bg-brand-gradient text-white text-[11px] font-bold grid place-items-center">I’m on my way</div>
      </div>
    </div>
  )
}

function FloatingChip({ className, icon: I, title, body, tone = 'brand' }) {
  const tones = { brand: 'bg-brand-600 text-white', mint: 'bg-mint-400 text-ink', amber: 'bg-amber-500 text-white', success: 'bg-success-500 text-white' }
  return (
    <div className={cn('absolute glass shadow-lift rounded-2xl p-3 pr-4 flex items-center gap-3 animate-float', className)}>
      <span className={cn('h-9 w-9 rounded-xl grid place-items-center shrink-0', tones[tone])}><I className="h-4 w-4" /></span>
      <div>
        <p className="text-xs font-bold whitespace-nowrap">{title}</p>
        <p className="text-[10px] text-ink-500 whitespace-nowrap">{body}</p>
      </div>
    </div>
  )
}

function SectionHead({ eyebrow, title, body, center, dark }) {
  return (
    <div className={cn('max-w-2xl', center && 'mx-auto text-center')}>
      <p className={cn('text-xs font-bold uppercase tracking-[0.2em]', dark ? 'text-mint-400' : 'text-brand-600')}>{eyebrow}</p>
      <h2 className={cn('mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]', dark && 'text-white')}>{title}</h2>
      {body && <p className={cn('mt-4 text-lg leading-relaxed', dark ? 'text-white/60' : 'text-ink-500')}>{body}</p>}
    </div>
  )
}

/* ---------------- Page ---------------- */

export default function Landing() {
  const scrolled = useScrolled()
  const toast = useToast()
  const [menu, setMenu] = useState(false)
  const [signup, setSignup] = useState(false)
  const [billing, setBilling] = useState('yearly')
  const [faq, setFaq] = useState(0)
  const [tIdx, setTIdx] = useState(0)
  const [notifStep, setNotifStep] = useState(0)

  useEffect(() => {
    const i = setInterval(() => setNotifStep((s) => (s + 1) % 4), 2600)
    return () => clearInterval(i)
  }, [])

  const notifs = [
    { t: 'Only 5 people are ahead of you.', b: 'CityCare Clinic · ~12 min', i: Users, c: 'bg-brand-50 text-brand-600' },
    { t: 'You’re almost there.', b: '3 people ahead — time to leave', i: MapPin, c: 'bg-mint-50 text-mint-600' },
    { t: 'You’re next!', b: 'Head to the waiting area', i: BellRing, c: 'bg-amber-50 text-amber-600' },
    { t: 'It’s your turn — please proceed to Counter 03.', b: 'Token A-031', i: CheckCircle2, c: 'bg-success-50 text-success-600' },
  ]

  return (
    <div className="bg-canvas overflow-x-hidden">
      {/* NAV */}
      <header className={cn('fixed top-0 inset-x-0 z-50 transition-all duration-300', scrolled ? 'py-2' : 'py-4')}>
        <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 transition-all')}>
          <div className={cn('flex items-center justify-between h-14 rounded-2xl px-3 sm:px-4 transition-all duration-300', scrolled && 'glass shadow-soft')}>
            <Link to="/"><Logo /></Link>
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(([l, h]) => <a key={l} href={h} className="px-3.5 h-9 rounded-xl text-sm font-semibold text-ink-500 hover:text-ink hover:bg-white/70 grid place-items-center transition">{l}</a>)}
            </nav>
            <div className="flex items-center gap-2">
              <Link to="/business" className="hidden sm:inline-flex h-10 px-4 rounded-xl text-sm font-semibold text-ink-600 hover:text-ink items-center">Sign in</Link>
              <Button size="sm" className="hidden sm:inline-flex" onClick={() => setSignup(true)}>Start Free</Button>
              <button className="lg:hidden h-10 w-10 rounded-xl bg-white shadow-soft grid place-items-center" onClick={() => setMenu(!menu)} aria-label="Menu">{menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
            </div>
          </div>
          {menu && (
            <div className="lg:hidden mt-2 card p-3 animate-scale-in origin-top">
              {navLinks.map(([l, h]) => <a key={l} href={h} onClick={() => setMenu(false)} className="block px-3 py-3 rounded-xl text-sm font-semibold hover:bg-canvas">{l}</a>)}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button variant="secondary" to="/business">Sign in</Button>
                <Button onClick={() => { setMenu(false); setSignup(true) }}>Start Free</Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-32 sm:pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-aurora" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_65%)]" />
        {/* orbital rings backdrop */}
        <div className="absolute left-1/2 top-[520px] -translate-x-1/2 h-[1100px] w-[1100px] rounded-full border border-brand-200/60 pointer-events-none" />
        <div className="absolute left-1/2 top-[640px] -translate-x-1/2 h-[860px] w-[860px] rounded-full border border-brand-200/50 pointer-events-none" />
        <div className="absolute left-1/2 top-[520px] -translate-x-1/2 h-[1100px] w-[1100px] animate-orbit-slow pointer-events-none">
          <span className="absolute left-1/2 -top-1.5 h-3 w-3 rounded-full bg-mint-400 shadow-glow-mint" />
          <span className="absolute left-[14%] top-[14%] h-2 w-2 rounded-full bg-brand-400" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <button onClick={() => setSignup(true)} className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur shadow-soft ring-1 ring-ink-100 pl-1.5 pr-3.5 py-1.5 text-xs font-semibold animate-fade-up hover:shadow-lift transition">
            <span className="rounded-full bg-brand-gradient text-white px-2.5 py-1 flex items-center gap-1"><Sparkles className="h-3 w-3" /> New</span>
            AI Queue Assistant is live
            <ArrowRight className="h-3.5 w-3.5 text-ink-400" />
          </button>
          <h1 className="mt-7 text-[44px] leading-[0.98] sm:text-7xl lg:text-[92px] font-extrabold tracking-[-0.04em] animate-fade-up [animation-delay:80ms]">
            Waiting should<br />happen <span className="relative inline-block"><span className="text-gradient">virtually.</span>
              <svg className="absolute -bottom-2 sm:-bottom-3 left-0 w-full" viewBox="0 0 300 16" fill="none" preserveAspectRatio="none"><path d="M3 12C60 4 150 2 297 9" stroke="url(#u)" strokeWidth="5" strokeLinecap="round" /><defs><linearGradient id="u" x1="0" x2="1"><stop stopColor="#6D4AFF" /><stop offset="1" stopColor="#2EE6C5" /></linearGradient></defs></svg>
            </span>
          </h1>
          <p className="mt-7 mx-auto max-w-2xl text-lg sm:text-xl text-ink-500 leading-relaxed animate-fade-up [animation-delay:160ms]">
            QFlow lets customers join the queue from anywhere while businesses manage every customer in real time.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up [animation-delay:240ms]">
            <Button size="lg" onClick={() => setSignup(true)} className="w-full sm:w-auto">Start Free <ArrowRight className="h-5 w-5" /></Button>
            <Button size="lg" variant="secondary" to="/demo" className="w-full sm:w-auto"><span className="h-7 w-7 rounded-full bg-ink text-white grid place-items-center -ml-2"><Play className="h-3 w-3 fill-white" /></span> See Live Demo</Button>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-ink-500 animate-fade-up [animation-delay:300ms]">
            <div className="flex -space-x-2">
              {['from-brand-400 to-brand-600', 'from-mint-400 to-mint-600', 'from-coral-500 to-amber-500', 'from-amber-500 to-coral-500'].map((g, i) => <Avatar key={i} initials={['SK', 'IR', 'CD', 'MH'][i]} gradient={g} className="ring-2 ring-canvas h-8 w-8 text-[10px]" />)}
            </div>
            <span><b className="text-ink">1,200+ businesses</b> · 3.4M hours of waiting saved</span>
          </div>

          {/* Visual */}
          <div className="relative mt-16 sm:mt-20 mx-auto max-w-5xl animate-fade-up [animation-delay:380ms]">
            <div className="absolute -inset-x-10 -inset-y-6 bg-brand-500/15 blur-3xl rounded-full" />
            <div className="relative sm:mr-24 lg:mr-40 text-left">
              <MiniDashboard />
            </div>
            <div className="absolute -right-2 sm:right-0 lg:-right-6 -bottom-16 sm:-bottom-20 scale-[0.62] sm:scale-90 lg:scale-100 origin-bottom-right z-10"><MiniPhone className="animate-float" /></div>
            <FloatingChip className="hidden md:flex -left-12 -top-8 text-left" icon={BellRing} title="Only 3 people ahead" body="Time to leave · 7 min drive" tone="brand" />
            <FloatingChip className="hidden md:flex left-[34%] -bottom-10 text-left [animation-delay:2s]" icon={PhoneCall} title="A-029 → Counter 03" body="Called via push & SMS" tone="mint" />
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <section className="pt-20 pb-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-ink-400">Replacing waiting rooms at</p>
        <div className="mt-6 relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((k) => (
              <div key={k} className="flex items-center gap-14 pr-14">
                {['CityCare', 'Meridian Bank', 'Lumière', 'Precision Dx', 'FixHub', 'Saffron Table', 'NorthStar Health', 'Civic One', 'Apex Motors', 'Bloom Dental'].map((n) => (
                  <span key={n} className="font-display text-2xl font-bold text-ink-300 whitespace-nowrap tracking-tight">{n}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PROMISES */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { n: '01', t: 'No physical waiting.', b: 'Customers join from home, the car or the café next door — and arrive when it’s almost their turn.', stat: '−63%', sl: 'lobby crowding', i: MapPin },
            { n: '02', t: 'Always know when.', b: 'A live orbital tracker, precise ETAs and smart alerts. No guessing, no anxiety, no missed turns.', stat: '±2 min', sl: 'ETA accuracy', i: Radio },
            { n: '03', t: 'One screen to run it all.', b: 'Queues, counters, staff, appointments and walk-ins — controlled from a single live dashboard.', stat: '2.6×', sl: 'faster service', i: Monitor },
          ].map((p, i) => (
            <div key={p.n} className={cn('relative rounded-[28px] p-7 overflow-hidden group transition-all hover:-translate-y-1', i === 1 ? 'bg-ink text-white shadow-lift' : 'bg-white shadow-soft hover:shadow-lift')}>
              {i === 1 && <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/40 blur-3xl" />}
              <div className="relative flex items-center justify-between">
                <span className={cn('h-12 w-12 rounded-2xl grid place-items-center', i === 1 ? 'bg-white/10 text-mint-400' : 'bg-brand-50 text-brand-600')}><p.i className="h-6 w-6" /></span>
                <span className={cn('num text-sm font-bold', i === 1 ? 'text-white/30' : 'text-ink-200')}>{p.n}</span>
              </div>
              <h3 className="relative mt-8 text-2xl font-extrabold tracking-tight">{p.t}</h3>
              <p className={cn('relative mt-2 leading-relaxed', i === 1 ? 'text-white/60' : 'text-ink-500')}>{p.b}</p>
              <div className={cn('relative mt-8 pt-5 border-t flex items-baseline gap-2', i === 1 ? 'border-white/10' : 'border-ink-100')}>
                <span className={cn('num text-4xl font-bold', i === 1 && 'text-mint-400')}>{p.stat}</span>
                <span className={cn('text-sm', i === 1 ? 'text-white/50' : 'text-ink-400')}>{p.sl}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-16 sm:py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead center eyebrow="How it works" title={<>Four steps. <span className="text-gradient">Zero waiting rooms.</span></>} body="Simple enough for a first-time user, powerful enough for a 40-counter bank branch." />
          <div className="relative mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="hidden lg:block absolute top-[46px] left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-mint-400" />
            {[
              { i: QrCode, t: 'Scan or search', b: 'Scan the QR at the entrance or find the business in the app. No account needed.' },
              { i: CheckCircle2, t: 'Join queue', b: 'Pick a service, party size and walk-in or scheduled visit. Get a digital token.' },
              { i: Radio, t: 'Track live progress', b: 'Watch your place move in real time with precise wait estimates.' },
              { i: MapPin, t: 'Arrive when it’s almost your turn', b: 'Smart Arrival tells you exactly when to leave. Walk straight in.' },
            ].map((s, i) => (
              <div key={s.t} className="relative text-center px-4">
                <div className="relative mx-auto h-[92px] w-[92px] rounded-[28px] bg-white shadow-lift grid place-items-center">
                  <s.i className="h-9 w-9 text-brand-600" />
                  <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-ink text-white num text-sm font-bold grid place-items-center ring-4 ring-canvas">{i + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-extrabold tracking-tight">{s.t}</h3>
                <p className="mt-2 text-ink-500 leading-relaxed">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER EXPERIENCE */}
      <section id="customer" className="py-16 sm:py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <SectionHead eyebrow="Customer experience" title={<>The queue lives in <span className="text-gradient">their pocket.</span></>} body="A mobile-first PWA that feels like a premium airline app — tokens, live tracking and boarding-pass style queue passes." />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                [Car, 'Smart Arrival', 'Calculates when to leave based on live position and traffic.'],
                [Snowflake, 'Queue Freeze', 'Running late? Pause your place once, if the business allows.'],
                [UsersRound, 'Group Queue', 'Families and groups hold one place together.'],
                [Accessibility, 'Priority Queue', 'Elderly, pregnant, disabled and emergency lanes.'],
              ].map(([I, t, b]) => (
                <div key={t} className="rounded-[22px] bg-white p-5 shadow-soft hover:shadow-lift transition">
                  <I className="h-6 w-6 text-brand-600" />
                  <p className="mt-3 font-bold">{t}</p>
                  <p className="mt-1 text-sm text-ink-500 leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
            <Button variant="dark" size="lg" to="/app" className="mt-8">Try the customer app <ArrowRight className="h-5 w-5" /></Button>
          </div>
          <div className="relative h-[560px] flex items-center justify-center">
            <div className="absolute inset-10 rounded-full bg-gradient-to-br from-brand-200/60 to-mint-100 blur-2xl" />
            <div className="absolute h-[520px] w-[520px] rounded-full border border-dashed border-brand-200 animate-orbit-slow" />
            {/* pass card */}
            <div className="absolute left-0 sm:left-6 top-10 w-[240px] rotate-[-8deg] rounded-[24px] overflow-hidden shadow-lift animate-float [animation-delay:1s]">
              <div className="bg-brand-gradient p-5 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Queue Pass</p>
                <p className="num text-5xl font-bold mt-1">A-031</p>
              </div>
              <div className="bg-white p-4 grid grid-cols-2 gap-2 text-[11px]">
                <div><p className="text-ink-400">Business</p><p className="font-bold">CityCare</p></div>
                <div><p className="text-ink-400">Est. time</p><p className="font-bold">11:40 AM</p></div>
                <div><p className="text-ink-400">Service</p><p className="font-bold">Consultation</p></div>
                <div><p className="text-ink-400">Counter</p><p className="font-bold">03</p></div>
              </div>
            </div>
            <MiniPhone className="relative z-10" />
            <div className="absolute right-0 bottom-16 glass shadow-lift rounded-2xl p-4 w-[220px] animate-float [animation-delay:2.5s] z-20">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Saved this month</p>
              <p className="num text-3xl font-bold mt-1">4h 32m</p>
              <div className="mt-2 flex items-end gap-1 h-8">{[40, 62, 35, 90].map((h, i) => <span key={i} className={cn('flex-1 rounded', i === 3 ? 'bg-mint-400' : 'bg-brand-200')} style={{ height: `${h}%` }} />)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* BUSINESS DASHBOARD / LIVE QUEUE */}
      <section id="business" className="py-20 sm:py-28 bg-ink relative overflow-hidden scroll-mt-20">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-brand-600/30 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-mint-500/15 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <SectionHead dark eyebrow="Business dashboard · Live queue" title={<>Control the entire queue<br />from one screen.</>} body="Drag tokens between states, call the next customer, open counters and let the AI assistant rebalance the flow." />
            <Button variant="mint" size="lg" to="/business/live">Open live dashboard <ArrowRight className="h-5 w-5" /></Button>
          </div>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* kanban */}
            <div className="lg:col-span-2 rounded-[28px] bg-white/[0.04] ring-1 ring-white/10 p-5">
              <div className="flex items-center justify-between text-white">
                <p className="font-bold flex items-center gap-2">Live Queue <LiveDot color="bg-mint-400" /></p>
                <span className="inline-flex items-center gap-2 h-9 px-3 rounded-xl bg-brand-600 text-sm font-bold"><PhoneCall className="h-4 w-4" /> Call Next</span>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  ['Waiting', 'bg-brand-400', [['A-031', 'Alex Rahman', '18m', null], ['A-032', 'Sadia Karim', '15m', 'Pregnant'], ['A-033', 'Rafiq Ahmed', '13m', null]]],
                  ['Called', 'bg-amber-500', [['A-029', 'Priya Sen', '21m', null], ['A-030', 'Omar Faruk', '19m', 'VIP']]],
                  ['Serving', 'bg-mint-400', [['A-027', 'Counter 1 · Sarah', '26m', null], ['A-028', 'Counter 2 · Rahim', '24m', 'Elderly']]],
                ].map(([t, c, items]) => (
                  <div key={t} className="rounded-2xl bg-white/[0.04] p-2.5">
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/60 px-1.5 pb-2.5"><span className={cn('h-2 w-2 rounded-full', c)} />{t}</p>
                    <div className="space-y-2">
                      {items.map(([tk, n, w, p]) => (
                        <div key={tk} className="rounded-xl bg-white p-3 text-ink">
                          <div className="flex items-center justify-between"><span className="num font-bold text-lg">{tk}</span>{p && <span className={cn('text-[9px] font-bold rounded-full px-1.5 py-0.5', p === 'VIP' ? 'bg-brand-600 text-white' : 'bg-amber-50 text-amber-600')}>{p}</span>}</div>
                          <p className="text-[11px] text-ink-500 truncate">{n}</p>
                          <p className="text-[10px] text-ink-400 mt-1 flex items-center gap-1"><Timer className="h-3 w-3" />{w}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* side */}
            <div className="space-y-5">
              <div className="rounded-[28px] bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white relative overflow-hidden">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-mint-400/30 blur-2xl" />
                <p className="relative flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4 text-mint-400" /> AI Queue Assistant</p>
                <p className="relative mt-3 text-lg font-semibold leading-snug">Opening Counter 4 could reduce average wait time from <span className="num">26 min</span> to <span className="num text-mint-400">17 min</span>.</p>
                <button onClick={() => toast('Counter 04 opened (demo)', { tone: 'success' })} className="relative mt-4 h-10 px-4 rounded-xl bg-mint-400 text-ink text-sm font-bold hover:bg-mint-300 transition">Open Counter 4</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['Counter 01', 'A-027', 'Sarah', true], ['Counter 02', 'A-028', 'Rahim', true], ['Counter 03', 'Available', '', false], ['Counter 04', 'Paused', '', false]].map(([n, t, s, a]) => (
                  <div key={n} className={cn('rounded-2xl p-4', a ? 'bg-white text-ink' : 'bg-white/[0.05] ring-1 ring-white/10 text-white')}>
                    <p className={cn('text-[10px] font-bold uppercase tracking-wider', a ? 'text-ink-400' : 'text-white/40')}>{n}</p>
                    <p className="num text-xl font-bold mt-1">{t}</p>
                    <p className={cn('text-[11px]', a ? 'text-ink-500' : 'text-white/40')}>{s ? `Staff: ${s}` : t === 'Paused' ? 'Paused' : 'Ready'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[[ShieldCheck, 'Priority lanes'], [UsersRound, 'Group & hybrid queues'], [Zap, 'Real-time via WebSockets'], [Monitor, 'TV display mode']].map(([I, l]) => (
              <div key={l} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4 text-white"><I className="h-5 w-5 text-mint-400" /><span className="text-sm font-semibold">{l}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTIFICATIONS */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="order-2 lg:order-1 relative h-[420px] flex items-center justify-center">
            <div className="absolute inset-8 rounded-[40px] bg-gradient-to-br from-brand-100 to-mint-50" />
            <div className="relative w-full max-w-sm space-y-3">
              {notifs.map((n, i) => {
                const active = i <= notifStep
                return (
                  <div key={n.t} className={cn('flex items-center gap-3 rounded-[20px] bg-white p-4 shadow-lift transition-all duration-700', active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4', i === notifStep && 'ring-2 ring-brand-500 scale-[1.03]')}>
                    <span className={cn('h-11 w-11 rounded-2xl grid place-items-center shrink-0', n.c)}><n.i className="h-5 w-5" /></span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-snug">{n.t}</p>
                      <p className="text-xs text-ink-500">{n.b}</p>
                    </div>
                    <span className="ml-auto text-[10px] text-ink-400 self-start">now</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHead eyebrow="Smart notifications" title={<>The right nudge at <span className="text-gradient">the right moment.</span></>} body="Customers are notified as the queue moves — when 5 are ahead, when it’s time to leave, when they’re next and when it’s their turn." />
            <div className="mt-8 flex flex-wrap gap-2">
              {[[Smartphone, 'Push'], [Mail, 'SMS'], [MessageCircle, 'WhatsApp'], [Globe, 'PWA']].map(([I, l]) => (
                <span key={l} className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl bg-white shadow-soft text-sm font-semibold"><I className="h-4 w-4 text-brand-600" />{l}</span>
              ))}
            </div>
            <p className="mt-6 text-sm text-ink-500 flex items-center gap-2"><Check className="h-4 w-4 text-success-500" /> No-show detection auto-skips unresponsive tokens after 3 calls.</p>
          </div>
        </div>
      </section>

      {/* ANALYTICS */}
      <section id="analytics" className="py-16 sm:py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead center eyebrow="Analytics" title={<>Know your busiest hour <span className="text-gradient">before it happens.</span></>} body="Beautiful, honest analytics on wait times, peak hours, abandonment, counters and customer satisfaction." />
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3 card p-6">
              <div className="flex items-start justify-between">
                <div><p className="font-bold">Customers served</p><p className="text-xs text-ink-400">September 2026</p></div>
                <Badge tone="success">+14% MoM</Badge>
              </div>
              <AreaChart data={monthTrend} labels={Array.from({ length: 30 }, (_, i) => `Sep ${i + 1}`)} color={SERIES[0]} className="mt-4" unit=" served" />
            </div>
            <div className="lg:col-span-2 space-y-5">
              <div className="card p-6">
                <div className="flex items-start justify-between">
                  <div><p className="font-bold">Peak hours</p><p className="text-xs text-ink-400">Today</p></div>
                  <span className="num text-sm font-bold text-brand-700 bg-brand-50 rounded-lg px-2 py-1">10 AM – 12 PM</span>
                </div>
                <BarChart data={hourlyVolume} highlight={[2, 3, 4]} height={150} className="mt-3" unit=" customers" />
              </div>
              <div className="rounded-card bg-ink text-white p-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/50 blur-2xl" />
                <p className="relative text-xs font-bold uppercase tracking-wider text-mint-400">Insight</p>
                <p className="relative mt-2 text-lg font-semibold leading-snug">Tuesdays between 11 AM and 1 PM have 38% higher queue volume.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead eyebrow="Supported industries" title="Built for every place with a line." body="Customize logo, brand colors, services, counters, queue rules and operating hours for each location." />
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {industries.map((ind, i) => (
              <div key={ind.name} className={cn('group rounded-[24px] p-6 transition-all hover:-translate-y-1 hover:shadow-lift', i === 0 ? 'bg-brand-gradient text-white shadow-glow' : 'bg-white shadow-soft')}>
                <span className={cn('h-12 w-12 rounded-2xl grid place-items-center', i === 0 ? 'bg-white/15' : 'bg-canvas text-brand-600 group-hover:bg-brand-50 transition')}><Icon name={ind.icon} className="h-6 w-6" /></span>
                <p className="mt-6 font-bold text-lg leading-tight">{ind.name}</p>
                <p className={cn('mt-4 num text-3xl font-bold', i === 0 ? 'text-mint-300' : '')}>{ind.stat}</p>
                <p className={cn('text-sm', i === 0 ? 'text-white/70' : 'text-ink-500')}>{ind.statLabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative rounded-[36px] bg-white shadow-lift overflow-hidden p-8 sm:p-14">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-100 blur-3xl" />
            <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 items-center">
              <div key={tIdx} className="animate-fade-up">
                <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />)}</div>
                <blockquote className="mt-6 text-2xl sm:text-3xl font-semibold tracking-tight leading-snug">“{testimonials[tIdx].quote}”</blockquote>
                <div className="mt-8 flex items-center gap-3">
                  <Avatar initials={testimonials[tIdx].avatar} gradient={testimonials[tIdx].color} className="h-12 w-12 text-sm" />
                  <div><p className="font-bold">{testimonials[tIdx].name}</p><p className="text-sm text-ink-500">{testimonials[tIdx].role}</p></div>
                </div>
              </div>
              <div className="flex lg:flex-col gap-3">
                {testimonials.map((t, i) => (
                  <button key={t.name} onClick={() => setTIdx(i)} className={cn('flex-1 text-left rounded-2xl p-4 transition', tIdx === i ? 'bg-ink text-white' : 'bg-canvas hover:bg-ink-100')}>
                    <p className={cn('num text-3xl font-bold', tIdx === i && 'text-mint-400')}>{t.metric}</p>
                    <p className={cn('text-xs', tIdx === i ? 'text-white/60' : 'text-ink-500')}>{t.metricLabel}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 sm:py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead center eyebrow="Pricing" title="Simple pricing that scales with your lines." body="Start free. Upgrade when your queue grows." />
          <div className="mt-8 flex justify-center">
            <Segmented options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly · save 20%' }]} value={billing} onChange={setBilling} />
          </div>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            {pricing.map((p) => (
              <div key={p.name} className={cn('relative rounded-[30px] p-8 flex flex-col transition-all', p.featured ? 'bg-ink text-white shadow-lift lg:-translate-y-3' : 'bg-white shadow-soft hover:shadow-lift')}>
                {p.featured && <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/40 blur-3xl" />}
                {p.featured && <span className="absolute top-6 right-6 rounded-full bg-mint-400 text-ink text-[11px] font-bold px-2.5 py-1">Most popular</span>}
                <p className="relative text-lg font-bold">{p.name}</p>
                <p className={cn('relative text-sm mt-1', p.featured ? 'text-white/60' : 'text-ink-500')}>{p.tagline}</p>
                <p className="relative mt-6 flex items-baseline gap-1">
                  <span className="num text-6xl font-bold">${p.price[billing]}</span>
                  <span className={cn('text-sm', p.featured ? 'text-white/50' : 'text-ink-400')}>/ location / mo</span>
                </p>
                <ul className="relative mt-8 space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className={cn('h-5 w-5 rounded-full grid place-items-center shrink-0', p.featured ? 'bg-mint-400 text-ink' : 'bg-brand-50 text-brand-600')}><Check className="h-3 w-3" /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button size="lg" variant={p.featured ? 'mint' : 'secondary'} className="relative mt-8 w-full" onClick={() => (p.name === 'Business' ? toast('Thanks! Our team will reach out within 1 business day.', { tone: 'success' }) : setSignup(true))}>
                  {p.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12">
          <div>
            <SectionHead eyebrow="FAQ" title="Questions, answered." body="Can’t find what you need? Our team replies in under 10 minutes." />
            <Button variant="secondary" className="mt-6" onClick={() => toast('Chat opened', { body: 'A QFlow specialist will join shortly.', tone: 'info' })}><MessageCircle className="h-4 w-4" /> Chat with us</Button>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className={cn('rounded-[22px] transition-all', faq === i ? 'bg-white shadow-lift' : 'bg-white/60 hover:bg-white')}>
                <button onClick={() => setFaq(faq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left" aria-expanded={faq === i}>
                  <span className="font-bold text-[17px]">{f.q}</span>
                  <span className={cn('h-8 w-8 rounded-full grid place-items-center shrink-0 transition', faq === i ? 'bg-ink text-white rotate-180' : 'bg-canvas')}>{faq === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span>
                </button>
                <div className={cn('grid transition-all duration-300', faq === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                  <div className="overflow-hidden"><p className="px-5 sm:px-6 pb-6 text-ink-500 leading-relaxed">{f.a}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[40px] bg-brand-gradient px-6 py-16 sm:p-20 text-center text-white">
            <div className="absolute inset-0 bg-dots opacity-20 invert" />
            <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/3 h-[700px] w-[700px] rounded-full border border-white/20" />
            <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/3 h-[500px] w-[500px] rounded-full border border-white/20" />
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-mint-400/30 blur-3xl" />
            <h2 className="relative text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.02]">Give your customers<br />their time back.</h2>
            <p className="relative mt-5 text-lg text-white/70 max-w-xl mx-auto">Launch a virtual queue today. It takes less time than your average wait.</p>
            <div className="relative mt-9 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="white" onClick={() => setSignup(true)}>Start Free <ArrowRight className="h-5 w-5" /></Button>
              <Button size="lg" variant="glass-light" to="/demo">See Live Demo</Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-10 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <Logo />
              <p className="mt-4 text-ink-500 max-w-xs">Skip the line. Keep your place. Smart virtual queues for every business with a line.</p>
            </div>
            {[
              ['Product', [['Customer app', '/app'], ['Dashboard', '/business'], ['TV display', '/tv'], ['Live demo', '/demo']]],
              ['Company', [['About', '/'], ['Careers', '/'], ['Press', '/'], ['Contact', '/']]],
              ['Resources', [['Help center', '/'], ['API docs', '/'], ['Status', '/'], ['Privacy', '/']]],
            ].map(([h, links]) => (
              <div key={h}>
                <p className="text-sm font-bold">{h}</p>
                <ul className="mt-4 space-y-2.5">{links.map(([l, to]) => <li key={l}><Link to={to} className="text-sm text-ink-500 hover:text-ink transition">{l}</Link></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-ink-200/70 flex flex-col sm:flex-row justify-between gap-3 text-sm text-ink-400">
            <p>© 2026 QFlow Technologies. All rights reserved.</p>
            <p>Made for people who hate waiting.</p>
          </div>
        </div>
      </footer>

      <SignupModal open={signup} onClose={() => setSignup(false)} />
    </div>
  )
}
