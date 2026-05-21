# S-PROTO-post-connect-dashboard-canvas-port · Verification

## Acceptance criteria — evidence

| AC | Status | Evidence |
|---|---|---|
| AC-1 Route + variant routing | TBD | `/dev/proto/post-connect-dashboard` resolves; `?variant=expressive` query toggles render path. Visible page-bg difference between conservative (`#FFF`) and expressive (`#F5F1EB`) confirms the gate fires. |
| AC-2 Tokenisation | TBD | `grep -E '#1A1A1A\|#78716C\|#E5E3DC\|#FAFAF7' src/app/dev/proto/post-connect-dashboard/page.tsx` returns no canonical-canvas-token literals; expressive-only one-offs remain inline. |
| AC-3 SignedInHeader integration | TBD | Page imports `SignedInHeader` from `@/components/layout/signed-in-header` with `mode="app"`; chrome renders above dashboard body in both variants. |
| AC-4 JourneyRail | TBD | Left sidebar renders 5 journey items with state badges; matches canvas L1259–1325. |
| AC-5 PhaseStrip | TBD | Horizontal 5-phase strip with locked-state dimming; matches canvas L1327–1370. |
| AC-6 ConnectedBanner | TBD | Bank-connected banner with toggle; click expands/collapses; `aria-expanded` reflects state. Smoke test in AC-12 asserts behaviour. |
| AC-7 DisclosureCard | TBD | 3-row disclosure card with progress indicator; matches canvas L1455–1485. |
| AC-8 PrepTasksCard | TBD | 3-task card via `PREP_TASKS` + `TaskRow`; last row no border; matches canvas L1486–1552. |
| AC-9 LockedSection×2 | TBD | Two parametric locked phase cards (Reconcile + Settle/Finalise); matches canvas L1554–1614 + Dashboard composition. |
| AC-10 Dashboard wrapper | TBD | Composed layout matches canvas L1619–1727; variant prop threads to children. |
| AC-11 Variant gate | TBD | `isExpressive` derivation present in each component receiving `variant`; only inline style values diverge per variant. |
| AC-12 Unit test | TBD | `tests/unit/proto-post-connect-dashboard/dashboard.test.tsx` written; assertions: invalid `?variant=foo` falls back to conservative; `ConnectedBanner` toggle flips `aria-expanded`. |

## Preview-deploy verification (per spec 72a + CLAUDE.md §"Engineering conventions" §"Preview-deploy verification rubric")

`prototype` category; dormant gates as documented in spec 76 §3. The 6-dim rubric below is filled by the user side; this slice's preview-deploy lives at `https://<branch-preview>.vercel.app/dev/proto/post-connect-dashboard` (URL surfaced on the PR by Vercel).

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
- A11y holistic pass. Deferred to the system-wide Phase 2/3 a11y slice once all prototype surfaces ship.

## Status

Drafted session 114 alongside acceptance. Evidence rows filled as build completes + at PR-review time.
