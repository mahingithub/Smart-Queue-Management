import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Share2, Heart, BadgeCheck, MapPin, Clock, Users, Timer, ChevronRight, Accessibility, Snowflake, UsersRound, Phone, Navigation } from 'lucide-react'
import { businesses } from '../../data/mock'
import { Badge, BizLogo, Button, ErrorState, LiveDot, Stars } from '../../components/ui/primitives'
import Icon from '../../components/ui/Icon'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../lib/cn'

export default function BusinessDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [fav, setFav] = useState(false)
  const b = businesses.find((x) => x.id === id)

  if (!b) {
    return (
      <div className="pt-16">
        <ErrorState title="Business not found" body="This QFlow link may have expired or the business moved." onRetry={() => navigate('/app')} />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Cover */}
      <div className={cn('relative h-56 bg-gradient-to-br overflow-hidden', b.cover)}>
        <div className="absolute inset-0 bg-dots opacity-30 mix-blend-overlay" />
        <div className="absolute -right-16 -top-10 h-64 w-64 rounded-full border-[28px] border-white/15" />
        <div className="absolute right-20 top-24 h-24 w-24 rounded-full border-[14px] border-white/10" />
        <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute top-4 inset-x-5 flex justify-between">
          <button onClick={() => navigate(-1)} className="h-11 w-11 rounded-2xl glass grid place-items-center" aria-label="Back"><ArrowLeft className="h-5 w-5" /></button>
          <div className="flex gap-2">
            <button onClick={() => toast('Link copied', { body: `qflow.app/${b.id}`, tone: 'success' })} className="h-11 w-11 rounded-2xl glass grid place-items-center" aria-label="Share"><Share2 className="h-[18px] w-[18px]" /></button>
            <button onClick={() => { setFav(!fav); toast(fav ? 'Removed from favourites' : 'Saved to favourites', { tone: 'success' }) }} className="h-11 w-11 rounded-2xl glass grid place-items-center" aria-label="Favourite">
              <Heart className={cn('h-[18px] w-[18px] transition', fav && 'fill-coral-500 text-coral-500 scale-110')} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative -mt-10 px-5">
        <div className="card p-5">
          <div className="flex items-start gap-4 -mt-12">
            <BizLogo initials={b.initials} gradient={b.logoBg} size="lg" className="ring-4 ring-white shadow-lift" />
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <h1 className="text-2xl font-extrabold tracking-tight">{b.name}</h1>
            {b.verified && <BadgeCheck className="h-5 w-5 text-brand-600 fill-brand-100" />}
          </div>
          <p className="text-sm text-ink-500">{b.categoryLabel}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-semibold"><Stars value={b.rating} /> <span className="text-ink-400">({b.reviews.toLocaleString()})</span></span>
            <Badge tone={b.open ? 'success' : 'danger'} dot>{b.open ? 'Open now' : 'Closed'}</Badge>
            <Badge tone="neutral"><Navigation className="h-3 w-3" />{b.distance}</Badge>
          </div>
          <div className="mt-4 space-y-2.5 text-sm">
            <p className="flex items-start gap-2.5 text-ink-600"><MapPin className="h-4 w-4 mt-0.5 text-ink-400 shrink-0" />{b.address}</p>
            <p className="flex items-center gap-2.5 text-ink-600"><Clock className="h-4 w-4 text-ink-400" />{b.hours}<span className="text-ink-300">·</span><span className="text-success-600 font-semibold">Mon–Sat</span></p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="secondary" size="sm" onClick={() => toast('Opening directions…', { body: `${b.distance} · about 7 min by car`, tone: 'info' })}><Navigation className="h-4 w-4" /> Directions</Button>
            <Button variant="secondary" size="sm" onClick={() => toast('Calling front desk…', { tone: 'info' })}><Phone className="h-4 w-4" /> Call</Button>
          </div>
        </div>

        {/* Live queue */}
        <div className="mt-4 relative overflow-hidden rounded-[24px] bg-ink text-white p-5 shadow-lift">
          <div className="absolute -right-16 -bottom-16 h-52 w-52 rounded-full bg-brand-500/40 blur-3xl" />
          <div className="absolute right-6 top-6 h-24 w-24 rounded-full border border-white/10" />
          <div className="absolute right-10 top-10 h-16 w-16 rounded-full border border-white/10" />
          <div className="relative flex items-center gap-2 text-xs font-semibold text-white/70"><LiveDot color="bg-mint-400" /> Live queue status</div>
          <p className="relative mt-3 text-xs text-white/50">Current token</p>
          <p className="relative num text-5xl font-bold tracking-tight">{b.currentToken}</p>
          <div className="relative mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3">
              <p className="text-[11px] text-white/50 flex items-center gap-1"><Users className="h-3 w-3" />Waiting</p>
              <p className="num text-2xl font-bold">{b.waiting} <span className="text-sm font-sans font-medium text-white/50">people</span></p>
            </div>
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3">
              <p className="text-[11px] text-white/50 flex items-center gap-1"><Timer className="h-3 w-3" />Estimated wait</p>
              <p className="num text-2xl font-bold">{b.estWait} <span className="text-sm font-sans font-medium text-white/50">min</span></p>
            </div>
          </div>
        </div>

        {/* Perks */}
        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-none -mx-5 px-5">
          {[
            [UsersRound, 'Group queue'],
            [Accessibility, 'Priority lanes'],
            [Snowflake, 'Queue freeze'],
          ].map(([I, l]) => (
            <span key={l} className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-white shadow-soft px-3 h-9 text-xs font-semibold text-ink-600"><I className="h-3.5 w-3.5 text-brand-600" />{l}</span>
          ))}
        </div>

        {/* Services */}
        <h2 className="mt-7 text-lg font-bold tracking-tight">Available services</h2>
        <div className="mt-3 space-y-3">
          {b.services.map((s, i) => (
            <div key={s.id} className="card p-4 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-3">
                <span className="h-11 w-11 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center"><Icon name={s.icon} className="h-5 w-5" /></span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{s.name}</p>
                  <p className="text-xs text-ink-400">{s.duration} · {s.fee}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="flex-1 flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 font-semibold"><Timer className="h-3.5 w-3.5 text-mint-600" />{s.wait} min</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-ink-500"><Users className="h-3.5 w-3.5" />{s.people} in queue</span>
                </span>
                <Button size="sm" disabled={!b.open} onClick={() => navigate(`/app/join/${b.id}?service=${s.id}`)}>Join Queue <ChevronRight className="h-4 w-4 -mr-1" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
