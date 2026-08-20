# Setup — Brady Perron Replica

## Overview
Replication of https://www.bradyperron.com/ — minimal portfolio with infinite scrolling project titles, bottom fixed navigation, about modal, and loader.

Live: https://kokuna-webcraft-bradyperron.vercel.app (to be deployed)
Original: https://www.bradyperron.com/

Tech: Next.js 16 App Router, Tailwind v4, TypeScript, Framer Motion, Playwright

## Prerequisites
- Node >= 20.9
- npm >= 9

## Env
No keys. Static site.
```bash
cp .env.example .env
```

## Local
```bash
npm install
npm run dev
# http://localhost:3000
```

## Build
```bash
npm run build
npm start
# Outputs / and /_not-found by design
```

## Tests
```bash
npm run test:unit
npm run test
```

## Structure
```
src/app/
  layout.tsx — metadata, Acumin fallback fonts, overflow-x-hidden
  page.tsx — state for loaderDone, viewMode (canvas/list), aboutOpen, activeIndex
  globals.css — brand tokens, scrollbar hide, about-word utilities
src/components/
  Loader — simulates progress 0→100 with interval, then fade
  InfiniteCanvas — wheel + drag infinite list, duplication 2x for loop
  ProjectPreview — absolute inset preview image layer behind titles
  ListView — vertical list alternative
  BottomBar — bradyperron pill + list/about buttons fixed bottom
  AboutModal — slide-up transform, focus trap, stagger words, contact links
src/lib/projects.ts — 17 projects
public/assets/bradyperron — local images
```

## Deployment
- Vercel: `vercel --prod`
- Firewall: allow Meta IPs 163.114.128.0/20, 199.201.64.0/22 if needed
- Transfer to AAI - Web Craft org, set hosting_access_granted true in site.toml

## Assets
From https://cdn.sanity.io/images/qrv69xlg/production/... — 43 images discovered, 6 copied locally. No runtime CDN beyond next/image remotePatterns. Documented in site.toml and PRD.

## Validation
```bash
npm run build
npm run lint
npm run test:unit
npm audit --omit=dev
```
