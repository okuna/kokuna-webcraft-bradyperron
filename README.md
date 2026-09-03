# Brady Perron Portfolio

A single-page Web Craft 1.0 portfolio for filmmaker Brady Perron. Sparse, image-led, editorial and cinematic with two interchangeable project browsers, fullscreen project previews, and an about panel.

**GitHub:** https://github.com/codimango/kokuna-webcraft-bradyperron
**Live:** https://kokuna-webcraft-bradyperron.vercel.app
**Walkthrough:** https://www.internalfb.com/intern/px/p/cvjCL
- Production (immutable): https://kokuna-webcraft-bradyperron-ky954izbi-aai-webcraft.vercel.app
- Team alias: https://kokuna-webcraft-bradyperron-aai-webcraft.vercel.app
- Vercel Inspector: https://vercel.com/aai-webcraft/kokuna-webcraft-bradyperron/EuAz7D5zwAM7rL2FqC8SeLfLV5Jb
- Team: `aai-webcraft` (`team_cTx8vJkH2Yt4oQRCXiogNYAn`) — SSO protected, Meta-only access
- Project: `aai-webcraft/kokuna-webcraft-bradyperron` (`prj_l2McIoCt1Q2ZqasTLuJOTSkPNdxI`)

## Experience

- A white `bradyperron` loader tracks the preload state of all 17 project frames and the portrait, with brand mark exiting upward as bar fades, overlapping the stack reveal (delay 0.02s) for one connected sequence.
- The default grid begins as a centered stack of 16 media cards on desktop or 15 on mobile (scale 0.12, centered <300x<150). Twelve temporary cards fan radially offscreen with fading opacity (angle 2.18 rad, distance 1.28x viewport) while the same four desktop or three mobile cards travel via `layoutId` to exact grid-path positions. Same DOM elements preserve continuity token and begin continuous drift after 2.85s entrance window without layer swap.
- The fixed `list` control switches to a looping vertical title list coupled to a depth-scaled ring of project media. Title transforms are applied via direct DOM writes outside React renders to avoid per-frame rerenders; only active title is tabbable (arrow keys navigate).
- Every project image or title opens a fullscreen inline preview on `/` via shared `layoutId="project-{id}"`; there are no placeholder project routes. Preview background is translucent white (16% + 3px blur) keeping grid visible behind modal. Tile gradually moves to center and enlarges to modal envelope (82vw/72vh).
- Project previews auto-close when scrolling to bottom: wheel accumulator >90 or scroll near bottom triggers close and hero shrinks back to click location via layoutId reverse.
- The `about` control opens a slide-up dialog with staggered biography text, slowly drifting portrait (using portrait width/height for aspect), Instagram and email links, and focus containment with restoration after inert removal.
- Motion respects the user's reduced-motion preference: static grid with discrete Prev/Next + arrow-key navigation (no continuous drift, touch-action auto), static list with all titles + Prev/Next; durations instant.

## Fixes applied for review (2026-08-27)

- **Loading animation (site blocker):** Implemented stacked-center → disperse as one connected thing: loader fade overlaps stack reveal (0.02s delay), 16 cards start centered, 12 departing cards fan offscreen with opacity fade, 4 active cards travel to exact path destinations and continue moving via RAF without jump, preserving continuity tokens.
- **Modal transitions (site blocker):** ProjectPreview now relies on layoutId for center-to-modal and reverse modal-to-grid animation; background remains visible (translucent + blur); scroll-to-bottom and overscroll wheel auto-close.
- **Reduced-motion (code blocker #1):** Discrete navigation for grid (Prev/Next + Arrow keys, no wheel blocking, touch-action auto) and static list with all projects; passes reduced-motion e2e that expects 4 static cards.
- **Invisible buttons focusable (code blocker #2):** Page wrapper uses inert only (not aria-hidden) during loading/intro; grid buttons remove aria-hidden, use disabled + tabIndex -1 during intro, wrapped in inert container until interactive.
- **E2E macOS (code blocker #3):** Playwright config uses only `cp -R` (POSIX, works on BSD/macOS and GNU), no --reflink.
- **List tab order (code blocker #4):** Only active title tabbable (0 vs -1), ring container aria-hidden true, explicit ArrowUp/ArrowDown navigation.
- **List per-frame renders (code blocker #5):** Removed setRenderOffset state; transforms applied directly via refs inside useAnimationFrame, activeIndex updates only on change.
- **Unused fields (code blocker #6):** Portrait width/height now used for aspectRatio and Image dimensions, SETTINGS.description used for contact discipline line (formatted with spaced slashes), slug retained via data-slug attribute.

## Stack

- Next.js 16 App Router and React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Playwright and Node's built-in test runner

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
npm run lint
npm run test:unit
npm run build
npm run test
```

## Repository map

```text
src/app/
  layout.tsx              local Fraunces setup and document metadata
  page.tsx                shared view and modal state
  globals.css             global tokens, focus treatment, and reduced motion
src/components/
  Loader.tsx              local image preloader and branded entrance
  InfiniteCanvas.tsx      animated media-grid view
  ListView.tsx            looping titles and media-ring view
  BottomBar.tsx           fixed brand and view/about controls
  ProjectMedia.tsx        local video-loop or image rendering
  ProjectPreview.tsx      fullscreen project dialog
  AboutModal.tsx          fullscreen biography/contact dialog
src/lib/
  projects.ts             17 projects, local asset paths, and source provenance
  motion.ts               shared timing and easing constants
  useModalFocus.ts        focus trap, Escape close, and focus restoration
public/assets/bradyperron/ local portrait, project frames, and preview loops
public/fonts/              Fraunces Thin, Thin Italic, and SIL OFL license
```

## Assets and provenance

The runtime is self-contained: project frames, four short preview loops, portrait, fonts, and browser identity icons are served from `public/`. No Sanity or Mux media is fetched over the network when the page renders.

- Project frames are original-site poster frames: 15 exported from the target's Mux thumbnail endpoints and two from its Sanity image CDN.
- Four short homepage preview loops were copied from the target's public Mux 720p files for Lo & Behold, Timberland, Nuance, and Valerie Omari.
- The portrait is the original Sanity-hosted photograph.
- Fraunces Thin and Thin Italic were copied from the target site's `/Fraunces/` directory. The included `public/fonts/OFL.txt` records the SIL Open Font License 1.1.
- `public/favicon.ico`, `public/icon.svg`, and `public/apple-icon.png` provide the browser and Apple touch icons declared in the page metadata.
- Exact source URLs and local-file mappings are recorded in `site.toml` and `src/lib/projects.ts`.

The photographs and videos are original-site replication material; ownership and redistribution rights beyond this evaluation were not independently verified. No media was AI-generated.

The short local MP4s reproduce ambient portfolio previews; they are not full project films. A user can choose `watch film` in a project preview to open the project's public YouTube or Vimeo page. The about panel also contains the portfolio owner's Instagram and email links.

## Scope

Only `/` is implemented. Project detail routes, a CMS, WebGL shaders, and remote embedded Mux playback are intentionally excluded. Their entry points were replaced with inline project dialogs and local preview loops so the experience has no internal dead ends.

See `SETUP.md` for operational notes and `PRD.md` for the product specification.

The detailed original-versus-replica audit is in `ORIGINAL_VS_REPLICA_REPORT.md`.
