import { useState } from 'react'
import { Download, TrendingUp, Lightbulb, Star, UserMinus, Users, Timer } from 'lucide-react'
import { counterPerformance, heatmap, hourlyVolume, monthTrend, satisfaction, servicePerformance, waitTrend, weekServed } from '../../data/mock'
import { AreaChart, BarChart, Donut, Heatmap, Meter, SERIES } from '../../components/charts/Charts'
import { Button, Segmented } from '../../components/ui/primitives'
import { useToast } from '../../components/ui/Toast'
import { StatTile } from './Overview'
import { cn } from '../../lib/cn'

const dayLabels = Array.from({ length: 30 }, (_, i) => `Sep ${i + 1}`)

export default function Analytics() {
  const toast = useToast()
  const [range, setRange] = useState('30D')
  const slice = range === '7D' ? -7 : range === '14D' ? -14 : 0
  const served = slice ? monthTrend.slice(slice) : monthTrend
  const waits = slice ? waitTrend.slice(slice) : waitTrend
  const labels = slice ? dayLabels.slice(slice) : dayLabels

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Analytics</h1>
          <p className="text-ink-500 mt-1">How your queue performs — and where to improve.</p>
        </div>
        <div className="flex gap-2">
          <Segmented options={['7D', '14D', '30D']} value={range} onChange={setRange} />
          <Button variant="secondary" onClick={() => toast('Report exported', { body: `QFlow analytics · last ${range}`, tone: 'success' })}><Download className="h-4 w-4" /> Export</Button>
        </div>
      </div>

      {/* Insight */}
      <div className="relative overflow-hidden rounded-[24px] bg-ink text-white p-6 sm:p-7">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/50 blur-3xl" />
        <div className="absolute right-40 -bottom-24 h-56 w-56 rounded-full bg-mint-400/20 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-5">
          <span className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-coral-500 grid place-items-center shrink-0"><Lightbulb className="h-6 w-6" /></span>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Insight of the week</p>
            <p className="text-xl sm:text-2xl font-bold tracking-tight mt-1">Tuesdays between 11 AM and 1 PM have <span className="text-mint-400">38% higher</span> queue volume.</p>
            <p className="text-sm text-white/60 mt-1">Add one extra counter on Tuesdays 10:30 AM – 1:30 PM to keep waits under 15 min.</p>
          </div>
          <Button variant="mint" onClick={() => toast('Tuesday staffing rule created', { body: 'Counter 04 auto-opens 10:30 AM – 1:30 PM.', tone: 'success' })}>Apply schedule</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile icon={Users} label="Customers served" value={served.reduce((a, b) => a + b, 0).toLocaleString()} unit="" delta="14%" good up spark={served} color={SERIES[0]} />
        <StatTile icon={Timer} label="Average wait" value={Math.round(waits.reduce((a, b) => a + b, 0) / waits.length)} unit="min" delta="31%" good spark={waits} color={SERIES[1]} />
        <StatTile icon={UserMinus} label="Queue abandonment" value="3.1" unit="%" delta="2.4 pts" good spark={[6.2, 5.8, 5.1, 4.6, 4.2, 3.8, 3.1]} color={SERIES[2]} />
        <StatTile icon={Star} label="Satisfaction" value={satisfaction.score} unit="/ 5" delta="0.3" good up spark={[4.3, 4.4, 4.5, 4.5, 4.6, 4.7, 4.8]} color={SERIES[0]} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div><h2 className="font-bold tracking-tight">Customers served</h2><p className="text-xs text-ink-400">Daily · September 2026</p></div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-success-600 bg-success-50 rounded-lg px-2 py-1"><TrendingUp className="h-3.5 w-3.5" />+14%</span>
          </div>
          <AreaChart data={served} labels={labels} color={SERIES[0]} className="mt-4" unit=" served" />
        </div>
        <div className="card p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div><h2 className="font-bold tracking-tight">Average wait time</h2><p className="text-xs text-ink-400">Minutes · lower is better</p></div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-success-600 bg-success-50 rounded-lg px-2 py-1">31 → 18 min</span>
          </div>
          <AreaChart data={waits} labels={labels} color={SERIES[1]} className="mt-4" unit=" min" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="font-bold tracking-tight">Peak hours</h2><p className="text-xs text-ink-400">Queue volume by weekday & hour</p></div>
            <div className="rounded-2xl bg-brand-50 px-3.5 py-2"><p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Peak</p><p className="num font-bold text-brand-900">10 AM – 12 PM</p></div>
          </div>
          <Heatmap data={heatmap} rows={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} cols={hourlyVolume.map((h) => h.h)} className="mt-5" />
        </div>
        <div className="card p-5 sm:p-6">
          <h2 className="font-bold tracking-tight">Customer satisfaction</h2>
          <p className="text-xs text-ink-400">{satisfaction.responses.toLocaleString()} post-visit ratings</p>
          <div className="mt-5 flex justify-center">
            <Donut
              size={170}
              thickness={16}
              segments={satisfaction.breakdown.map((v, i) => ({ value: v, label: `${5 - i}★`, color: ['#5B3DF5', '#8B6DFF', '#CEC2FF', '#DDE0EB', '#BFC3D6'][i] }))}
              center={<div><p className="num text-4xl font-bold">{satisfaction.score}</p><p className="text-xs text-ink-400">out of 5</p></div>}
            />
          </div>
          <div className="mt-5 space-y-2">
            {satisfaction.breakdown.map((v, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="w-6 font-semibold text-ink-600">{5 - i}★</span>
                <Meter value={v} max={100} color={['bg-brand-600', 'bg-brand-400', 'bg-brand-200', 'bg-ink-200', 'bg-ink-300'][i]} className="flex-1" />
                <span className="num w-9 text-right font-semibold">{v}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="card p-5 sm:p-6">
          <h2 className="font-bold tracking-tight">Served by weekday</h2>
          <p className="text-xs text-ink-400">Last 7 days</p>
          <BarChart data={weekServed} valueKey="served" labelKey="d" highlight={[1]} className="mt-4" unit=" served" />
        </div>
        <div className="card p-5 sm:p-6">
          <h2 className="font-bold tracking-tight">Service performance</h2>
          <p className="text-xs text-ink-400">Avg handling time vs target</p>
          <div className="mt-5 space-y-4">
            {servicePerformance.map((s) => {
              const over = s.avg > s.target
              return (
                <div key={s.name}>
                  <div className="flex justify-between text-sm"><span className="font-semibold">{s.name}</span><span className={cn('num font-bold', over ? 'text-coral-600' : 'text-success-600')}>{s.avg}m <span className="text-ink-400 font-medium">/ {s.target}m</span></span></div>
                  <div className="relative mt-2 h-2 rounded-full bg-ink-100">
                    <div className={cn('h-full rounded-full', over ? 'bg-coral-500' : 'bg-brand-600')} style={{ width: `${(s.avg / 20) * 100}%` }} />
                    <span className="absolute -top-1 h-4 w-0.5 bg-ink rounded" style={{ left: `${(s.target / 20) * 100}%` }} title="Target" />
                  </div>
                  <p className="text-[11px] text-ink-400 mt-1">{s.served} served · {s.sat}★</p>
                </div>
              )
            })}
          </div>
        </div>
        <div className="card p-5 sm:p-6">
          <h2 className="font-bold tracking-tight">Counter performance</h2>
          <p className="text-xs text-ink-400">Served today · utilisation</p>
          <div className="mt-5 space-y-3">
            {counterPerformance.map((c) => (
              <div key={c.name} className="flex items-center gap-3 rounded-2xl bg-canvas p-3">
                <span className="num h-10 w-10 rounded-xl bg-white grid place-items-center font-bold text-sm">{c.name.slice(-2)}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm"><span className="font-semibold">{c.name}</span><span className="num font-bold">{c.value}</span></div>
                  <Meter value={c.util} max={1} color={c.util > 0.8 ? 'bg-brand-600' : c.util > 0.5 ? 'bg-mint-500' : 'bg-amber-500'} className="mt-1.5" />
                </div>
                <span className="num text-xs text-ink-500 w-10 text-right">{Math.round(c.util * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
