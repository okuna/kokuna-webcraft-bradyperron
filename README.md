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

- A white `bradyperron` loader tracks the preload state of all 17 project frames and the portrait.
- The default grid begins with a twelve-image scatter, then keeps four media cards moving on desktop and three on mobile. Four projects use local muted video loops; the others use local poster frames. Wheel and drag input add momentum to the continuous motion.
- The fixed `list` control switches to a looping vertical title list coupled to a depth-scaled ring of project media.
- Every project image or title opens a fullscreen inline preview on `/`; there are no placeholder project routes.
- Project previews contain the poster, project metadata, a smooth-scroll `more info` action, and an external YouTube or Vimeo link when one is available.
- The `about` control opens a slide-up dialog with staggered biography text, a slowly drifting portrait, Instagram and email links, and focus containment.
- Motion respects the user's reduced-motion preference.

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
