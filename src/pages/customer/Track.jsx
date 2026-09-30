import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Car, Check, Clock, LogOut, MoreHorizontal, Pause, Play, RotateCcw, Snowflake, Ticket, Users, Zap, Radio } from 'lucide-react'
import { useCustomerQueue } from '../../context/CustomerQueue'
import OrbitalRing from '../../components/ui/OrbitalRing'
import { Badge, Button, EmptyState } from '../../components/ui/primitives'
import { ConfirmModal, Modal } from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../lib/cn'

export default function Track() {
  const navigate = useNavigate()
  const toast = useToast()
  const { queue, live, setLive, leaveQueue, toggleFreeze, setOnMyWay, advance, resetDemo } = useCustomerQueue()
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [menu, setMenu] = useState(false)

  if (!queue.active) {
    return (
      <div className="pt-20 px-5">
        <EmptyState
          icon={Radio}
          title="You’re not in a queue"
          body="Find a place nearby and join remotely — we’ll track your turn live."
          action={
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate('/app')}>Find a queue</Button>
              <Button variant="ghost" size="sm" onClick={resetDemo}><RotateCcw className="h-4 w-4" /> Restore demo token</Button>
            </div>
          }
        />
      </div>
    )
  }

  const { ahead, total } = queue
  const leaveIn = Math.max(0, queue.wait - 10)
  const stage = ahead === 0 ? 4 : ahead === 1 ? 3 : ahead <= 3 ? 2 : ahead <= total ? 1 : 0
  const timeline = [
    { label: 'Joined Queue', sub: queue.joinedAt },
    { label: '7 people ahead', sub: 'Waiting remotely' },
    { label: '3 people ahead', sub: 'Time to leave' },
    { label: 'You’re Next', sub: 'Head to waiting area' },
    { label: 'Your Turn', sub: queue.counter },
  ]

  const headline =
    ahead === 0 ? 'It’s your turn!' : ahead === 1 ? 'You’re next!' : ahead <= 3 ? 'You’re almost there.' : 'Relax — we’re holding your place.'

  return (
    <div className="animate-fade-in">
      <div className="px-5 pt-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-400 font-medium">{queue.business}</p>
          <h1 className="text-xl font-extrabold tracking-tight">{queue.service}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/app/pass')} className="h-11 w-11 rounded-2xl bg-white shadow-soft grid place-items-center" aria-label="Pass"><Ticket className="h-5 w-5" /></button>
          <button onClick={() => setMenu(true)} className="h-11 w-11 rounded-2xl bg-white shadow-soft grid place-items-center" aria-label="More"><MoreHorizontal className="h-5 w-5" /></button>
        </div>
      </div>

      {/* Orbit */}
      <section className="relative mt-2 flex flex-col items-center">
        <div className="absolute top-2 left-5">
          <Badge tone={queue.frozen ? 'warning' : ahead === 0 ? 'success' : 'brand'} dot>{queue.frozen ? 'Place frozen' : ahead === 0 ? 'Now serving' : live ? 'Live · updating' : 'Live'}</Badge>
        </div>
        <OrbitalRing token={queue.token} ahead={ahead} total={total} serving={ahead === 0 ? null : queue.serving} size={318} label={ahead === 0 ? 'Proceed to' : 'Your token'} />
        {/* floating stats around the circle */}
        <div className="absolute left-4 bottom-10 glass shadow-soft rounded-2xl px-3 py-2 animate-float">
          <p className="text-[10px] text-ink-400 font-semibold uppercase tracking-wider">Ahead</p>
          <p className="num text-xl font-bold">{ahead} <span className="text-xs font-sans text-ink-400">people</span></p>
        </div>
        <div className="absolute right-4 bottom-16 glass shadow-soft rounded-2xl px-3 py-2 animate-float [animation-delay:1.5s]">
          <p className="text-[10px] text-ink-400 font-semibold uppercase tracking-wider">Wait</p>
          <p className="num text-xl font-bold">{queue.wait} <span className="text-xs font-sans text-ink-400">min</span></p>
        </div>
      </section>

      <div className="px-5 -mt-1 text-center">
        <h2 className={cn('text-2xl font-extrabold tracking-tight', ahead === 0 && 'text-success-600')}>{headline}</h2>
        <p className="text-sm text-ink-500 mt-1">
          {ahead === 0 ? `Please proceed to ${queue.counter}.` : <>Now serving <b className="text-ink">{queue.serving}</b> · estimated turn <b className="text-ink">{queue.estTime}</b></>}
        </p>
      </div>

      {/* Smart arrival */}
      {ahead > 0 && (
        <section className="px-5 mt-5">
          <div className="relative overflow-hidden rounded-[24px] bg-ink text-white p-5">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-mint-400/25 blur-2xl" />
            <div className="relative flex items-start gap-3">
              <span className="h-11 w-11 rounded-2xl bg-mint-400 text-ink grid place-items-center shrink-0"><Car className="h-5 w-5" /></span>
              <div className="flex-1">
                <p className="text-xs text-white/50 font-semibold uppercase tracking-wider">Smart Arrival</p>
                <p className="font-bold text-lg leading-snug mt-0.5">
                  {queue.onMyWay ? 'On your way — we’ve told the front desk.' : leaveIn > 0 ? <>Leave home in approximately <span className="text-mint-400">{leaveIn} minutes</span>.</> : <>Leave <span className="text-mint-400">now</span> to arrive on time.</>}
                </p>
                <p className="text-xs text-white/50 mt-1">7 min drive · light traffic on Gulshan Ave</p>
              </div>
            </div>
            <Button
              variant={queue.onMyWay ? 'glass-light' : 'mint'}
              className="relative w-full mt-4"
              onClick={() => { setOnMyWay(); toast('Front desk notified', { body: 'CityCare knows you’re on your way.', tone: 'success' }) }}
              disabled={queue.onMyWay}
            >
              {queue.onMyWay ? <><Check className="h-4 w-4" /> On my way</> : 'I’m on my way'}
            </Button>
          </div>
        </section>
      )}

      {/* Timeline */}
      <section className="px-5 mt-5">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Your journey</h3>
            <span className="text-xs text-ink-400">Updated live</span>
          </div>
          <ol className="relative">
            {timeline.map((t, i) => {
              const done = i < stage
              const current = i === stage
              return (
                <li key={t.label} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < timeline.length - 1 && <span className={cn('absolute left-[13px] top-7 bottom-0 w-0.5 rounded-full', done ? 'bg-brand-500' : 'bg-ink-100')} />}
                  <span className={cn('relative z-10 h-7 w-7 rounded-full grid place-items-center shrink-0 transition-all duration-500', done ? 'bg-brand-600 text-white' : current ? 'bg-white ring-[3px] ring-brand-500' : 'bg-ink-100')}>
                    {done ? <Check className="h-3.5 w-3.5" /> : current ? <span className="h-2.5 w-2.5 rounded-full bg-brand-600 animate-blink" /> : null}
                  </span>
                  <div className="pt-0.5">
                    <p className={cn('text-sm font-bold', !done && !current && 'text-ink-400')}>{t.label}</p>
                    <p className="text-xs text-ink-400">{t.sub}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* Notification note */}
      <section className="px-5 mt-3">
        <div className="rounded-[20px] bg-brand-50 p-4 flex items-center gap-3">
          <Bell className="h-5 w-5 text-brand-600 shrink-0" />
          <p className="text-sm text-brand-900">We’ll notify you when only <b>3 people</b> are ahead.</p>
        </div>
      </section>

      {/* Demo controls */}
      <section className="px-5 mt-5">
        <div className="rounded-[20px] border-2 border-dashed border-ink-200 p-4">
          <p className="eyebrow flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /> Prototype controls</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Button size="sm" variant={live ? 'dark' : 'primary'} onClick={() => setLive(!live)}>{live ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Simulate</>}</Button>
            <Button size="sm" variant="secondary" onClick={advance} disabled={ahead === 0}><Users className="h-4 w-4" /> Next</Button>
            <Button size="sm" variant="secondary" onClick={() => { resetDemo(); setLive(false) }}><RotateCcw className="h-4 w-4" /> Reset</Button>
          </div>
        </div>
      </section>

      <section className="px-5 mt-4 grid grid-cols-2 gap-2.5">
        <Button variant="secondary" onClick={() => { toggleFreeze(); toast(queue.frozen ? 'Queue resumed' : queue.freezeUsed ? 'Freeze already used' : 'Place frozen for 10 min', { body: queue.frozen ? 'You’re moving with the queue again.' : queue.freezeUsed ? 'CityCare allows one freeze per visit.' : 'People can pass you while you’re delayed.', tone: queue.freezeUsed && !queue.frozen ? 'warning' : 'info' }) }}>
          <Snowflake className="h-4 w-4 text-brand-600" /> {queue.frozen ? 'Unfreeze' : 'Freeze place'}
        </Button>
        <Button variant="danger-soft" onClick={() => setConfirmLeave(true)}><LogOut className="h-4 w-4" /> Leave queue</Button>
      </section>

      <ConfirmModal
        open={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        onConfirm={() => { leaveQueue(); toast('You left the queue', { body: `Token ${queue.token} released.`, tone: 'warning', action: { label: 'Undo', onClick: resetDemo } }) }}
        title="Leave the queue?"
        body={`You’ll lose your place (${queue.token}) with ${ahead} people ahead.`}
        confirmLabel="Leave queue"
      />

      <Modal open={menu} onClose={() => setMenu(false)} title="Queue options">
        <div className="space-y-2">
          {[
            [Ticket, 'Show digital pass', () => navigate('/app/pass')],
            [Clock, 'Change to a scheduled time', () => toast('Reschedule sent', { body: 'CityCare will confirm your new slot.', tone: 'info' })],
            [Users, 'Add a family member', () => toast('Group updated', { body: 'Party size is now 2.', tone: 'success' })],
            [Bell, 'Notification settings', () => toast('WhatsApp alerts enabled', { tone: 'success' })],
          ].map(([I, l, fn]) => (
            <button key={l} onClick={() => { setMenu(false); fn() }} className="w-full flex items-center gap-3 rounded-2xl p-3.5 hover:bg-ink-100 text-sm font-semibold text-left"><I className="h-5 w-5 text-brand-600" />{l}</button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
