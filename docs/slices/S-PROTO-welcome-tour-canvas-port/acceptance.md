# S-PROTO-welcome-tour-canvas-port

**Category:** prototype

## Intent

Port the welcome-tour canvas at `docs/design-source/welcome-tour/decoded/Welcome Tour - Standalone.html` to a Next.js prototype route at `src/app/dev/proto/welcome-tour/`. Canvas-as-source pattern per CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype default)".

Source canvas is a carousel-style multi-step tour with 6 steps (intro → 4 phases → dashboard preview). Canvas already React-shaped (`<script type="text/babel">` with `className` / `style={{}}` / hooks). State: `useState` for step + `useEffect` for localStorage persistence + keyboard nav (ArrowLeft / ArrowRight / Enter). Ported verbatim per user direction (see scope decision).

Out of scope:
- Wiring the tour into a signup / authentication flow (the tour is unauthenticated prototype at `/dev/proto/welcome-tour`).
- Adjusting tour copy or phase order — copy ships as canvas defines.
- Mobile responsive breakpoint work (canvas has no responsive media queries other than `prefers-reduced-motion` if present; deferred per canvas-as-source pattern).
- A11y deep-pass (deferred to the system-wide holistic a11y pass).
- The `moment-1-ack` and other `post-signup-onboarding` registry entries beyond `welcome-tour` itself.

## Acceptance criteria

### Carousel + steps

**AC-1.** Page renders at `/dev/proto/welcome-tour` with the intro screen visible by default (`INTRO_STEP = 0`). *Evidence:* `src/app/dev/proto/welcome-tour/page.tsx` default-exports a client component with `'use client'`; initial render shows the intro step content per canvas.

**AC-2.** Four phase screens render in sequence (Disclose / Reconcile / Settle / Finalise) — one per click of the advance control. Each phase carries `n / k / kicker / title / sub / body / accent / accentSoft / hue / illo` per the canvas `PHASES` array (canvas L646-695); per-phase accent colour drives the visual treatment (badge tint, kicker colour, gradient hue).

**AC-3.** Dashboard preview renders at the final step (`DASH_STEP = 5 = TOTAL_STEPS - 1`). Renders the canvas's preview of the post-tour dashboard surface.

### State + persistence

**AC-4.** Step state persists to `localStorage` under key `decouple_tour_step` (canvas-defined). On page reload, the tour resumes at the last-active step. *Evidence:* `useEffect` reads from `localStorage` post-mount; `useEffect` on `[step]` writes back. SSR-safe wrapping (no `localStorage` access in `useState` initial-state lambda — Next.js client-component init runs on server too). Documented inline in the file with a short rationale.

**AC-5.** Keyboard navigation: `ArrowRight` or `Enter` advances (capped at `DASH_STEP`); `ArrowLeft` retreats (capped at `0`). *Evidence:* the canvas's `useEffect` with `window.addEventListener("keydown", ...)` ported verbatim. No new key bindings added.

**AC-6.** "Skip tour" CTA on intro jumps to `DASH_STEP` (per canvas L773 + the corresponding handler). "Take the tour" CTA advances from intro. *Evidence:* the canvas L773 + L901 handlers ported verbatim.

### Page chrome

**AC-7.** Wordmark + tour-step indicator chrome ports from canvas. Canvas-defined "First-time tour" caption (canvas L759) + "Welcome tour" footer label (canvas L1364) preserved.

### Tokenisation (CLAUDE.md §"Canvas-as-source" Step 1)

**AC-8.** Canvas-top colour constants tokenised against `src/styles/tokens.ts`:

| Canvas constant | Hex | `tokens.color` ref |
|---|---|---|
| `INK` | `#1A1A1A` | `color.ink` |
| `SUB` | `#57534E` | `color.text.sub` |
| `MUTE` | `#78716C` | `color.text.muted` |
| `LINE` | `#E5E3DC` | `color.border` |
| `BG` | `#F5F5F4` | `color.surface.page` |
| `PANEL` | `#FFFFFF` | `color.surface.panel` |
| `CANVAS` | `#FAFAF7` | `color.surface.canvas` |

The 7 mapped constants reference `tokens.color.*` via `import { tokens } from '@/styles/tokens'`. The `PHASES` array's per-phase `accent` + `accentSoft` hex values stay inline (canvas-local phase data; not tokens). The four phase accents (`#4338CA` build / `#9D174D` reconcile / `#0369A1` settle / `#166534` finalise) also exist in `tokens.color.phase.*` and could be cross-referenced if desired — kept inline this slice to match canvas verbatim. Font tokens (Inter / Source Serif Pro / JetBrains Mono) already exist in `tokens.font` and are referenced via `tokens.font.sans` / `.serif` / `.mono` where the canvas calls them out.

### State (CLAUDE.md §"Canvas-as-source" Step 3)

**AC-9.** State ported verbatim per user direction:
- `useState` for step
- `useEffect` initialiser for `localStorage` (SSR-safe pattern)
- `useEffect` writer for `localStorage` on `[step]`
- Keyboard handler with `ArrowLeft` / `ArrowRight` / `Enter`

### Route + scaffold (CLAUDE.md §"Canvas-as-source" Step 4)

**AC-10.** Route `/dev/proto/welcome-tour` resolves to the new literal-slug subroute (precedence over the `[slug]` stub). `page.tsx` with `'use client'`. *Evidence:* file exists with default export.

Registry: `src/app/dev/proto/registry.ts` `welcome-tour` row remains `status: 'canvas-drafted'`. Promotion to `live` deferred until user has previewed.

### Tests

**AC-11.** Unit test for the step state machine. Asserts:
- Initial state: `step = 0` (intro visible).
- ArrowRight advances by 1.
- ArrowLeft retreats by 1 (not below 0).
- ArrowRight from `DASH_STEP` does NOT advance further.
- "Skip tour" click jumps to `DASH_STEP`.

Test mocks `localStorage` via Testing Library's default jsdom env (Vitest provides `localStorage` in jsdom).

## Plan-vs-spec cross-check

CLAUDE.md §"Visual direction" §"Canvas-as-source" 5-step:

1. **Tokenise hardcoded colours** — AC-8.
2. **Replace placeholder data** — N/A (tour copy is final marketing-product copy).
3. **Wire state** — AC-4 + AC-5 + AC-9 (ported verbatim per user scope decision).
4. **Add Next.js wrapping** — AC-10.
5. **Inline canvas-local helpers OR adapt** — Wordmark + icons + sub-components stay inline.

CLAUDE.md §"Slice convention for canvas-as-source": *"`acceptance.md` does NOT carry the `Linked canvas:` field (so canvas-fidelity stays dormant per CLAUDE.md §'Hard controls'). Per-AC evidence cites the source canvas path inline without verbatim quoting requirements. `**Category:** prototype` declared as usual."* — confirmed: no `Linked canvas:` field; line refs only.

## Definition of Done

1. All ACs met; evidence per AC in `verification.md`.
2. Tests written + passing (AC-11).
3. Adversarial review done.
4. Preview deploy verified — user-confirmed (agent sandbox blocks Vercel preview URL host).
5. No regression in adjacent slices — `/dev/proto/pre-signup-interview` + `/dev/proto/marketing-landing` smoke walk after port.
6. Slice's open registry questions logged for follow-up; the canvas's *"Skip-to-end vs forced linearity?"* registry open question is implicitly answered by the canvas itself (Skip-tour CTA from intro + linear progression for tour-takers) — recorded as resolved-by-canvas in this slice's wrap.

14-item security checklist short-form per CLAUDE.md §"Slice categories" §"prototype": items 1, 8, 12, 14 in `security.md`.

## Status

Drafted. Not yet shipped.
