# Brady Perron — Product Requirements

## 1. Product Overview

Brady Perron is a Brooklyn-based Videographer / Director / Editor / Photographer. Tagline: "Rhythm. Range. Poetic. Dynamic." The website is a minimal editorial portfolio where the entire experience is a single page: an infinite vertical scroll of project titles rendered over a full-viewport canvas that reveals preview imagery on hover/proximity. Fixed bottom chrome shows the identity mark `bradyperron` and two actions: `list` and `about`. Clicking `about` slides up a full-screen white modal with large type manifesto, personal portrait, contact links, and footer.

Original: https://www.bradyperron.com/
Category: replication, creative portfolio

Primary qualities: Brutalist minimalism, typographic restraint, fluid motion, high contrast black on white, focus on content and imagery.

## 2. Audience and Core Experience

- Primary: Creative directors, brands (Timberland, The North Face, Monster Energy, Armada Skis), music artists, agencies scouting directors.
- Secondary: Other filmmakers, photographers, peers.

Goals:
- Rapidly scan 17 projects as large type that feels infinite.
- Hover near center triggers image preview.
- Switch to list view for scannability.
- Open about to get positioning statement + contact (instagram, email).
- Loader establishes brand before interaction.

Core flows:
1. Land → loader shows bradyperron + progress bar 0→100 → fades, reveals project rows and bottom bar with opacity 0→1.
2. Scroll wheel or drag → infinite loop of titles moving vertically. Centered title is visually prominent (larger, wider letter-spacing). Titles off-screen loop.
3. Hover/focus near-center title → preview image fades behind (or beside) with scale.
4. Click title → would navigate to project page (original routes like /harlaut-apparel). For scope, project click opens inline detail or stays on page with hash anchor to avoid broken scope.
5. Toggle `list` bottom right → switches from infinite canvas to simple vertical list with small thumbnails + meta (client, year).
6. Toggle `about` → modal slides up from 100% translateY, locks scroll, shows manifesto, portrait, contact, close. Close via button or Escape or click outside.

Emotional qualities: calm, confident, rhythmic, poetic, editor's precision.

## 3. Global Design System

### Typography
| Role | Style |
|------|-------|
| Brand mark | Acumin / Helvetica Neue, lowercase `bradyperron`, 1.25rem mobile → 1.875rem desktop, tight tracking -0.02em |
| Project titles (infinite) | Acumin, regular, uppercase or mixed case as original (preserve quotes), white-space nowrap, centered left-1/2 top-1/2 absolute, font size fluid clamp roughly 11px → 64px depending on proximity to viewport center. Letter-spacing transitions 450ms cubic-bezier(0.22,0.61,0.36,1) |
| Project titles (list view) | Same font but small 14-18px, tabular |
| About headline | Acumin, clamp 1.7rem to 3.75rem, 4.4vw, line-height 1.06, letter-spacing -0.018em, max-width 17em, split per word in overflow-hidden wrappers for staggered reveal |
| About eyebrows | 11-12px tracking 0.3em uppercase black/40 |
| Contact links | 14px mobile 20px desktop, border-t black/15, flex baseline justify-between, arrow ↗ on hover translate |

### Color Tokens
| Token | Value | Usage |
|-------|-------|-------|
| White | #FFFFFF | Page background, modal background |
| Black | #000000 | Text primary |
| Black/10 | rgba(0,0,0,0.1) | Loader track |
| Black/15 | rgba(0,0,0,0.15) | Borders in about |
| Black/85 blur | rgba(255,255,255,0.85) backdrop-blur-md | Bottom name pill |
| #000000 at 40% | for eyebrows |

### Layout and Spacing
- Full viewport: 100vw 100vh canvas fixed inset-0, overflow hidden.
- Bottom bar: fixed bottom-0 left-0 right-0 z-20 p-4 pointer-events-none for container, but children pointer-events-auto.
- About modal: fixed inset-0 z-30 bg-white text-black pointer-events-auto overflow-y-auto overscroll-contain [transform:translateY(100%)] [scrollbar-width:none] styled to slide up; internal px-5 pb-5 md:px-12 md:pb-10, header sticky top.
- Loader: fixed inset-0 z-50 flex items-center justify-center bg-white h-screen w-screen.

### Shared Component Styles
- Buttons: layout-button fixed bottom-4 right-16 / right-4 z-20 pointer-events-auto font-acumin text-black text-sm md:text-base leading-none hover:opacity-60 transition-opacity cursor-pointer opacity-0 initially.
- Project rows: will-change transform, opacity, letter-spacing, font-size; pointer-events toggled after loader.
- About word: inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em] containing about-word child.

### Motion Language
- Loader text slides up from y 100% opacity 0.
- Progress bar width animates 0→100% duration ~1.2s ease-out.
- Project titles ease via letter-spacing and font-size 450ms cubic-bezier(0.22,0.61,0.36,1) as they approach center.
- About modal: transform translateY 100% → 0% with ease [0.22,0.61,0.36,1] 600-800ms, opacity fade, staggered word reveal.
- Image preview: fade opacity 0→1 300ms, scale 0.95→1.
- Reduced motion: respect prefers-reduced-motion, disable parallax and make transitions instant opacity only.

### Responsive System
- Mobile 390px: Bottom name text-xl, single column about layout: manifesto full width, then image 2/3 width, then contact, footer baseline.
- Tablet 768px: Name text-3xl, about grid 12 cols: headline spans 12, image col 9 span 4, contact col 1 span 4.
- Desktop 1024px+: same as tablet but more breathing room.

## 4. Global Accessibility Requirements
- Keyboard: All interactive (project rows as buttons, list/about, close, instagram, email) reachable via Tab, operable Enter/Space, no trap. About modal traps focus when open, Escape closes.
- Focus visible: outline 2px black offset.
- Skip: skip to main content link hidden until focus.
- Landmarks: header in about, main, footer.
- Labels: list button aria-label "Switch to list view", about button "Open about modal", close "close", project rows have aria-label with title.
- Alt: Brady portrait alt "Brady Perron portrait", preview images alt set to title.
- Contrast: black on white 21:1.

## 5. Global Content and Data

17 Projects extracted from live site:
1. Harlaut Apparel Winter Campaign — 2024 — Harlaut Apparel — video https://www.youtube.com/watch?v=-gETTd7vTrE — image https://cdn.sanity.io/images/qrv69xlg/production/d6ac3e0ce944481e0732d26436d27640e0400470-1080x1080.jpg
2. "Lo & Behold" Henrik Harlaut — 2023 — Monster Energy — Short Film — video https://www.youtube.com/watch?v=Hn21UDVOk3E — Mux playback pWpmeh2nG7EX6MHchaIRXBL00wr2N2zR9zZc3D00wLJH8 — image https://cdn.sanity.io/images/qrv69xlg/production/90b6f28fe8519373e5942619884af5622fc383cc-2048x1536.jpg
3. Timberland Built for the Bold — 2023 — Timberland — Commercial — video https://www.youtube.com/shorts/RFudzdvrvPc — image https://cdn.sanity.io/images/qrv69xlg/production/5a193cc9f4ad9d2c6af3203a1a98e042f407aa3a-1920x1080.jpg
4. "Nuance" Phil Casabon x Armada Skis — 2023 — Armada Skis — Short Film — video https://www.youtube.com/watch?v=AZH6GulSGYQ — image https://cdn.sanity.io/images/qrv69xlg/production/d4002ec0d079d7781d1ddacbf5ca55568c3fa82a-5035x3339.jpg
5. Valerie Omari — 2025 — Music Video — video https://www.youtube.com/watch?v=M-f_vdpkP_M — image https://cdn.sanity.io/images/qrv69xlg/production/cf3774860fc2e259b5b98c7ed0d4190b08d7036b-3840x2160.jpg
6. NOVOS Labs — — — image https://cdn.sanity.io/images/qrv69xlg/production/189c09419553268b45572cda075fec37313878ae-3089x2048.jpg
7. JACK MOORE HEAD IN SAND — — — image https://cdn.sanity.io/images/qrv69xlg/production/0881f51ccf5932c3a352365a7e277de5024b2547-2048x1536.jpg
8. Shy of Summer II — — — image https://cdn.sanity.io/images/qrv69xlg/production/11cdc3fe547613d2dc6ea0dc038d7c34b03fc850-2988x1616.png
9. "I'll See You on the Other Side" Omar Al-Sudani x Office Mag — — Editorial — image https://cdn.sanity.io/images/qrv69xlg/production/4c6b9a827a15c981dd76f55d1167379e30e568f7-3006x1330.png
10. 686 Jogger — — — image https://cdn.sanity.io/images/qrv69xlg/production/39f899373e9893b04ef43877b8f0eea98f1f71a1-1080x1080.jpg
11. ERNE — — — image https://cdn.sanity.io/images/qrv69xlg/production/f7d007555a98695447d9c8376d546fc708df2c55-1600x1436.jpg
12. Elaine Hersby — — — image https://cdn.sanity.io/images/qrv69xlg/production/1f71c6afd77b2f175a2a6cc23afeadf57debeb1a-1600x1200.jpg
13. The North Face | Freeride — — — image https://cdn.sanity.io/images/qrv69xlg/production/b03b7f78cc137f6fc786fc3952b74f8db58fe82b-1600x968.jpg
14. "Something in the Water" Jake Mageau x Level 1 — — Short Film — image https://cdn.sanity.io/images/qrv69xlg/production/54eaeff8f4671a54752a304cb9ec296df3f9ae89-3130x2075.jpg
15. The North Face "COALESCE" — — — image https://cdn.sanity.io/images/qrv69xlg/production/b311550b0d640b8383ef5d10295e767e9256dd2f-3840x2160.jpg
16. ATTN for bite. — — — image https://cdn.sanity.io/images/qrv69xlg/production/ba68756c2e95ff5c4be548d079843783c2105c3a-3680x2760.jpg
17. Good Bacteria — — — image https://cdn.sanity.io/images/qrv69xlg/production/e44975709317e32bc577b39bd9d77b15b495fd28-1920x1080.jpg

Settings:
- siteTitle bradyperron
- description Videographer/Editor/Director short, long: Brady Perron is a Brooklyn-based Videographer/Director/Editor/Photographer. Rhythm. Range. Poetic. Dynamic.
- instagram https://instagram.com/bradyperron
- email brady.perron@gmail.com
- portrait https://cdn.sanity.io/images/qrv69xlg/production/ce4e709dd358c6174402b1342cef9809f85035b5-3339x5035.jpg

## 6. Product Surfaces

### Loader
- Full viewport white, centered stack: brand text bradyperron text-3xl md:text-5xl black with overflow-hidden slide-up, progress track w-half left-0 w-full h-1 bg-black/10, inner bar h-full bg-black transition-all duration-300 ease-out width 0%→100%.
- Appearance after delay: opacity 0 with pointer-events none, then removed.
- Behavior: Progress simulates loading (or tracks image preloading). Once 100%, fade out 500ms, then reveal main titles (opacity 0→1) and bottom bar.

### Infinite Canvas View (default)
- Structure: parent min-h-screen min-w-screen, inner fixed inset-0 w-100vw h-100vh with inner relative w-full h-full overflow-hidden pointer-events-auto containing canvas (display:block) + DOM title rows layer.
- For replica, we mimic canvas image trail with a div layer behind titles that shows current hover image with object-cover.
- Title rows: button absolute left-1/2 top-1/2 whitespace-nowrap font-acumin text-black cursor-pointer select-none, style will-change transform, opacity, letter-spacing, font-size; transition letter-spacing 450ms cubic-bezier(0.22,0.61,0.36,1), font-size 450ms...
- Position calculation: original uses WebGL math to place each subsequent title lower with scroll. Replica can use Framer Motion + scroll-linked transforms: each row translateY based on index multiplied by base line height (e.g., 12% viewport) plus scroll offset, duplicated list to allow infinite wrap; centering via transform translateX(-50%) translateY(-50% + offset).
- Focus proximity: title closest to viewport center gets largest font size (e.g., clamp 28px to 64px) and widest letter-spacing (at center 0.02em, off -0.05em) and opacity 1, others opacity 0.3-0.6.
- Pointer: on hover set activeIndex, show preview image.

### List View
- Toggled via list button which text flips to "canvas" or "grid" when in list mode. Original aria-label switches to "Switch to canvas view" etc.
- Simple vertical list: each item row: small index 01., title, year, client, type, 80px thumbnail right. Click still previews or navigates.

### Bottom Bar
- Fixed bottom-0 left-0 right-0 z-20 p-4 pointer-events-none container with inner:
  - Left: h1.layout-name font-acumin text-xl md:text-3xl text-black opacity-0 bg-white/85 backdrop-blur-md → opacity 1 after loader.
  - Right cluster: two buttons bottom-4 right-16 and right-4 fixed, pointer-events-auto.
  - Both buttons hover:opacity-60 transition.

### About Modal
- Fixed inset-0 z-30 bg-white text-black overflow-y-auto overscroll-contain initially translateY(100%) hidden via CSS transform, also scrollbar hidden.
- Inner flex col min-h-full px-5 pb-5 md:px-12 md:pb-10.
- Header: sticky top-0 z-20 -mx-5 flex items-start justify-between bg-white px-5 pb-3 pt-5 md:-mx-12 md:px-12 md:pb-4 md:pt-10 — left eyebrow about — bradyperron font 11px tracking 0.3em black/40, right close button 11px tracking 0.25em black/60 hover black.
- Main: grid 1 col gap-y-12 pb-6 md:mt-24 md:grid-cols-12 md:gap-x-10 flex-1.
  - Headline block md:col-span-12 font-acumin black clamp 1.7rem,4.4vw,3.75rem line-height 1.06 letter-spacing -0.018em max-width 17em — words each inside overflow-hidden wrapper pb-[0.14em] -mb-[0.14em] with inner .about-word inline-block that will be animated staggered.
  - Figure portrait: aspect 4/5 w-2/3 overflow-hidden bg-black/[0.04] md:col-span-4 md:col-start-9 — inner div absolute -inset-[5%] overflow for subtle zoom.
  - Contact: flex-col md:col-span-4 col-start-1 row-start-2 — label (contact) same eyebrow, nav mt-5 flex-col md:mt-7 — each link group flex baseline justify-between gap-4 border-t (first) and border-y second, py 2.5 md:py-3.5 text-sm md:text-xl text-black hover:text-black/55 transition-colors with arrow ↗ that translates on group hover: translate-x-1 -translate-y-1 duration 300.
  - Role line: Videographer / Editor / Director font 11px tracking 0.3em black/45.
- Footer: about-reveal flex items-end justify-between border-t border-black/10 pt-6 font 10px tracking 0.3em black/30 md:pt-8 md:text-11px — left bradyperron, right © 2026.
- Behavior: When open, body overflow hidden, pointer-events auto, transform translateY 0. Close on button, Escape, or click backdrop edge.
- Animation: initial translateY 100% → 0% spring, each .about-reveal element fade stagger, words 20ms stagger.

## 7. Acceptance Criteria

- Loader visible on initial load with bradyperron text and progress bar that animates 0→100% then disappears.
- Home shows at least 17 distinct project titles infinitely scrolling; scroll wheel and drag work; centered title largest.
- Hover on title shows preview image behind (object-cover with slight scale).
- Bottom left shows bradyperron mark with blurred white pill, visible after loader.
- Bottom right has list and about buttons, both visible after loader, hover opacity 60%.
- List button toggles to list view with same 17 titles + meta.
- About button opens modal that slides up from 100% with portrait, manifesto text, instagram and email links (target blank for insta, mailto for email), and footer. Close works via button and Escape.
- No horizontal overflow at 320px, no broken links.
- All original content (titles exact including quotes) preserved.
- Keyboard navigable: Tab reaches bottom buttons and project rows and about links.
- Reduced motion respected.

## 8. Scope Cut (Intentional)

Per AGENTS.md prefer smaller complete site:
- Project detail pages (/harlaut-apparel etc.) cut — titles do not navigate to broken routes; click in infinite view either no-ops or shows toast/list detail to avoid dead ends. List view keeps on page.
- WebGL canvas shader effects cut simplified to CSS transform and image preview layer — avoids bundling heavy custom WebGL that would be fragile.
- Mux video previews cut for autoplay performance; use poster images only with link to YouTube where videoUrl present.
- CMS fetching (Sanity) cut — static data file.

## 9. Stack and Setup

Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Framer Motion for drag/scroll and about stagger.

Setup: npm install && npm run dev → localhost:3000
Build: npm run build
Tests: npm run test:unit (checks manifest shape, project count, about content, navigation targets)
Playwright: npm run test

## 10. Assets Source

All preview images from Sanity CDN https://cdn.sanity.io/images/qrv69xlg/production/... copied list in PRD and features.json. Portrait same CDN. Served locally per policy via next/image remotePatterns or copied to public/assets/bradyperron. No runtime CDN beyond image optimization. Documented in site.toml.
