import { useState } from 'react'
import { Pause, Play, UserPlus, ArrowLeftRight, Timer, Lock, Unlock, Sparkles, Minus, Plus, ShieldAlert, Crown, Accessibility, Baby, UserRound, Check } from 'lucide-react'
import { useBusinessQueue } from '../../context/BusinessQueue'
import { Button, Toggle } from '../../components/ui/primitives'
import { ConfirmModal, Modal } from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../lib/cn'

export function AIAssistantCard({ compact }) {
  const toast = useToast()
  const { counters, updateCounter } = useBusinessQueue()
  const c4 = counters.find((c) => c.id === 4)
  const [applied, setApplied] = useState(c4?.status !== 'paused')

  return (
    <div className="relative overflow-hidden rounded-card bg-ink text-white p-5">
      <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-brand-500/50 blur-3xl" />
      <div className="absolute -left-10 -bottom-16 h-40 w-40 rounded-full bg-mint-400/25 blur-3xl" />
      <div className="relative flex items-center gap-2">
        <span className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-400 to-mint-400 grid place-items-center"><Sparkles className="h-4 w-4 text-white" /></span>
        <p className="text-sm font-bold">AI Queue Assistant</p>
        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/10 px-2 py-1">Suggestion</span>
      </div>
      {applied ? (
        <p className="relative mt-4 text-[17px] font-semibold leading-snug">Counter 4 is open. Average wait is trending down to <span className="text-mint-400">17 min</span>. 🎉</p>
      ) : (
        <p className="relative mt-4 text-[17px] font-semibold leading-snug">
          Opening <span className="text-mint-400">Counter 4</span> could reduce average wait time from <span className="num">26 min</span> to <span className="num text-mint-400">17 min</span>.
        </p>
      )}
      {!compact && (
        <div className="relative mt-4 flex items-end gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-white/50 mb-1"><span>Now</span><span className="num">26 min</span></div>
            <div className="h-1.5 rounded-full bg-white/10"><div className="h-full w-full rounded-full bg-coral-500" /></div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-white/50 mb-1"><span>With Counter 4</span><span className="num">17 min</span></div>
            <div className="h-1.5 rounded-full bg-white/10"><div className="h-full w-[65%] rounded-full bg-mint-400" /></div>
          </div>
        </div>
      )}
      <div className="relative mt-5 flex gap-2">
        <Button
          size="sm"
          variant={applied ? 'glass-light' : 'mint'}
          disabled={applied}
          onClick={() => { updateCounter(4, { status: 'available', staff: 'Dr. Arif Hasan' }); setApplied(true); toast('Counter 04 opened', { body: 'Dr. Arif Hasan assigned · 6 customers rebalanced.', tone: 'success' }) }}
        >
          {applied ? <><Check className="h-4 w-4" /> Applied</> : 'Open Counter 4'}
        </Button>
        {!applied && <Button size="sm" variant="glass-light" onClick={() => toast('Suggestion dismissed', { body: 'We’ll check again in 15 minutes.', tone: 'info' })}>Not now</Button>}
      </div>
    </div>
  )
}

export default function QueueControl({ onAddWalkIn }) {
  const toast = useToast()
  const { settings, setSettings, byStatus, transfer, counters } = useBusinessQueue()
  const [confirmClose, setConfirmClose] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [tToken, setTToken] = useState('')
  const [tCounter, setTCounter] = useState(2)

  const set = (patch) => setSettings((s) => ({ ...s, ...patch }))
  const prios = [
    ['elderly', 'Elderly', UserRound],
    ['pregnant', 'Pregnant', Baby],
    ['disabled', 'Disabled', Accessibility],
    ['emergency', 'Emergency', ShieldAlert],
    ['vip', 'VIP', Crown],
  ]

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold tracking-tight">Smart Queue Control</h3>
          <p className="text-xs text-ink-400">Command center · changes apply instantly</p>
        </div>
        <span className={cn('h-2.5 w-2.5 rounded-full', settings.closed ? 'bg-coral-500' : settings.paused ? 'bg-amber-500' : 'bg-success-500 animate-blink')} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => { set({ paused: !settings.paused }); toast(settings.paused ? 'Queue resumed' : 'Queue paused', { body: settings.paused ? 'Customers can join again.' : 'New joins are on hold. Existing tokens are safe.', tone: settings.paused ? 'success' : 'warning' }) }}
          className={cn('flex flex-col items-start gap-2 rounded-2xl p-3.5 text-left transition', settings.paused ? 'bg-amber-500 text-white' : 'bg-canvas hover:bg-ink-100')}
        >
          {settings.paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5 text-amber-600" />}
          <span className="text-sm font-bold">{settings.paused ? 'Resume queue' : 'Pause queue'}</span>
        </button>
        <button onClick={onAddWalkIn} className="flex flex-col items-start gap-2 rounded-2xl p-3.5 text-left bg-canvas hover:bg-ink-100 transition">
          <UserPlus className="h-5 w-5 text-brand-600" />
          <span className="text-sm font-bold">Add walk-in</span>
        </button>
        <button onClick={() => { setTToken(byStatus.waiting[0]?.id || ''); setTransferOpen(true) }} className="flex flex-col items-start gap-2 rounded-2xl p-3.5 text-left bg-canvas hover:bg-ink-100 transition">
          <ArrowLeftRight className="h-5 w-5 text-mint-600" />
          <span className="text-sm font-bold">Transfer customer</span>
        </button>
        <button
          onClick={() => (settings.closed ? (set({ closed: false }), toast('Queue reopened', { tone: 'success' })) : setConfirmClose(true))}
          className={cn('flex flex-col items-start gap-2 rounded-2xl p-3.5 text-left transition', settings.closed ? 'bg-coral-500 text-white' : 'bg-canvas hover:bg-ink-100')}
        >
          {settings.closed ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5 text-coral-500" />}
          <span className="text-sm font-bold">{settings.closed ? 'Reopen queue' : 'Close temporarily'}</span>
        </button>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Maximum queue size</p>
            <p className="text-xs text-ink-400">{byStatus.waiting.length} of {settings.maxSize} used</p>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-canvas p-1">
            <button onClick={() => set({ maxSize: Math.max(10, settings.maxSize - 5) })} className="h-7 w-7 rounded-lg grid place-items-center hover:bg-white" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
            <span className="num w-9 text-center text-sm font-bold">{settings.maxSize}</span>
            <button onClick={() => set({ maxSize: Math.min(200, settings.maxSize + 5) })} className="h-7 w-7 rounded-lg grid place-items-center hover:bg-white" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold flex items-center gap-1.5"><Timer className="h-4 w-4 text-ink-400" /> Est. service time</p>
            <span className="num text-sm font-bold">{settings.serviceTime} min</span>
          </div>
          <input type="range" min="3" max="30" value={settings.serviceTime} onChange={(e) => set({ serviceTime: Number(e.target.value) })} className="mt-2 w-full accent-brand-600" aria-label="Estimated service time" />
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">Prioritize</p>
          <div className="flex flex-wrap gap-1.5">
            {prios.map(([k, l, I]) => {
              const on = settings.priorityEnabled[k]
              return (
                <button
                  key={k}
                  onClick={() => set({ priorityEnabled: { ...settings.priorityEnabled, [k]: !on } })}
                  className={cn('h-8 px-2.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition', on ? 'bg-brand-600 text-white' : 'bg-canvas text-ink-500 hover:bg-ink-100')}
                >
                  <I className="h-3.5 w-3.5" />{l}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Allow queue freeze</p>
            <p className="text-xs text-ink-400">Customers can pause their place once</p>
          </div>
          <Toggle checked={settings.allowFreeze} onChange={(v) => set({ allowFreeze: v })} label="Allow queue freeze" />
        </div>
      </div>

      <ConfirmModal
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        onConfirm={() => { set({ closed: true }); toast('Queue closed temporarily', { body: `${byStatus.waiting.length} waiting customers were notified.`, tone: 'warning' }) }}
        title="Close the queue temporarily?"
        body="No new customers can join. People already waiting keep their place and will be notified."
        confirmLabel="Close queue"
      />

      <Modal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        title="Transfer customer"
        subtitle="Move a token to another counter."
        footer={<><Button variant="secondary" onClick={() => setTransferOpen(false)}>Cancel</Button><Button disabled={!tToken} onClick={() => { transfer(tToken, tCounter); setTransferOpen(false) }}>Transfer</Button></>}
      >
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-ink-500">Token</span>
            <select value={tToken} onChange={(e) => setTToken(e.target.value)} className="mt-1.5 w-full h-11 rounded-xl bg-canvas px-3 text-sm outline-none">
              {[...byStatus.waiting, ...byStatus.called, ...byStatus.serving].map((q) => <option key={q.id} value={q.id}>{q.id} · {q.customer}</option>)}
            </select>
          </label>
          <div>
            <span className="text-xs font-semibold text-ink-500">To counter</span>
            <div className="mt-1.5 grid grid-cols-4 gap-2">
              {counters.map((c) => (
                <button key={c.id} disabled={c.status === 'paused'} onClick={() => setTCounter(c.id)} className={cn('h-14 rounded-xl text-sm font-bold transition disabled:opacity-30', tCounter === c.id ? 'bg-ink text-white' : 'bg-canvas hover:bg-ink-100')}>
                  0{c.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
