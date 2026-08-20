# AGENTS Guide

This file defines implementation standards for this repository.

## Core Principle

Prefer a smaller complete site over a larger broken one. Cutting scope is acceptable. Shipping broken scope is not.

## Code Quality Rules

| Area | Instruction |
|------|-------------|
| Route/component structure | Single page "/" only by design. Keep clean mapping. Avoid placeholder routes that 404. |
| No dead ends | Project title clicks must not navigate to missing pages. Use inline preview or modal or keep on page. |
| Animation implementation | Use Framer Motion for scroll, drag, about stagger. Keep timing constants named, not scattered magic numbers. |
| Scope discipline | Do not introduce CMS, WebGL shader complexity, or Mux unless verified. Cut cleanly and document in PRD. |
| Semantic HTML | Heading hierarchy: h1 brand mark, h2 about headline (or p styled as headline), proper landmarks header/main/footer, buttons for actions, links for navigation. |
| Responsive | Use grid, flex, clamp(). Ensure no horizontal overflow at 320px. |

## Maintainability

- No commented-out blocks, unused imports, unreachable branches.
- Extract repeated project data into lib/projects.ts constant.
- Split files beyond ~500 lines. Components: Loader, InfiniteCanvas, ListView, BottomBar, AboutModal, ProjectPreview.
- Replace magic numbers (450ms, cubic-bezier values) with named constants where reused.
- Keep components composable, avoid circular imports.

## Accessibility & Responsiveness

- Provide alt text for portrait and previews (title as alt).
- Keyboard: Tab to all buttons/links, Escape to close about, no traps except modal traps focus when open.
- Visible focus states 2px black offset.
- Touch targets min 44px for bottom buttons and about links.
- Avoid left-to-right assumptions for future i18n.

## Integrity & Security

- No obfuscated code, minified committed bundles, or hidden provenance.
- No dist/build/node_modules committed.
- Copy only compatible licensed images (Sanity CDN originals served locally or via next/image allowlist).
- Document asset sources in site.toml and PRD.
- No analytics, tracking, or undocumented third-party calls.
- No eval, new Function, document.write, unsafe innerHTML.
- No secrets committed.

# Next.js Note

This version may have breaking changes — read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
