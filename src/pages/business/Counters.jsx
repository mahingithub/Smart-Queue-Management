import { useState } from 'react'
import { Play, Pause, UserCog, Plus, MonitorSmartphone, PhoneCall, CheckCircle2 } from 'lucide-react'
import { useBusinessQueue } from '../../context/BusinessQueue'
import { staff as staffList, businessServices } from '../../data/mock'
import { Avatar, Badge, Button } from '../../components/ui/primitives'
import { Modal } from '../../components/ui/Modal'
import { Meter } from '../../components/charts/Charts'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../lib/cn'

const statusStyle = {
  active: { label: 'Active', tone: 'success' },
  available: { label: 'Available', tone: 'brand' },
  paused: { label: 'Paused', tone: 'warning' },
}

export default function Counters() {
  const toast = useToast()
  const { counters, updateCounter, addCounter, byStatus, move, complete } = useBusinessQueue()
  const [assign, setAssign] = useState(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Counters</h1>
          <p className="text-ink-500 mt-1">Open, pause and staff every service point.</p>
        </div>
        <Button onClick={() => { addCounter(); toast(`Counter 0${counters.length + 1} created`, { tone: 'success' }) }}><Plus className="h-4 w-4" /> Open Counter</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {counters.map((c) => {
          const serving = byStatus.serving.find((q) => q.counter === c.id)
          const called = byStatus.called.find((q) => q.counter === c.id)
          const status = serving ? 'active' : c.status === 'paused' ? 'paused' : 'available'
          const S = statusStyle[status]
          const staffer = staffList.find((s) => s.name === c.staff)
          return (
            <div key={c.id} className={cn('relative rounded-[24px] p-5 overflow-hidden transition-all', status === 'active' ? 'bg-ink text-white shadow-lift' : 'bg-white shadow-soft', status === 'paused' && 'opacity-90')}>
              {status === 'active' && <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-500/40 blur-3xl" />}
              <div className="relative flex items-center justify-between">
                <span className={cn('h-10 w-10 rounded-2xl grid place-items-center', status === 'active' ? 'bg-white/10 text-mint-400' : 'bg-canvas text-ink-600')}><MonitorSmartphone className="h-5 w-5" /></span>
                <Badge tone={status === 'active' ? 'glass' : S.tone} dot>{S.label}</Badge>
              </div>
              <p className={cn('relative mt-4 text-xs font-bold uppercase tracking-[0.16em]', status === 'active' ? 'text-white/50' : 'text-ink-400')}>{c.name}</p>
              <p className="relative num text-4xl font-bold mt-1">{serving ? serving.id : status === 'paused' ? 'Paused' : 'Available'}</p>
              <p className={cn('relative text-sm mt-1 min-h-5', status === 'active' ? 'text-white/60' : 'text-ink-500')}>{serving ? `Serving ${serving.customer}` : called ? `Called ${called.id}` : c.service}</p>

              <div className={cn('relative mt-5 flex items-center gap-3 rounded-2xl p-3', status === 'active' ? 'bg-white/5 ring-1 ring-white/10' : 'bg-canvas')}>
                {staffer ? <Avatar initials={staffer.avatar} gradient={staffer.color} /> : <span className="h-9 w-9 rounded-full border-2 border-dashed border-ink-300 grid place-items-center"><UserCog className="h-4 w-4 text-ink-400" /></span>}
                <span className="flex-1 min-w-0">
                  <span className={cn('block text-[11px]', status === 'active' ? 'text-white/50' : 'text-ink-400')}>Staff</span>
                  <span className="block text-sm font-bold truncate">{c.staff ? c.staff.replace('Dr. ', 'Dr. ') : 'Unassigned'}</span>
                </span>
              </div>

              <div className="relative mt-4">
                <div className={cn('flex justify-between text-[11px] mb-1.5', status === 'active' ? 'text-white/50' : 'text-ink-400')}><span>Served today</span><span className="num font-bold">{c.servedToday}</span></div>
                <Meter value={c.servedToday} max={60} color={status === 'active' ? 'bg-mint-400' : 'bg-brand-500'} className={status === 'active' ? 'bg-white/10' : ''} />
              </div>

              <div className="relative mt-5 grid grid-cols-2 gap-2">
                {status === 'paused' ? (
                  <Button size="sm" variant="primary" onClick={() => { updateCounter(c.id, { status: 'available' }); toast(`${c.name} opened`, { tone: 'success' }) }}><Play className="h-4 w-4" /> Open</Button>
                ) : (
                  <Button size="sm" variant={status === 'active' ? 'glass-light' : 'secondary'} onClick={() => { updateCounter(c.id, { status: 'paused' }); toast(`${c.name} paused`, { body: 'New tokens won’t be routed here.', tone: 'warning' }) }}><Pause className="h-4 w-4" /> Pause</Button>
                )}
                <Button size="sm" variant={status === 'active' ? 'glass-light' : 'secondary'} onClick={() => setAssign(c)}><UserCog className="h-4 w-4" /> Assign</Button>
                {serving ? (
                  <Button size="sm" variant="mint" className="col-span-2" onClick={() => complete(serving.id)}><CheckCircle2 className="h-4 w-4" /> Complete {serving.id}</Button>
                ) : status !== 'paused' && byStatus.waiting[0] ? (
                  <Button size="sm" variant="soft" className="col-span-2" onClick={() => { const n = byStatus.waiting[0]; move(n.id, 'called'); toast(`Calling ${n.id} to ${c.name}`, { tone: 'notify' }) }}><PhoneCall className="h-4 w-4" /> Call {byStatus.waiting[0].id}</Button>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={!!assign} onClose={() => setAssign(null)} title={assign ? `Assign staff · ${assign.name}` : ''} subtitle="Pick who runs this counter and what it serves.">
        {assign && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              {staffList.filter((s) => s.status !== 'Off today').map((s) => (
                <button key={s.id} onClick={() => { updateCounter(assign.id, { staff: s.name, status: assign.status === 'paused' ? 'available' : assign.status }); toast(`${s.name} assigned to ${assign.name}`, { tone: 'success' }); setAssign(null) }} className={cn('w-full flex items-center gap-3 rounded-2xl p-3 text-left transition', assign.staff === s.name ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-canvas')}>
                  <Avatar initials={s.avatar} gradient={s.color} />
                  <span className="flex-1"><span className="block text-sm font-bold">{s.name}</span><span className="block text-xs text-ink-400">{s.role}</span></span>
                  <Badge tone={s.status === 'On duty' ? 'success' : 'warning'}>{s.status}</Badge>
                </button>
              ))}
            </div>
            <label className="block">
              <span className="text-xs font-semibold text-ink-500">Service</span>
              <select defaultValue={assign.service} onChange={(e) => updateCounter(assign.id, { service: e.target.value })} className="mt-1.5 w-full h-11 rounded-xl bg-canvas px-3 text-sm outline-none">
                {businessServices.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
        )}
      </Modal>
    </div>
  )
}
