# S-PROTO-share-flow — Verification

**Status:** SCAFFOLD — populated as each AC lands. Final-state record per AC assembles at slice ship.

## AC verification

### AC-1 · Reconcile state-1 destination view

- **Evidence:** TBD — populated when implementation lands.
- **Files:** `src/app/dev/proto/share-flow/page.tsx`, `_components/JoinedAvatarsHero.tsx`, `_components/MarkStatusCard.tsx`.
- **Test:** `tests/unit/proto-share-flow/page.test.tsx`, `JoinedAvatarsHero.test.tsx`.
- **Status:** pending.

### AC-2 · C-S1 adaptive Share CTA + page copy

- **Evidence:** TBD.
- **Files:** `src/app/dev/proto/share-flow/page.tsx`, `_components/MarkStatusCard.tsx`.
- **Test:** `tests/unit/proto-share-flow/page.test.tsx`, `MarkStatusCard.test.tsx`.
- **Status:** pending.

### AC-3 · C-S2 party-type-aware modal

- **Evidence:** TBD.
- **Files:** `src/app/dev/proto/share-flow/_components/ShareModal.tsx`.
- **Test:** `tests/unit/proto-share-flow/ShareModal.test.tsx`.
- **Status:** pending.

### AC-4 · C-S3 selective publish toggles

- **Evidence:** TBD.
- **Files:** `src/app/dev/proto/share-flow/_components/SelectivePublishToggles.tsx`.
- **Test:** `tests/unit/proto-share-flow/SelectivePublishToggles.test.tsx`.
- **Status:** pending.

### AC-5 · Submit transition stub

- **Evidence:** TBD.
- **Files:** `src/app/dev/proto/share-flow/_components/ShareModal.tsx` (submit handler + confirmation block).
- **Test:** `tests/unit/proto-share-flow/ShareModal.test.tsx` (submit assertions).
- **Status:** pending.

### AC-6 · Registry L70 row update + regression-guard

- **Evidence:** TBD.
- **Files:** `src/app/dev/proto/registry.ts`.
- **Test:** `tests/unit/app/dev/proto/registry.test.ts`.
- **Status:** pending.

## Open Q resolution (registry L70)

Original openQ: *"Invite mechanics + real-time-vs-async?"*.

Resolution at scoping (recorded before implementation):

- **Invite mechanics:** party-type-aware tab selector (Ex · Solicitor · Mediator) per `68a §C-S2`. Phase-1 functionality wires Ex only; Solicitor + Mediator render TBD placeholder copy per `68f §S-1` open.
- **Real-time-vs-async:** async per `68c §R-M3` — *"You'll get a notification when Mark shares."* The Mark Status card surfaces Nudge / Resend affordances on states 2-4 (out-of-scope for this slice; state-1 has no inviting-yet, so no Nudge/Resend). No real-time polling, no chat, no presence indicators.

## Preview-deploy verification

Per CLAUDE.md §"Engineering conventions" §"Definition of Done" item 4 and `docs/workspace-spec/72a-preview-deploy-rubric.md`:

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | TBD | TBD |
| Edge cases | TBD | TBD |
| `prefers-reduced-motion` | TBD | TBD |
| Keyboard-only | TBD | TBD |
| Mobile viewport (375×667) | TBD | TBD |
| Screen-reader | TBD | TBD |

## Architectural deferrals

- **R-M1 states 2-5 + R-M3 right rail:** deferred to future `S-PROTO-reconcile-waiting` (states 2-4) + existing `joint-document-view` slice (state 5).
- **C-S1 pending-state CTA + change-while-shared banner:** deferred until a prior-share snapshot exists.
- **C-S2 Solicitor + Mediator functional wiring:** deferred until C-S4 (68f S-1) closes the form-field shape.
- **Backend submit wiring:** prototype-only; live API call deferred to production-host slice.

## Adversarial review pass

Pending — runs before final commit. Findings logged here.

## DoD checklist (per CLAUDE.md §"Engineering conventions" §"Definition of Done")

1. [ ] All acceptance criteria met, evidence per AC above.
2. [ ] Tests written and passing.
3. [ ] Adversarial review done; concerns addressed or deferred.
4. [ ] Preview-deploy verified (6-dim rubric).
5. [ ] No regression in adjacent slices.
6. [ ] Open 68f/g entries resolved or explicitly deferred.

Security checklist (prototype short-form, items 1/8/12/14 from spec 72 §11): see `security.md`.
