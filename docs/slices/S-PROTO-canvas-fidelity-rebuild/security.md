# S-PROTO-canvas-fidelity-rebuild · security

**Category:** prototype (spec 76 §1 path-default; declared explicitly in `acceptance.md`)

**Data-tier reference:** spec 72 §1 (T0 Public · T1 Functional · T2 Personal · T3 Financial · T4 Safeguarding · T5 Legal)

Per CLAUDE.md §"Slice categories" + spec 76 §3 §3.5: prototype slices run the **short-form** of the 14-item security checklist — items 1, 8, 12, 14 only. T0 metadata only; no real users; pre-launch dev-mode UI under `/dev/proto/*`.

## Data-tier table

| AC | Data touched | Tier | Notes |
|---|---|---|---|
| AC-1 — Title bold/italic split | Static screen titles | T0 Public | Copy strings only; no user input. |
| AC-2 — Sub-question label serif | Static sub-question labels | T0 Public | Copy strings only. |
| AC-3 — Header chrome | Static UI affordances | T0 Public | Back-button label + chevron. |
| AC-4 — Step indicator pill | Static progress geometry | T0 Public | `aria-label` derived from current/total numerics — no PII. |

## Short-form checklist (prototype category)

### 1. Data classification + tier mapping
- [x] All AC surfaces are T0 Public (copy + visual treatment only). No user-supplied data persisted; no API integrations introduced. Section 1 satisfied.

### 8. Validation at system boundaries
- [x] N/A · reason: **No system boundary introduced.** Prototype consumes static dev-mode data via existing dev-store (`src/lib/dev/dev-store.ts`); this slice changes visual rendering only, not data flow. No new user input; no new API.

### 12. Adversarial review
- [ ] Pending at PR open · closes Done post-verdict on the multi-agent auto-review for this slice's PR. Canvas-fidelity persona's first live exercise — calibration data captured in PR auto-review verdict + carry-over to gate slice's calibration-report.md.

### 14. Per-slice security DoD
- [ ] Pending at PR open · closes Done at slice merge after items 1, 8, 12 confirmed.

## Items intentionally not assessed (prototype short-form)

Items 2-7, 9-11, 13 from spec 72 §11 do not apply to this slice under the spec 76 §3 prototype calibration:
- Items 2-7 (env vars · auth/session · RLS · logging · dev/prod boundary · third-party): no env var · no session · no DB · no logging · same `/dev/proto/*` boundary · no third-party.
- Items 9-11, 13 (rate limit · safeguarding · audit log · pen-test): N/A for static-data dev-mode UI.

## Status

- 2026-05-10: skeleton authored at slice setup; short-form items 1 + 8 confirmed N/A-or-Done at scaffold; items 12 + 14 stay Pending until PR auto-review verdict + slice merge.
