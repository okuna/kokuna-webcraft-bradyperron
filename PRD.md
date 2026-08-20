# Brady Perron Portfolio — Product Requirements Document

**Status:** Build - Complete  
**Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion  
**Route:** `/` only (single-page portfolio)  
**Design Direction:** Sparse, image-led, editorial / cinematic, playful discovery without conventional navigation chrome

## 1. Product Intent

Build a sparse, image-led portfolio for filmmaker and photographer Brady Perron. The identity is lowercase `bradyperron`. Visitors discover 17 projects by moving through images or titles, open each project without leaving the page, and can reach biography and contact links at any time.

The experience must feel editorial, cinematic, and intentional — not a conventional grid with nav. Cutting scope is acceptable; shipping broken scope is not.

Core promise:
- One public product route: `/`
- Two interchangeable project browsers (grid + list) on the same page
- Fullscreen inline project detail (dialog, not route)
- Fullscreen inline about/biography (dialog, not route)
- No dead ends: project titles never navigate to missing pages; use modal/inline preview

## 2. Goals / Non-Goals

### Goals
- Showcase 17 projects with local poster frames and 4 muted preview loops
- Provide two browsing modes with continuous looping interaction
- Present project metadata and external film link in a focused fullscreen dialog
- Present biography, portrait, discipline and contact links in a fullscreen about dialog
- Meet a11y baseline: keyboard operable, focus trap for dialogs, visible focus states, reduced-motion support
- Be fully responsive with no horizontal overflow at 320px
- Performant local-only assets: no automatic third-party media or tracking requests at render

### Non-Goals (Cut Cleanly)
- No CMS integration
- No WebGL / shader complexity
- No remote streaming SDK (no Mux SDK, no embedded iframes on the homepage)
- No additional routes (`/projects/[slug]`, `/about`, etc.)
- No analytics, tracking, or undocumented third-party calls
- No `eval`, `new Function`, `document.write`, unsafe `innerHTML`

## 3. Information Architecture & Routes

| Route | Purpose | Notes |
|-------|---------|-------|
| `/` | Single product page — contains loader, grid/list browsers, bottom controls, and inline dialogs | Only public route |

- All project and about content opens inline via dialogs on `/`
- Project title clicks must not navigate; they open `ProjectPreview` dialog
- Placeholder routes that 404 are forbidden
- Brand mark `bradyperron` stays on page (scroll-to-top or no-op), never links to missing route
- Next.js framework-level `not-found` may exist but is not part of product IA

## 4. Content Model

### 4.1 Identity & Settings (`lib/projects.ts` SETTINGS)

- `siteTitle`: `bradyperron`
- `description`: `Videographer/Editor/Director`
- `longDescription`: `Brady Perron is a Brooklyn-based Videographer/Director/Editor/Photographer. Rhythm. Range. Poetic. Dynamic.`
- `discipline line`: `Videographer / Editor / Director`
- `instagram`: `https://instagram.com/bradyperron`
- `email`: `brady.perron@gmail.com`
- `portrait`: local 4:5 image at `/assets/bradyperron/brady-portrait.jpg` with alt text

### 4.2 Projects (`lib/projects.ts` PROJECTS)

Single source of truth: `src/lib/projects.ts` constant.

Per project fields:

```ts
{
  id: string,
  slug: string,
  title: string,
  client: string,
  year: string,
  type: "Commercial" | "Short Film" | "Campaign" | "Music Video" | "Documentary" | "Film",
  description?: string,
  videoUrl?: string,           // optional external YouTube/Vimeo destination for "watch film"
  previewVideoUrl?: string,    // optional local muted loop (4 projects)
  imageUrl: string,            // local poster frame under /assets/bradyperron/home/
  width: number,               // authoritative aspect ratio width
  height: number,              // authoritative aspect ratio height
}
```

Exactly 17 entries:

| # | Title | Client | Year | Type | Has Local Preview Loop |
|---|-------|--------|------|------|------------------------|
| 1 | Harlaut Apparel Winter Campaign | Harlaut Apparel Winter Campaign | 2024 | Campaign | No |
| 2 | "Lo & Behold" Henrik Harlaut | Monster Energy | 2023 | Short Film | Yes |
| 3 | Timberland Built for the Bold | Timberland | 2023 | Commercial | Yes |
| 4 | "Nuance" Phil Casabon x Armada Skis | Armada Skis | 2023 | Short Film | Yes |
| 5 | Valerie Omari | Valerie Omari | 2025 | Music Video | Yes |
| 6 | NOVOS Labs | NOVOS Labs | 2025 | Commercial | No |
| 7 | JACK MOORE HEAD IN SAND | JACK MOORE | 2025 | Documentary | No |
| 8 | Shy of Summer II | Monster Energy | 2025 | Commercial | No |
| 9 | "I'll See You on the Other Side" Omar Al-Sudani x Office Mag | Omar Al-Sudani x Office Mag | 2025 | Documentary | No |
| 10 | 686 Jogger | 686 | 2025 | Commercial | No |
| 11 | ERNE | ERNE | 2024 | Music Video | No |
| 12 | Elaine Hersby | Elaine Hersby | 2023 | Commercial | No |
| 13 | The North Face \| Freeride | The North Face | 2026 | Commercial | No |
| 14 | "Something in the Water" Jake Mageau x Level 1 | 686, ON3P, Fat Tire | 2025 | Commercial | No |
| 15 | The North Face "COALESCE" | The North Face | 2023 | Short Film | No |
| 16 | ATTN for bite. | bite. | 2026 | Film | No |
| 17 | Good Bacteria | Good Bacteria | 2026 | Commercial | No |

- When `previewVideoUrl` exists, the project plays a muted, inline, looping video in active grid/list slots and in preview dialog; otherwise poster frame is used.
- `videoUrl` when present renders a single centered `watch film ↗` external link in preview dialog; opened in new tab with `rel="noopener noreferrer"` only after explicit user action.

## 5. Visual System

### 5.1 Color
- Canvas and panel background: `#FFFFFF`
- Primary text: `#000000`
- Secondary labels: black at 40–60% opacity
- Borders / progress track: black at 10–15% opacity
- Image placeholders: very light neutral gray
- Text selection: white text on black (`::selection`)

### 5.2 Typography
- Locally hosted `Fraunces Thin` at weight 100 for entire interface: `public/fonts/fraunces-thin.ttf` + italic variant
- Light editorial, not bold/geometric
- Brand mark (lower-left): 20px mobile, 30px desktop
- Default list titles: fluid `14–24px`, line-height `1.5`, tracking `0.02em`
- Active centered list title: fluid `20–36px`, tracking `0.32em`
- About statement: `clamp(1.7rem, 4.4vw, 3.75rem)`, line-height `1.06`, letter-spacing `-0.018em`
- Utility labels: `11–14px`, tracking `0.22–0.32em`

### 5.3 Layout Tokens
- Viewport: white, full-width, `overflow-x: clip` at every supported size
- Project browsers fill viewport and do not expose document scrollbar
- Bottom controls fixed: brand at lower-left, `list`/`grid` + `about` at lower-right
- Primary responsive breakpoint: `768px`
- Focus visible: `2px solid black` with `2px` offset outline
- Touch targets: minimum `44px` for bottom buttons and about links

## 6. Global Layout & Chrome

- `header` / `main` / `footer` landmarks present
- `main` id `main-content` with skip link: `Skip to main content` (sr-only, focus-visible fixed)
- BottomBar is `footer` landmark with brand (`h1`) and controls
- No horizontal overflow at 320px — verify with `grid`, `flex`, `clamp()`

## 7. Component Breakdown (Maintainability)

Split beyond ~500 lines. No circular imports. No commented-out blocks / unused imports / unreachable branches.

| Component | File | Responsibility |
|-----------|------|----------------|
| `Loader` | `src/components/Loader.tsx` | White fullscreen loader, brand reveal, progress bar tied to real asset loading |
| `InfiniteCanvas` | `src/components/InfiniteCanvas.tsx` | Default grid view: continuously recycling 4 desktop / 3 mobile poster cards with drift, rotation, hover enlarge |
| `ListView` | `src/components/ListView.tsx` | Looping vertical title list + depth-scaled ring of 17 frames |
| `BottomBar` | `src/components/BottomBar.tsx` | Fixed `h1` brand + view toggle + about trigger, staggered reveal after loader |
| `ProjectMedia` | `src/components/ProjectMedia.tsx` | Renders local video loop when `previewVideoUrl` available, else `img` poster; preserves authoritative aspect ratio |
| `ProjectPreview` | `src/components/ProjectPreview.tsx` | Fullscreen dialog: centered media envelope, `more info` scroll, metadata row with centered dots, 16:9 black field, `watch film` external link if present, close actions |
| `AboutModal` | `src/components/AboutModal.tsx` | Fullscreen slide-up dialog: sticky header, staggered biography, portrait reveal + drift, contact links with rule + arrow hover, footer with current year |
| `useModalFocus` | `src/lib/useModalFocus.ts` | Focus trap (Tab/Shift+Tab), initial focus, restore focus on close, Escape handling |
| `motion` | `src/lib/motion.ts` | Named constants for durations (loader min, fade, scatter, about slide), easings `[0.22,0.61,0.36,1]` and `[0.16,1,0.3,1]` — no scattered magic numbers |
| `projects` | `src/lib/projects.ts` | Single source of truth for all 17 projects + SETTINGS |

All meaningful images use project-title or portrait alt text; duplicated decorative images use empty `alt=""`.

## 8. Page States & User Flows

### 8.1 Initial Load & Entrance

1. On fresh page load, render white fullscreen loader above all content.
2. Display `bradyperron` with upward text reveal + black progress bar beneath.
3. Progress represents loading of 17 local project frames + local portrait — not a timer. Track real `img` preload.
4. Loader minimum visible duration: `LOADER_MIN_MS = 1350ms` normal motion, `~150ms` for `prefers-reduced-motion`.
5. After assets + minimum duration complete, fade loader out over `LOADER_FADE_MS = 500ms`.
6. Reveal default view with 12 poster frames expanding from center into irregular full-screen scatter.
7. Scatter holds long enough to read as deliberate composition, then fades to persistent moving grid after `GRID_INTRO_SECONDS = ~2.7s`.
8. Reveal bottom brand + controls with staggered upward fades while media entrance runs.
9. Reduced-motion: omit scatter movement, reveal stable grid immediately.

### 8.2 Grid View (Default) — `data-view="grid"`

- Desktop: 4 independently moving poster cards; Mobile: 3
- Preserve source aspect ratio declared in `projects.ts`. Desktop cards up to ~58vw / max ~420px height; mobile up to ~68vw / ~340px height.
- Cards travel continuously through mixed horizontal, vertical, diagonal paths that cross viewport; enter/leave beyond viewport edges, no visible stop at boundary.
- When project has `previewVideoUrl`, play muted inline loop continuously inside active card; otherwise poster frame.
- Recycle indefinitely: on path completion, assign next project and continue without jump.
- Gentle rotation + subtle hover enlargement (no imagery obscured).
- Wheel + pointer drag add directional velocity; momentum eases back toward base drift.
- Each visible card is keyboard-focusable `button` named `Open {title} preview` via `aria-label`.
- Activate opens fullscreen preview without URL change.

### 8.3 List View — `data-view="list"`

Triggered by fixed `list` control crossfading from grid. While active, label becomes `grid`.

- Render all 17 titles in vertically looping list centered in viewport.
- Baseline spacing `64px`, wrap positions continuously both directions.
- Title nearest center: fully black, larger, widely tracked (`0.32em`). Fade progressively with distance from center.
- Couple title movement to ring of 17 poster frames below/around title list.
- Ring projection: inside-looking-out virtual camera, single outward-facing arc visible. Center of arc: smaller/farther; toward clipped viewport edges: larger/closer. Never render second near-side arc.
- Geometry: virtual FOV ~50deg, camera z ~12, ring center ~z 2.2 / y -2, radii ~7.5 desktop / 5.5 mobile (tuned values in `ListView` + `motion` constants).
- Only active project's local preview loop plays; others use still frames.
- Wheel + drag move titles + ring together with easing + wraparound.
- Title buttons in tab order; ring images are redundant visual controls outside keyboard order.
- Activating title or ring image opens matching project preview.

### 8.4 Project Preview Dialog

Opens inline above portfolio on project selection.

**Opening view:**
- Fade white dialog (`role="dialog"`, `aria-modal="true"`, labelled by project title `h2`) into view
- Close control `56–64px` at upper-right
- Center selected project's local preview loop within ~82vw × 72vh envelope when available; else poster frame. Preserve declared aspect ratio.
- Overlay compact `more info` control + downward cue at center of poster. Activates smooth scroll to info section (within dialog scroll container marked `data-modal-scroll="true"`).

**Info & Film:**
- Exact project title as dialog `h2` heading
- Row: `client · year · type` separated by centered dots (·)
- Below: poster on full-width black 16:9 field using `object-contain`
- If `videoUrl` exists: centered `watch film ↗` link over field; new tab + safe external attributes; only after explicit activation
- If no `videoUrl`: omit link, no empty/disabled control
- End: centered `close` action

**Dialog behavior:**
- `useModalFocus` moves focus into dialog on open, traps Tab / Shift+Tab, restores focus to opener on close
- Both close controls + Escape key close dialog
- Background scroll locked, page beneath `inert` + `aria-hidden` while open
- Visible focus states preserved

### 8.5 About Panel Dialog

Fixed `about` control opens white fullscreen dialog sliding upward from below viewport over `ABOUT_SLIDE_MS = 750ms`.

- Sticky header: left `about — bradyperron`, right close control min `44×44px`
- Biography (`longDescription` + `Videographer / Editor / Director`) revealed as individually masked words with short stagger (Framer Motion)
- Local 4:5 portrait at two-thirds width mobile, right 4 columns of 12-col grid desktop. Vertical clip reveal then very slow subtle drift.
- Left side lower desktop grid: `(contact)` label, Instagram link, email link, discipline line
- Contact links: thin black rules + arrow that moves diagonally on hover
- Footer low-contrast: `bradyperron` + current year
- Same dialog focus management, Escape handling, background inert, focus restoration as project preview

## 9. Motion

- Use Framer Motion for entrances, view transitions, wheel/drag-driven motion, modal animation
- Centralize reusable easing + duration values in `lib/motion.ts`; no magic numbers in components
- Default easing editorial: near `[0.22, 0.61, 0.36, 1]` (entrance/stagger) and `[0.16, 1, 0.3, 1]` (smooth out)
- Shared `MotionConfig reducedMotion="user"` + CSS `prefers-reduced-motion: reduce` => stop continuous media, skip scatter, reduce durations to effectively instant

Constants (example naming — keep named, not scattered):

```ts
LOADER_MIN_MS = 1350
LOADER_MIN_REDUCED_MS = 150
LOADER_FADE_MS = 500
GRID_INTRO_SECONDS = 2.7
ABOUT_SLIDE_MS = 750
EASE_DEFAULT = [0.22, 0.61, 0.36, 1]
EASE_SMOOTH = [0.16, 1, 0.3, 1]
```

## 10. Accessibility & Semantics

- One page-level `main`, `footer` landmark for persistent controls, headings in logical order: brand mark as `h1`, dialog titles as `h2`, `p` styled as headline for about statement (or `h2` for about)
- Skip link to `#main-content`
- All meaningful images use project-title / portrait alt text; decorative duplicates empty alt
- Every action: native `button` or `a` with clear accessible name + min 44px target in both dimensions
- Dialogs fully keyboard operable: Tab, Shift+Tab trapped, Escape closes, focus restored
- External links open only after explicit user activation; no auto-play navigations
- Focus states: 2px black offset visible (global CSS)
- Avoid left-to-right assumptions for future i18n (no hard-coded LTR positioning logic)
- Touch targets min 44px for bottom buttons + about links

## 11. Responsive Behavior

- Primary breakpoint: `768px`
- Grid: 4 cards desktop, 3 mobile; sizes via `vw` + max-height clamps; verified `flex`/`grid`/`clamp()`
- List: tighter ring + title spacing on mobile
- About: stacked single column mobile, 12-col grid desktop
- At 320px: no element may create horizontal document overflow — test fixed bottom bar, ring projection, modal header
- Bottom controls remain usable at all supported sizes

## 12. Assets

Use only committed local runtime assets under `public/`:

- `public/assets/bradyperron/home/*.webp` — 17 project frames (authoritative aspect ratios in `projects.ts`)
- `public/assets/bradyperron/video/*.mp4` — 4 muted homepage + preview loops (Lo & Behold, Timberland, Nuance, Valerie Omari)
- `public/assets/bradyperron/brady-portrait.jpg` — about portrait 4:5
- `public/fonts/fraunces-thin.ttf` + `public/fonts/fraunces-thin-italic.ttf` + `public/fonts/OFL.txt` (SIL OFL 1.1) — locally hosted typography
- `public/favicon.ico`, `public/icon.svg`, `public/apple-icon.png` — browser + Apple touch identity

Constraints:
- Do not replace local assets with remote CDN URLs at render time
- Do not introduce additional font weights unless verified and licensed
- Source provenance documented in `site.toml` and `src/lib/projects.ts` with local paths
- No automatic third-party media or tracking requests during normal rendering; only user-initiated external links (YouTube/Vimeo, Instagram, mailto)

## 13. Technical Constraints & Maintainability

- Framework: Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4
- Single page `/` only by design; keep clean mapping, avoid placeholder routes that 404
- Extract repeated project data into `lib/projects.ts`
- Split files beyond ~500 lines: `Loader`, `InfiniteCanvas`, `ListView`, `BottomBar`, `AboutModal`, `ProjectPreview`, `ProjectMedia`
- Replace magic numbers (450ms, cubic-bezier) with named constants in `lib/motion.ts`
- Keep components composable, avoid circular imports
- No commented-out blocks, unused imports, unreachable branches
- No obfuscated code, minified committed bundles, hidden provenance
- No `dist`/`build`/`node_modules` committed
- No secrets committed
- `.env.example` empty / explanatory only

Build + quality gates:

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run test:unit
npm run build
npm run test       # Playwright E2E on production build, port 4173 isolated
```

## 14. Acceptance Criteria

- [ ] Only `/` is public product route; all project + about content opens inline via dialogs, no internal dead ends or placeholder project routes
- [ ] Brand mark `bradyperron` as `h1` visible at all sizes, does not navigate to missing page
- [ ] Loader reports real local-image preload progress (17 frames + portrait), respects minimum intro delay (1.35s normal / ~150ms reduced-motion), fades 500ms
- [ ] After loader: 12-image scatter from center, then settles into persistent grid after ~2.7s; reduced-motion skips scatter and reveals stable grid immediately
- [ ] Grid continuously recycles 4 media cards desktop / 3 mobile across varied paths; preview loops autoplay muted + inline where available; wheel/drag adds momentum; keyboard focusable `Open {title} preview` buttons
- [ ] List control crossfades to looping 17-title list with centered active title enlarged + widely tracked, progressive fade by distance; media ring depth-scaled outward-facing arc only; wheel/drag moves both; active preview loop plays when available
- [ ] All 17 projects discoverable and open corresponding fullscreen preview via grid card, list title, or ring image
- [ ] Project preview dialog: centered media envelope (82vw × 72vh) preserving aspect, `more info` scroll, exact title as `h2`, `client · year · type` dotted row, black 16:9 field poster, `watch film ↗` external link only when `videoUrl` exists, close controls, Escape handling, focus trap + restore, background `inert` + scroll lock, no empty controls
- [ ] About dialog: slides up 750ms, sticky header, staggered biography words, portrait vertical-clip reveal + slow drift, contact label + Instagram + email + discipline, hover arrow motion, footer brand + current year, same focus management as preview
- [ ] Fixed bottom controls (`bradyperron`, `list`/`grid`, `about`) remain usable at all viewport sizes including 320px
- [ ] Layout has no horizontal overflow at 320px
- [ ] Typography uses locally hosted Fraunces Thin; utility labels tracked; brand fluid scaling correct
- [ ] No local image, video, font, or icon request returns 404 / empty file
- [ ] No automatic third-party media or tracking requests during normal rendering; external destinations only after user activation
- [ ] Semantic HTML: `header`/`main`/`footer`, single `h1`, `h2` dialog titles, buttons for actions, links for navigation, skip link, portrait + previews alt text, decorative dupes empty alt, 44px min touch targets, 2px focus outline offset
- [ ] Motion respects `prefers-reduced-motion`; continuous motion stopped, durations instant
- [ ] Lint, unit tests, Playwright checks, production build succeed before deployment
- [ ] PRD, `site.toml`, `features.json`, and implementation stay synchronized; no original-site references

## 15. Out of Scope / Scope Discipline

Explicitly excluded and must not be introduced without verification + PRD update:

- CMS (Sanity, Contentful, etc.)
- WebGL shader complexity or canvas-based renderers beyond Framer Motion DOM motion
- Remote video SDKs (Mux player, Vimeo/YouTube embeds on homepage)
- Multi-route IA (`/work`, `/project/[slug]`, etc.)
- Analytics, pixels, trackers
- Complex filter/search UI — discovery is spatial (grid drift + list ring), not faceted

If cutting further scope to keep site complete: prefer smaller complete site over larger broken one. Document cuts in this PRD.

## 16. Deployment & Submission Checklist

- [ ] `npm run build` + `npm run test:unit` + `npm run lint` + `npm run test` green
- [ ] Screenshots captured: `screenshots/home-desktop.png` (1440×900) + `screenshots/home-mobile.png` (390×844) for `/`
- [ ] `site.toml` asset lists match `public/` runtime files
- [ ] No secrets, no `dist`/`build`/`node_modules` committed
- [ ] PRD contains no references to external source sites — standalone spec only
