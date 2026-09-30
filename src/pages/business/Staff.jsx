import { useState } from 'react'
import { Plus, Star, Timer, CheckCircle2, Mail } from 'lucide-react'
import { staff as initial } from '../../data/mock'
import { Avatar, Badge, Button, Segmented } from '../../components/ui/primitives'
import { Modal } from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'

const tone = { 'On duty': 'success', 'On break': 'warning', 'Off today': 'neutral' }

export default function Staff() {
  const toast = useToast()
  const [list, setList] = useState(initial)
  const [filter, setFilter] = useState('All')
  const [invite, setInvite] = useState(false)
  const [email, setEmail] = useState('')
  const shown = list.filter((s) => filter === 'All' || s.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Staff</h1>
          <p className="text-ink-500 mt-1">{list.filter((s) => s.status === 'On duty').length} on duty · performance updates live.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Segmented options={['All', 'On duty', 'On break', 'Off today']} value={filter} onChange={setFilter} />
          <Button onClick={() => setInvite(true)}><Plus className="h-4 w-4" /> Invite staff</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {shown.map((s) => (
          <div key={s.id} className="card p-5 hover:shadow-lift transition">
            <div className="flex items-start gap-3">
              <Avatar initials={s.avatar} gradient={s.color} className="h-12 w-12 text-sm" />
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{s.name}</p>
                <p className="text-sm text-ink-500">{s.role}</p>
              </div>
              <Badge tone={tone[s.status]} dot>{s.status}</Badge>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-canvas p-3"><CheckCircle2 className="h-4 w-4 text-success-500" /><p className="num text-xl font-bold mt-1.5">{s.served}</p><p className="text-[11px] text-ink-400">Served</p></div>
              <div className="rounded-2xl bg-canvas p-3"><Timer className="h-4 w-4 text-brand-600" /><p className="num text-xl font-bold mt-1.5">{s.avgTime.split(' ')[0]}</p><p className="text-[11px] text-ink-400">Avg time</p></div>
              <div className="rounded-2xl bg-canvas p-3"><Star className="h-4 w-4 text-amber-500" /><p className="num text-xl font-bold mt-1.5">{s.rating}</p><p className="text-[11px] text-ink-400">Rating</p></div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-ink-500">{s.counter ? `Counter 0${s.counter}` : 'No counter'}</span>
              <button
                onClick={() => {
                  const next = s.status === 'On duty' ? 'On break' : 'On duty'
                  setList(list.map((x) => (x.id === s.id ? { ...x, status: next } : x)))
                  toast(`${s.name} is ${next.toLowerCase()}`, { tone: 'info' })
                }}
                className="text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                {s.status === 'On duty' ? 'Set on break' : 'Set on duty'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={invite}
        onClose={() => setInvite(false)}
        title="Invite a team member"
        subtitle="They’ll get an email to set up their QFlow login."
        footer={<><Button variant="secondary" onClick={() => setInvite(false)}>Cancel</Button><Button disabled={!email.includes('@')} onClick={() => { toast('Invitation sent', { body: email, tone: 'success' }); setEmail(''); setInvite(false) }}><Mail className="h-4 w-4" /> Send invite</Button></>}
      >
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@citycare.com" className="w-full h-11 rounded-xl bg-canvas px-3.5 text-sm outline-none focus:ring-1 focus:ring-brand-500" />
        {email && !email.includes('@') && <p className="text-xs text-coral-600 mt-2">Enter a valid email address.</p>}
        <div className="mt-4 flex gap-2 flex-wrap">
          {['Front desk', 'Doctor / Specialist', 'Manager', 'Admin'].map((r, i) => <span key={r} className={i === 0 ? 'h-8 px-3 rounded-lg bg-ink text-white text-xs font-semibold grid place-items-center' : 'h-8 px-3 rounded-lg bg-canvas text-xs font-semibold grid place-items-center'}>{r}</span>)}
        </div>
      </Modal>
    </div>
  )
}
