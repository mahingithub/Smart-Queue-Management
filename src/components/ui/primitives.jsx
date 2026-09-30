import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw, Inbox } from 'lucide-react'
import { cn } from '../../lib/cn'

const variants = {
  primary:
    'bg-brand-gradient text-white shadow-glow hover:shadow-[0_16px_44px_-8px_rgba(91,61,245,0.7)] hover:-translate-y-px active:translate-y-0',
  dark: 'bg-ink text-white hover:bg-ink-800 shadow-lift hover:-translate-y-px active:translate-y-0',
  secondary: 'bg-white text-ink ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-ink-100/40 shadow-soft',
  ghost: 'text-ink-600 hover:text-ink hover:bg-ink-100/70',
  soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
  mint: 'bg-mint-400 text-ink hover:bg-mint-300 shadow-glow-mint hover:-translate-y-px',
  danger: 'bg-coral-500 text-white hover:bg-coral-600 shadow-[0_12px_30px_-10px_rgba(244,99,90,0.7)]',
  'danger-soft': 'bg-coral-50 text-coral-600 hover:bg-coral-100',
  white: 'bg-white text-ink hover:bg-white/90 shadow-lift hover:-translate-y-px',
  'glass-light': 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 backdrop-blur',
}
const sizes = {
  xs: 'h-8 px-3 text-xs gap-1.5 rounded-xl',
  sm: 'h-9 px-3.5 text-[13px] gap-1.5 rounded-xl',
  md: 'h-11 px-5 text-sm gap-2 rounded-2xl',
  lg: 'h-14 px-7 text-[15px] gap-2.5 rounded-2xl',
  icon: 'h-10 w-10 rounded-2xl justify-center',
  'icon-sm': 'h-8 w-8 rounded-xl justify-center',
}

export function Button({ as, to, href, variant = 'primary', size = 'md', className, children, loading, ...props }) {
  const cls = cn(
    'inline-flex items-center justify-center font-semibold whitespace-nowrap select-none transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className,
  )
  const content = (
    <>
      {loading && <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />}
      {children}
    </>
  )
  if (to) return <Link to={to} className={cls} {...props}>{content}</Link>
  if (href) return <a href={href} className={cls} {...props}>{content}</a>
  const Cmp = as || 'button'
  return <Cmp className={cls} type={Cmp === 'button' ? 'button' : undefined} {...props}>{content}</Cmp>
}

const badgeTones = {
  neutral: 'bg-ink-100 text-ink-600',
  brand: 'bg-brand-50 text-brand-700',
  mint: 'bg-mint-50 text-mint-600',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-coral-50 text-coral-600',
  dark: 'bg-ink text-white',
  glass: 'bg-white/15 text-white ring-1 ring-white/20 backdrop-blur',
}
export function Badge({ tone = 'neutral', className, children, dot }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none', badgeTones[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export function LiveDot({ className, color = 'bg-success-500' }) {
  return (
    <span className={cn('relative inline-flex h-2 w-2', className)}>
      <span className={cn('absolute inset-0 rounded-full animate-ping2', color)} />
      <span className={cn('relative inline-flex h-2 w-2 rounded-full', color)} />
    </span>
  )
}

export function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} />
}

export function EmptyState({ icon: IconCmp = Inbox, title, body, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center px-6 py-12', className)}>
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-3xl bg-brand-200 blur-2xl opacity-50" />
        <div className="relative h-16 w-16 rounded-3xl bg-white shadow-lift grid place-items-center text-brand-600">
          <IconCmp className="h-7 w-7" />
        </div>
      </div>
      <h3 className="text-lg font-bold tracking-tight">{title}</h3>
      {body && <p className="mt-1.5 max-w-xs text-sm text-ink-500">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', body = 'We couldn’t reach the queue server. Your place in line is safe.', onRetry, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center px-6 py-12', className)}>
      <div className="h-16 w-16 rounded-3xl bg-coral-50 text-coral-500 grid place-items-center mb-5">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm text-ink-500">{body}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" /> Try again
        </Button>
      )}
    </div>
  )
}

export function Logo({ className, light, size = 'md' }) {
  const s = size === 'sm' ? 'h-7 w-7 rounded-[10px]' : size === 'lg' ? 'h-11 w-11 rounded-2xl' : 'h-9 w-9 rounded-xl'
  const t = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className={cn('relative grid place-items-center bg-brand-gradient shadow-glow', s)}>
        <svg viewBox="0 0 32 32" className="h-[62%] w-[62%]" fill="none">
          <circle cx="14" cy="14" r="8.5" stroke="white" strokeWidth="3.6" />
          <path d="M19.5 19.5 26 26" stroke="#2EE6C5" strokeWidth="3.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className={cn('font-display font-bold tracking-tight', t, light ? 'text-white' : 'text-ink')}>
        QFlow
      </span>
    </span>
  )
}

export function BizLogo({ initials, gradient, className, size = 'md' }) {
  const s = { sm: 'h-9 w-9 text-xs rounded-xl', md: 'h-12 w-12 text-sm rounded-2xl', lg: 'h-16 w-16 text-lg rounded-[20px]' }[size]
  return (
    <span className={cn('grid place-items-center shrink-0 bg-gradient-to-br text-white font-display font-bold tracking-tight', gradient, s, className)}>
      {initials}
    </span>
  )
}

export function Avatar({ initials, gradient = 'from-brand-400 to-brand-600', className }) {
  return (
    <span className={cn('grid place-items-center shrink-0 rounded-full bg-gradient-to-br text-white font-semibold text-xs h-9 w-9', gradient, className)}>
      {initials}
    </span>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300', checked ? 'bg-brand-600' : 'bg-ink-200')}
    >
      <span className={cn('absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300', checked && 'translate-x-5')} />
    </button>
  )
}

export function Segmented({ options, value, onChange, className, dark }) {
  return (
    <div className={cn('inline-flex p-1 rounded-2xl', dark ? 'bg-white/10' : 'bg-ink-100/80', className)}>
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value
        const l = typeof o === 'string' ? o : o.label
        const active = v === value
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={cn(
              'px-3.5 h-8 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all',
              active ? (dark ? 'bg-white text-ink' : 'bg-white text-ink shadow-soft') : dark ? 'text-white/70 hover:text-white' : 'text-ink-500 hover:text-ink',
            )}
          >
            {l}
          </button>
        )
      })}
    </div>
  )
}

export function Stars({ value, className }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-semibold', className)}>
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-amber-500"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z" /></svg>
      {value}
    </span>
  )
}
