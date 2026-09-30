import { useId } from 'react'
import { cn } from '../../lib/cn'

/**
 * Signature QFlow visual: an orbital queue ring.
 * - Inner arc = your progress through the queue.
 * - Orbiting dots = people still ahead of you.
 */
export default function OrbitalRing({ token = 'A-031', ahead = 7, total = 12, serving = 'A-024', size = 300, dark = false, className, label = 'Your token', showOrbit = true }) {
  const id = useId().replace(/:/g, '')
  const c = size / 2
  const r = size * 0.36
  const orbitR = size * 0.465
  const stroke = Math.max(8, size * 0.045)
  const circ = 2 * Math.PI * r
  const progress = Math.max(0.02, Math.min(1, 1 - ahead / Math.max(total, 1)))
  const angle = progress * 360 - 90
  const knobX = c + r * Math.cos((angle * Math.PI) / 180)
  const knobY = c + r * Math.sin((angle * Math.PI) / 180)
  const dots = Array.from({ length: ahead })

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      {/* ambient glow */}
      <div className="absolute inset-[18%] rounded-full bg-brand-500/30 blur-3xl" />
      <div className="absolute inset-[30%] rounded-full bg-mint-400/25 blur-2xl translate-x-6 translate-y-4" />

      <svg viewBox={`0 0 ${size} ${size}`} className="relative" width={size} height={size}>
        <defs>
          <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6D4AFF" />
            <stop offset="55%" stopColor="#8B6DFF" />
            <stop offset="100%" stopColor="#2EE6C5" />
          </linearGradient>
          <radialGradient id={`core-${id}`}>
            <stop offset="0%" stopColor={dark ? '#1c2244' : '#FFFFFF'} />
            <stop offset="100%" stopColor={dark ? '#11162f' : '#F4F2FF'} />
          </radialGradient>
        </defs>

        {showOrbit && (
          <>
            <circle cx={c} cy={c} r={orbitR} fill="none" stroke={dark ? 'rgba(255,255,255,0.12)' : 'rgba(91,61,245,0.16)'} strokeWidth="1" strokeDasharray="2 6" />
            <circle cx={c} cy={c} r={size * 0.41} fill="none" stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(11,16,38,0.05)'} strokeWidth="1" />
            <g className="animate-orbit-slow" style={{ transformOrigin: `${c}px ${c}px` }}>
              {dots.map((_, i) => {
                const a = (-90 + 20 + (i * 300) / Math.max(ahead, 1)) * (Math.PI / 180)
                const x = c + orbitR * Math.cos(a)
                const y = c + orbitR * Math.sin(a)
                const isNext = i === 0
                return (
                  <g key={i}>
                    {isNext && <circle cx={x} cy={y} r={size * 0.03} fill="#2EE6C5" opacity="0.25" />}
                    <circle cx={x} cy={y} r={isNext ? size * 0.017 : size * 0.012} fill={isNext ? '#2EE6C5' : dark ? '#AD99FF' : '#8B6DFF'} opacity={isNext ? 1 : 0.55 + (0.45 * (ahead - i)) / ahead} />
                  </g>
                )
              })}
            </g>
          </>
        )}

        {/* core */}
        <circle cx={c} cy={c} r={r - stroke} fill={`url(#core-${id})`} />
        {/* track */}
        <circle cx={c} cy={c} r={r} fill="none" stroke={dark ? 'rgba(255,255,255,0.08)' : '#ECEEF5'} strokeWidth={stroke} />
        {/* tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i * 6 - 90) * (Math.PI / 180)
          const r1 = r - stroke / 2 - 6
          const r2 = r1 - (i % 5 === 0 ? 6 : 3)
          return (
            <line
              key={i}
              x1={c + r1 * Math.cos(a)} y1={c + r1 * Math.sin(a)}
              x2={c + r2 * Math.cos(a)} y2={c + r2 * Math.sin(a)}
              stroke={dark ? 'rgba(255,255,255,0.15)' : 'rgba(11,16,38,0.12)'}
              strokeWidth="1"
            />
          )
        })}
        {/* progress */}
        <circle
          cx={c} cy={c} r={r}
          fill="none"
          stroke={`url(#g-${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress)}
          transform={`rotate(-90 ${c} ${c})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.2,.7,.2,1)' }}
        />
        {/* knob */}
        <g style={{ transition: 'all 1.2s cubic-bezier(.2,.7,.2,1)' }}>
          <circle cx={knobX} cy={knobY} r={stroke * 0.95} fill="#2EE6C5" opacity="0.3" />
          <circle cx={knobX} cy={knobY} r={stroke * 0.55} fill="white" stroke="#2EE6C5" strokeWidth="3" />
        </g>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className={cn('text-[10px] font-semibold uppercase tracking-[0.18em]', dark ? 'text-white/50' : 'text-ink-400')}>{label}</span>
        <span className={cn('num font-bold leading-none mt-1.5', dark ? 'text-white' : 'text-ink')} style={{ fontSize: size * 0.15 }}>
          {token}
        </span>
        {serving && (
          <span className={cn('mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', dark ? 'bg-white/10 text-white/80' : 'bg-brand-50 text-brand-700')}>
            <span className="h-1.5 w-1.5 rounded-full bg-mint-500 animate-blink" /> Serving {serving}
          </span>
        )}
      </div>
    </div>
  )
}
