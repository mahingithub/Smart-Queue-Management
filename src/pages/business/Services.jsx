import { useState } from 'react'
import { Plus, Timer, Users, Pencil } from 'lucide-react'
import { businesses } from '../../data/mock'
import { Button, Toggle } from '../../components/ui/primitives'
import { Modal } from '../../components/ui/Modal'
import Icon from '../../components/ui/Icon'
import { useToast } from '../../components/ui/Toast'

export default function Services() {
  const toast = useToast()
  const [list, setList] = useState(businesses[0].services.map((s) => ({ ...s, enabled: true, remote: true })))
  const [edit, setEdit] = useState(null)

  const save = () => {
    if (edit.isNew) setList([...list, { ...edit, id: `svc-${list.length}`, icon: 'Sparkles', people: 0, wait: 0, enabled: true, remote: true }])
    else setList(list.map((s) => (s.id === edit.id ? edit : s)))
    toast(edit.isNew ? 'Service created' : 'Service updated', { body: edit.name, tone: 'success' })
    setEdit(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Services</h1>
          <p className="text-ink-500 mt-1">Each service has its own token prefix, timing and queue rules.</p>
        </div>
        <Button onClick={() => setEdit({ isNew: true, name: '', prefix: 'N', duration: '15 min', fee: '৳ 0' })}><Plus className="h-4 w-4" /> New service</Button>
      </div>

      <div className="card overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-400 border-b border-ink-100">
          <span>Service</span><span>Prefix</span><span>Live queue</span><span>Avg duration</span><span>Remote join</span><span className="w-20 text-right">Status</span>
        </div>
        {list.map((s) => (
          <div key={s.id} className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 border-b border-ink-100 last:border-0 hover:bg-canvas/60 transition">
            <div className="col-span-2 md:col-span-1 flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 grid place-items-center"><Icon name={s.icon} className="h-5 w-5" /></span>
              <div>
                <p className="font-bold">{s.name}</p>
                <p className="text-xs text-ink-400">{s.fee}</p>
              </div>
              <button onClick={() => setEdit(s)} className="ml-auto md:ml-2 h-8 w-8 rounded-lg grid place-items-center text-ink-400 hover:bg-white hover:text-ink" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
            </div>
            <span className="num font-bold text-brand-700"><span className="rounded-lg bg-brand-50 px-2 py-1">{s.prefix}-###</span></span>
            <span className="text-sm flex items-center gap-3"><span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-ink-400" />{s.people}</span><span className="flex items-center gap-1"><Timer className="h-3.5 w-3.5 text-ink-400" />{s.wait}m</span></span>
            <span className="text-sm text-ink-600">{s.duration}</span>
            <Toggle checked={s.remote} label="Remote join" onChange={(v) => { setList(list.map((x) => (x.id === s.id ? { ...x, remote: v } : x))); toast(`Remote join ${v ? 'enabled' : 'disabled'}`, { body: s.name, tone: 'info' }) }} />
            <div className="w-20 flex justify-end">
              <Toggle checked={s.enabled} label="Enabled" onChange={(v) => setList(list.map((x) => (x.id === s.id ? { ...x, enabled: v } : x)))} />
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.isNew ? 'New service' : 'Edit service'}
        footer={<><Button variant="secondary" onClick={() => setEdit(null)}>Cancel</Button><Button disabled={!edit?.name} onClick={save}>Save service</Button></>}
      >
        {edit && (
          <div className="space-y-4">
            {[['name', 'Service name', 'e.g. Physiotherapy'], ['prefix', 'Token prefix', 'A'], ['duration', 'Average duration', '15 min'], ['fee', 'Fee', '৳ 800']].map(([k, l, ph]) => (
              <label key={k} className="block">
                <span className="text-xs font-semibold text-ink-500">{l}</span>
                <input value={edit[k]} maxLength={k === 'prefix' ? 2 : 60} onChange={(e) => setEdit({ ...edit, [k]: k === 'prefix' ? e.target.value.toUpperCase() : e.target.value })} placeholder={ph} className="mt-1.5 w-full h-11 rounded-xl bg-canvas px-3.5 text-sm outline-none focus:ring-1 focus:ring-brand-500" />
              </label>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
