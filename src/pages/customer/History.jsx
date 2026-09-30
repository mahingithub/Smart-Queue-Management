import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Hourglass, RotateCcw, Calendar, Timer } from 'lucide-react'
import { history } from '../../data/mock'
import { Badge, BizLogo, Segmented } from '../../components/ui/primitives'
import { useToast } from '../../components/ui/Toast'

const tone = { Active: 'brand', Completed: 'success', Cancelled: 'neutral', 'No-show': 'danger' }
const weeks = [52, 71, 38, 111]

export default function History() {
  const navigate = useNavigate()
  const toast = useToast()
  const [filter, setFilter] = useState('All')
  const list = history.filter((h) => filter === 'All' || (filter === 'Completed' ? h.status === 'Completed' : h.status !== 'Completed'))
  const max = Math.max(...weeks)

  return (
    <div className="px-5 pt-4 animate-fade-in">
      <h1 className="text-[28px] font-extrabold tracking-tight">History</h1>
      <p className="text-sm text-ink-500">Every visit, and the time you got back.</p>

      {/* Saved */}
      <div className="mt-5 relative overflow-hidden rounded-[26px] bg-brand-gradient text-white p-5 shadow-glow">
        <div className="absolute -right-12 -bottom-12 h-44 w-44 rounded-full border-[20px] border-white/10" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Waiting time saved</p>
            <p className="num text-[44px] leading-none font-bold mt-2">4h 32m</p>
            <p className="text-sm text-white/70 mt-1">this month · 6 visits</p>
          </div>
          <span className="h-11 w-11 rounded-2xl bg-white/15 grid place-items-center"><Hourglass className="h-5 w-5" /></span>
        </div>
        <div className="relative mt-5 flex items-end gap-2 h-16">
          {weeks.map((w, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full rounded-lg bg-white/25 relative overflow-hidden" style={{ height: `${(w / max) * 48}px` }}>
                {i === weeks.length - 1 && <div className="absolute inset-0 bg-mint-400" />}
              </div>
              <span className="text-[10px] text-white/60">W{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="card p-4"><p className="text-xs text-ink-400">Avg. actual wait</p><p className="num text-2xl font-bold mt-1">13 min</p></div>
        <div className="card p-4"><p className="text-xs text-ink-400">On-time arrivals</p><p className="num text-2xl font-bold mt-1">94%</p></div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight">Previous visits</h2>
        <Segmented options={['All', 'Completed', 'Other']} value={filter} onChange={setFilter} />
      </div>

      <div className="mt-3 space-y-2.5">
        {list.map((h, i) => (
          <div key={h.id} className="card p-4 animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="flex items-start gap-3">
              <BizLogo initials={h.initials} gradient={h.logoBg} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold truncate">{h.business}</p>
                  <Badge tone={tone[h.status]}>{h.status}</Badge>
                </div>
                <p className="text-xs text-ink-500">{h.service}</p>
                <div className="mt-2.5 flex items-center gap-4 text-xs text-ink-500">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{h.date}</span>
                  <span className="flex items-center gap-1"><Timer className="h-3.5 w-3.5" />Waited {h.wait}</span>
                  {h.saved !== '—' && <span className="font-semibold text-success-600">+{h.saved}</span>}
                </div>
              </div>
            </div>
            {h.status !== 'Active' && (
              <button
                onClick={() => { const b = h.business.split(' ')[0].toLowerCase(); const map = { citycare: 'citycare', meridian: 'meridian', lumière: 'lumiere', precision: 'precision', regional: 'passport', saffron: 'saffron', fixhub: 'fixhub' }; toast('Rebooking…', { tone: 'info' }); navigate(`/app/business/${map[b] || 'citycare'}`) }}
                className="mt-3 w-full h-9 rounded-xl bg-canvas hover:bg-ink-100 text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Queue again
              </button>
            )}
            {h.status === 'Active' && (
              <button onClick={() => navigate('/app/track')} className="mt-3 w-full h-9 rounded-xl bg-brand-50 text-brand-700 text-xs font-bold transition hover:bg-brand-100">Track live</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
