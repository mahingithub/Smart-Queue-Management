import { useMemo } from 'react'

// Decorative, deterministic QR-style code (visual only — not a scannable QR).
function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return ((h >>> 0) % 1000) / 1000
  }
}

export default function QRCode({ value = 'QFLOW', size = 160, fg = '#0B1026', bg = 'transparent', className }) {
  const n = 25
  const cells = useMemo(() => {
    const rnd = hash(value)
    const out = []
    const inFinder = (x, y) =>
      (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9)
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) if (!inFinder(x, y) && rnd() > 0.52) out.push([x, y])
    return out
  }, [value])

  const finder = (x, y) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" rx="2" fill={fg} />
      <rect x={x + 1} y={y + 1} width="5" height="5" rx="1.4" fill={bg === 'transparent' ? '#fff' : bg} />
      <rect x={x + 2} y={y + 2} width="3" height="3" rx="0.9" fill={fg} />
    </g>
  )

  return (
    <svg viewBox={`0 0 ${n} ${n}`} width={size} height={size} className={className} shapeRendering="geometricPrecision" aria-label="QR code">
      {bg !== 'transparent' && <rect width={n} height={n} fill={bg} />}
      {cells.map(([x, y]) => (
        <rect key={`${x}_${y}`} x={x + 0.08} y={y + 0.08} width="0.84" height="0.84" rx="0.28" fill={fg} />
      ))}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  )
}
