# S-PROTO-welcome-tour-canvas-port — verification

Per CLAUDE.md §"Definition of Done": *"All acceptance criteria met, with evidence per AC in `verification.md`."*

## Per-AC evidence

### AC-1 — Page renders at `/dev/proto/welcome-tour` with intro visible
- `src/app/dev/proto/welcome-tour/page.tsx` L1 declares `'use client'`.
- L816 default-exports `function WelcomeTourPage()`.
- L818 `const [step, setStep] = useState(0)` — initial state matches `INTRO_STEP = 0` (L99).
- L872 `if (step === INTRO_STEP) { stage = <IntroStage ... />` — intro stage selected by default.

### AC-2 — Four phase screens render in sequence
- L47-97 `PHASES: Phase[]` ports the 4-phase array verbatim from canvas L646-695. `n / k / kicker / title / sub / body / accent / accentSoft / hue / illo` properties retained per phase. Per-phase accent hex (`#4338CA` build · `#9D174D` reconcile · `#0369A1` settle · `#166534` finalise) preserved inline; canvas-local data, not tokens.
- L875-880 `else` branch wires `<PhaseStage phase={PHASES[step-1]} ... />` for `step ∈ [1..4]`.

### AC-3 — Dashboard preview at `DASH_STEP = 5`
- L100 `const DASH_STEP = TOTAL_STEPS - 1` where `TOTAL_STEPS = PHASES.length + 2 = 6`.
- L874 `else if (step === DASH_STEP) { stage = <DashStage /> }` renders the post-tour dashboard preview.

### AC-4 — Step state persists to `localStorage` under `decouple_tour_step`
- L819-820 inline comment documents the SSR-safe pattern: *"SSR-safe init: start with the default; hydrate from localStorage after mount."*
- L823-826 hydrate `useEffect`: reads `localStorage.getItem('decouple_tour_step')`, parses, calls `setStep` only when finite.
- L828 write `useEffect` with `[step]` dep: `localStorage.setItem('decouple_tour_step', String(step))`.
- Key `'decouple_tour_step'` matches canvas-defined key (canvas storage key constant).

### AC-5 — Keyboard navigation
- L842-849 `useEffect` with `window.addEventListener('keydown', ...)` ports the canvas handler verbatim.
- L844 `if (step === DASH_STEP) return;` — handler disabled at dashboard (canvas-defined; the dashboard preview is terminal in the tour flow).
- L845 `ArrowRight` or `Enter` → `setStep(s => Math.min(DASH_STEP, s+1))` (advance, capped).
- L846 `ArrowLeft` → `setStep(s => Math.max(0, s-1))` (retreat, capped).
- L847 `Escape` → `setStep(DASH_STEP)` (canvas-defined; skip to end via keyboard).

Note: AC-5 narrative says *"ArrowLeft retreats (capped at 0)"* — at `DASH_STEP` the handler returns before key-check, so ArrowLeft from DASH_STEP does NOT retreat. Canvas-verbatim behaviour; the dashboard is the tour terminus by design.

### AC-6 — Skip / advance CTAs
- L873 `stage = <IntroStage onStart={next} onSkip={() => goto(DASH_STEP)}/>` — intro stage receives `onSkip` jumping to `DASH_STEP`.
- L311 IntroStage's "Take the tour" button wired to `onStart` (advance one step).
- L315-318 IntroStage's "Skip to dashboard" CTA wired to `onSkip` (jumps to `DASH_STEP`).
- L155 TopBar (visible on phase steps 1..4, hidden at intro + dashboard) carries `Skip tour` text at L183, wired to `onExit={() => goto(DASH_STEP)}` per L955.

### AC-7 — Wordmark + chrome
- L168-170 TopBar caption: `<span>First-time tour</span>` (canvas L759 verbatim).
- L774 Footer label: `Welcome tour` mono-styled text (canvas L1364 verbatim).
- Wordmark `Decouple.` rendered at top-left of TopBar (canvas-defined).

### AC-8 — Tokenisation
- L26-32 alias the canvas-top constants against `tokens.color.*`:
  ```ts
  const INK = tokens.color.ink;
  const SUB = tokens.color.text.sub;
  const MUTE = tokens.color.text.muted;
  const LINE = tokens.color.border;
  const BG = tokens.color.surface.page;
  const PANEL = tokens.color.surface.panel;
  const CANVAS = tokens.color.surface.canvas;
  ```
- L4 imports tokens: `import { tokens } from '@/styles/tokens'`.
- Bare-hex literals remain at ~13 sites (L255 `#D6D3CC` border-tint · L324/326/350 small dot/divider tints · L425-429 `BANKS` array bank-brand colours · L436 `#059669` LED dot · L477 `#E5E3DC` progress-bar bg · L518 `#DCFCE7` green tint · L519 `#059669` · L529 `#F5F3EE` progress-bar bg · L531 `#DCFCE7` · L589-591 `#D6D3CC` divider tints · L624+ `BANKS` array bank-brand colours). These are canvas-verbatim — the source canvas hard-codes these tints inline rather than referencing its own named constants; per CLAUDE.md §"Visual direction" §"Canvas-as-source" Step 1 (*"Canvas-top constants (`const INK = ...`) → `tokens.color.ink` refs"*), only the canvas-top named constants were swapped.

### AC-9 — State ported verbatim
- L818 `useState`, L823-826 + L828 `useEffect` for localStorage, L842-849 keyboard handler — all ported verbatim per scope decision. No simplification, no abstraction, no removal.

### AC-10 — Route + scaffold
- File `src/app/dev/proto/welcome-tour/page.tsx` exists (verified `git status` post-write).
- `'use client'` at L1.
- Default export `WelcomeTourPage` at L816.
- Route `/dev/proto/welcome-tour` resolves: the literal-slug subroute takes precedence over `[slug]` per Next.js App Router conventions.
- `src/app/dev/proto/registry.ts` `welcome-tour` row remains at its prior status (no registry change in scope this slice).

### AC-11 — Unit test for step state machine
- `tests/unit/proto-welcome-tour/step-state.test.tsx` — 12 specs covering:
  - Initial state at `INTRO_STEP = 0` (intro CTAs visible; localStorage persisted post-mount).
  - `ArrowRight` / `Enter` keydown advances state — localStorage value increments.
  - 5× `ArrowRight` reaches `DASH_STEP`; further `ArrowRight` is no-op.
  - `ArrowLeft` retreats; capped at 0.
  - `Escape` jumps to `DASH_STEP` from non-dashboard step; no-op at DASH_STEP (canvas-verbatim).
  - "Skip to dashboard" CTA click jumps to `DASH_STEP`.
  - Hydrates step from localStorage on mount when value is finite.
  - Non-integer localStorage value falls back to default step 0 (exercises the `Number.isFinite` guard cited in `security.md`).
- Run: `npm test -- tests/unit/proto-welcome-tour/step-state.test.tsx`.

## Preview-deploy verification

DoD item 4 ("Preview deploy verified in-browser if UI") — six-dimension rubric per `docs/workspace-spec/72a-preview-deploy-rubric.md`.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending user-confirmation | Vercel preview URL host blocked from agent sandbox (`x-deny-reason: host_not_allowed`). User to walk `/dev/proto/welcome-tour` on Vercel preview. |
| Edge cases | Pending user-confirmation | Edge cases to walk: refresh mid-tour (localStorage resume) · keyboard-only progression through all 6 steps · click "Skip to dashboard" from intro · arrive at DASH_STEP and try arrow keys (no-op expected per canvas). |
| `prefers-reduced-motion` | Pending user-confirmation | `<style jsx>` block at component root carries `@media (prefers-reduced-motion: reduce) { ... }` fallback (verified L947). |
| Keyboard-only | Pending user-confirmation | Tab order + `ArrowRight` / `ArrowLeft` / `Enter` / `Escape` should fully drive the tour without mouse. |
| Mobile viewport (375×667) | Pending user-confirmation | Canvas designed for desktop; mobile responsiveness deferred per canvas-as-source pattern. User to note layout concerns for follow-up. |
| Screen-reader | Pending user-confirmation | A11y deep-pass deferred to the system-wide holistic a11y pass per `S-PROTO-a11y-wcag-audit-phase-1` / `-phase-2` slices. |

## Adversarial review

See `## Adversarial review` section in `security.md`.

## Status

Drafted; pending test run + adversarial review + user-confirmed preview-deploy walk.
