import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { initialCompleted, initialCounters, initialQueue } from '../data/mock'
import { useToast } from '../components/ui/Toast'

const Ctx = createContext(null)
const now = () => new Date(2026, 8, 30, 11, 14 + Math.floor(Math.random() * 6)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

export function BusinessQueueProvider({ children }) {
  const toast = useToast()
  const [queue, setQueue] = useState(initialQueue)
  const [completed, setCompleted] = useState(initialCompleted)
  const [counters, setCounters] = useState(initialCounters)
  const [nextNum, setNextNum] = useState(39)
  const [settings, setSettings] = useState({
    paused: false,
    closed: false,
    maxSize: 60,
    serviceTime: 11,
    allowFreeze: true,
    groupQueue: true,
    priorityEnabled: { elderly: true, pregnant: true, disabled: true, emergency: true, vip: true },
    noShowMinutes: 5,
  })
  const [announcement, setAnnouncement] = useState('Please keep your digital token ready. Masks are recommended in the waiting area.')

  const byStatus = useMemo(() => {
    const rank = { emergency: 0, vip: 1, pregnant: 1, elderly: 1, disabled: 1, none: 1 } // emergencies jump the line; other priorities are flagged
    const waiting = queue.filter((q) => q.status === 'waiting')
    return {
      waiting: [...waiting].sort((a, b) => rank[a.priority] - rank[b.priority] || b.wait - a.wait),
      called: queue.filter((q) => q.status === 'called'),
      serving: queue.filter((q) => q.status === 'serving'),
    }
  }, [queue])

  const freeCounter = useCallback(
    (list = queue) => {
      const busy = new Set(list.filter((q) => q.status === 'serving' || q.status === 'called').map((q) => q.counter))
      return counters.find((c) => c.status !== 'paused' && !busy.has(c.id))?.id ?? counters.find((c) => c.status !== 'paused')?.id ?? 1
    },
    [counters, queue],
  )

  const move = useCallback(
    (id, status) => {
      const item = queue.find((q) => q.id === id)
      if (!item || item.status === status) return
      if (status === 'completed') {
        setCompleted((c) => [{ id: item.id, customer: item.customer, service: item.service, served: now(), duration: `${6 + Math.floor(Math.random() * 10)} min`, counter: item.counter || 1 }, ...c])
        setQueue((list) => list.filter((q) => q.id !== id))
        return
      }
      const counter = status === 'waiting' ? null : item.counter ?? freeCounter(queue)
      setQueue((list) => list.map((q) => (q.id === id ? { ...q, status, counter } : q)))
    },
    [queue, freeCounter],
  )

  const callNext = useCallback(() => {
    const next = byStatus.waiting[0]
    if (!next) {
      toast('Queue is empty', { body: 'No customers are waiting right now.', tone: 'info' })
      return
    }
    move(next.id, 'called')
    toast(`Calling ${next.id}`, { body: `${next.customer} · notified via push & SMS`, tone: 'notify' })
  }, [byStatus.waiting, move, toast])

  const skip = useCallback(
    (id) => {
      setQueue((list) => {
        const item = list.find((q) => q.id === id)
        if (!item) return list
        return [...list.filter((q) => q.id !== id), { ...item, status: 'waiting', counter: null, wait: 0, skipped: true }]
      })
      toast(`${id} skipped`, { body: 'Moved to the end of the waiting list.', tone: 'warning' })
    },
    [toast],
  )

  const recall = useCallback((id) => toast(`Recalling ${id}`, { body: 'Announcement sent to TV display and customer phone.', tone: 'notify' }), [toast])

  const complete = useCallback(
    (id) => {
      move(id, 'completed')
      toast(`${id} completed`, { body: 'Moved to today’s history.', tone: 'success' })
    },
    [move, toast],
  )

  const transfer = useCallback(
    (id, counterId) => {
      setQueue((list) => list.map((q) => (q.id === id ? { ...q, counter: counterId } : q)))
      toast(`${id} transferred`, { body: `Now assigned to Counter 0${counterId}.`, tone: 'info' })
    },
    [toast],
  )

  const setPriority = useCallback((id, priority) => setQueue((list) => list.map((q) => (q.id === id ? { ...q, priority } : q))), [])

  const addWalkIn = useCallback(
    ({ customer, service, priority = 'none', party = 1, phone = '' }) => {
      const id = `A-${String(nextNum).padStart(3, '0')}`
      setNextNum((n) => n + 1)
      setQueue((list) => [...list, { id, customer: customer || 'Walk-in guest', service, wait: 0, priority, status: 'waiting', counter: null, party, type: 'Walk-in', phone }])
      toast(`Token ${id} issued`, { body: `${customer || 'Walk-in guest'} · ${service}`, tone: 'success' })
      return id
    },
    [nextNum, toast],
  )

  const updateCounter = useCallback((id, patch) => setCounters((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c))), [])
  const addCounter = useCallback(() => {
    setCounters((list) => [...list, { id: list.length + 1, name: `Counter 0${list.length + 1}`, staff: null, status: 'available', service: 'General Consultation', servedToday: 0 }])
  }, [])

  const value = {
    queue, byStatus, completed, counters, settings, setSettings, announcement, setAnnouncement,
    move, callNext, skip, recall, complete, transfer, setPriority, addWalkIn, updateCounter, addCounter,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useBusinessQueue = () => useContext(Ctx)
