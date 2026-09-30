import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { CheckCircle2, Info, AlertTriangle, XCircle, X, Bell } from 'lucide-react'
import { cn } from '../../lib/cn'

const ToastCtx = createContext(null)

const tones = {
  success: { icon: CheckCircle2, cls: 'text-success-500' },
  info: { icon: Info, cls: 'text-brand-500' },
  warning: { icon: AlertTriangle, cls: 'text-amber-500' },
  error: { icon: XCircle, cls: 'text-coral-500' },
  notify: { icon: Bell, cls: 'text-mint-500' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const toast = useCallback(
    (title, opts = {}) => {
      const id = ++idRef.current
      setToasts((t) => [...t.slice(-3), { id, title, tone: 'success', ...opts }])
      setTimeout(() => dismiss(id), opts.duration || 3600)
      return id
    },
    [dismiss],
  )

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed z-[100] bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 sm:bottom-5 flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-[380px] pointer-events-none" aria-live="polite">
        {toasts.map((t) => {
          const T = tones[t.tone] || tones.info
          return (
            <div
              key={t.id}
              className="pointer-events-auto animate-slide-in-right flex items-start gap-3 rounded-2xl bg-ink text-white px-4 py-3.5 shadow-lift ring-1 ring-white/10"
            >
              <T.icon className={cn('h-5 w-5 mt-px shrink-0', T.cls)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-snug">{t.title}</p>
                {t.body && <p className="text-xs text-white/60 mt-0.5 leading-snug">{t.body}</p>}
              </div>
              {t.action && (
                <button onClick={() => { t.action.onClick(); dismiss(t.id) }} className="text-xs font-bold text-mint-400 hover:text-mint-300 mt-0.5">
                  {t.action.label}
                </button>
              )}
              <button onClick={() => dismiss(t.id)} className="text-white/40 hover:text-white" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
