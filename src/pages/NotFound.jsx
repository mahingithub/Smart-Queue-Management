import { Button, Logo } from '../components/ui/primitives'
import OrbitalRing from '../components/ui/OrbitalRing'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas bg-aurora grid place-items-center px-6">
      <div className="text-center flex flex-col items-center">
        <Logo />
        <OrbitalRing token="404" ahead={3} total={12} serving={null} size={260} label="Lost token" className="mt-8" />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">This page skipped the line.</h1>
        <p className="mt-2 text-ink-500">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="mt-6 flex gap-2">
          <Button to="/">Back home</Button>
          <Button variant="secondary" to="/demo">Open demo</Button>
        </div>
      </div>
    </div>
  )
}
