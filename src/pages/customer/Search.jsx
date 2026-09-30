import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search as SearchIcon, X, Clock, TrendingUp } from 'lucide-react'
import { businesses } from '../../data/mock'
import { EmptyState } from '../../components/ui/primitives'
import { BusinessCard } from './Home'

const recent = ['Blood test', 'CityCare', 'Haircut', 'Passport']
const trending = ['Dental near me', 'Bank open now', 'X-Ray', 'Table for 2']

export default function Search() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const term = q.trim().toLowerCase()
  const results = term
    ? businesses.filter((b) => b.name.toLowerCase().includes(term) || b.categoryLabel.toLowerCase().includes(term) || b.category.includes(term) || b.services.some((s) => s.name.toLowerCase().includes(term)))
    : []

  return (
    <div className="px-5 pt-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="h-11 w-11 shrink-0 rounded-2xl bg-white shadow-soft grid place-items-center" aria-label="Back"><ArrowLeft className="h-5 w-5" /></button>
        <div className="flex-1 h-12 rounded-2xl bg-white shadow-soft ring-2 ring-brand-500/30 flex items-center gap-2 px-3.5">
          <SearchIcon className="h-5 w-5 text-brand-600" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clinic, salon, bank or service…" className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-ink-400 min-w-0" />
          {q && <button onClick={() => setQ('')} className="text-ink-400 hover:text-ink" aria-label="Clear"><X className="h-4 w-4" /></button>}
        </div>
      </div>

      {!term && (
        <div className="mt-6 space-y-6">
          <div>
            <p className="eyebrow mb-3">Recent</p>
            <div className="flex flex-wrap gap-2">
              {recent.map((r) => <button key={r} onClick={() => setQ(r)} className="h-9 px-3.5 rounded-xl bg-white shadow-soft text-sm font-semibold flex items-center gap-1.5 hover:shadow-lift transition"><Clock className="h-3.5 w-3.5 text-ink-400" />{r}</button>)}
            </div>
          </div>
          <div>
            <p className="eyebrow mb-3">Trending near you</p>
            <div className="space-y-1">
              {trending.map((r) => <button key={r} onClick={() => setQ(r.split(' ')[0])} className="w-full flex items-center gap-3 py-3 text-sm font-semibold border-b border-ink-100 last:border-0 text-left"><TrendingUp className="h-4 w-4 text-mint-500" />{r}</button>)}
            </div>
          </div>
        </div>
      )}

      {term && (
        <div className="mt-5 space-y-3">
          <p className="text-xs text-ink-400 font-medium">{results.length} result{results.length !== 1 && 's'} for “{q}”</p>
          {results.map((b) => <BusinessCard key={b.id} b={b} wide />)}
          {results.length === 0 && (
            <div className="card"><EmptyState icon={SearchIcon} title="No matches yet" body={`We couldn’t find “${q}”. Try a service like “dental” or “teller”.`} /></div>
          )}
        </div>
      )}
    </div>
  )
}
