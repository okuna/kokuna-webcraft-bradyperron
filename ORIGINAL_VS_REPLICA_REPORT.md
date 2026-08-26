# Original vs. Replica Difference Report

Audit date: August 20, 2026

## Executive summary

The replica is a strong match for the original site's visual identity and primary home-page browsing model. It reproduces the white editorial canvas, Fraunces Thin typography, fixed bottom controls, project ordering, loader branding, moving grid, looping title list, About content, and responsive breakpoint.

It is not a feature-complete clone. The largest differences are:

1. The original's Three.js/WebGL media engine, shader effects, and geometry-preserving transitions were replaced with a lighter DOM/Framer Motion implementation.
2. The original has 15 moving home-preview videos; the replica retains four local preview loops and shows still posters for the other 11.
3. The original project experience includes deep links, inline film players, full descriptions, and 28 gallery items. The replica uses a single-route dialog with one poster and an outbound film link.

Within the repository's declared single-page scope, there are no dead-end routes or broken primary flows. For exact visual and content parity, the media engine and project-detail experience remain the main blockers.

## Audit basis

The comparison used:

- Live original captures at 1440×900 and 390×844, including loader, grid, list, project, and About states.
- The original production JavaScript bundles and normalized 17-project Sanity payload.
- The replica's optimized production build and checked-in [desktop](screenshots/home-desktop.png) and [mobile](screenshots/home-mobile.png) captures.
- Current replica source, tests, PRD, and asset manifest.

Because both grids are continuously animated, individual projects will not occupy identical coordinates in arbitrary screenshots. The audit therefore compares scale, density, paths, hierarchy, transitions, and behavior rather than expecting one frozen frame to match exactly.

## Parity overview

| Area | Parity | Summary |
| --- | --- | --- |
| Typography, color, and fixed chrome | High | Same Fraunces Thin files, black/white palette, lowercase brand, and bottom controls. |
| Loader | Medium-high | Branding and headline timing are close; progress inputs and explosion choreography differ. |
| Grid composition | Medium | Counts and nine path shapes match, but aspect sizing, speed variation, depth, and effects differ. |
| List typography | High | The 64px rhythm, active title scale/tracking, opacity falloff, and looping behavior are close. |
| List media ring | High-medium | The replica projects the original virtual-camera geometry into CSS, places it behind the title list, and shows one camera-facing outward arc, but it is not a true WebGL scene. |
| About panel | High | Copy, portrait, responsive composition, and overall entrance are close; sequencing and exit differ. |
| Project opening transition | Low-medium | A separate modal scales in instead of the clicked media plane expanding continuously. |
| Project detail content | Low | Deep links, embedded films, full rich text, and all gallery sections are omitted. |
| Accessibility | Better than original overall | The replica adds focus management, semantic controls, reduced motion, and an inert background. |
| Privacy and runtime independence | Better than original overall | Normal rendering is local-only and omits analytics and automatic third-party embeds. |

## Exact-parity blockers

### 1. Media engine and motion language

The original is a WebGL canvas built with Three.js/React Three Fiber and GSAP. The replica uses positioned DOM buttons, images, videos, and Framer Motion.

Consequences:

- The replica now matches the original entrance topology with four active desktop cards or three active mobile cards continuing from the centered stack into their exact paths while up to 12 temporary extras fan outward. The remaining difference is implementation and depth: DOM cards approximate the original WebGL planes rather than sharing its world-space camera and rendering pipeline.
- The original begins randomized idle effects after approximately 12 seconds, then after roughly eight seconds of later inactivity. Its five desktop modes include trails, kaleidoscope, blur/flare, chromatic ripple, and liquid warp; mobile omits the blur mode. The replica has no idle post-processing.
- The original grid-to-list transition shrinks grid geometry toward the center over about 550ms while the 3D ring fades in. The replica crossfades two separately mounted views over 650ms, so geometry and position do not carry across the mode change.
- The original preserves the selected plane through project open and close. The replica creates a new media element inside an opaque dialog.

This is the main reason the replica feels like a close visual interpretation rather than the same authored motion system.

### 2. Moving-media coverage

| Content | Original | Replica |
| --- | ---: | ---: |
| Home projects | 17 | 17 |
| Moving home previews | 15 | 4 |
| Static home images/posters | 2 | 13 |
| Project gallery items | 28 across 6 projects | 0 |

The four retained videos are Lo & Behold, Timberland, Nuance, and Valerie Omari. The remaining 11 projects that move in the original appear as still posters in the replica's grid, list ring, and project hero.

The first screen therefore retains much of the original's tone, but motion variety decreases as projects recycle.

### 3. Project-detail experience

The two flows are materially different:

| Stage | Original | Replica |
| --- | --- | --- |
| Selection | Clicked WebGL plane expands from its current position | White dialog fades in; a separate card scales from 72% |
| URL | Pushes `/project/{slug}`; deep links and browser history work | URL remains `/` |
| Hero | Selected plane remains continuous behind transparent UI | New centered media card on an opaque white section |
| Persistent chrome | Brand, grid/list, and About remain visible over the hero | Project dialog covers the bottom chrome |
| Information | Source rich text, client, and year | Plain paragraph plus client, year, and an added type |
| Film | Full-width embedded YouTube/Vimeo player | Repeated poster with `watch film ↗` external link |
| Gallery | All project gallery media in screen-height black stages | Omitted |
| Closing | X, Escape, bottom action, or 520px edge overscroll; plane returns to prior geometry | X, Escape, or bottom `close`; dialog fades/shrinks |

Keeping only `/` is required by this repository's instructions, but the richer detail content could still exist inside the inline dialog.

## Major quality gaps

### Grid sizing and physics

- The original sizes media from a fixed 3D short side: 5.5 world units on desktop and 3.5 on mobile. At 1440×900, a portrait 4:5 plane is roughly 442×553px. The replica caps its height near 441–460px, producing a portrait near 353×441px.
- On 390px mobile, original landscape planes can be wider than the viewport and clip naturally at the edges. The replica caps width near 68vw, so landscape media is substantially smaller and more contained.
- Original cards are axis-aligned with subtle z offsets. The replica adds visible sine-based rotation and a 1.5% hover scale not present in the target.
- Original autonomous speed is slightly randomized per card and is faster on mobile. The replica uses one base speed for every card.
- Original mobile physics use damping `.90`, maximum velocity `1.1`, wheel multiplier `.0014`, and touch multiplier `.009`. The replica uses the desktop `.92`, `1.6`, `.0024`, and `.011` values in grid mode, making direct mobile input more aggressive even though autonomous motion is slower.
- Original recycling applies a small golden-ratio spawn offset. The replica has no equivalent offset, so spacing is more regular.

### List ring depth

The title column is one of the strongest matches. The media ring now also matches the target's inside-looking-out composition much more closely:

- The original uses a true 3D radius of 7.5 desktop and 5.5 mobile, camera-facing planes, and perspective foreshortening.
- The replica projects those same radii, a 50-degree field of view, camera z-position 12, ring center z-position 2.2, and world y-position -2 through a CSS perspective scene. It culls the near half so only the single far/outward arc remains visible.
- Each media card receives camera-derived X/Y rotation, producing the target's inward-facing 3D skew. The entire arc is layered behind the title list so text remains the foreground anchor.
- The result matches the target's center-small/edge-large perspective, but CSS elements still lack real mesh intersection, raycast precision, and WebGL depth rendering.
- Original visible front-half videos can play. The replica plays only the active project's loop, and only for four projects.
- Replica clickability is limited to the visible arc, while the original uses raycasting and a material-opacity threshold.

### Project layout details

- Original project information is a fixed 50vh section with vertically centered content. The replica uses `min-height: 50vh`, top alignment, and 80–112px vertical padding.
- The original hero expands portrait and square work much larger on mobile. The replica's 82vw/72vh envelope produces a smaller square hero.
- The original label reads `scroll to close`; the replica reads `close`.
- The original uses compact vector X and chevron icons. The replica uses typographic `×` and `⌄` glyphs in larger boxes.
- The original hides the `more info` prompt after about 80px of scrolling. The replica leaves it in the hero and simply scrolls it out of view.
- The underlying replica grid keeps animating behind the opaque modal, so closing can reveal changed card positions. The original freezes global motion and restores the selected plane to its exact previous geometry.

## Content and metadata differences

### Incomplete descriptions

- **The North Face “COALESCE”**: the replica keeps the opening paragraph but omits director, camera/edit, featured artist, music, and 35mm-image credits.
- **ATTN for bite.**: the replica truncates the first paragraph and omits the starring, Monster Energy support, and thanks credits.
- Portable rich-text structure is flattened into plain paragraphs, so emphasis and source line breaks are lost.

### Type metadata drift

The original source has no type for Harlaut Apparel, COALESCE, or ATTN. The replica adds `Campaign`, `Short Film`, and `Film` respectively. The original source spells the 686 type as `Commecial`; the replica silently corrects it to `Commercial`.

The original project UI displays client and year. The replica additionally displays type, so even source-correct types change the information line's content and width.

### Social metadata

Both versions use the same page title, description, and browser icons. The original also defines the portrait as its Open Graph/Twitter image and includes Twitter metadata. The replica currently defines no Open Graph image or Twitter card.

## Loader and transition differences

- The original loader tracks the 17 decoded homepage textures and has no artificial minimum display duration. The replica preloads 17 poster images plus the portrait, rounds progress to an integer, and enforces a 1.35-second minimum, reduced to 150ms for reduced-motion users.
- The replica loader does not wait for its four MP4 previews, so a poster-to-video swap can occur after the loader has completed.
- Both use a one-second brand reveal and a 500ms exit, but the easing curves differ slightly.
- The original About panel has a staged exit: headline and portrait lift/fade, reveal items follow, then the panel drops. The replica moves the entire panel down as one layer.
- Original About contact rows reveal separately. The replica reveals the contact block as one unit and begins several elements earlier in the panel timeline.

## Intentional repository-driven differences

These differences should not be treated as accidental regressions:

- **Single route:** the repository explicitly requires only `/`, so project routes were replaced with inline dialogs.
- **No CMS:** the live Sanity payload was normalized into [projects.ts](src/lib/projects.ts).
- **No runtime Mux:** poster frames and four verified preview files are local.
- **No WebGL shader complexity:** the canvas was replaced with maintainable DOM/Framer components.
- **No analytics:** the original's Vercel Analytics script is intentionally absent.
- **No automatic third-party embeds:** YouTube, Vimeo, Instagram, and email destinations load only after explicit activation.

These choices reduce exact fidelity but improve reproducibility, privacy, and maintainability.

## Areas where the replica is stronger

- Grid media and project titles are native named buttons rather than canvas-only hit areas.
- Both dialogs trap focus, restore focus to the opener, lock body scroll, and make the background inert.
- Escape works consistently for both dialog types.
- A skip link and visible 2px focus treatment are present.
- The portrait has descriptive alt text.
- `prefers-reduced-motion` is supported; the original bundle has no equivalent branch.
- The layout is verified without horizontal document overflow at 320px.
- Normal rendering makes requests only to the replica origin.
- Project selection never lands on a missing internal route.

## Replica-specific issues independent of fidelity

These are implementation gaps even within the replica's chosen scope:

- In reduced-motion mode, grid and list physics stop completely. Wheel and drag no longer advance projects, making the full collection difficult to browse visually.
- List title buttons do not meet the documented 44px minimum touch height; inactive rows are approximately 21–36px tall and the mobile active row is about 30px.
- The decorative ring wrapper has `aria-hidden="true"` while containing clickable button descendants. Those controls should be non-interactive decorative elements or moved outside the hidden subtree.
- There are no keyboard commands for intentionally advancing either moving browser. Keyboard users can tab visible controls, but cannot step the sequence predictably.

## Documentation and submission gaps

The PRD is otherwise aligned with the shipped single-page product and uses replica screenshots. One measurement is stale:

- It describes a roughly 420px desktop grid-height cap; current code allows 460px.

The PRD also promises exact metadata and 44px action targets, which conflict with the type additions and list-title sizing above.

`features.json` is structurally complete and contains five specific mixed CUJ/design criteria. Deployment access and the narrated walkthrough remain explicitly incomplete; those are submission-readiness items, not runtime differences from the original.

## Recommended priority order

If closer parity is desired while retaining the one-route architecture:

1. Add the missing project descriptions and 28 gallery items to the inline dialog; use click-to-load film embeds if third-party privacy is a concern.
2. Add optimized local loops for the remaining 11 video projects.
3. Use shared-layout geometry so the selected card expands into the hero and restores to its prior location; freeze the background while open.
4. Reproduce the grid-to-list shrink/morph instead of crossfading two reset views.
5. Correct aspect-based grid sizing and mobile velocity constants, then refine the CSS ring's occlusion only if a true WebGL ring remains out of scope.
6. Add a lightweight approximation of the idle effects if full WebGL remains out of scope.
7. Correct metadata/content drift, add OG/Twitter images, and resolve the reduced-motion and ARIA issues.

## Overall assessment

The replica is highly faithful in identity, typography, basic composition, list-title behavior, and About presentation. It is moderately faithful as an animated home portfolio and substantially simplified as a project-viewing platform. The implementation is cleaner, more accessible, more private, and easier to maintain than the original, but those gains come with visible losses in motion authorship, moving-media coverage, spatial continuity, and project depth.
