import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Home, Radio, Ticket, Bell, History as HistoryIcon, ArrowLeft, Monitor, LayoutDashboard, Wifi, Signal, BatteryFull } from 'lucide-react'
import { useCustomerQueue } from '../../context/CustomerQueue'
import { Logo } from '../../components/ui/primitives'
import { cn } from '../../lib/cn'

const tabs = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/track', label: 'Queue', icon: Radio },
  { to: '/app/pass', label: 'Pass', icon: Ticket },
  { to: '/app/notifications', label: 'Alerts', icon: Bell },
  { to: '/app/history', label: 'History', icon: HistoryIcon },
]

function StatusBar({ dark }) {
  return (
    <div className={cn('hidden sm:flex items-center justify-between px-7 pt-3.5 pb-1 text-[13px] font-semibold', dark ? 'text-white' : 'text-ink')}>
      <span className="num">11:22</span>
      <span className="absolute left-1/2 -translate-x-1/2 top-2.5 h-[30px] w-[108px] rounded-full bg-ink" />
      <span className="flex items-center gap-1.5">
        <Signal className="h-3.5 w-3.5" />
        <Wifi className="h-3.5 w-3.5" />
        <BatteryFull className="h-4 w-4" />
      </span>
    </div>
  )
}

export default function CustomerShell() {
  const { pathname } = useLocation()
  const { notifications, queue } = useCustomerQueue()
  const unread = notifications.filter((n) => n.unread).length
  const scrollRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const hideNav = pathname.startsWith('/app/join') || pathname.startsWith('/app/scan')
  const darkTop = pathname.startsWith('/app/pass') || pathname.startsWith('/app/scan')

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="h-[100dvh] sm:h-auto sm:min-h-screen bg-canvas sm:bg-[#E9EAF3] sm:bg-aurora relative overflow-hidden">
      {/* Desktop presentation chrome */}
      <div className="hidden lg:block absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] pointer-events-none" />
      <header className="hidden sm:flex relative z-10 items-center justify-between px-8 py-5">
        <Link to="/"><Logo /></Link>
        <div className="flex items-center gap-2">
          <Link to="/demo" className="inline-flex items-center gap-2 h-10 px-4 rounded-2xl text-sm font-semibold text-ink-600 hover:text-ink hover:bg-white/70">
            <ArrowLeft className="h-4 w-4" /> Demo hub
          </Link>
          <Link to="/business" className="inline-flex items-center gap-2 h-10 px-4 rounded-2xl text-sm font-semibold bg-white shadow-soft hover:shadow-lift transition">
            <LayoutDashboard className="h-4 w-4 text-brand-600" /> Business view
          </Link>
          <Link to="/tv" className="inline-flex items-center gap-2 h-10 px-4 rounded-2xl text-sm font-semibold bg-ink text-white hover:bg-ink-800 transition">
            <Monitor className="h-4 w-4 text-mint-400" /> TV mode
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex items-start justify-center gap-16 sm:pb-10">
        {/* Side captions on wide screens */}
        <aside className="hidden xl:flex flex-col gap-6 w-[300px] pt-24 animate-fade-up">
          <p className="eyebrow text-brand-600">Customer app · Mobile PWA</p>
          <h1 className="text-4xl font-extrabold tracking-tight leading-[1.05]">Skip the line.<br /><span className="text-gradient">Keep your place.</span></h1>
          <p className="text-ink-500 leading-relaxed">This is an interactive prototype. Tap around — every button works. On the <b className="text-ink">Queue</b> tab, press <b className="text-ink">Simulate live queue</b> to watch the queue move and notifications arrive.</p>
          {queue.active && (
            <Link to="/app/track" className="card p-4 flex items-center gap-3 hover:shadow-lift transition">
              <span className="h-11 w-11 rounded-2xl bg-brand-gradient grid place-items-center text-white num font-bold text-xs">{queue.token}</span>
              <span className="text-sm"><b>{queue.ahead} people ahead</b><br /><span className="text-ink-500">{queue.business}</span></span>
            </Link>
          )}
        </aside>

        {/* Phone */}
        <div className="relative w-full sm:w-[390px] sm:mt-4 animate-scale-in">
          <div className={cn('relative w-full h-[100dvh] sm:h-[844px] sm:rounded-[54px] sm:shadow-phone overflow-hidden flex flex-col transition-colors', darkTop ? 'bg-ink' : 'bg-canvas')}>
            <StatusBar dark={darkTop} />
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-none relative" onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 8)}>
              <Outlet context={{ scrolled }} />
              {!hideNav && !darkTop && <div className="h-28" />}
            </div>

            {!hideNav && (
              <nav className="absolute bottom-0 inset-x-0 z-30 px-4 pb-[max(env(safe-area-inset-bottom),14px)] pt-2 pointer-events-none">
                <div className="pointer-events-auto glass shadow-lift rounded-[26px] h-[68px] flex items-center justify-around px-2">
                  {tabs.map((t) => (
                    <NavLink
                      key={t.to}
                      to={t.to}
                      end={t.end}
                      className={({ isActive }) =>
                        cn('relative flex flex-col items-center justify-center gap-1 h-14 w-14 rounded-2xl text-[10px] font-semibold transition-all', isActive ? 'text-brand-600' : 'text-ink-400 hover:text-ink')
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && <span className="absolute inset-1 rounded-2xl bg-brand-50 -z-10 animate-scale-in" />}
                          <t.icon className={cn('h-[22px] w-[22px]', isActive && 'stroke-[2.4]')} />
                          {t.label}
                          {t.label === 'Alerts' && unread > 0 && (
                            <span className="absolute top-1.5 right-2.5 h-4 min-w-4 px-1 rounded-full bg-coral-500 text-white text-[9px] font-bold grid place-items-center ring-2 ring-white">{unread}</span>
                          )}
                          {t.label === 'Queue' && queue.active && !isActive && (
                            <span className="absolute top-2 right-3.5 h-2 w-2 rounded-full bg-mint-500 ring-2 ring-white" />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </nav>
            )}
            <div className="hidden sm:block absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-32 rounded-full bg-ink/80 z-40" />
          </div>
        </div>

        <aside className="hidden xl:flex flex-col gap-3 w-[300px] pt-28 animate-fade-up [animation-delay:120ms]">
          <p className="eyebrow">Jump to a screen</p>
          {[
            ['/app', 'Home & discovery'],
            ['/app/business/citycare', 'Business profile'],
            ['/app/join/citycare', 'Join queue flow'],
            ['/app/track', 'Live queue tracking'],
            ['/app/pass', 'Digital queue pass'],
            ['/app/scan', 'QR queue join (no account)'],
            ['/app/notifications', 'Notifications'],
            ['/app/history', 'Visit history'],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) => cn('flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition', isActive ? 'bg-ink text-white shadow-lift' : 'bg-white/60 hover:bg-white text-ink-600')}
            >
              {label}
              <span className="text-xs opacity-50">→</span>
            </NavLink>
          ))}
        </aside>
      </div>
    </div>
  )
}
