# Slices — per-slice working docs

**Purpose.** One folder per engineering slice. Stores the slice's acceptance criteria, test plan, security DoD evidence, and in-browser verification checklist. Lives alongside (not inside) the code so the docs survive refactors and travel in PRs.

**Source conventions:**
- Per-slice AC template — `docs/engineering-phase-candidates.md` §C
- Per-slice test plan template — `docs/engineering-phase-candidates.md` §D
- Per-slice security checklist — `docs/workspace-spec/72-engineering-security.md` §11
- In-browser verification — DoD item 4 in `CLAUDE.md` Engineering conventions

**Slice catalogue:** `docs/workspace-spec/70-build-map-slices.md` (33 slices across Foundation / Marketing / Onboarding / Build / Reconcile / Settle / Finalise / Cross-cutting).

---

## Folder structure

```
docs/slices/
  README.md                         — this file
  _template/                        — copy these into a new slice folder when starting work
    acceptance.md
    test-plan.md
    security.md
    verification.md
  S-F1-design-system/               — example; created when S-F1 begins
    acceptance.md
    test-plan.md
    security.md
    verification.md
  S-F7-persistence-auth/
    ...
```

**Slice folder naming:** `S-{Category}{N}-{short-slug}` matching the spec 70 slice ID. Category letters: `F` foundation, `M` marketing, `O` onboarding, `B` build, `R` reconcile, `S` settle, `L` finalise-legal, `X` cross-cutting.

---

## Workflow

**At slice kickoff:**
1. Copy `_template/` to `S-XX-{slug}/`.
2. Fill in `acceptance.md` with 3-7 AC (MLP floor — "would a user feel delighted or merely served?").
3. User reviews + approves AC before implementation starts. AC is the contract.
4. Fill in `test-plan.md` — one test per AC minimum.
5. Fill in `security.md` — work through the 13-item checklist; mark N/A with written reasoning where a box doesn't apply.
6. Fill in `verification.md` — the in-browser smoke checklist for DoD item 4.

**During implementation:**
- Update each doc as reality deviates from plan.
- Capture evidence (test result, screenshot, preview deploy URL) alongside each AC.
- Adversarial review pass before merge per Engineering conventions — record concerns + disposition in `verification.md`.

**At slice wrap:**
- All DoD boxes ticked or explicitly deferred with reasoning.
- Open 68f/g entries this slice should have resolved are closed + committed.
- Discarded paths this slice replaced are deleted (per spec 71 §5 staged-removal table).
- Spec 70 hub inventory updated (flip removed rows; add new components).
- Slice folder retained as PR artefact + audit trail.

---

## What goes where

| Doc | Source | When to update |
|---|---|---|
| `acceptance.md` | engineering-phase-candidates §C | Written at kickoff, reviewed by user, frozen at implementation start. AC changes = re-slice, not mid-slice scope drift. |
| `test-plan.md` | engineering-phase-candidates §D | Written alongside AC. One test per AC minimum. Updated as implementation surfaces edge cases. |
| `security.md` | spec 72 §11 | Worked through during implementation. Each of 13 boxes carries evidence or justified N/A. |
| `verification.md` | CLAUDE.md DoD item 4 + engineering-phase-candidates §G.5 | Run against preview deploy before merge. Golden path + edge cases + prefers-reduced-motion + keyboard-only + mobile viewport. |

---

## Maintenance

When engineering-phase-candidates §C / §D or spec 72 §11 changes, update `_template/` files in the same PR. Existing slice folders are frozen historical records — don't retrofit.
