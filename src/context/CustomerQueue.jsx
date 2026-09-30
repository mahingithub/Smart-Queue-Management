import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { businesses, customerNotifications, myToken } from '../data/mock'
import { useToast } from '../components/ui/Toast'

const Ctx = createContext(null)

const TICK_MS = 9000 // demo: queue advances one person every 9s while tracking

function addMinutes(base, mins) {
  const [time, ampm] = base.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  const d = new Date(2026, 8, 30, h, m + mins)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function CustomerQueueProvider({ children }) {
  const toast = useToast()
  const [queue, setQueue] = useState({
    active: true,
    ...myToken,
    total: 12,
    frozen: false,
    freezeUsed: false,
    onMyWay: false,
    mode: 'walkin',
  })
  const [notifications, setNotifications] = useState(customerNotifications.slice(2))
  const [live, setLive] = useState(false) // simulation running
  const notified = useRef(new Set())

  const pushNotification = useCallback((n) => {
    setNotifications((list) => [{ id: Date.now() + Math.random(), time: 'Just now', unread: true, ...n }, ...list])
  }, [])

  // Demo simulation — the queue moves while "live" is on.
  useEffect(() => {
    if (!live || !queue.active || queue.frozen || queue.ahead <= 0) return
    const t = setInterval(() => {
      setQueue((q) => {
        if (q.ahead <= 0 || q.frozen) return q
        const ahead = q.ahead - 1
        const num = parseInt(q.serving.split('-')[1], 10) + 1
        return { ...q, ahead, serving: `${q.serving.split('-')[0]}-${String(num).padStart(3, '0')}`, wait: Math.max(0, Math.round(ahead * 2.6)) }
      })
    }, TICK_MS)
    return () => clearInterval(t)
  }, [live, queue.active, queue.frozen, queue.ahead])

  // Milestone notifications.
  useEffect(() => {
    if (!queue.active) return
    const key = `${queue.token}-${queue.ahead}`
    if (notified.current.has(key)) return
    const map = {
      5: { type: 'ahead', title: 'Only 5 people are ahead of you.', body: `${queue.business} · Estimated turn ${queue.estTime}`, tone: 'notify' },
      3: { type: 'almost', title: 'You’re almost there.', body: 'Only 3 people ahead — a good time to head over.', tone: 'notify' },
      1: { type: 'next', title: 'You’re next!', body: 'Please make your way to the waiting area.', tone: 'warning' },
      0: { type: 'turn', title: `It’s your turn — please proceed to ${queue.counter}.`, body: `${queue.business} · Token ${queue.token}`, tone: 'success' },
    }
    const m = map[queue.ahead]
    if (m && live) {
      notified.current.add(key)
      pushNotification({ type: m.type, title: m.title, body: m.body })
      toast(m.title, { body: m.body, tone: m.tone, duration: 5000 })
    }
  }, [queue.ahead, queue.active, queue.token, queue.business, queue.counter, queue.estTime, live, pushNotification, toast])

  const joinQueue = useCallback(({ businessId, serviceId, party, mode, slot }) => {
    const b = businesses.find((x) => x.id === businessId) || businesses[0]
    const s = b.services.find((x) => x.id === serviceId) || b.services[0]
    const num = parseInt(b.currentToken.split('-')[1], 10) + s.people + 1 - (b.id === 'citycare' && s.id === 'gen' ? 5 : 0)
    const token = `${s.prefix}-${String(num).padStart(3, '0')}`
    const ahead = b.id === 'citycare' && s.id === 'gen' ? 7 : Math.max(2, Math.min(s.people, 9))
    const wait = mode === 'scheduled' ? 0 : Math.round(ahead * 2.6)
    const next = {
      active: true,
      token,
      business: b.name,
      businessId: b.id,
      service: s.name,
      date: 'Wed, 30 Sep 2026',
      joinedAt: '11:12 AM',
      estTime: mode === 'scheduled' ? slot : addMinutes('11:22 AM', wait),
      ahead,
      total: ahead + 4,
      serving: `${s.prefix}-${String(num - ahead - 1).padStart(3, '0')}`,
      wait,
      counter: 'Counter 03',
      party,
      mode,
      frozen: false,
      freezeUsed: false,
      onMyWay: false,
    }
    notified.current = new Set()
    setQueue(next)
    pushNotification({ type: 'joined', title: `You joined the queue at ${b.name}`, body: `Token ${token} · ${s.name}` })
    return next
  }, [pushNotification])

  const leaveQueue = useCallback(() => {
    setQueue((q) => ({ ...q, active: false }))
    setLive(false)
  }, [])

  const toggleFreeze = useCallback(() => {
    setQueue((q) => (q.frozen ? { ...q, frozen: false } : q.freezeUsed ? q : { ...q, frozen: true, freezeUsed: true }))
  }, [])

  const setOnMyWay = useCallback(() => setQueue((q) => ({ ...q, onMyWay: true })), [])
  const advance = useCallback(() => {
    setLive(true)
    setQueue((q) => {
      if (q.ahead <= 0) return q
      const ahead = q.ahead - 1
      const num = parseInt(q.serving.split('-')[1], 10) + 1
      return { ...q, ahead, serving: `${q.serving.split('-')[0]}-${String(num).padStart(3, '0')}`, wait: Math.round(ahead * 2.6) }
    })
  }, [])
  const resetDemo = useCallback(() => {
    notified.current = new Set()
    setQueue((q) => ({ ...q, ...myToken, total: 12, active: true, frozen: false, freezeUsed: false, onMyWay: false }))
  }, [])

  const markAllRead = useCallback(() => setNotifications((l) => l.map((n) => ({ ...n, unread: false }))), [])
  const clearNotifications = useCallback(() => setNotifications([]), [])

  return (
    <Ctx.Provider
      value={{ queue, live, setLive, joinQueue, leaveQueue, toggleFreeze, setOnMyWay, advance, resetDemo, notifications, markAllRead, clearNotifications }}
    >
      {children}
    </Ctx.Provider>
  )
}

export const useCustomerQueue = () => useContext(Ctx)
