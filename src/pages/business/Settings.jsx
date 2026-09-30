import { useState } from 'react'
import { Upload, Check, Monitor } from 'lucide-react'
import { useBusinessQueue } from '../../context/BusinessQueue'
import { Button, Segmented, Toggle } from '../../components/ui/primitives'
import QRCode from '../../components/ui/QRCode'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../lib/cn'

const brandColors = ['#5B3DF5', '#0AA58B', '#F4635A', '#D98A0B', '#0B1026', '#2563EB']
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Settings() {
  const toast = useToast()
  const { settings, setSettings, announcement, setAnnouncement } = useBusinessQueue()
  const [tab, setTab] = useState('Branding')
  const [color, setColor] = useState(brandColors[0])
  const [name, setName] = useState('CityCare Clinic')
  const [open, setOpen] = useState({ Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false })
  const set = (p) => setSettings((s) => ({ ...s, ...p }))
  const save = () => toast('Settings saved', { body: 'Changes are live for customers.', tone: 'success' })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-ink-500 mt-1">Customize branding, hours and queue rules.</p>
        </div>
        <Segmented options={['Branding', 'Hours', 'Queue rules', 'QR & Display']} value={tab} onChange={setTab} />
      </div>

      {tab === 'Branding' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card p-6 space-y-5">
            <div className="flex items-center gap-4">
              <span className="h-16 w-16 rounded-[20px] grid place-items-center text-white font-display font-bold text-lg" style={{ background: color }}>{name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
              <Button variant="secondary" size="sm" onClick={() => toast('Logo uploaded', { body: 'citycare-logo.svg', tone: 'success' })}><Upload className="h-4 w-4" /> Upload logo</Button>
            </div>
            <label className="block"><span className="text-xs font-semibold text-ink-500">Business name</span><input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full h-11 rounded-xl bg-canvas px-3.5 text-sm outline-none focus:ring-1 focus:ring-brand-500" /></label>
            <div>
              <span className="text-xs font-semibold text-ink-500">Brand color</span>
              <div className="mt-2 flex gap-2">
                {brandColors.map((c) => (
                  <button key={c} onClick={() => setColor(c)} className="h-10 w-10 rounded-xl grid place-items-center ring-offset-2 transition" style={{ background: c, boxShadow: color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : undefined }} aria-label={c}>{color === c && <Check className="h-4 w-4 text-white" />}</button>
                ))}
              </div>
            </div>
            <Button onClick={save}>Save changes</Button>
          </div>
          <div className="card p-6">
            <p className="eyebrow">Live preview · customer app</p>
            <div className="mt-4 rounded-[24px] bg-canvas p-5">
              <div className="rounded-[20px] p-5 text-white relative overflow-hidden" style={{ background: color }}>
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[14px] border-white/15" />
                <p className="text-xs text-white/70">{name}</p>
                <p className="num text-5xl font-bold mt-2">A-031</p>
                <p className="text-sm text-white/80 mt-1">7 people ahead · ~18 min</p>
              </div>
              <button className="mt-3 w-full h-11 rounded-2xl text-white text-sm font-bold" style={{ background: color }}>Join Queue</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'Hours' && (
        <div className="card p-6 max-w-2xl">
          <div className="divide-y divide-ink-100">
            {days.map((d) => (
              <div key={d} className="flex items-center gap-4 py-3.5">
                <span className="w-12 font-bold">{d}</span>
                <Toggle checked={open[d]} label={`${d} open`} onChange={(v) => setOpen({ ...open, [d]: v })} />
                {open[d] ? (
                  <span className="flex items-center gap-2 text-sm">
                    <input type="time" defaultValue="08:00" className="h-9 rounded-lg bg-canvas px-2 outline-none" /> –
                    <input type="time" defaultValue="21:00" className="h-9 rounded-lg bg-canvas px-2 outline-none" />
                  </span>
                ) : <span className="text-sm text-ink-400">Closed</span>}
              </div>
            ))}
          </div>
          <Button className="mt-4" onClick={save}>Save hours</Button>
        </div>
      )}

      {tab === 'Queue rules' && (
        <div className="card p-6 max-w-2xl space-y-5">
          {[
            ['groupQueue', 'Group queue', 'Families can join with one shared token'],
            ['allowFreeze', 'Queue freeze', 'Customers can pause their place once per visit'],
          ].map(([k, l, d]) => (
            <div key={k} className="flex items-center justify-between gap-4">
              <div><p className="font-semibold">{l}</p><p className="text-sm text-ink-500">{d}</p></div>
              <Toggle checked={settings[k]} label={l} onChange={(v) => set({ [k]: v })} />
            </div>
          ))}
          <div className="flex items-center justify-between gap-4">
            <div><p className="font-semibold">No-show detection</p><p className="text-sm text-ink-500">Auto-skip if a called customer doesn’t arrive within</p></div>
            <Segmented options={[{ value: 3, label: '3m' }, { value: 5, label: '5m' }, { value: 10, label: '10m' }]} value={settings.noShowMinutes} onChange={(v) => set({ noShowMinutes: v })} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div><p className="font-semibold">Maximum queue size</p><p className="text-sm text-ink-500">New joins pause when full</p></div>
            <input type="number" value={settings.maxSize} onChange={(e) => set({ maxSize: Number(e.target.value) })} className="num w-24 h-10 rounded-xl bg-canvas px-3 text-right font-bold outline-none" />
          </div>
          <Button onClick={save}>Save rules</Button>
        </div>
      )}

      {tab === 'QR & Display' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-bold">Entrance QR poster</h2>
            <p className="text-sm text-ink-500">Customers scan → choose service → get a token. No account required.</p>
            <div className="mt-5 mx-auto max-w-[280px] rounded-[28px] bg-brand-gradient p-6 text-white text-center shadow-glow">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Skip the line</p>
              <p className="text-2xl font-extrabold mt-1">Scan to join</p>
              <div className="mt-4 bg-white rounded-2xl p-4 inline-block"><QRCode value="citycare-entrance" size={160} /></div>
              <p className="text-sm mt-4 text-white/80">{name}</p>
            </div>
            <div className="mt-5 flex gap-2 justify-center">
              <Button variant="secondary" size="sm" onClick={() => toast('Poster PDF downloaded', { tone: 'success' })}>Download PDF</Button>
              <Button variant="secondary" size="sm" onClick={() => toast('Link copied', { body: 'qflow.app/j/citycare', tone: 'success' })}>Copy link</Button>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="font-bold">TV display announcement</h2>
            <p className="text-sm text-ink-500">Scrolls along the bottom of the waiting-room screen.</p>
            <textarea value={announcement} onChange={(e) => setAnnouncement(e.target.value)} rows={3} className="mt-4 w-full rounded-xl bg-canvas p-3 text-sm outline-none resize-none focus:ring-1 focus:ring-brand-500" />
            <div className="mt-3 flex gap-2">
              <Button onClick={() => toast('Announcement updated', { body: 'Now showing on the TV display.', tone: 'success' })}>Update display</Button>
              <Button variant="secondary" to="/tv"><Monitor className="h-4 w-4" /> Open TV mode</Button>
            </div>
            <div className={cn('mt-5 rounded-2xl bg-ink text-white p-4 text-sm')}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-mint-400">Preview</p>
              <p className="mt-1">{announcement || '—'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
