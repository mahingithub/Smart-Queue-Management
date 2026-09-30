// Minimal production server for Railway (or any Node host).
// Serves the Vite build and falls back to index.html for client-side routes.
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, 'dist')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static(dist, { maxAge: '1h', index: false }))
app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')))

app.listen(port, '0.0.0.0', () => {
  console.log(`QFlow UI running on http://0.0.0.0:${port}`)
})
