# Brady Perron — Replication

**Live:** https://kokuna-webcraft-bradyperron.vercel.app (to be deployed)
**Original:** https://www.bradyperron.com/
**Category:** replication (portfolio single-page)

## What this is

Pixel-aware replication of Brady Perron's minimal portfolio. The original is a Brooklyn-based videographer/director/editor/photographer portfolio with a full-viewport canvas + infinite scrolling typographic project list, bottom fixed identity `bradyperron` with `list`/`about` toggles, and a slide-up about modal with manifesto and contact.

- 17 projects duplicated for infinite loop, vertical wheel/drag scroll with inertia, center-proximity scaling and letter-spacing animation 450ms cubic-bezier(0.22,0.61,0.36,1)
- Hover near center reveals preview image behind titles (object-cover scale)
- Bottom bar: left branded `bradyperron` with bg white/85 backdrop-blur, right list/about fixed buttons opacity-0 → 1 after loader, hover opacity 60%
- List view toggle: simple vertical list with thumbnails, client/year/type, retains 17 titles
- About modal: fixed inset-0 translateY(100%) → 0 slide-up, 12-col grid at md, large fluid headline clamp 1.7rem to 3.75rem, portrait 4/5, contact instagram/email with ↗ arrow hover translate, footer © 2026
- Loader: full white overlay with bradyperron text slide-up and progress bar width 0→100% then fade 500ms

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind v4 with @theme inline
- Framer Motion for drag, scroll, stagger, layout animations

## Structure

```
src/
  app/
    layout.tsx — font Acumin fallback to Helvetica, metadata bradyperron
    page.tsx — composes Loader, Portfolio, BottomBar, AboutModal, state viewMode aboutOpen
    globals.css — tokens, utility for about-word wrappers, scrollbar hide
  components/
    Loader.tsx — progress 0→100, then onComplete
    InfiniteCanvas.tsx — infinite scroll of PROJECTS duplicated 2x, wheel/drag, center calc
    ProjectPreview.tsx — behind layer image fade scale
    ListView.tsx — list alternative
    BottomBar.tsx — name pill + list/about buttons
    AboutModal.tsx — slide-up, focus trap, word stagger, contact links
  lib/
    projects.ts — 17 project constants with image urls, videoUrl, client, year, type
tests/
  unit.test.js — checks manifest shape, project count 17, titles include quotes, bottom bar targets, about content
  e2e.spec.ts — loader, infinite scroll, list toggle, about open/close, keyboard, responsive overflow
public/assets/bradyperron — local portraits + thumbs (originals from Sanity CDN listed in site.toml)
```

## Key Fidelity Choices

- Preserved all 17 titles exactly including escaped quotes: "Lo & Behold", "Nuance", "I'll See You on the Other Side" etc.
- Bottom bar positioning matches original: fixed bottom-0 p-4 container, left name, right-16 list and right-4 about both bottom-4 fixed.
- About modal matches transform [translateY(100%)] hidden scrollbar, eyebrow tracking 0.3em, headline clamp, overflow-hidden word wrappers pb-[0.14em] -mb-[0.14em].
- Canvas: original uses <canvas> display:block for WebGL trail; replica keeps canvas element visually but renders preview via DOM to avoid fragile shader while preserving layout (canvas stays fixed inset but pointer-events none for replica, or used for subtle grain).
- Reduced motion respected.

## Scope Cut (Intentional)

Per AGENTS.md:
- Project detail pages (/harlaut-apparel etc.) cut to avoid dead ends; titles click does not navigate to 404, instead stays page or shows image.
- WebGL shader trail and Mux video autoplay cut for simplicity and performance; uses poster images.
- Sanity CMS fetch cut; static lib.

## Scripts

- `npm run dev` — localhost:3000
- `npm run build` — prod build 2 routes by design (/, /_not-found)
- `npm run lint`
- `npm run test:unit` — node:test structural checks
- `npm run test` — Playwright browser checks

## Assets Source

All images from Brady Perron Sanity CDN https://cdn.sanity.io/images/qrv69xlg/production/... listed in PRD.md and site.toml (43 urls, 6 copied locally). No runtime CDN beyond Next image optimization via remotePatterns. Portrait same CDN.
