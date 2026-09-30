import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastProvider } from './components/ui/Toast'
import { CustomerQueueProvider } from './context/CustomerQueue'
import { BusinessQueueProvider } from './context/BusinessQueue'
import { Logo } from './components/ui/primitives'

const Landing = lazy(() => import('./pages/Landing'))
const DemoHub = lazy(() => import('./pages/DemoHub'))
const NotFound = lazy(() => import('./pages/NotFound'))
const TVMode = lazy(() => import('./pages/TVMode'))

const CustomerShell = lazy(() => import('./pages/customer/CustomerShell'))
const Home = lazy(() => import('./pages/customer/Home'))
const BusinessDetails = lazy(() => import('./pages/customer/BusinessDetails'))
const JoinQueue = lazy(() => import('./pages/customer/JoinQueue'))
const Track = lazy(() => import('./pages/customer/Track'))
const Pass = lazy(() => import('./pages/customer/Pass'))
const Notifications = lazy(() => import('./pages/customer/Notifications'))
const History = lazy(() => import('./pages/customer/History'))
const ScanJoin = lazy(() => import('./pages/customer/ScanJoin'))
const Search = lazy(() => import('./pages/customer/Search'))

const DashboardLayout = lazy(() => import('./pages/business/DashboardLayout'))
const Overview = lazy(() => import('./pages/business/Overview'))
const LiveQueue = lazy(() => import('./pages/business/LiveQueue'))
const Appointments = lazy(() => import('./pages/business/Appointments'))
const Customers = lazy(() => import('./pages/business/Customers'))
const Counters = lazy(() => import('./pages/business/Counters'))
const Staff = lazy(() => import('./pages/business/Staff'))
const Services = lazy(() => import('./pages/business/Services'))
const Analytics = lazy(() => import('./pages/business/Analytics'))
const BizNotifications = lazy(() => import('./pages/business/BizNotifications'))
const Settings = lazy(() => import('./pages/business/Settings'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Loader() {
  return (
    <div className="min-h-screen grid place-items-center bg-canvas">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <Logo size="lg" />
        <div className="h-1 w-32 rounded-full bg-ink-100 overflow-hidden">
          <div className="h-full w-1/2 bg-brand-gradient rounded-full animate-[marquee_1s_linear_infinite]" />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <CustomerQueueProvider>
        <BusinessQueueProvider>
          <ScrollToTop />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/demo" element={<DemoHub />} />
              <Route path="/tv" element={<TVMode />} />

              <Route path="/app" element={<CustomerShell />}>
                <Route index element={<Home />} />
                <Route path="search" element={<Search />} />
                <Route path="business/:id" element={<BusinessDetails />} />
                <Route path="join/:id" element={<JoinQueue />} />
                <Route path="scan" element={<ScanJoin />} />
                <Route path="track" element={<Track />} />
                <Route path="pass" element={<Pass />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="history" element={<History />} />
              </Route>

              <Route path="/business" element={<DashboardLayout />}>
                <Route index element={<Overview />} />
                <Route path="live" element={<LiveQueue />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="customers" element={<Customers />} />
                <Route path="counters" element={<Counters />} />
                <Route path="staff" element={<Staff />} />
                <Route path="services" element={<Services />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="notifications" element={<BizNotifications />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BusinessQueueProvider>
      </CustomerQueueProvider>
    </ToastProvider>
  )
}
