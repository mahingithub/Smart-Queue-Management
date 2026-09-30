import { useState } from 'react'
import { BellOff, CheckCheck, BellRing, Users, Sparkles, MapPin, Megaphone, Trash2, MessageCircle, Smartphone, Mail } from 'lucide-react'
import { useCustomerQueue } from '../../context/CustomerQueue'
import { Button, EmptyState, Segmented, Toggle } from '../../components/ui/primitives'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../lib/cn'

const typeStyle = {
  turn: { icon: Megaphone, cls: 'bg-success-500 text-white' },
  next: { icon: BellRing, cls: 'bg-amber-500 text-white' },
  almost: { icon: MapPin, cls: 'bg-brand-600 text-white' },
  ahead: { icon: Users, cls: 'bg-brand-50 text-brand-600' },
  joined: { icon: CheckCheck, cls: 'bg-mint-50 text-mint-600' },
  promo: { icon: Sparkles, cls: 'bg-coral-50 text-coral-600' },
}

export default function Notifications() {
  const toast = useToast()
  const { notifications, markAllRead, clearNotifications } = useCustomerQueue()
  const [tab, setTab] = useState('All')
  const [channels, setChannels] = useState({ push: true, sms: true, whatsapp: false })
  const list = tab === 'Unread' ? notifications.filter((n) => n.unread) : notifications

  return (
    <div className="px-5 pt-4 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight">Alerts</h1>
          <p className="text-sm text-ink-500">Live updates about your turn.</p>
        </div>
        <button onClick={() => { markAllRead(); toast('All caught up', { tone: 'success' }) }} className="text-xs font-bold text-brand-600 h-9 px-3 rounded-xl hover:bg-brand-50">Mark all read</button>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <Segmented options={['All', 'Unread']} value={tab} onChange={setTab} />
        {notifications.length > 0 && <button onClick={clearNotifications} className="h-9 w-9 rounded-xl grid place-items-center text-ink-400 hover:text-coral-500 hover:bg-coral-50" aria-label="Clear all"><Trash2 className="h-4 w-4" /></button>}
      </div>

      <div className="mt-4 space-y-2.5">
        {list.map((n, i) => {
          const T = typeStyle[n.type] || typeStyle.ahead
          return (
            <div key={n.id} className={cn('relative flex gap-3 rounded-[20px] p-4 transition animate-fade-up', n.unread ? 'bg-white shadow-lift' : 'bg-white/60')} style={{ animationDelay: `${i * 40}ms` }}>
              <span className={cn('h-11 w-11 rounded-2xl grid place-items-center shrink-0', T.cls)}><T.icon className="h-5 w-5" /></span>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm leading-snug', n.unread ? 'font-bold' : 'font-semibold text-ink-700')}>{n.title}</p>
                <p className="text-xs text-ink-500 mt-0.5">{n.body}</p>
                <p className="text-[11px] text-ink-400 mt-1.5">{n.time}</p>
              </div>
              {n.unread && <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-brand-600" />}
            </div>
          )
        })}
        {list.length === 0 && (
          <div className="card">
            <EmptyState icon={BellOff} title={tab === 'Unread' ? 'No unread alerts' : 'No notifications yet'} body="Join a queue and we’ll keep you posted as your turn approaches." />
          </div>
        )}
      </div>

      <div className="mt-6 card p-5">
        <h3 className="font-bold">Notify me via</h3>
        <p className="text-xs text-ink-500 mt-0.5">At 5 ahead, 3 ahead, when next & on your turn.</p>
        <div className="mt-4 space-y-3.5">
          {[
            ['push', Smartphone, 'Push notifications'],
            ['sms', Mail, 'SMS · +880 1712-•••678'],
            ['whatsapp', MessageCircle, 'WhatsApp'],
          ].map(([k, I, l]) => (
            <div key={k} className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-xl bg-canvas grid place-items-center text-ink-600"><I className="h-4 w-4" /></span>
              <span className="flex-1 text-sm font-semibold">{l}</span>
              <Toggle checked={channels[k]} label={l} onChange={(v) => { setChannels({ ...channels, [k]: v }); toast(`${l.split(' ·')[0]} ${v ? 'enabled' : 'disabled'}`, { tone: 'info' }) }} />
            </div>
          ))}
        </div>
        <Button variant="soft" size="sm" className="w-full mt-5" onClick={() => toast('You’re next!', { body: 'Test notification from CityCare Clinic.', tone: 'notify' })}>Send test notification</Button>
      </div>
    </div>
  )
}
