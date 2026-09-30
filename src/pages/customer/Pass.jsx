import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Share2, Wallet, Download, Sun, Ticket } from 'lucide-react'
import { useCustomerQueue } from '../../context/CustomerQueue'
import { customer } from '../../data/mock'
import QRCode from '../../components/ui/QRCode'
import { Button, EmptyState, Logo } from '../../components/ui/primitives'
import { useToast } from '../../components/ui/Toast'

export default function Pass() {
  const navigate = useNavigate()
  const toast = useToast()
  const { queue } = useCustomerQueue()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [bright, setBright] = useState(false)

  if (!queue.active) {
    return (
      <div className="pt-20 px-5">
        <EmptyState icon={Ticket} title="No active pass" body="Your digital queue pass appears here once you join a queue." action={<Button onClick={() => navigate('/app')}>Find a queue</Button>} />
      </div>
    )
  }

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 8 })
  }

  return (
    <div className="min-h-full bg-ink text-white relative overflow-hidden -mt-px">
      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-brand-600/50 blur-3xl" />
      <div className="absolute top-60 -right-24 h-72 w-72 rounded-full bg-mint-500/25 blur-3xl" />

      <div className="relative px-5 pt-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="h-11 w-11 rounded-2xl bg-white/10 grid place-items-center" aria-label="Back"><ArrowLeft className="h-5 w-5" /></button>
        <p className="font-bold">Queue Pass</p>
        <button onClick={() => { setBright(!bright); toast(bright ? 'Brightness restored' : 'Brightness boosted for scanning', { tone: 'info' }) }} className="h-11 w-11 rounded-2xl bg-white/10 grid place-items-center" aria-label="Brightness"><Sun className="h-5 w-5" /></button>
      </div>

      <div className="relative px-5 mt-5 [perspective:1000px]">
        <div
          onMouseMove={onMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          className="relative rounded-[28px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out animate-scale-in"
          style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          {/* top */}
          <div className="relative bg-brand-gradient px-6 pt-6 pb-8 overflow-hidden">
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border-[22px] border-white/10" />
            <div className="absolute right-14 top-16 h-16 w-16 rounded-full border-[10px] border-mint-400/30" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-60" style={{ transform: `translateX(${tilt.y * 6}px)` }} />
            <div className="relative flex items-center justify-between">
              <Logo light size="sm" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Walk-in · Group {queue.party}</span>
            </div>
            <div className="relative mt-6 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Token</p>
                <p className="num text-[72px] leading-[0.9] font-bold">{queue.token}</p>
              </div>
              <div className="text-right pb-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Est. time</p>
                <p className="num text-2xl font-bold">{queue.estTime}</p>
              </div>
            </div>
          </div>

          {/* perforation */}
          <div className="relative bg-white h-0">
            <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-ink" />
            <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-ink" />
            <span className="absolute left-5 right-5 top-0 border-t-2 border-dashed border-ink-200" />
          </div>

          {/* body */}
          <div className="bg-white text-ink px-6 pt-6 pb-6">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {[
                ['Business', queue.business],
                ['Service', queue.service],
                ['Date', queue.date],
                ['Counter', queue.ahead === 0 ? queue.counter : 'Assigned on call'],
                ['Customer', customer.name],
                ['People ahead', `${queue.ahead}`],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-400">{k}</p>
                  <p className="text-sm font-bold mt-0.5 leading-snug">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-4 rounded-[20px] bg-canvas p-4">
              <div className={bright ? 'bg-white p-2 rounded-xl ring-4 ring-mint-400 transition' : 'bg-white p-2 rounded-xl transition'}>
                <QRCode value={queue.token + queue.business} size={104} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Scan at reception</p>
                <p className="text-xs text-ink-500 mt-1 leading-relaxed">Show this code when your token is called to check in instantly.</p>
                <p className="num text-[11px] text-ink-400 mt-2 tracking-widest">QF·{queue.token.replace('-', '')}·0930</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative px-5 mt-6 grid grid-cols-3 gap-2.5 pb-32">
        {[
          [Share2, 'Share', () => toast('Pass link copied', { body: 'Share it with family so they can track too.', tone: 'success' })],
          [Wallet, 'Wallet', () => toast('Added to Wallet', { tone: 'success' })],
          [Download, 'Save', () => toast('Pass saved as image', { tone: 'success' })],
        ].map(([I, l, fn]) => (
          <button key={l} onClick={fn} className="h-16 rounded-2xl bg-white/10 hover:bg-white/15 ring-1 ring-white/10 flex flex-col items-center justify-center gap-1 text-xs font-semibold transition">
            <I className="h-5 w-5" />{l}
          </button>
        ))}
      </div>
    </div>
  )
}
