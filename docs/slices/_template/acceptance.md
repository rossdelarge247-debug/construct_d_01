# {S-XX · slice name} — Acceptance criteria

**Slice:** S-XX-{slug}
**Spec ref:** `docs/workspace-spec/70-build-map-slices.md` (slice card) + relevant 68a-g entries
**Phase(s):** {which phase(s) the slice touches}
**Status:** Draft · Under review · Approved · In implementation · Shipped · Deferred

---

## Context

{one paragraph — what this slice does in the user's words, why it's being built now, what it depends on, what it unblocks}

## Dependencies

- **Upstream slices:** {slice IDs this needs shipped before starting — per spec 70 slice card "Depends on"}
- **Open decisions required:** {68f/g IDs that block this slice — must be resolved before AC freeze}
- **Re-use / Preserve-with-reskin paths touched:** {list per spec 70 hub inventory}
- **Discarded paths deleted at DoD:** {per spec 71 §5 staged-removal table}

## MLP framing

The loveable floor for this slice is: {one sentence}. Taken together, the AC below should satisfy that. Cuts happen by deferring AC to a later slice (re-slicing), not by shipping lukewarm AC.

---

## AC-1 · {short name}

- **Outcome:** {one sentence, user-visible}
- **Verification:** {exact observable behaviour or test that confirms it — no ambiguity}
- **In scope:** {what this AC does cover}
- **Out of scope:** {what it explicitly does not — pushes to a later AC or future slice}
- **Opens blocked:** {any 68f/g entries this AC cannot be met without resolving — list IDs, or "none"}
- **Loveable check:** {one sentence — does meeting this AC make the user feel delighted or merely served? If merely served, re-draft.}
- **Evidence at wrap:** {test result / screenshot / preview URL — filled in during implementation}

## AC-2 · {short name}

- **Outcome:**
- **Verification:**
- **In scope:**
- **Out of scope:**
- **Opens blocked:**
- **Loveable check:**
- **Evidence at wrap:**

## AC-3 · {short name}

- **Outcome:**
- **Verification:**
- **In scope:**
- **Out of scope:**
- **Opens blocked:**
- **Loveable check:**
- **Evidence at wrap:**

{add AC-4..AC-7 as needed — minimum 3 AC, ideally 5-7, more than 10 = slice too big, reconsider the cut}

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| | User | | AC frozen · implementation may begin |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-sliceing, not mid-slice scope shifts.
