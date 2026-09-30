import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertTriangle } from 'lucide-react'
import { Button } from './primitives'
import { cn } from '../../lib/cn'

export function Modal({ open, onClose, title, subtitle, children, footer, className, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  const w = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-lg', xl: 'sm:max-w-2xl' }[size]
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={cn('relative w-full bg-white rounded-t-[28px] sm:rounded-[28px] shadow-lift animate-scale-in max-h-[92vh] overflow-y-auto scrollbar-thin', w, className)}>
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
            <div>
              {title && <h3 className="text-xl font-bold tracking-tight">{title}</h3>}
              {subtitle && <p className="text-sm text-ink-500 mt-1">{subtitle}</p>}
            </div>
            {onClose && (
              <button onClick={onClose} className="h-9 w-9 shrink-0 rounded-xl grid place-items-center text-ink-400 hover:text-ink hover:bg-ink-100" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 pb-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}

export function ConfirmModal({ open, onClose, onConfirm, title, body, confirmLabel = 'Confirm', tone = 'danger', icon: IconCmp = AlertTriangle }) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center -mt-4">
        <div className={cn('h-14 w-14 rounded-2xl grid place-items-center mb-4', tone === 'danger' ? 'bg-coral-50 text-coral-500' : 'bg-brand-50 text-brand-600')}>
          <IconCmp className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        {body && <p className="text-sm text-ink-500 mt-2">{body}</p>}
        <div className="grid grid-cols-2 gap-2 w-full mt-6">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  )
}
