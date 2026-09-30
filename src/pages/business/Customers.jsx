import { useEffect, useState } from 'react'
import { Search, Download, UserSearch, MessageSquare } from 'lucide-react'
import { customersDirectory } from '../../data/mock'
import { Avatar, Badge, Button, EmptyState, ErrorState, Skeleton } from '../../components/ui/primitives'
import { Modal } from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'

const tagTone = { VIP: 'brand', Regular: 'neutral', New: 'mint', Elderly: 'warning', Priority: 'danger' }
const grad = ['from-brand-400 to-brand-600', 'from-mint-400 to-mint-600', 'from-coral-500 to-amber-500', 'from-amber-500 to-coral-500', 'from-ink-600 to-ink-800']

export default function Customers() {
  const toast = useToast()
  const [q, setQ] = useState('')
  const [state, setState] = useState('loading')
  const [sel, setSel] = useState(null)
  useEffect(() => {
    const t = setTimeout(() => setState('ready'), 700)
    return () => clearTimeout(t)
  }, [])

  const list = customersDirectory.filter((c) => `${c.name} ${c.phone} ${c.tag}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Customers</h1>
          <p className="text-ink-500 mt-1">2,184 customers · 312 visited this week</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setState('error')}>Simulate error</Button>
          <Button variant="secondary" onClick={() => toast('Export started', { body: 'customers-sep-2026.csv will download shortly.', tone: 'success' })}><Download className="h-4 w-4" /> Export CSV</Button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-ink-100">
          <div className="flex items-center gap-2 h-10 rounded-xl bg-canvas px-3 max-w-md">
            <Search className="h-4 w-4 text-ink-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, phone or tag" className="flex-1 bg-transparent outline-none text-sm" />
          </div>
        </div>

        {state === 'error' ? (
          <ErrorState title="Couldn’t load customers" body="The connection to the QFlow server timed out." onRetry={() => { setState('loading'); setTimeout(() => setState('ready'), 700) }} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-ink-400">
                  <th className="px-5 py-3 font-bold">Customer</th><th className="px-5 py-3 font-bold">Tag</th><th className="px-5 py-3 font-bold">Visits</th><th className="px-5 py-3 font-bold">Avg wait</th><th className="px-5 py-3 font-bold">NPS</th><th className="px-5 py-3 font-bold">Last visit</th>
                </tr>
              </thead>
              <tbody>
                {state === 'loading'
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-t border-ink-100"><td className="px-5 py-4" colSpan={6}><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-4 w-48" /><Skeleton className="h-4 w-20 ml-auto" /></div></td></tr>
                    ))
                  : list.map((c, i) => (
                      <tr key={c.name} onClick={() => setSel(c)} className="border-t border-ink-100 hover:bg-canvas/70 cursor-pointer transition">
                        <td className="px-5 py-3.5"><div className="flex items-center gap-3"><Avatar initials={c.name.split(' ').map((x) => x[0]).join('')} gradient={grad[i % grad.length]} /><div><p className="font-semibold">{c.name}</p><p className="text-xs text-ink-400">{c.phone}</p></div></div></td>
                        <td className="px-5 py-3.5"><Badge tone={tagTone[c.tag]}>{c.tag}</Badge></td>
                        <td className="px-5 py-3.5 num font-bold">{c.visits}</td>
                        <td className="px-5 py-3.5 text-ink-600">{c.avgWait}</td>
                        <td className="px-5 py-3.5"><span className={c.nps >= 9 ? 'text-success-600 font-bold' : c.nps >= 7 ? 'text-amber-600 font-bold' : 'text-coral-600 font-bold'}>{c.nps}</span></td>
                        <td className="px-5 py-3.5 text-ink-500">{c.last}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {state === 'ready' && list.length === 0 && <EmptyState icon={UserSearch} title="No customers found" body={`Nothing matches “${q}”.`} />}
          </div>
        )}
      </div>

      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.name} subtitle={sel?.phone} footer={<><Button variant="secondary" onClick={() => setSel(null)}>Close</Button><Button onClick={() => { toast('Message sent', { body: `SMS to ${sel.name}`, tone: 'success' }); setSel(null) }}><MessageSquare className="h-4 w-4" /> Send message</Button></>}>
        {sel && (
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-canvas p-3"><p className="text-[11px] text-ink-400">Visits</p><p className="num text-xl font-bold">{sel.visits}</p></div>
            <div className="rounded-2xl bg-canvas p-3"><p className="text-[11px] text-ink-400">Avg wait</p><p className="num text-xl font-bold">{sel.avgWait}</p></div>
            <div className="rounded-2xl bg-canvas p-3"><p className="text-[11px] text-ink-400">NPS</p><p className="num text-xl font-bold">{sel.nps}</p></div>
          </div>
        )}
      </Modal>
    </div>
  )
}
