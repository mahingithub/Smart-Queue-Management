import { useState } from 'react'
import { MessageCircle, Smartphone, Mail, AlertTriangle, UserX, Sparkles, BellRing, Send } from 'lucide-react'
import { Badge, Button, Toggle } from '../../components/ui/primitives'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../lib/cn'

const feed = [
  { icon: AlertTriangle, cls: 'bg-amber-50 text-amber-600', title: 'Queue reached 80% capacity', body: '48 of 60 slots used for General Consultation.', time: '2 min ago', unread: true },
  { icon: UserX, cls: 'bg-coral-50 text-coral-600', title: 'No-show detected · A-022', body: 'Customer didn’t respond after 3 calls. Token auto-skipped.', time: '9 min ago', unread: true },
  { icon: Sparkles, cls: 'bg-brand-50 text-brand-600', title: 'AI suggestion: open Counter 4', body: 'Could cut average wait from 26 to 17 min.', time: '14 min ago', unread: true },
  { icon: BellRing, cls: 'bg-mint-50 text-mint-600', title: 'Dr. Arif Hasan started a break', body: 'Counter 04 paused automatically.', time: '32 min ago', unread: false },
]

const templates = [
  { key: 'ahead5', label: 'When 5 people are ahead', text: 'Only 5 people are ahead of you at CityCare Clinic. Estimated turn {time}.' },
  { key: 'ahead3', label: 'When 3 people are ahead', text: 'You’re almost there! 3 people ahead — please start heading over.' },
  { key: 'next', label: 'When customer is next', text: 'You’re next! Please make your way to the waiting area.' },
  { key: 'turn', label: 'On their turn', text: 'It’s your turn — please proceed to {counter}.' },
]

export default function BizNotifications() {
  const toast = useToast()
  const [channels, setChannels] = useState({ push: true, sms: true, whatsapp: true, email: false })
  const [enabled, setEnabled] = useState({ ahead5: true, ahead3: true, next: true, turn: true })
  const [broadcast, setBroadcast] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Notifications</h1>
        <p className="text-ink-500 mt-1">Operational alerts, customer messaging and channels.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="card p-5 sm:p-6">
            <div className="flex items-center justify-between"><h2 className="font-bold">Alerts</h2><Badge tone="danger">3 new</Badge></div>
            <div className="mt-4 space-y-2">
              {feed.map((f) => (
                <div key={f.title} className={cn('flex gap-3 rounded-2xl p-3.5', f.unread ? 'bg-canvas' : '')}>
                  <span className={cn('h-10 w-10 rounded-xl grid place-items-center shrink-0', f.cls)}><f.icon className="h-5 w-5" /></span>
                  <div className="flex-1"><p className="text-sm font-bold">{f.title}</p><p className="text-xs text-ink-500">{f.body}</p></div>
                  <span className="text-[11px] text-ink-400 whitespace-nowrap">{f.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="font-bold">Customer message triggers</h2>
            <p className="text-xs text-ink-400">Sent automatically as the queue moves.</p>
            <div className="mt-4 divide-y divide-ink-100">
              {templates.map((t) => (
                <div key={t.key} className="py-4 flex gap-4 items-start">
                  <div className="flex-1">
                    <p className="text-sm font-bold">{t.label}</p>
                    <p className="mt-1.5 text-sm text-ink-600 rounded-xl bg-canvas px-3 py-2">{t.text}</p>
                  </div>
                  <Toggle checked={enabled[t.key]} label={t.label} onChange={(v) => setEnabled({ ...enabled, [t.key]: v })} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="font-bold">Channels</h2>
            <div className="mt-4 space-y-3.5">
              {[['push', Smartphone, 'Push (PWA)', 'Free'], ['sms', Mail, 'SMS', '৳0.35 / msg'], ['whatsapp', MessageCircle, 'WhatsApp', '৳0.60 / msg'], ['email', Mail, 'Email', 'Free']].map(([k, I, l, c]) => (
                <div key={k} className="flex items-center gap-3">
                  <span className="h-9 w-9 rounded-xl bg-canvas grid place-items-center"><I className="h-4 w-4" /></span>
                  <span className="flex-1"><span className="block text-sm font-semibold">{l}</span><span className="block text-[11px] text-ink-400">{c}</span></span>
                  <Toggle checked={channels[k]} label={l} onChange={(v) => setChannels({ ...channels, [k]: v })} />
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="font-bold">Broadcast to waiting customers</h2>
            <p className="text-xs text-ink-400">Reaches everyone currently in the queue.</p>
            <textarea value={broadcast} onChange={(e) => setBroadcast(e.target.value)} rows={4} placeholder="e.g. Dr. Karim is running 10 minutes late. Your place is safe." className="mt-3 w-full rounded-xl bg-canvas p-3 text-sm outline-none resize-none focus:ring-1 focus:ring-brand-500" />
            <Button className="w-full mt-3" disabled={!broadcast.trim()} onClick={() => { toast('Broadcast sent to 42 customers', { body: broadcast, tone: 'success' }); setBroadcast('') }}><Send className="h-4 w-4" /> Send broadcast</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
