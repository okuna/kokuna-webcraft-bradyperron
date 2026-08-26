# Brady Perron Portfolio — Product Requirements Document

## 1. Product Overview

A single-page portfolio for filmmaker and photographer Brady Perron. The identity is lowercase `bradyperron`. The experience is sparse, image-led, editorial and cinematic, inviting playful discovery without conventional navigation chrome.

The product has one public surface that presents 17 projects. Visitors move through images or titles, open each project without leaving the page, and can reach biography and contact links at any time. Project titles never navigate to missing destinations; they open an inline preview that keeps the visitor on the same page.

The portfolio delivers:
- Two interchangeable project browsers on the same surface (grid and list) that loop continuously
- Fullscreen inline project detail that preserves the browsing context
- Fullscreen inline biography, portrait, discipline and contact links
- Performance that relies on local poster frames and short preview loops, with external film destinations opening only after explicit activation

## 2. Audience and Core Experience

Primary audience is visitors discovering film and photography work, including potential collaborators and clients looking for project context and contact paths.

Core experience:
- Enter through a white brand loader that reveals the portfolio once local poster frames and the portrait have loaded
- Discover projects by moving through a continuously drifting grid of poster cards or by traveling through a looping vertical list of titles coupled to a depth-scaled ring of media
- Open any project via its card, title, or ring image to view a focused fullscreen preview with metadata and, when available, a single external film destination
- Open the about surface at any time to read the biography line, discipline, portrait, and contact links
- Operate the entire experience with mouse, touch, or keyboard with equal clarity

## 3. Global Design System

### Color
- Canvas and dialog backgrounds white, primary text black
- Secondary labels black at 40–60% opacity
- Borders and progress track black at 10–15% opacity
- Image placeholders very light neutral gray
- Text selection white text on black

### Typography
- A single locally hosted thin editorial typeface and its italic counterpart for the entire interface
- Brand mark lower-left: 20px on small viewports, 30px on large viewports
- Default list titles: fluid 14–24px, line-height 1.5, tracking 0.02em
- Active centered list title: fluid 20–36px, tracking 0.32em, fully black
- About statement: clamp 1.7rem, 4.4vw, 3.75rem, line-height 1.06, letter-spacing -0.018em
- Utility labels: 11–14px, tracking 0.22–0.32em
- Titles farther from center fade progressively

### Layout
- White full-width viewport, overflow-x clipped at every supported size
- Fixed bottom controls: brand at lower-left, view toggle and about at lower-right
- Primary responsive breakpoint at 768px
- Bottom controls and about links provide minimum 44px touch targets in both dimensions
- Focus visible treatment: 2px solid black outline with 2px offset

### Motion Principles
- Editorial, unhurried easing with smooth out curves for entrances and spatial movement
- Loader respects a minimum visible duration of 1.35s in standard motion and about 150ms when reduced motion is preferred, then fades over 500ms
- As the loader fades, 16 poster frames on desktop or 15 on mobile expand from one centered stack. Twelve temporary frames fan radially offscreen while the same 4 desktop or 3 mobile cards travel to their exact grid-path positions; continuous grid motion begins after the 2.7s entrance window without a layer swap
- About surface slides upward from below the viewport over 750ms
- Continuous drift, hover enlargement, and ring parallax stop when reduced motion is preferred, with durations becoming effectively instant
- Shared motion configuration respects the user's reduced-motion preference

### Responsive Principles
- Grid uses 4 independent cards on large viewports and 3 on small viewports, with sizes defined via viewport-relative units and maximum height clamps up to about 58vw / 420px on large and 68vw / 340px on small
- List title spacing and ring radius tighten on small viewports
- About shifts from stacked single column on small to 12-column grid on large
- No element creates horizontal document overflow at 320px
- Fixed bottom bar, ring projection, and dialog headers remain usable at all supported sizes

## 4. Global Accessibility Requirements

- Landmarks: header, main, footer for persistent controls; main carries an id for skip destination; skip link "Skip to main content" is visually hidden until focus
- Heading hierarchy: brand mark as h1, project and about dialog titles as h2, about statement may be presented as a paragraph styled as a headline
- Semantics: native button elements for actions, anchor elements for navigation, anchors for external destinations only after explicit activation
- Imagery: meaningful images use project-title or portrait alternative text; duplicated decorative images use empty alternative text
- Keyboard: Tab moves to all buttons and links, Shift+Tab reverses, Escape closes any open dialog, no keyboard traps except modal focus containment when a dialog is open
- Dialog focus: moves into dialog on open, traps Tab and Shift+Tab, restores focus to the opener on close, initial focus on a close control or heading
- Background behavior while dialog is open: page scroll locked, page beneath marked inert and hidden from assistive technology
- Visible focus states preserved at all times
- External destinations open in a new tab with safe external attributes only after explicit user activation; no automatic network requests for third-party media or tracking during normal rendering
- Touch targets minimum 44px for bottom buttons and about links
- Layout avoids assumptions about left-to-right reading order

## 5. Global Content and Data

### Identity and Contact
- Site title: `bradyperron`
- Short description: `Videographer/Editor/Director`
- Long description: `Brady Perron is a Brooklyn-based Videographer/Director/Editor/Photographer. Rhythm. Range. Poetic. Dynamic.`
- Discipline line: `Videographer / Editor / Director`
- Social: Instagram link to `https://instagram.com/bradyperron`
- Contact: `brady.perron@gmail.com`
- Portrait: local 4:5 photograph with alt text for the about surface

### Projects
The collection contains 17 projects. Each project provides title, client, year, and type. Type is one of Commercial, Short Film, Campaign, Music Video, Documentary, Film. Each may also provide a description, an external film destination used for a single "watch film" link, a local muted looping preview used in active grid, list and preview states, a poster frame, and width and height that define the authoritative aspect ratio.

| Title | Client | Year | Type | Local Preview Loop |
|-------|--------|------|------|-------------------|
| Harlaut Apparel Winter Campaign | Harlaut Apparel Winter Campaign | 2024 | Campaign | No |
| Lo & Behold Henrik Harlaut | Monster Energy | 2023 | Short Film | Yes |
| Timberland Built for the Bold | Timberland | 2023 | Commercial | Yes |
| Nuance Phil Casabon x Armada Skis | Armada Skis | 2023 | Short Film | Yes |
| Valerie Omari | Valerie Omari | 2025 | Music Video | Yes |
| NOVOS Labs | NOVOS Labs | 2025 | Commercial | No |
| JACK MOORE HEAD IN SAND | JACK MOORE | 2025 | Documentary | No |
| Shy of Summer II | Monster Energy | 2025 | Commercial | No |
| I'll See You on the Other Side Omar Al-Sudani x Office Mag | Omar Al-Sudani x Office Mag | 2025 | Documentary | No |
| 686 Jogger | 686 | 2025 | Commercial | No |
| ERNE | ERNE | 2024 | Music Video | No |
| Elaine Hersby | Elaine Hersby | 2023 | Commercial | No |
| The North Face Freeride | The North Face | 2026 | Commercial | No |
| Something in the Water Jake Mageau x Level 1 | 686, ON3P, Fat Tire | 2025 | Commercial | No |
| The North Face COALESCE | The North Face | 2023 | Short Film | No |
| ATTN for bite. | bite. | 2026 | Film | No |
| Good Bacteria | Good Bacteria | 2026 | Commercial | No |

When a local preview loop exists, the project shows a muted inline looping video in active grid and list slots and in preview dialogs; otherwise the poster frame is used. When an external film destination exists, the preview dialog shows a single centered "watch film" link; otherwise no link appears and no empty control is shown.

### Asset Inventory
- Seventeen poster frames covering all projects
- Four short muted preview loops for Lo & Behold, Timberland, Nuance, and Valerie Omari
- One portrait photograph in 4:5 ratio for the about surface
- Locally hosted thin editorial typeface in regular and italic plus its license file
- Browser identity icons for favicon, generic icon, and Apple touch icon

## 6. Product Surfaces

#### 6.1 Loader and Entrance
White fullscreen loader above all content. Displays the brand mark with upward text reveal and a black progress bar beneath that tracks real loading of the 17 poster frames and the portrait. Respects minimum visible duration and fade behavior defined in the design system. As the loader fades, the default view reveals a centered stack of 16 poster frames on desktop or 15 on mobile. Twelve temporary frames fan radially beyond the viewport while the persistent 4 desktop or 3 mobile cards move to their exact grid-path destinations. Those same card elements begin continuous grid motion after the entrance window, with no crossfade or position reset. Reduced-motion omits the stack and dispersal movement and reveals a stable grid immediately.

#### 6.2 Bottom Controls
Fixed footer landmark with brand mark as h1 at lower-left and view toggle list/grid plus about at lower-right. Brand does not navigate to a missing destination; it scrolls to top or is a no-op. Controls remain usable at all viewport sizes including 320px. Staggered upward fade reveals them while media entrance runs.

#### 6.3 Grid Browser (Default)
Default browsing mode. Presents 4 independently moving poster cards on large viewports and 3 on small viewports. Preserves each project's declared aspect ratio. Cards travel continuously through mixed horizontal, vertical, and diagonal paths that cross the viewport, entering and leaving beyond viewport edges with no visible stop at the boundary. When a project has a local preview loop, the loop plays muted inline continuously inside the active card; otherwise the poster frame is shown. Recycle behavior is indefinite: on path completion the card is assigned the next project and continues without jump. Includes subtle hover enlargement without obscuring imagery. Wheel and pointer drag add directional velocity; momentum eases back toward base drift. Each visible card is a keyboard-focusable button with an accessible name that includes the project title and indicates it opens a preview. Activation opens the fullscreen project preview without URL change.

#### 6.4 List Browser
Triggered by the fixed list control that crossfades from the grid. While active, the control label shows grid to return. Renders all 17 titles in a vertically looping list centered in the viewport with baseline spacing around 64px, wrapping positions continuously in both directions. Title nearest center is fully black, larger, and widely tracked; titles farther away fade progressively. Title movement is coupled to a ring of 17 poster frames below and around the title list. Ring projection uses an inside-looking-out virtual camera with a single outward-facing arc visible. Center of arc: smaller and farther; toward clipped viewport edges: larger and closer. A second near-side arc is never rendered. Virtual field of view around 50 degrees, with only the active project's local preview loop playing and others using still frames. Wheel and drag move titles and ring together with easing and wraparound. Title buttons are in tab order; ring images are redundant visual controls outside keyboard order. Activating a title or ring image opens the matching project preview.

#### 6.5 Project Preview Dialog
Opens inline above the portfolio on project selection. Fades a white dialog into view with dialog role, modal true, labelled by project title heading. Close control at upper-right sized 56–64px. Centers the selected project's local preview loop within an envelope around 82vw by 72vh when available, otherwise the poster frame, preserving declared aspect. Overlays a compact more info control and downward cue at center of poster that activates smooth scroll to an info section inside the dialog scroll container. Info section shows exact project title as dialog h2 heading, a row with client, year, and type separated by centered dots, a poster on a full-width black 16:9 field using contain fit, and when an external film destination exists a centered watch film link with external arrow over the field. When no destination exists, the link and any empty control are omitted. Ends with a centered close action. Both close controls and Escape close the dialog. Background scroll is locked while open. Focus behavior follows global accessibility requirements.

#### 6.6 About Panel Dialog
White fullscreen dialog sliding upward from below viewport. Sticky header with about label on left and close control on right minimum 44 by 44. Biography including long description and Videographer / Editor / Director line revealed as individually masked words with short stagger. Portrait at two-thirds width on small viewports and 4 columns of a 12-column grid on the right on large viewports. Portrait reveals via vertical clip and then drifts very slowly with subtle movement. Left side lower grid on large viewports shows contact label, Instagram link, email link, and discipline line. Contact links show thin black rules and an arrow that moves diagonally on hover. Footer shows brand mark and current year in low-contrast style. Follows same focus, Escape, background inert, and scroll lock behavior as project preview.

#### 6.7 Site Frame
White viewport with header, main, and footer landmarks. Main carries skip destination. Bottom controls are persistent chrome. No document scrollbar is exposed by the project browsers; scrolling and dragging drive the spatial browsers and dialog scroll containers.

## 7. Acceptance Criteria

- One public surface presents the entire portfolio; all project and about content opens inline via dialogs, with no internal dead ends or placeholder project destinations. Brand mark remains visible and does not navigate to a missing destination.
- Loader reports real local-image loading progress for the 17 poster frames and the portrait, respects minimum intro visibility and fade timing defined in the design system, and reveals a centered 16-card desktop or 15-card mobile stack whose persistent 4/3 cards disperse directly into their grid paths while 12 extras exit radially; reduced-motion skips the dispersal and reveals a stable grid immediately.
- Grid continuously recycles 4 media cards on large viewports and 3 on small across varied paths; preview loops autoplay muted and inline when available; wheel and drag add momentum; keyboard focusable controls with accessible names that include the project title are present.
- List control crossfades to a looping 17-title list with centered active title enlarged and widely tracked and progressive fade by distance; media ring is depth-scaled outward-facing arc only; wheel and drag move both; active preview loop plays when available.
- All 17 projects are discoverable and open the corresponding fullscreen preview via grid card, list title, or ring image.
- Project preview dialog shows centered media envelope preserving aspect ratio, more info scroll, exact title as h2, client year type row with centered dots, black 16:9 field poster, watch film external link only when an external destination exists, close controls, Escape handling, focus trap and restoration, background inert and scroll lock, and no empty controls.
- About dialog slides up with sticky header, staggered biography words, portrait vertical-clip reveal and slow drift, contact label with Instagram and email and discipline, hover arrow motion, footer brand and current year, with same focus management as preview.
- Fixed bottom controls remain usable at all viewport sizes including 320px and layout has no horizontal overflow at 320px.
- Typography uses locally hosted thin editorial face with tracked utility labels and fluid brand scaling as defined.
- No local image, video, font, or icon request returns empty or missing; no automatic third-party media or tracking requests occur during normal rendering; external destinations open only after explicit user activation.
- Semantics include header, main, footer, single h1, h2 dialog titles, buttons for actions, links for navigation, skip link, portrait and preview alternative text, decorative duplicates with empty alternative text, minimum touch targets, and offset focus outline.
- Motion respects reduced-motion preference with continuous motion stopped and durations made effectively instant.
- Browsing and dialog interactions remain smooth and error-free across desktop and mobile viewports with keyboard, mouse, and touch inputs.
