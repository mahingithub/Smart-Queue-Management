import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Users, Timer, CheckCircle2, UserX, ArrowUpRight, ArrowDownRight, PhoneCall, ArrowRight, Megaphone, Monitor, CalendarDays } from 'lucide-react'
import { useBusinessQueue } from '../../context/BusinessQueue'
import { hourlyVolume, monthTrend, waitTrend, appointments, priorities } from '../../data/mock'
import { BarChart, Sparkline, SERIES } from '../../components/charts/Charts'
import { Badge, Button, LiveDot, Skeleton } from '../../components/ui/primitives'
import QueueControl, { AIAssistantCard } from './QueueControl'
import { cn } from '../../lib/cn'

export function StatTile({ icon: I, label, value, unit, delta, good, up, spark, color, loading }) {
  return (
    <div className="card p-5 group hover:shadow-lift transition-shadow">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink-500"><span className="h-8 w-8 rounded-xl bg-canvas grid place-items-center"><I className="h-4 w-4 text-ink-600" /></span>{label}</span>
        {delta && (
          <span className={cn('inline-flex items-center gap-0.5 text-xs font-bold rounded-lg px-1.5 py-0.5', good ? 'text-success-600 bg-success-50' : 'text-coral-600 bg-coral-50')}>
            {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}{delta}
          </span>
        )}
      </div>
      {loading ? <Skeleton className="h-10 w-24 mt-4" /> : (
        <p className="mt-4 num text-[40px] leading-none font-bold">{value}<span className="text-base font-sans font-semibold text-ink-400 ml-1.5">{unit}</span></p>
      )}
      {spark && <Sparkline data={spark} color={color} className="mt-4 h-9" />}
    </div>
  )
}

export default function Overview() {
  const { openWalkIn } = useOutletContext()
  const { byStatus, counters, callNext, completed, settings } = useBusinessQueue()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const servedToday = 181 + completed.length
  const nowServing = counters.map((c) => ({ ...c, token: byStatus.serving.find((q) => q.counter === c.id) }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink-400">Wednesday, 30 September</p>
          <h1 className="text-3xl sm:text-[40px] font-extrabold tracking-tight leading-tight mt-1">Good morning, <span className="text-gradient">CityCare Clinic</span></h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone={settings.closed ? 'danger' : settings.paused ? 'warning' : 'success'}><LiveDot color={settings.closed ? 'bg-coral-500' : settings.paused ? 'bg-amber-500' : 'bg-success-500'} className="mr-0.5" /> {settings.closed ? 'Queue Closed' : settings.paused ? 'Queue Paused' : 'Queue Active'}</Badge>
            <Badge tone="neutral">Open 8:00 AM – 9:00 PM</Badge>
            <Badge tone="brand">{counters.filter((c) => c.status !== 'paused').length} of {counters.length} counters open</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" to="/tv"><Monitor className="h-4 w-4" /> TV mode</Button>
          <Button onClick={callNext}><PhoneCall className="h-4 w-4" /> Call Next</Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile loading={loading} icon={Users} label="Waiting Now" value={byStatus.waiting.length + 30} unit="waiting" delta="12%" good={false} up spark={[28, 31, 36, 34, 40, 38, 42]} color={SERIES[0]} />
        <StatTile loading={loading} icon={Timer} label="Average Wait Time" value="18" unit="min" delta="22%" good spark={waitTrend.slice(-12)} color={SERIES[1]} />
        <StatTile loading={loading} icon={CheckCircle2} label="Served Today" value={servedToday} unit="served" delta="9%" good up spark={monthTrend.slice(-12)} color={SERIES[0]} />
        <StatTile loading={loading} icon={UserX} label="No-show Rate" value="4.8" unit="%" delta="1.2 pts" good spark={[7.2, 6.8, 6.1, 5.9, 5.6, 5.1, 4.8]} color={SERIES[2]} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Live snapshot */}
        <div className="xl:col-span-2 space-y-6">
          <div className="card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">Now serving <LiveDot /></h2>
                <p className="text-xs text-ink-400">Real-time over WebSockets · synced 2s ago</p>
              </div>
              <Link to="/business/live" className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">Open live board <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {nowServing.map((c) => (
                <div key={c.id} className={cn('relative rounded-2xl p-4 overflow-hidden', c.token ? 'bg-ink text-white' : c.status === 'paused' ? 'bg-canvas text-ink-400' : 'bg-brand-50')}>
                  {c.token && <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand-500/50 blur-2xl" />}
                  <p className={cn('relative text-[11px] font-bold uppercase tracking-wider', c.token ? 'text-white/50' : 'text-ink-400')}>{c.name}</p>
                  <p className="relative num text-3xl font-bold mt-2">{c.token ? c.token.id : c.status === 'paused' ? '—' : 'Free'}</p>
                  <p className={cn('relative text-xs mt-1 truncate', c.token ? 'text-white/60' : 'text-ink-500')}>{c.token ? c.token.customer : c.status === 'paused' ? 'Paused' : 'Ready for next'}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <h3 className="text-sm font-bold">Up next</h3>
              <span className="text-xs text-ink-400">{byStatus.waiting.length} waiting · priority first</span>
            </div>
            <div className="mt-3 divide-y divide-ink-100">
              {byStatus.waiting.slice(0, 5).map((q, i) => (
                <div key={q.id} className="flex items-center gap-4 py-3">
                  <span className="num w-5 text-xs text-ink-300 font-bold">{i + 1}</span>
                  <span className="num font-bold w-16">{q.id}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold truncate">{q.customer}</span>
                    <span className="block text-xs text-ink-400 truncate">{q.service} · {q.type}</span>
                  </span>
                  {q.priority !== 'none' && <span className={cn('hidden sm:inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold', priorities[q.priority].cls)}>{priorities[q.priority].label}</span>}
                  <span className="num text-sm text-ink-500 w-14 text-right">{q.wait}m</span>
                </div>
              ))}
            </div>
          </div>

          {/* Peak hours */}
          <div className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Today’s queue volume</h2>
                <p className="text-xs text-ink-400">Customers joining per hour</p>
              </div>
              <div className="rounded-2xl bg-brand-50 px-3.5 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Peak hours</p>
                <p className="num font-bold text-brand-900">10 AM – 12 PM</p>
              </div>
            </div>
            <BarChart data={hourlyVolume} highlight={[2, 3, 4]} className="mt-4" unit=" customers" />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <AIAssistantCard />
          <QueueControl onAddWalkIn={openWalkIn} />
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold tracking-tight flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-600" /> Next appointments</h3>
              <Link to="/business/appointments" className="text-xs font-semibold text-brand-600">View all</Link>
            </div>
            <div className="mt-3 space-y-2">
              {appointments.filter((a) => a.status === 'Upcoming').slice(0, 3).map((a) => (
                <div key={a.time + a.name} className="flex items-center gap-3 rounded-xl bg-canvas p-3">
                  <span className="num text-sm font-bold w-12">{a.time}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold truncate">{a.name}</span>
                    <span className="block text-xs text-ink-400 truncate">{a.service}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-card bg-gradient-to-br from-mint-50 to-brand-50 p-5 flex items-start gap-3">
            <Megaphone className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">Insight</p>
              <p className="text-sm text-ink-600 mt-0.5">Tuesdays between 11 AM and 1 PM have <b>38% higher</b> queue volume.</p>
              <Link to="/business/analytics" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-600">See analytics <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
