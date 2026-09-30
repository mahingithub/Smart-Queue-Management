import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Zap, ImageIcon, BadgeCheck, ChevronRight, Timer, Users } from 'lucide-react'
import { businesses } from '../../data/mock'
import { BizLogo, Button } from '../../components/ui/primitives'
import Icon from '../../components/ui/Icon'
import QRCode from '../../components/ui/QRCode'
import { cn } from '../../lib/cn'

export default function ScanJoin() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('scanning') // scanning → found
  const [torch, setTorch] = useState(false)
  const b = businesses[0]

  useEffect(() => {
    if (phase !== 'scanning') return
    const t = setTimeout(() => setPhase('found'), 2200)
    return () => clearTimeout(t)
  }, [phase])

  return (
    <div className="h-full min-h-full bg-ink text-white relative overflow-hidden flex flex-col">
      {/* camera feed */}
      <div className={cn('absolute inset-0 transition-colors', torch ? 'bg-[#2a2f4d]' : 'bg-[#141833]')}>
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
      </div>

      <div className="relative px-5 pt-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="h-11 w-11 rounded-2xl bg-white/10 grid place-items-center" aria-label="Close"><X className="h-5 w-5" /></button>
        <p className="font-bold">Scan to join</p>
        <button onClick={() => setTorch(!torch)} className={cn('h-11 w-11 rounded-2xl grid place-items-center transition', torch ? 'bg-amber-500 text-ink' : 'bg-white/10')} aria-label="Torch"><Zap className="h-5 w-5" /></button>
      </div>

      <div className="relative flex-1 flex flex-col items-center pt-14">
        <div className="relative h-64 w-64">
          {/* poster */}
          <div className={cn('absolute inset-6 rounded-3xl bg-white p-4 transition-all duration-700', phase === 'found' ? 'scale-95 opacity-40' : 'opacity-90')}>
            <QRCode value="citycare-entrance" size={160} className="w-full h-full" />
          </div>
          {/* frame corners */}
          {['top-0 left-0 border-l-4 border-t-4 rounded-tl-3xl', 'top-0 right-0 border-r-4 border-t-4 rounded-tr-3xl', 'bottom-0 left-0 border-l-4 border-b-4 rounded-bl-3xl', 'bottom-0 right-0 border-r-4 border-b-4 rounded-br-3xl'].map((c) => (
            <span key={c} className={cn('absolute h-12 w-12 transition-colors duration-500', c, phase === 'found' ? 'border-mint-400' : 'border-white')} />
          ))}
          {phase === 'scanning' && <span className="absolute left-4 right-4 h-0.5 bg-mint-400 shadow-[0_0_20px_4px_rgba(46,230,197,0.6)] animate-[float_2s_ease-in-out_infinite] top-1/2" />}
        </div>
        <p className="mt-8 text-center text-white/70 text-sm px-10">
          {phase === 'scanning' ? 'Point your camera at the QFlow code at the entrance.' : 'Code recognised!'}
        </p>
        <p className="mt-2 text-xs text-white/40">No account or app download required</p>
        {phase === 'scanning' && (
          <button onClick={() => setPhase('found')} className="mt-6 inline-flex items-center gap-2 h-10 px-4 rounded-2xl bg-white/10 text-sm font-semibold"><ImageIcon className="h-4 w-4" /> Upload from photos</button>
        )}
      </div>

      {phase === 'found' && (
        <div className="relative bg-white text-ink rounded-t-[32px] px-5 pt-5 pb-8 animate-fade-up">
          <div className="mx-auto h-1 w-10 rounded-full bg-ink-200 mb-4" />
          <div className="flex items-center gap-3">
            <BizLogo initials={b.initials} gradient={b.logoBg} />
            <div className="flex-1">
              <p className="font-bold flex items-center gap-1">{b.name}<BadgeCheck className="h-4 w-4 text-brand-600" /></p>
              <p className="text-xs text-ink-500">Main entrance · Choose a service</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {b.services.slice(0, 3).map((s) => (
              <button key={s.id} onClick={() => navigate(`/app/join/${b.id}?service=${s.id}`)} className="w-full flex items-center gap-3 rounded-2xl bg-canvas hover:bg-brand-50 p-3 text-left transition group">
                <span className="h-10 w-10 rounded-xl bg-white grid place-items-center text-brand-600"><Icon name={s.icon} className="h-5 w-5" /></span>
                <span className="flex-1">
                  <span className="block text-sm font-bold">{s.name}</span>
                  <span className="flex gap-3 text-[11px] text-ink-500"><span className="flex items-center gap-1"><Timer className="h-3 w-3" />{s.wait} min</span><span className="flex items-center gap-1"><Users className="h-3 w-3" />{s.people}</span></span>
                </span>
                <ChevronRight className="h-4 w-4 text-ink-400 group-hover:translate-x-0.5 transition" />
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-3" onClick={() => setPhase('scanning')}>Scan again</Button>
        </div>
      )}
    </div>
  )
}
