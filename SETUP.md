# Setup — Brady Perron Portfolio

**GitHub:** https://github.com/okuna/kokuna-webcraft-bradyperron
**Vercel:** https://kokuna-webcraft-bradyperron.vercel.app

## Requirements

- Node.js 20.9 or newer
- npm 9 or newer

The application is static and requires no environment variables, API keys, database, or backend service. `.env.example` is intentionally empty apart from its explanatory comment.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

The application exposes only `/`; Next.js also generates its framework-level not-found route.

## Validation

```bash
npm run lint
npm run test:unit
npm run build
npm run test
```

The Playwright configuration builds the app, starts the production server on the isolated port `4173`, and refuses to reuse an existing server.

## Runtime behavior

The loader preloads the 17 local project frames and local portrait before revealing the interface. The default view is a continuously moving media grid controlled by the mouse wheel or pointer drag. Four projects replace their poster with a muted local video loop when active. The `list` control switches to a looping title list and synchronized media ring. Selecting media or a title opens a fullscreen project dialog; `about` opens a separate biography dialog. Both dialogs trap focus, close with Escape, restore focus, and leave the rest of the page inert while open.

The interface uses Framer Motion for the loader, view transitions, grid/list gestures, project dialog, and about reveal. A shared `MotionConfig` and CSS media query respect `prefers-reduced-motion`.

## Asset provenance

All visual and font assets used at runtime are committed locally. No image, font, Mux, or CMS network request is needed to render the site.

### Project frames

The 17 files under `public/assets/bradyperron/home/` are original-site poster frames. Fifteen were downloaded from the target's `image.mux.com` thumbnail endpoints. The Harlaut Apparel and ATTN for bite. frames were exported from the target's Sanity CDN as 1200px WebP files. Each exact local-file/source-URL pair is recorded in `site.toml`; the matching source URL is also stored beside each project in `src/lib/projects.ts`.

### Preview loops

Four exact public Mux 720p files from the target are stored locally and play muted, looped, and inline:

- `public/assets/bradyperron/video/lo-behold.mp4` from `https://stream.mux.com/pWpmeh2nG7EX6MHchaIRXBL00wr2N2zR9zZc3D00wLJH8/720p.mp4`
- `public/assets/bradyperron/video/timberland.mp4` from `https://stream.mux.com/sfl3vxN2dMGgKu9TMWztvia9YpAmQTrdgSMdLS5EbMw/720p.mp4`
- `public/assets/bradyperron/video/nuance.mp4` from `https://stream.mux.com/aRHAvLuj8OTimrgtjFxBzTgIUNd02zHUzW8Dr8uy8IBo/720p.mp4`
- `public/assets/bradyperron/video/valerie-omari.mp4` from `https://stream.mux.com/JIbtVyo57Rn2Q1e00Y01r11kRQIIJ2hR00q47bAgroVfEM/720p.mp4`

### Portrait

- Local: `public/assets/bradyperron/brady-portrait.jpg`
- Source: `https://cdn.sanity.io/images/qrv69xlg/production/ce4e709dd358c6174402b1342cef9809f85035b5-3339x5035.jpg`

### Typography

- `public/fonts/fraunces-thin.ttf` from `https://www.bradyperron.com/Fraunces/static/Fraunces_72pt-Thin.ttf`
- `public/fonts/fraunces-thin-italic.ttf` from `https://www.bradyperron.com/Fraunces/static/Fraunces_72pt-ThinItalic.ttf`
- `public/fonts/OFL.txt` from `https://www.bradyperron.com/Fraunces/OFL.txt`

The font is Fraunces, copyright 2018 The Fraunces Project Authors, licensed under SIL Open Font License 1.1.

### Icons

- `public/favicon.ico` from `https://www.bradyperron.com/favicon.ico?favicon.0p-z811-z3k4c.ico`
- `public/icon.svg` from `https://www.bradyperron.com/icon.svg?icon.12uh3kqfs.9yg.svg`
- `public/apple-icon.png` from `https://www.bradyperron.com/apple-icon.png?apple-icon.0z1xtsgj7-38k.png`

All three are declared through the Next.js metadata API for browser and Apple touch identity.

### External user-initiated links

Project dialogs may open public YouTube or Vimeo film pages. The about dialog may open Instagram or the visitor's email client. These destinations are never loaded automatically by the replica.

## Authorship and replication notes

- Sourced from the original portfolio: project names and metadata, poster frames, four preview loops, portrait, Fraunces files, icons, biography, and contact destinations.
- Created for this repository: the Next.js/React implementation, Framer Motion behavior, responsive layout, accessible dialogs, tests, and repository documentation.
- No imagery or video was AI-generated.
- Original-site photographs and videos are included for this replication evaluation; ownership and redistribution rights beyond that use were not independently verified.
- Project detail routes, the original WebGL implementation, CMS access, and remote embedded streaming were deliberately omitted. Project content remains accessible through inline dialogs on `/`, with four short preview videos served locally.

## Deployment

**Vercel Production (AAI -Web Craft team)**

- **Stable alias (main):** https://kokuna-webcraft-bradyperron.vercel.app
- **Immutable production:** https://kokuna-webcraft-bradyperron-ky954izbi-aai-webcraft.vercel.app
- **Team alias:** https://kokuna-webcraft-bradyperron-aai-webcraft.vercel.app
- **Additional alias:** https://kokuna-webcraft-bradyperron-chi.vercel.app
- **Inspector:** https://vercel.com/aai-webcraft/kokuna-webcraft-bradyperron/EuAz7D5zwAM7rL2FqC8SeLfLV5Jb
- **Project ID:** `prj_l2McIoCt1Q2ZqasTLuJOTSkPNdxI`
- **Team:** `aai-webcraft` (`team_cTx8vJkH2Yt4oQRCXiogNYAn`)
- **Framework:** Next.js 16.3.0 (Turbopack), static prerender `/`
- **Status:** Ready, SSO protected (302 to `vercel.com/sso-api`) — Meta-only firewall
- **Build:** 44s, 4 cores / 8GB, iad1, 365 packages

Deployment was performed via Vercel CLI authenticated as `kokuna-5671`:

```bash
rm -rf .vercel
vercel --scope aai-webcraft --prod --yes
vercel alias rm kokuna-webcraft-bradyperron.vercel.app --scope test-team1-please-ignore --yes
vercel alias set https://kokuna-webcraft-bradyperron-ky954izbi-aai-webcraft.vercel.app kokuna-webcraft-bradyperron.vercel.app --scope aai-webcraft
vercel remove kokuna-webcraft-bradyperron --scope test-team1-please-ignore --yes  # cleanup personal team copy
```

`site.toml` updated:
```toml
url = "https://kokuna-webcraft-bradyperron.vercel.app"
hosting_access_granted = true
```

## Screenshots

The checked-in home captures are:

- `screenshots/home-desktop.png` at 1440×900.
- `screenshots/home-mobile.png` at 390×844.

Both are declared for `/` in `site.toml`.

## Narration / Walkthrough Videos

**Walkthrough:** https://www.internalfb.com/intern/px/p/cvjCL

- Narrated walkthrough of loader real-preload progress, 12-image scatter intro, grid 4/3 recycling with preview loops + wheel/drag, list looping titles + media ring, project preview dialog a11y (focus trap/restore/Escape/inert), about panel slide-up + staggered biography + portrait drift, responsive 320px, reduced-motion, local-only assets, Vercel deployment in AAI -Web Craft team.
