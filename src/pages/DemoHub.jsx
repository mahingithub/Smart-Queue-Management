import { Link } from 'react-router-dom'
import { ArrowRight, Smartphone, LayoutDashboard, Monitor, QrCode, ArrowLeft } from 'lucide-react'
import { Logo } from '../components/ui/primitives'
import OrbitalRing from '../components/ui/OrbitalRing'
import { cn } from '../lib/cn'

const demos = [
  { to: '/app', icon: Smartphone, title: 'Customer app', body: 'Mobile-first PWA: discover, join, track your token live and get notified.', tag: 'Mobile · 390px', dark: false },
  { to: '/business', icon: LayoutDashboard, title: 'Business dashboard', body: 'Live queue board with drag & drop, counters, staff, AI assistant and analytics.', tag: 'Desktop · 1440px', dark: true },
  { to: '/tv', icon: Monitor, title: 'TV display mode', body: 'Huge, glanceable “Now Serving” screen for waiting rooms.', tag: 'Large screen', dark: false },
  { to: '/app/scan', icon: QrCode, title: 'QR queue join', body: 'Scan at the entrance → choose service → get token. No account.', tag: 'Walk-up flow', dark: false },
]

export default function DemoHub() {
  return (
    <div className="min-h-screen bg-canvas bg-aurora relative overflow-hidden">
      <div className="absolute -right-40 -top-40 opacity-60 pointer-events-none hidden md:block">
        <OrbitalRing token="A-031" ahead={7} total={12} serving={null} size={560} label="Live demo" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between">
          <Link to="/"><Logo /></Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink"><ArrowLeft className="h-4 w-4" /> Back to site</Link>
        </div>
        <div className="mt-16 sm:mt-24 max-w-2xl animate-fade-up">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Interactive prototype</p>
          <h1 className="mt-3 text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.02]">Explore QFlow <span className="text-gradient">live.</span></h1>
          <p className="mt-4 text-lg text-ink-500">Every button works. The customer app, business dashboard and TV display share the same live demo data.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {demos.map((d, i) => (
            <Link key={d.to} to={d.to} className={cn('group relative rounded-[30px] p-7 overflow-hidden transition-all hover:-translate-y-1 animate-fade-up', d.dark ? 'bg-ink text-white shadow-lift' : 'bg-white shadow-soft hover:shadow-lift')} style={{ animationDelay: `${i * 80}ms` }}>
              {d.dark && <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/40 blur-3xl" />}
              <div className="relative flex items-start justify-between">
                <span className={cn('h-14 w-14 rounded-2xl grid place-items-center', d.dark ? 'bg-white/10 text-mint-400' : 'bg-brand-50 text-brand-600')}><d.icon className="h-7 w-7" /></span>
                <span className={cn('text-xs font-bold rounded-full px-3 py-1', d.dark ? 'bg-white/10 text-white/70' : 'bg-canvas text-ink-500')}>{d.tag}</span>
              </div>
              <h2 className="relative mt-10 text-2xl font-extrabold tracking-tight">{d.title}</h2>
              <p className={cn('relative mt-2', d.dark ? 'text-white/60' : 'text-ink-500')}>{d.body}</p>
              <span className={cn('relative mt-6 inline-flex items-center gap-2 font-bold text-sm', d.dark ? 'text-mint-400' : 'text-brand-600')}>Open <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" /></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
