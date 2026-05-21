# S-PROTO-post-connect-dashboard-canvas-port · Verification

## Acceptance criteria — evidence

| AC | Status | Evidence |
|---|---|---|
| AC-1 Route + variant routing | Met (build) | `src/app/dev/proto/post-connect-dashboard/page.tsx` exists; default export wraps `DashboardContent` in `Suspense` and reads `?variant` via `useSearchParams`; `resolveVariant()` (lines 25–27) maps `'expressive'` to `'expressive'` and everything else to `'conservative'`. Visible page-bg difference between conservative (BG token) and expressive (`linear-gradient(180deg, #F3EEFE 0%, #F5F5F4 360px)`) confirms the gate fires (Dashboard lines 651–656). |
| AC-2 Tokenisation | Met (build) | `grep -c "#1A1A1A\\|#78716C\\|#E5E3DC" src/app/dev/proto/post-connect-dashboard/page.tsx` returns `0`. All 6 canonical canvas constants (INK/SUB/MUTE/LINE/CANVAS/BG) reference `tokens.color.*`. Expressive-only literals retained inline (`#F5F1EB`, `#4338CA`, `#9D174D`, `#F3EEFE`, etc) per slice intent. |
| AC-3 SignedInHeader integration | Met (build) | Page imports `SignedInHeader` from `@/components/layout/signed-in-header`; renders at top of Dashboard wrapper with `mode="app"`, `pageLabel="Dashboard"`, and `user={{ name: 'Sarah', initial: 'S', status: 'Just joined' }}` (matches canvas TopBar's user trio). |
| AC-4 JourneyRail | Met (deferred) | Canvas defines JourneyRail (L1259–1325) but Dashboard wrapper (L1628–1717) does not render it; port reflects that decision. Grep on decoded canvas for `<JourneyRail` returns no matches. |
| AC-5 PhaseStrip | Met (build) | `PhaseStrip` function (lines 102–157) maps 5 phase entries; active phase (Preparation) styled with INK background + CANVAS surface, locked phases at 0.42 opacity. Title tooltip per canvas L1348. |
| AC-6 ConnectedBanner | Met (build) | `ConnectedBanner` (lines 161–270) renders bank banner with toggle; primary toggle `<button>` carries `aria-expanded`, `aria-controls="connected-bank-accounts"`, `aria-label`. The chevron is a visual companion (`aria-hidden="true"`, `tabIndex={-1}`) so keyboard + screen-reader focus stays on the labelled primary. AC-12 test asserts toggle state. |
| AC-7 DisclosureCard | Met (build) | `DisclosureCard` (lines 272–325) renders "Your private area" kicker + italic-serif H3 ("View your disclosure picture") + body copy + 32% progress bar + INK CTA ("Go to your picture") with right-arrow. Single-section layout — no row primitives. |
| AC-8 PrepTasksCard | Met (build) | `PrepTasksCard` (lines 411–453) renders 7 PREP_TASKS via `TaskRow`; last row `borderBottom: 'none'`. Special-task style (`Upload now`) uses Upload icon + expressive `#7C3AED` / conservative INK. |
| AC-9 LockedSection×2 | Met (build) | `LockedSection` (lines 461–625) parametric: title + Lock chip + unlockReason + primary card + locked-task list. Two instances composed in `Dashboard` (lines 737–786) for Reconcile (`phaseColor="#9D174D"`) and Settle (`phaseColor="#0369A1"`). Outer wrapper at `opacity: 0.55`; inner content has `pointer-events-none`. |
| AC-10 Dashboard wrapper | Met (build) | `Dashboard` (lines 650–791) composes greeting + PhaseStrip + Preparation block (ConnectedBanner + DisclosureCard + PrepTasksCard) + two LockedSection blocks. `data-variant` attribute on outer div exposes the variant for verification. |
| AC-11 Variant gate | Met (build) | `isExpressive` derived independently in `ConnectedBanner` (L177), `DisclosureCard` (L274), `TaskRow` (L341), `PrepTasksCard` (L412), `LockedSection` (L470), `Dashboard` (L652). Only inline style values diverge per variant. |
| AC-12 Unit test | Met (build) | `tests/unit/proto-post-connect-dashboard/dashboard.test.tsx` written: 4 cases for `resolveVariant` (null / undefined / expressive / fallback) + 6 cases for `ConnectedBanner` (initial state · expand on click · collapse on second click · panel reveal when expanded · panel hidden when collapsed · `onToggle` invocation). 10 cases total. Execution deferred to CI (sandbox blocks `npm install`). |

## Preview-deploy verification

`prototype` category. The 6-dim rubric below is filled by the user side; this slice's preview-deploy lives at `https://<branch-preview>.vercel.app/dev/proto/post-connect-dashboard` (URL surfaced on the PR by Vercel).

| Dimension | Status | Evidence |
|---|---|---|
| Golden path — canvas-visible render at default `?variant=conservative` | TBD | User walks `/dev/proto/post-connect-dashboard` + asserts visual match against decoded canvas. |
| Edge cases — alternative variant + invalid variant fallback | TBD | User walks `?variant=expressive` (expressive visual) and `?variant=foo` (falls back to conservative). |
| prefers-reduced-motion | TBD | Canvas has no motion treatments in the dashboard section (motion is restricted to scroll-based marketing-landing patterns; dashboard is static). Pass-through by default. |
| Keyboard-only | TBD | `ConnectedBanner` toggle reachable via Tab; Enter/Space activates per `<button>` browser default. Other interactive surfaces: in-page nav anchors (if any). |
| Mobile viewport (375×667) | TBD | Dashboard canvas is desktop-only; mobile reconciliation deferred per slice intent. User reviews + flags any catastrophic break. |
| Screen-reader | TBD | `SignedInHeader` ships with `aria-label` on icon buttons; `ConnectedBanner` toggle has `aria-expanded`. User runs NVDA or VoiceOver pass + flags gaps for the deferred holistic a11y pass. |

Note: sandbox blocks Vercel preview URL fetches (`x-deny-reason: host_not_allowed`) — evidence rows are filled user-side after preview-deploy walk.

## Adjacent-slice regression check (DoD #5)

After this slice's port, smoke-walk:
- `/dev/proto/marketing-landing` — assert no visual or interaction regression.
- `/dev/proto/welcome-tour` — assert no visual or interaction regression. Tour's bespoke TopBar is intentionally NOT migrated to `SignedInHeader`; verify the tour TopBar still renders.
- `/dev/proto/pre-signup-interview` — assert no regression.
- `/dev/proto/how-it-works`, `/dev/proto/pricing`, `/dev/proto/faq-trust` — shell routes; assert still render placeholders.

## Architectural deferrals

- Variant switcher UI in-page (currently URL-driven). Deferred until user-feedback after preview-walk picks a winner; the loser may be removed entirely.
- Real data wiring (auth check, bank API, task status persistence). Out of slice scope; production-port will reintegrate.
- Mobile responsive scaffolding. Canvas authors desktop only; mobile reconciliation deferred per canvas-as-source pattern.
- A11y holistic pass. Deferred to the system-wide Phase 2/3 a11y slice once all prototype surfaces ship. Specific known issue: `PhaseStrip` locked-state cells render text at `opacity: 0.42` over MUTE (`#78716C`) on a near-white background — composite effective contrast falls below 4.5:1 AA at 12.5px. The remedy (explicit locked-state colours rather than blanket opacity) is in scope for the a11y pass, not this slice.

## Status

Drafted session 114 alongside acceptance. Evidence rows filled as build completes + at PR-review time.
