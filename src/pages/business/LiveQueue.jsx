import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { PhoneCall, SkipForward, Volume2, CheckCircle2, ArrowLeftRight, MoreHorizontal, GripVertical, Search, UserPlus, Users, Clock, Play, History, Inbox, SlidersHorizontal } from 'lucide-react'
import { useBusinessQueue } from '../../context/BusinessQueue'
import { priorities, businessServices } from '../../data/mock'
import { Button, EmptyState, LiveDot, Segmented } from '../../components/ui/primitives'
import { Modal } from '../../components/ui/Modal'
import QueueControl from './QueueControl'
import { cn } from '../../lib/cn'

const columns = [
  { id: 'waiting', label: 'Waiting', dot: 'bg-brand-500', hint: 'Drag to call' },
  { id: 'called', label: 'Called', dot: 'bg-amber-500', hint: 'Customer notified' },
  { id: 'serving', label: 'Serving', dot: 'bg-success-500', hint: 'At a counter' },
  { id: 'completed', label: 'Completed', dot: 'bg-ink-300', hint: 'Drop to complete' },
]

function QueueCard({ q, onDragStart, onMenu, compact }) {
  const { move, skip, recall, complete } = useBusinessQueue()
  const p = priorities[q.priority]
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, q.id)}
      className={cn(
        'group relative rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-transparent hover:ring-brand-200 hover:shadow-lift transition-all cursor-grab active:cursor-grabbing active:scale-[0.98]',
        q.priority === 'emergency' && 'ring-coral-200',
      )}
    >
      {q.priority === 'emergency' && <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-coral-500" />}
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-ink-200 mt-1 -ml-1 opacity-0 group-hover:opacity-100 transition" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="num text-xl font-bold">{q.id}</span>
            {q.priority !== 'none' && <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', p.cls)}>{p.label}</span>}
            {q.party > 1 && <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-ink-500 bg-canvas rounded-full px-1.5 py-0.5"><Users className="h-3 w-3" />{q.party}</span>}
          </div>
          <p className="text-sm font-semibold mt-1 truncate">{q.customer}</p>
          <p className="text-xs text-ink-400 truncate">{q.service}</p>
        </div>
        <button onClick={() => onMenu(q)} className="h-8 w-8 -mr-1 -mt-1 rounded-lg grid place-items-center text-ink-400 hover:bg-canvas hover:text-ink" aria-label="More actions"><MoreHorizontal className="h-4 w-4" /></button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-ink-500">
        <span className="inline-flex items-center gap-1 whitespace-nowrap"><Clock className="h-3 w-3" /><span className="num font-semibold">{q.wait}m</span></span>
        <span className="rounded-md bg-canvas px-1.5 py-0.5 font-semibold whitespace-nowrap">{q.type}</span>
        {q.counter && q.status !== 'waiting' && <span className="rounded-md bg-brand-50 text-brand-700 px-1.5 py-0.5 font-semibold whitespace-nowrap">C-0{q.counter}</span>}
        {!compact && (
          <span className="ml-auto flex gap-1">
            {q.status === 'waiting' && <button onClick={() => move(q.id, 'called')} className="h-7 px-2.5 rounded-lg bg-brand-600 text-white text-[11px] font-bold hover:bg-brand-700 inline-flex items-center gap-1"><PhoneCall className="h-3 w-3" />Call</button>}
            {q.status === 'called' && (
              <>
                <button onClick={() => recall(q.id)} className="h-7 w-7 rounded-lg bg-canvas grid place-items-center hover:bg-amber-50 hover:text-amber-600" title="Recall" aria-label="Recall"><Volume2 className="h-3.5 w-3.5" /></button>
                <button onClick={() => skip(q.id)} className="h-7 w-7 rounded-lg bg-canvas grid place-items-center hover:bg-coral-50 hover:text-coral-600" title="Skip" aria-label="Skip"><SkipForward className="h-3.5 w-3.5" /></button>
                <button onClick={() => move(q.id, 'serving')} className="h-7 px-2.5 rounded-lg bg-ink text-white text-[11px] font-bold inline-flex items-center gap-1"><Play className="h-3 w-3" />Serve</button>
              </>
            )}
            {q.status === 'serving' && <button onClick={() => complete(q.id)} className="h-7 px-2.5 rounded-lg bg-success-500 text-white text-[11px] font-bold hover:bg-success-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Complete</button>}
          </span>
        )}
      </div>
    </div>
  )
}

export default function LiveQueue() {
  const { openWalkIn } = useOutletContext()
  const { byStatus, completed, move, callNext, skip, recall, complete, transfer, setPriority, counters } = useBusinessQueue()
  const [dragOver, setDragOver] = useState(null)
  const [menu, setMenu] = useState(null)
  const [search, setSearch] = useState('')
  const [service, setService] = useState('All')
  const [showControl, setShowControl] = useState(false)

  const filter = (list) =>
    list.filter((q) => (service === 'All' || q.service === service) && (!search || `${q.id} ${q.customer}`.toLowerCase().includes(search.toLowerCase())))

  const onDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }
  const onDrop = (e, status) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    setDragOver(null)
    if (!id) return
    if (status === 'completed') complete(id)
    else move(id, status)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">Live Queue <LiveDot /></h1>
          <p className="text-ink-500 mt-1">Drag tokens between states, or use quick actions. Completed tokens move to history automatically.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setShowControl(true)}><SlidersHorizontal className="h-4 w-4" /> Queue control</Button>
          <Button variant="secondary" onClick={openWalkIn}><UserPlus className="h-4 w-4" /> Add walk-in</Button>
          <Button onClick={callNext} size="md"><PhoneCall className="h-4 w-4" /> Call Next {byStatus.waiting[0] && <span className="num opacity-70">· {byStatus.waiting[0].id}</span>}</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="flex items-center gap-2 h-10 rounded-xl bg-white shadow-soft px-3 w-full md:w-72">
          <Search className="h-4 w-4 text-ink-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find token or customer" className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <div className="overflow-x-auto scrollbar-none">
          <Segmented options={['All', ...businessServices]} value={service} onChange={setService} />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x lg:grid lg:grid-cols-4 lg:overflow-visible">
        {columns.map((col) => {
          const items = col.id === 'completed' ? null : filter(byStatus[col.id])
          const count = col.id === 'completed' ? completed.length : items.length
          return (
            <div
              key={col.id}
              onDragOver={(e) => { e.preventDefault(); setDragOver(col.id) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => onDrop(e, col.id)}
              className={cn(
                'snap-start shrink-0 w-[290px] lg:w-auto rounded-[22px] p-3 transition-all min-h-[420px]',
                col.id === 'completed' ? 'bg-ink-100/50' : 'bg-ink-100/70',
                dragOver === col.id && 'bg-brand-50 ring-2 ring-brand-400',
              )}
            >
              <div className="flex items-center justify-between px-2 pt-1 pb-3">
                <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                  <span className={cn('h-2 w-2 rounded-full', col.dot)} />{col.label}
                  <span className="num text-xs font-bold text-ink-400 bg-white rounded-md px-1.5 py-0.5">{count}</span>
                </span>
                <span className="text-[11px] text-ink-400">{col.hint}</span>
              </div>

              <div className="space-y-2.5">
                {col.id === 'completed' ? (
                  <>
                    {completed.slice(0, 8).map((c) => (
                      <div key={c.id + c.served} className="rounded-2xl bg-white/70 p-3 flex items-center gap-3 animate-fade-in">
                        <span className="h-8 w-8 rounded-xl bg-success-50 text-success-600 grid place-items-center"><CheckCircle2 className="h-4 w-4" /></span>
                        <span className="flex-1 min-w-0">
                          <span className="flex items-center gap-2"><span className="num font-bold text-sm">{c.id}</span><span className="text-[11px] text-ink-400">C-0{c.counter}</span></span>
                          <span className="block text-xs text-ink-500 truncate">{c.customer}</span>
                        </span>
                        <span className="text-right text-[11px] text-ink-400"><span className="block num">{c.served}</span>{c.duration}</span>
                      </div>
                    ))}
                    <p className="flex items-center justify-center gap-1.5 pt-2 text-xs text-ink-400"><History className="h-3.5 w-3.5" /> {completed.length + 181} served today</p>
                  </>
                ) : (
                  <>
                    {items.map((q) => <QueueCard key={q.id} q={q} onDragStart={onDragStart} onMenu={setMenu} />)}
                    {items.length === 0 && (
                      <EmptyState icon={Inbox} title={search || service !== 'All' ? 'No matches' : 'Nothing here'} body={col.id === 'waiting' ? 'New customers appear here when they join.' : 'Drag a token here.'} className="py-10" />
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Card actions */}
      <Modal open={!!menu} onClose={() => setMenu(null)} title={menu ? `Token ${menu.id}` : ''} subtitle={menu ? `${menu.customer} · ${menu.service}` : ''}>
        {menu && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                [PhoneCall, 'Call', () => move(menu.id, 'called'), menu.status === 'waiting'],
                [Play, 'Start serving', () => move(menu.id, 'serving'), menu.status !== 'serving'],
                [Volume2, 'Recall', () => recall(menu.id), menu.status === 'called'],
                [SkipForward, 'Skip', () => skip(menu.id), menu.status !== 'waiting'],
                [CheckCircle2, 'Complete', () => complete(menu.id), true],
                [ArrowLeftRight, 'Back to waiting', () => move(menu.id, 'waiting'), menu.status !== 'waiting'],
              ].filter((a) => a[3]).map(([I, l, fn]) => (
                <button key={l} onClick={() => { fn(); setMenu(null) }} className="flex flex-col items-start gap-2 rounded-2xl bg-canvas hover:bg-brand-50 hover:text-brand-700 p-3.5 text-sm font-bold transition"><I className="h-5 w-5" />{l}</button>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-500 mb-2">Transfer counter</p>
              <div className="grid grid-cols-4 gap-2">
                {counters.map((c) => (
                  <button key={c.id} disabled={c.status === 'paused'} onClick={() => { transfer(menu.id, c.id); setMenu(null) }} className={cn('h-11 rounded-xl text-sm font-bold transition disabled:opacity-30', menu.counter === c.id ? 'bg-ink text-white' : 'bg-canvas hover:bg-ink-100')}>C-0{c.id}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-500 mb-2">Priority</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(priorities).map(([k, v]) => (
                  <button key={k} onClick={() => { setPriority(menu.id, k); setMenu({ ...menu, priority: k }) }} className={cn('h-8 px-3 rounded-lg text-xs font-semibold transition', menu.priority === k ? 'bg-ink text-white' : 'bg-canvas hover:bg-ink-100')}>{v.label}</button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-canvas p-3.5 text-xs text-ink-500 flex justify-between"><span>{menu.phone}</span><span>Waiting {menu.wait} min · {menu.type}</span></div>
          </div>
        )}
      </Modal>

      <Modal open={showControl} onClose={() => setShowControl(false)} size="md" className="!bg-canvas">
        <div className="-mt-8"><QueueControl onAddWalkIn={() => { setShowControl(false); openWalkIn() }} /></div>
      </Modal>
    </div>
  )
}
