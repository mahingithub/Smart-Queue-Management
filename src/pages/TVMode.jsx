import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Maximize, PhoneCall, Volume2 } from 'lucide-react'
import { useBusinessQueue } from '../context/BusinessQueue'
import { Logo } from '../components/ui/primitives'
import QRCode from '../components/ui/QRCode'
import { cn } from '../lib/cn'

function Clock() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(i)
  }, [])
  return <span className="num">{t.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
}

export default function TVMode() {
  const { counters, byStatus, callNext, announcement } = useBusinessQueue()
  const [flash, setFlash] = useState(null)
  const prev = useRef({})

  // Now-serving per counter: serving token, else called token on that counter.
  const slots = counters
    .filter((c) => c.id <= 3)
    .map((c) => ({ ...c, token: byStatus.serving.find((q) => q.counter === c.id) || byStatus.called.find((q) => q.counter === c.id) }))
  const next = [...byStatus.called.filter((q) => !slots.some((s) => s.token?.id === q.id)), ...byStatus.waiting].slice(0, 5)

  useEffect(() => {
    slots.forEach((s) => {
      const id = s.token?.id
      if (id && prev.current[s.id] && prev.current[s.id] !== id) {
        setFlash(s.id)
        setTimeout(() => setFlash(null), 2400)
      }
      prev.current[s.id] = id
    })
  })

  return (
    <div className="min-h-screen bg-[#070A1C] text-white overflow-hidden relative flex flex-col">
      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-brand-600/40 blur-[120px]" />
      <div className="absolute -bottom-40 right-0 h-[480px] w-[480px] rounded-full bg-mint-500/20 blur-[120px]" />
      <div className="absolute inset-0 bg-grid opacity-[0.07] invert" />

      {/* Controls (hidden in real TV use) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 opacity-40 hover:opacity-100 transition">
        <Link to="/business" className="h-10 px-3 rounded-xl bg-white/10 inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
        <button onClick={callNext} className="h-10 px-3 rounded-xl bg-white/10 inline-flex items-center gap-2 text-sm font-semibold"><PhoneCall className="h-4 w-4" /> Call next</button>
        <button onClick={() => document.documentElement.requestFullscreen?.().catch(() => {})} className="h-10 w-10 rounded-xl bg-white/10 grid place-items-center" aria-label="Fullscreen"><Maximize className="h-4 w-4" /></button>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-12 pt-8">
        <div className="flex items-center gap-5">
          <span className="h-14 w-14 sm:h-16 sm:w-16 rounded-[20px] bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center font-display font-bold text-xl">CC</span>
          <div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-[0.12em]">CITYCARE CLINIC</h1>
            <p className="text-white/50 text-sm sm:text-base">Gulshan · Wednesday, 30 September</p>
          </div>
        </div>
        <div className="hidden md:block text-right mt-12 lg:mt-0">
          <p className="text-5xl font-bold"><Clock /></p>
        </div>
      </header>

      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 px-6 sm:px-12 py-8">
        <section>
          <p className="flex items-center gap-3 text-mint-400 font-bold uppercase tracking-[0.3em] text-sm sm:text-lg">
            <span className="h-3 w-3 rounded-full bg-mint-400 animate-blink" /> Now Serving
          </p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {slots.map((s) => (
              <div
                key={s.id}
                className={cn(
                  'relative rounded-[32px] p-6 sm:p-8 overflow-hidden transition-all duration-500',
                  flash === s.id ? 'bg-mint-400 text-ink scale-[1.03] shadow-[0_0_80px_rgba(46,230,197,0.5)]' : 'bg-white/[0.06] ring-1 ring-white/10',
                )}
              >
                {flash !== s.id && <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/30 blur-3xl" />}
                <p className={cn('relative font-display text-lg sm:text-2xl font-bold tracking-[0.2em]', flash === s.id ? 'text-ink/70' : 'text-white/50')}>
                  COUNTER {String(s.id).padStart(2, '0')}
                </p>
                <p className="relative num font-bold leading-none mt-4 whitespace-nowrap text-[clamp(44px,5.4vw,124px)]">{s.token ? s.token.id : s.status === 'paused' ? '—' : '···'}</p>
                <p className={cn('relative mt-4 text-base sm:text-xl', flash === s.id ? 'text-ink/70' : 'text-white/50')}>
                  {s.token ? (s.token.status === 'called' ? 'Please proceed now' : s.token.service) : s.status === 'paused' ? 'Closed' : 'Available'}
                </p>
                {flash === s.id && <Volume2 className="absolute top-7 right-7 h-8 w-8 animate-blink" />}
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-5">
            {[
              [String(byStatus.waiting.length + 30), 'People waiting'],
              ['18 min', 'Average wait'],
              ['Counter 04', 'Opens at 12:00 PM'],
            ].map(([v, l]) => (
              <div key={l} className="rounded-[28px] bg-white/[0.03] ring-1 ring-white/10 px-6 py-5">
                <p className="num text-2xl sm:text-4xl font-bold">{v}</p>
                <p className="text-white/50 text-sm sm:text-lg mt-1">{l}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="flex flex-col gap-5">
          <div className="rounded-[32px] bg-white/[0.06] ring-1 ring-white/10 p-6 sm:p-8 flex-1">
            <p className="font-bold uppercase tracking-[0.3em] text-white/60 text-sm sm:text-lg">Next</p>
            <div className="mt-5 space-y-3">
              {next.map((q, i) => (
                <div key={q.id} className={cn('flex items-center justify-between rounded-2xl px-5 py-3.5 transition', i === 0 ? 'bg-brand-600' : 'bg-white/[0.04]')}>
                  <span className="num text-4xl sm:text-5xl font-bold">{q.id}</span>
                  {i === 0 && <span className="text-sm font-bold uppercase tracking-wider text-white/80">Up next</span>}
                </div>
              ))}
              {next.length === 0 && <p className="text-white/40 text-xl">No one waiting</p>}
            </div>
          </div>
          <div className="rounded-[32px] bg-white text-ink p-5 flex items-center gap-4">
            <QRCode value="citycare-entrance" size={96} />
            <div>
              <p className="font-extrabold text-xl leading-tight">Scan to join the queue</p>
              <p className="text-sm text-ink-500 mt-1">No app needed. Wait anywhere.</p>
            </div>
          </div>
        </aside>
      </main>

      {/* Announcement */}
      <footer className="relative z-10 border-t border-white/10 bg-white/[0.04] backdrop-blur py-5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center gap-16 pr-16 text-xl sm:text-2xl font-semibold text-white/80">
              <span className="flex items-center gap-4"><span className="text-mint-400">●</span>{announcement}</span>
              <span className="flex items-center gap-4"><span className="text-mint-400">●</span>Please keep your digital token ready.</span>
              <span className="flex items-center gap-4"><Logo light size="sm" /> Skip the line. Keep your place.</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  )
}
