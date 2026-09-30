import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, CalendarDays, Footprints, Check } from 'lucide-react'
import { appointments as initial, businessServices, staff } from '../../data/mock'
import { Badge, Button, EmptyState, Segmented } from '../../components/ui/primitives'
import { Modal } from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../lib/cn'

const tone = { Completed: 'neutral', 'In service': 'success', 'Checked in': 'brand', Upcoming: 'warning' }
const days = ['Mon 28', 'Tue 29', 'Wed 30', 'Thu 1', 'Fri 2', 'Sat 3', 'Sun 4']

export default function Appointments() {
  const toast = useToast()
  const [list, setList] = useState(initial)
  const [day, setDay] = useState(2)
  const [view, setView] = useState('Timeline')
  const [add, setAdd] = useState(false)
  const [form, setForm] = useState({ name: '', time: '16:00', service: businessServices[0] })
  const items = day === 2 ? list : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Appointments</h1>
          <p className="text-ink-500 mt-1">Hybrid queue — booked visits slot into the live walk-in flow automatically.</p>
        </div>
        <div className="flex gap-2">
          <Segmented options={['Timeline', 'List']} value={view} onChange={setView} />
          <Button onClick={() => setAdd(true)}><Plus className="h-4 w-4" /> New booking</Button>
        </div>
      </div>

      <div className="card p-3 flex items-center gap-2">
        <button onClick={() => setDay(Math.max(0, day - 1))} className="h-10 w-10 rounded-xl grid place-items-center hover:bg-canvas" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button>
        <div className="flex-1 grid grid-cols-7 gap-1.5">
          {days.map((d, i) => (
            <button key={d} onClick={() => setDay(i)} className={cn('h-14 rounded-2xl text-center transition', day === i ? 'bg-ink text-white shadow-lift' : 'hover:bg-canvas')}>
              <span className={cn('block text-[11px] font-semibold', day === i ? 'text-white/60' : 'text-ink-400')}>{d.split(' ')[0]}</span>
              <span className="num block text-lg font-bold">{d.split(' ')[1]}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setDay(Math.min(6, day + 1))} className="h-10 w-10 rounded-xl grid place-items-center hover:bg-canvas" aria-label="Next"><ChevronRight className="h-5 w-5" /></button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-5 sm:p-6">
          {items.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No bookings yet" body="This day is open for walk-ins only. Share your booking link to fill it up." action={<Button size="sm" onClick={() => setAdd(true)}><Plus className="h-4 w-4" /> Add booking</Button>} />
          ) : view === 'Timeline' ? (
            <div className="relative">
              {items.map((a, i) => (
                <div key={a.time + a.name} className="relative flex gap-4 pb-4 last:pb-0">
                  <span className="num text-sm font-bold w-12 pt-3 text-ink-500">{a.time}</span>
                  <div className="relative flex flex-col items-center">
                    <span className={cn('mt-4 h-3 w-3 rounded-full ring-4', a.status === 'In service' ? 'bg-success-500 ring-success-100' : a.status === 'Completed' ? 'bg-ink-300 ring-ink-100' : 'bg-brand-500 ring-brand-100')} />
                    {i < items.length - 1 && <span className="flex-1 w-px bg-ink-100 mt-1" />}
                  </div>
                  <div className={cn('flex-1 rounded-2xl p-4 flex flex-wrap items-center gap-3', a.status === 'In service' ? 'bg-success-50' : 'bg-canvas')}>
                    <div className="flex-1 min-w-[160px]">
                      <p className="font-bold">{a.name}</p>
                      <p className="text-xs text-ink-500">{a.service} · {a.doctor}</p>
                    </div>
                    <Badge tone={tone[a.status]}>{a.status}</Badge>
                    {a.status === 'Upcoming' && (
                      <Button size="xs" variant="secondary" onClick={() => { setList(list.map((x) => (x === a ? { ...x, status: 'Checked in' } : x))); toast(`${a.name} checked in`, { body: 'Merged into the live queue at their slot.', tone: 'success' }) }}><Check className="h-3.5 w-3.5" /> Check in</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[11px] uppercase tracking-wider text-ink-400"><th className="pb-3 font-bold">Time</th><th className="pb-3 font-bold">Customer</th><th className="pb-3 font-bold hidden sm:table-cell">Service</th><th className="pb-3 font-bold">Status</th></tr></thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.time + a.name} className="border-t border-ink-100"><td className="py-3 num font-bold">{a.time}</td><td className="py-3 font-semibold">{a.name}</td><td className="py-3 text-ink-500 hidden sm:table-cell">{a.service}</td><td className="py-3"><Badge tone={tone[a.status]}>{a.status}</Badge></td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold">Today’s mix</h3>
            <div className="mt-4 flex h-3 rounded-full overflow-hidden gap-0.5">
              <div className="bg-brand-600" style={{ width: '38%' }} />
              <div className="bg-mint-500" style={{ width: '62%' }} />
            </div>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-brand-600" /><CalendarDays className="h-4 w-4 text-ink-400" /> Appointments</span><b className="num">38%</b></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-mint-500" /><Footprints className="h-4 w-4 text-ink-400" /> Walk-ins & remote</span><b className="num">62%</b></div>
            </div>
          </div>
          <div className="card p-5">
            <h3 className="font-bold">Hybrid rules</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-ink-600">
              <li className="flex gap-2"><Check className="h-4 w-4 text-success-500 shrink-0 mt-0.5" />Appointments are called within ±5 min of their slot.</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-success-500 shrink-0 mt-0.5" />Max 2 appointments in a row before a walk-in is served.</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-success-500 shrink-0 mt-0.5" />No-show after 10 min releases the slot to walk-ins.</li>
            </ul>
          </div>
        </div>
      </div>

      <Modal
        open={add}
        onClose={() => setAdd(false)}
        title="New booking"
        footer={<><Button variant="secondary" onClick={() => setAdd(false)}>Cancel</Button><Button disabled={!form.name} onClick={() => { setList([...list, { ...form, doctor: staff[0].name, status: 'Upcoming' }].sort((a, b) => a.time.localeCompare(b.time))); setDay(2); setAdd(false); toast('Booking confirmed', { body: `${form.name} · ${form.time}`, tone: 'success' }); setForm({ ...form, name: '' }) }}>Confirm booking</Button></>}
      >
        <div className="space-y-4">
          <label className="block"><span className="text-xs font-semibold text-ink-500">Customer name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5 w-full h-11 rounded-xl bg-canvas px-3.5 text-sm outline-none focus:ring-1 focus:ring-brand-500" placeholder="e.g. Tahmina Rahman" /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="text-xs font-semibold text-ink-500">Time</span><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="mt-1.5 w-full h-11 rounded-xl bg-canvas px-3.5 text-sm outline-none" /></label>
            <label className="block"><span className="text-xs font-semibold text-ink-500">Service</span><select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="mt-1.5 w-full h-11 rounded-xl bg-canvas px-3 text-sm outline-none">{businessServices.map((s) => <option key={s}>{s}</option>)}</select></label>
          </div>
        </div>
      </Modal>
    </div>
  )
}
