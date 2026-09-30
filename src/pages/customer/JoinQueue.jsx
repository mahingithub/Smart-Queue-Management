import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Check, Minus, Plus, Footprints, CalendarClock, Timer, Users, Clock, Radio, LogOut, Ticket, Accessibility, Baby, HeartPulse, UserRound } from 'lucide-react'
import { businesses } from '../../data/mock'
import { useCustomerQueue } from '../../context/CustomerQueue'
import { BizLogo, Button, ErrorState } from '../../components/ui/primitives'
import { ConfirmModal } from '../../components/ui/Modal'
import Icon from '../../components/ui/Icon'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../lib/cn'

const steps = ['Service', 'People', 'Visit type', 'Confirm']
const slots = ['11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '1:15 PM', '2:00 PM', '2:30 PM', '3:45 PM']
const priorityOptions = [
  { id: 'none', label: 'None', icon: UserRound },
  { id: 'elderly', label: 'Elderly', icon: UserRound },
  { id: 'pregnant', label: 'Pregnant', icon: Baby },
  { id: 'disabled', label: 'Disabled', icon: Accessibility },
  { id: 'emergency', label: 'Emergency', icon: HeartPulse },
]

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => {
        const a = (i / 28) * Math.PI * 2
        const d = 110 + Math.random() * 90
        return {
          x: `${Math.cos(a) * d}px`,
          y: `${Math.sin(a) * d}px`,
          r: `${Math.random() * 540}deg`,
          c: ['#6D4AFF', '#2EE6C5', '#F5A524', '#F4635A', '#8B6DFF'][i % 5],
          delay: Math.random() * 120,
          w: 6 + Math.random() * 6,
        }
      }),
    [],
  )
  return (
    <div className="absolute left-1/2 top-1/2 pointer-events-none">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute block rounded-[2px] animate-confetti"
          style={{ '--x': p.x, '--y': p.y, '--r': p.r, background: p.c, width: p.w, height: p.w * 0.45, animationDelay: `${p.delay}ms` }}
        />
      ))}
    </div>
  )
}

export default function JoinQueue() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { joinQueue, leaveQueue } = useCustomerQueue()
  const b = businesses.find((x) => x.id === id)

  const initialService = params.get('service')
  const [step, setStep] = useState(initialService ? 1 : 0)
  const [service, setService] = useState(initialService || b?.services[0].id)
  const [party, setParty] = useState(1)
  const [mode, setMode] = useState('walkin')
  const [slot, setSlot] = useState(slots[1])
  const [priority, setPriority] = useState('none')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [confirmLeave, setConfirmLeave] = useState(false)

  if (!b) return <div className="pt-16"><ErrorState title="Queue unavailable" body="This business isn’t accepting remote joins right now." onRetry={() => navigate('/app')} /></div>
  const s = b.services.find((x) => x.id === service) || b.services[0]

  const next = () => {
    if (step < 3) return setStep(step + 1)
    setSubmitting(true)
    setTimeout(() => {
      const r = joinQueue({ businessId: b.id, serviceId: s.id, party, mode, slot })
      setResult(r)
      setSubmitting(false)
    }, 1100)
  }
  const back = () => (step === 0 ? navigate(-1) : setStep(step - 1))

  // ---------- Success ----------
  if (result) {
    return (
      <div className="min-h-full flex flex-col px-5 pt-6 pb-8 bg-aurora">
        <div className="relative flex flex-col items-center text-center pt-8">
          <Confetti />
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-success-500/30 animate-ping2" />
            <span className="relative h-20 w-20 rounded-full bg-gradient-to-br from-success-500 to-mint-400 grid place-items-center shadow-glow-mint animate-pop">
              <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" style={{ strokeDasharray: 24, '--len': 24 }} className="animate-[draw_.6s_.35s_ease-out_both]" />
              </svg>
            </span>
          </div>
          <h1 className="mt-6 text-[28px] font-extrabold tracking-tight animate-fade-up [animation-delay:200ms]">You’re in the queue.</h1>
          <p className="text-ink-500 mt-1 animate-fade-up [animation-delay:260ms]">{b.name} · {s.name}</p>
        </div>

        <div className="mt-7 relative rounded-[28px] bg-white shadow-lift overflow-hidden animate-fade-up [animation-delay:340ms]">
          <div className="bg-brand-gradient text-white px-6 pt-5 pb-7 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[18px] border-white/10" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Digital token</p>
            <p className="num text-[64px] leading-none font-bold mt-2">{result.token}</p>
            <p className="text-sm text-white/70 mt-2">{party > 1 ? `Group of ${party} · ` : ''}{mode === 'scheduled' ? 'Scheduled visit' : 'Walk-in queue'}</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-ink-100 py-4">
            <div className="text-center px-2"><p className="text-[11px] text-ink-400 font-medium">Estimated turn</p><p className="num font-bold text-lg mt-0.5">{result.estTime}</p></div>
            <div className="text-center px-2"><p className="text-[11px] text-ink-400 font-medium">People ahead</p><p className="num font-bold text-lg mt-0.5">{result.ahead}</p></div>
            <div className="text-center px-2"><p className="text-[11px] text-ink-400 font-medium">Est. wait</p><p className="num font-bold text-lg mt-0.5">{result.wait} min</p></div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-ink-500 animate-fade-up [animation-delay:420ms]">We’ll notify you when only 3 people are ahead.</p>

        <div className="mt-auto pt-8 space-y-2.5 animate-fade-up [animation-delay:480ms]">
          <Button size="lg" className="w-full" onClick={() => navigate('/app/track')}><Radio className="h-5 w-5" /> Track My Queue</Button>
          <div className="grid grid-cols-2 gap-2.5">
            <Button variant="secondary" onClick={() => navigate('/app/pass')}><Ticket className="h-4 w-4" /> View pass</Button>
            <Button variant="danger-soft" onClick={() => setConfirmLeave(true)}><LogOut className="h-4 w-4" /> Leave Queue</Button>
          </div>
        </div>

        <ConfirmModal
          open={confirmLeave}
          onClose={() => setConfirmLeave(false)}
          onConfirm={() => { leaveQueue(); toast('You left the queue', { body: `Token ${result.token} released.`, tone: 'warning' }); navigate('/app') }}
          title="Leave the queue?"
          body={`You’ll lose your place (${result.token}). You can rejoin, but you’ll go to the end of the line.`}
          confirmLabel="Leave queue"
        />
      </div>
    )
  }

  // ---------- Steps ----------
  return (
    <div className="min-h-full flex flex-col px-5 pt-4 pb-6">
      <div className="flex items-center gap-3">
        <button onClick={back} className="h-11 w-11 rounded-2xl bg-white shadow-soft grid place-items-center" aria-label="Back"><ArrowLeft className="h-5 w-5" /></button>
        <div className="flex-1 flex items-center gap-2.5 min-w-0">
          <BizLogo initials={b.initials} gradient={b.logoBg} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">{b.name}</p>
            <p className="text-[11px] text-ink-400">Step {step + 1} of 4 · {steps[step]}</p>
          </div>
        </div>
      </div>

      {/* progress */}
      <div className="mt-5 grid grid-cols-4 gap-1.5">
        {steps.map((l, i) => (
          <div key={l} className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
            <div className={cn('h-full rounded-full bg-brand-gradient transition-all duration-500', i <= step ? 'w-full' : 'w-0')} />
          </div>
        ))}
      </div>

      <div key={step} className="mt-7 flex-1 animate-slide-in-right">
        {step === 0 && (
          <>
            <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">Choose a service</h1>
            <p className="text-ink-500 mt-1">Live wait times for each service.</p>
            <div className="mt-5 space-y-2.5">
              {b.services.map((x) => (
                <button key={x.id} onClick={() => setService(x.id)} className={cn('w-full text-left flex items-center gap-3 rounded-[20px] p-4 transition-all', service === x.id ? 'bg-white ring-2 ring-brand-500 shadow-lift' : 'bg-white shadow-soft hover:shadow-lift')}>
                  <span className={cn('h-11 w-11 rounded-2xl grid place-items-center transition', service === x.id ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600')}><Icon name={x.icon} className="h-5 w-5" /></span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold">{x.name}</span>
                    <span className="flex gap-3 text-xs text-ink-500 mt-0.5"><span className="flex items-center gap-1"><Timer className="h-3 w-3" />{x.wait} min</span><span className="flex items-center gap-1"><Users className="h-3 w-3" />{x.people} waiting</span></span>
                  </span>
                  <span className={cn('h-6 w-6 rounded-full grid place-items-center transition', service === x.id ? 'bg-brand-600 text-white' : 'ring-2 ring-ink-200')}>{service === x.id && <Check className="h-3.5 w-3.5" />}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">How many people?</h1>
            <p className="text-ink-500 mt-1">Families and groups keep one place together.</p>
            <div className="mt-8 card p-6 flex flex-col items-center">
              <div className="flex -space-x-3 h-14">
                {Array.from({ length: party }).map((_, i) => (
                  <span key={i} className="h-14 w-14 rounded-full ring-4 ring-white bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center text-white animate-pop" style={{ zIndex: 10 - i }}>
                    <UserRound className="h-6 w-6" />
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-6">
                <button onClick={() => setParty(Math.max(1, party - 1))} disabled={party === 1} className="h-14 w-14 rounded-2xl bg-canvas grid place-items-center hover:bg-ink-100 disabled:opacity-40 transition" aria-label="Fewer"><Minus className="h-5 w-5" /></button>
                <span className="num text-6xl font-bold w-16 text-center">{party}</span>
                <button onClick={() => setParty(Math.min(6, party + 1))} disabled={party === 6} className="h-14 w-14 rounded-2xl bg-ink text-white grid place-items-center hover:bg-ink-800 disabled:opacity-40 transition" aria-label="More"><Plus className="h-5 w-5" /></button>
              </div>
              <p className="mt-4 text-sm text-ink-500">{party === 1 ? 'Just me' : `Group of ${party} · one token`}</p>
            </div>
            <p className="mt-5 eyebrow">Need priority assistance?</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {priorityOptions.map((p) => (
                <button key={p.id} onClick={() => setPriority(p.id)} className={cn('h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition', priority === p.id ? 'bg-ink text-white' : 'bg-white shadow-soft text-ink-600')}>
                  <p.icon className="h-3.5 w-3.5" />{p.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">How will you visit?</h1>
            <p className="text-ink-500 mt-1">Walk in with the live queue, or book a time.</p>
            <div className="mt-5 grid gap-3">
              {[
                { id: 'walkin', icon: Footprints, title: 'Walk-in Queue', body: `Join now · ~${s.wait} min wait`, tag: 'Fastest' },
                { id: 'scheduled', icon: CalendarClock, title: 'Scheduled Visit', body: 'Pick a time slot that suits you', tag: null },
              ].map((o) => (
                <button key={o.id} onClick={() => setMode(o.id)} className={cn('relative text-left rounded-[22px] p-5 transition-all overflow-hidden', mode === o.id ? 'bg-ink text-white shadow-lift' : 'bg-white shadow-soft hover:shadow-lift')}>
                  {mode === o.id && <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/40 blur-2xl" />}
                  <div className="relative flex items-center gap-4">
                    <span className={cn('h-12 w-12 rounded-2xl grid place-items-center', mode === o.id ? 'bg-white/10 text-mint-400' : 'bg-brand-50 text-brand-600')}><o.icon className="h-6 w-6" /></span>
                    <span className="flex-1">
                      <span className="flex items-center gap-2 font-bold text-[17px]">{o.title}{o.tag && <span className="text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 bg-mint-400 text-ink">{o.tag}</span>}</span>
                      <span className={cn('block text-sm mt-0.5', mode === o.id ? 'text-white/60' : 'text-ink-500')}>{o.body}</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {mode === 'scheduled' && (
              <div className="mt-5 animate-fade-up">
                <p className="eyebrow">Today · Wed 30 Sep</p>
                <div className="mt-2.5 grid grid-cols-4 gap-2">
                  {slots.map((t, i) => (
                    <button key={t} disabled={i === 4} onClick={() => setSlot(t)} className={cn('h-11 rounded-xl text-xs font-bold transition disabled:opacity-30 disabled:line-through', slot === t ? 'bg-brand-600 text-white shadow-glow' : 'bg-white shadow-soft hover:ring-2 hover:ring-brand-200')}>{t}</button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">Confirm & join</h1>
            <p className="text-ink-500 mt-1">Double-check your details.</p>
            <div className="mt-5 card divide-y divide-ink-100">
              {[
                ['Business', b.name],
                ['Service', s.name],
                ['People', party === 1 ? '1 person' : `${party} people`],
                ['Visit', mode === 'walkin' ? 'Walk-in queue' : `Scheduled · ${slot}`],
                ['Priority', priorityOptions.find((p) => p.id === priority).label],
                ['Notify via', 'Push + SMS'],
              ].map(([k, v], i) => (
                <div key={k} className="flex items-center justify-between px-5 py-3.5 text-sm">
                  <span className="text-ink-500">{k}</span>
                  <span className="font-semibold text-right">{v}</span>
                  {i === 0 && null}
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[20px] bg-gradient-to-br from-brand-50 to-mint-50 p-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-brand-600" />
              <p className="text-sm"><b>Estimated turn {mode === 'walkin' ? '~11:40 AM' : slot}.</b> <span className="text-ink-500">You don’t need to be there until we notify you.</span></p>
            </div>
          </>
        )}
      </div>

      <div className="pt-6">
        <Button size="lg" className="w-full" onClick={next} loading={submitting} disabled={submitting}>
          {step < 3 ? 'Continue' : submitting ? 'Reserving your place…' : 'Confirm & get token'}
        </Button>
      </div>
    </div>
  )
}
