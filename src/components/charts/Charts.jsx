import { useEffect, useId, useMemo, useRef, useState } from 'react'

// Measure the rendered width so SVG text stays at its true pixel size.
function useWidth(fallback = 640) {
  const ref = useRef(null)
  const [w, setW] = useState(fallback)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setW(Math.max(200, Math.round(e.contentRect.width))))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, w]
}
import { cn } from '../../lib/cn'

// Validated categorical palette (light surface): indigo, teal, amber.
export const SERIES = ['#5B3DF5', '#0AA58B', '#D98A0B']

/** Smooth area chart with hover crosshair + tooltip. */
export function AreaChart({ data, height = 220, color = SERIES[0], format = (v) => v, labels, className, yTicks = 4, unit = '' }) {
  const id = useId().replace(/:/g, '')
  const [hover, setHover] = useState(null)
  const [ref, W] = useWidth()
  const H = height
  const pad = { t: 16, r: 8, b: labels ? 26 : 8, l: 34 }
  const max = Math.max(...data) * 1.12
  const min = 0
  const x = (i) => pad.l + (i * (W - pad.l - pad.r)) / (data.length - 1)
  const y = (v) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b)

  const path = useMemo(() => {
    let d = `M ${x(0)} ${y(data[0])}`
    for (let i = 1; i < data.length; i++) {
      const cx = (x(i - 1) + x(i)) / 2
      d += ` C ${cx} ${y(data[i - 1])}, ${cx} ${y(data[i])}, ${x(i)} ${y(data[i])}`
    }
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, height, W])
  const area = `${path} L ${x(data.length - 1)} ${H - pad.b} L ${x(0)} ${H - pad.b} Z`
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => (max / yTicks) * i)

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (data.length - 1))
    setHover(Math.max(0, Math.min(data.length - 1, i)))
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible" onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img">
        <defs>
          <linearGradient id={`a-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#ECEEF5" strokeDasharray={i === 0 ? '' : '3 4'} />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="fill-ink-400 text-[10px]">{Math.round(t)}</text>
          </g>
        ))}
        <path d={area} fill={`url(#a-${id})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" />
        {labels && labels.map((l, i) => {
          const step = Math.ceil(labels.length / Math.max(3, Math.floor(W / 80)))
          const show = (i % step === 0 && labels.length - 1 - i >= step / 2) || i === labels.length - 1
          return show && <text key={i} x={x(i)} y={H - 6} textAnchor={i === labels.length - 1 ? 'end' : 'middle'} className="fill-ink-400 text-[10px]">{l}</text>
        })}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="#0B1026" strokeOpacity="0.15" />
            <circle cx={x(hover)} cy={y(data[hover])} r="6" fill="white" stroke={color} strokeWidth="2.5" />
          </g>
        )}
        {hover === null && (
          <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="5" fill={color} stroke="white" strokeWidth="2" />
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-xl bg-ink px-3 py-2 text-xs text-white shadow-lift whitespace-nowrap"
          style={{ left: `${Math.min(88, Math.max(12, (x(hover) / W) * 100))}%`, top: `${(y(data[hover]) / H) * 100 - 4}%` }}
        >
          <span className="text-white/60">{labels ? labels[hover] : `#${hover + 1}`}</span>
          <span className="ml-2 font-bold">{format(data[hover])}{unit}</span>
        </div>
      )}
    </div>
  )
}

/** Vertical bar chart with rounded data-ends and per-bar tooltip. */
export function BarChart({ data, height = 220, highlight = [], color = SERIES[0], muted = '#CEC2FF', unit = '', className, valueKey = 'v', labelKey = 'h' }) {
  const [hover, setHover] = useState(null)
  const [ref, W] = useWidth()
  const H = height
  const pad = { t: 22, r: 4, b: 26, l: 4 }
  const max = Math.max(...data.map((d) => d[valueKey])) * 1.1
  const bw = (W - pad.l - pad.r) / data.length
  const barW = Math.min(34, bw - 6)

  return (
    <div ref={ref} className={cn('relative', className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img">
        <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="#DDE0EB" />
        {data.map((d, i) => {
          const h = ((H - pad.t - pad.b) * d[valueKey]) / max
          const cx = pad.l + bw * i + bw / 2
          const on = highlight.includes(i)
          const r = Math.min(6, barW / 2)
          const top = H - pad.b - h
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-default">
              <rect x={cx - bw / 2} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
              <path
                d={`M ${cx - barW / 2} ${H - pad.b} V ${top + r} Q ${cx - barW / 2} ${top} ${cx - barW / 2 + r} ${top} H ${cx + barW / 2 - r} Q ${cx + barW / 2} ${top} ${cx + barW / 2} ${top + r} V ${H - pad.b} Z`}
                fill={on ? color : muted}
                opacity={hover === null || hover === i ? 1 : 0.55}
                style={{ transition: 'opacity .2s' }}
              />
              {on && <text x={cx} y={top - 7} textAnchor="middle" className="fill-ink-700 text-[11px] font-semibold">{d[valueKey]}</text>}
              <text x={cx} y={H - 8} textAnchor="middle" className={cn('text-[10px]', on ? 'fill-ink-700 font-semibold' : 'fill-ink-400')}>{d[labelKey]}</text>
            </g>
          )
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-xl bg-ink px-3 py-2 text-xs text-white shadow-lift whitespace-nowrap"
          style={{ left: `${((pad.l + bw * hover + bw / 2) / W) * 100}%`, top: `${(1 - data[hover][valueKey] / max) * 70 + 5}%` }}
        >
          <span className="text-white/60">{data[hover][labelKey]}</span>
          <span className="ml-2 font-bold">{data[hover][valueKey]}{unit}</span>
        </div>
      )}
    </div>
  )
}

/** Tiny inline trend line for stat tiles. */
export function Sparkline({ data, color = SERIES[0], className, height = 36 }) {
  const id = useId().replace(/:/g, '')
  const W = 120
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((v, i) => [(i / (data.length - 1)) * W, height - 3 - ((v - min) / (max - min || 1)) * (height - 6)])
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className={cn('w-full', className)} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={`s-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.2" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${W} ${height} L 0 ${height} Z`} fill={`url(#s-${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** Donut / ring meter for a single share. */
export function Donut({ segments, size = 160, thickness = 16, center }) {
  const r = (size - thickness) / 2
  const c = size / 2
  const circ = 2 * Math.PI * r
  const total = segments.reduce((s, x) => s + x.value, 0)
  const gap = 3
  let acc = 0
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="#ECEEF5" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const len = (s.value / total) * circ
          const el = (
            <circle
              key={i}
              cx={c} cy={c} r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${Math.max(0, len - gap)} ${circ}`}
              strokeDashoffset={-acc}
              transform={`rotate(-90 ${c} ${c})`}
              strokeLinecap="butt"
            >
              <title>{`${s.label}: ${s.value}`}</title>
            </circle>
          )
          acc += len
          return el
        })}
      </svg>
      {center && <div className="absolute inset-0 grid place-items-center text-center">{center}</div>}
    </div>
  )
}

/** Day × hour heat map, single-hue sequential scale. */
export function Heatmap({ data, rows, cols, className }) {
  const [hover, setHover] = useState(null)
  // sequential indigo ramp (light → dark)
  const ramp = ['#F2EFFF', '#E6E0FF', '#CEC2FF', '#AD99FF', '#8B6DFF', '#6D4AFF', '#4A2DDB', '#261673']
  const colorFor = (v) => ramp[Math.min(ramp.length - 1, Math.floor(v * ramp.length))]
  return (
    <div className={cn('relative', className)}>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `36px repeat(${cols.length}, minmax(0,1fr))` }}>
        {data.map((row, ri) => (
          <div key={ri} className="contents">
            <div className="text-[11px] text-ink-400 font-medium flex items-center">{rows[ri]}</div>
            {row.map((v, ci) => (
              <div
                key={ci}
                onMouseEnter={() => setHover({ ri, ci, v })}
                onMouseLeave={() => setHover(null)}
                className={cn('aspect-[1.3] rounded-[6px] transition-transform hover:scale-110 hover:z-10', hover && hover.ri === ri && hover.ci === ci && 'ring-2 ring-ink')}
                style={{ background: colorFor(v) }}
              />
            ))}
          </div>
        ))}
        <div />
        {cols.map((c, i) => (
          <div key={i} className="text-[10px] text-ink-400 text-center pt-1">{i % 2 === 0 ? c : ''}</div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-ink-500">
        <span className="min-h-[16px]">
          {hover ? (
            <><b className="text-ink">{rows[hover.ri]} {cols[hover.ci]}</b> · {Math.round(hover.v * 64)} customers/hr</>
          ) : 'Hover a cell for details'}
        </span>
        <span className="flex items-center gap-1.5">
          Low
          {ramp.map((c) => <span key={c} className="h-2.5 w-3 rounded-sm" style={{ background: c }} />)}
          High
        </span>
      </div>
    </div>
  )
}

/** Horizontal meter bar. */
export function Meter({ value, max = 1, color = 'bg-brand-600', className }) {
  return (
    <div className={cn('h-2 rounded-full bg-ink-100 overflow-hidden', className)}>
      <div className={cn('h-full rounded-full transition-all duration-700', color)} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
    </div>
  )
}
