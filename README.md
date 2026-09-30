# QFlow: Smart Queue Management (UI prototype)

> **Skip the line. Keep your place.**

This is a frontend-only prototype of QFlow, built with **React 18, Tailwind CSS 3 and Vite**. There is no backend. All data is realistic mock data held in React state, and every button, modal, toast and drag-and-drop works, so clients can click through the whole product.

## What's inside

| Area | Route | Highlights |
| --- | --- | --- |
| Marketing landing page | `/` | Hero with a floating phone and dashboard, how-it-works, customer/business/notifications/analytics sections, industries, testimonials, pricing toggle, FAQ, sign-up modal |
| Demo hub | `/demo` | Entry point to every experience |
| Customer app (mobile, 390px) | `/app` | Home and discovery, search, business profile, 4-step join flow with success animation, **orbital live queue tracker**, boarding-pass style queue pass, QR join (no account), notifications, history |
| Business dashboard (desktop, 1440px) | `/business` | Overview metrics, Smart Queue Control, AI Queue Assistant, **drag-and-drop live queue board**, appointments (hybrid queue), customers, counters, staff, services, analytics, notifications, settings (branding, hours, rules, QR poster) |
| TV / waiting-room display | `/tv` | Huge “Now Serving” tiles, next tokens, scrolling announcement, QR join |

Tips for the demo:
- On **Customer app → Queue**, press **Simulate** to watch the queue move. Notifications fire at 5, 3 and 1 people ahead, and on your turn.
- In the dashboard, press **⌘K / Ctrl+K** for the command palette.
- The customer app, dashboard and TV display share live state. For example, calling a token on the dashboard updates the TV screen.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Production build

```bash
npm run build      # outputs dist/
npm start          # Express serves dist/ on $PORT (default 3000) with SPA fallback
```

## Deploy on Railway

1. Create a new Railway project → **Deploy from GitHub repo** → select this repository.
2. Railway picks up `railway.json`: it builds with `npm ci && npm run build` and starts with `npm start`.
3. Under **Settings → Networking**, click **Generate Domain**. The server listens on Railway's `$PORT` automatically.

No environment variables are required.

## Project structure

```
src/
  components/ui/       Button, Badge, Modal, Toast, Skeleton, Empty/Error states, QR, OrbitalRing…
  components/charts/   Lightweight SVG charts (area, bar, sparkline, donut, heatmap, meter)
  context/             CustomerQueue & BusinessQueue state (mock real-time simulation)
  data/mock.js         Realistic businesses, tokens, staff, analytics, pricing, FAQ
  pages/               Landing, DemoHub, TVMode, customer/*, business/*
server.js              Minimal Express static server for Railway
```

## Design system

- **Type:** Plus Jakarta Sans (UI) and Space Grotesk (numbers and tokens)
- **Colors:** electric indigo `#5B3DF5` (primary), mint `#2EE6C5` (accent), green `#16B96B` (success), amber `#F5A524` (warning), coral `#F4635A` (danger), cool off-white canvas `#F4F5FA`, near-black navy ink `#0B1026`
- **Shape:** 18–24px rounded cards, soft shadows, glass only on floating layers
- **Motion:** fade/scale entrances, orbiting queue dots, animated progress ring, confetti on joining; `prefers-reduced-motion` is respected
