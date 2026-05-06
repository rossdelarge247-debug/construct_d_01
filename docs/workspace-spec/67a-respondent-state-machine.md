# 67a — Respondent state machine

**Status:** Logic-only spec. Sub-spec of spec 67 §"Gap 7" deepening the locked decisions G7-1..G7-5 into named states + transitions for the Phase C build. Detailed wireframes remain deferred per spec 67 §"Downstream work".

**Sources:**
- spec 67 §"Gap 7: Invited party (Mark) profiling variant — RESOLVED (session 22)" — five locks G7-1..G7-5
- spec 60 §"Party B journey" — M1-M10 screen sequence
- spec 65 — Sarah's pre-signup interview (Mark's IS1-IS6 mirror with respondent-tailored variations; O5 and O7 referenced)
- spec 47 — non-engagement paths (decline routing)

**Scope:** State names, transitions, gating conditions, terminal states, link-expiry timer rules.

**Out of scope:** Visual treatment, copy, wireframes (Phase C); IS-Plan AI prompt + content (use spec 65 §O7 as parallel basis per G7-5); reconciliation behaviour beyond M10 entry (spec 60 §"Reconciliation Flow"); resend UI on Sarah's dashboard; settings / notifications / account-profile (separate thin V1 specs).

---

## Phases

The respondent journey has three phases:

| Phase | Surface | Authentication |
|---|---|---|
| 1. Pre-account | Token-authenticated read of Sarah's shared subset; Mark builds his own pre-signup answers | Invitation token (no Mark account yet) |
| 2. Mark builds own picture | Mark profiling + bank + own picture ready | Mark account (created at `M3_SIGNUP`) |
| 3. Joint reconciliation | M10+ — entry point only in this spec | Mark account |

---

## Phase 1 — Pre-account

`TOKEN_VALIDATE` — entry on link click.
- valid token, within 14-day window → `M2_LANDING`
- expired token → `LINK_EXPIRED`
- revoked by Sarah → `LINK_REVOKED`

`LINK_EXPIRED` — terminal. Message: "this invitation expired; ask Sarah to resend." If Mark already has an account from a prior valid click, also offer login.

`LINK_REVOKED` — terminal. Message: "Sarah has stopped sharing; please contact Sarah." No further state.

`M2_LANDING` — onboarding landing per spec 60 §M2.
- [View Sarah's disclosure] → `IS1_CONFIRM_OR_CORRECT`
- [Sign in — existing account] → existing-account auth → `M4_WELCOME`
- [I don't want to use this] → `M2A_DECLINE`

`M2A_DECLINE` — terminal per spec 60 §M2a. Capture reason; notify Sarah neutrally. Spec 47 non-engagement paths apply downstream.

`IS1_CONFIRM_OR_CORRECT` — confirm-or-correct questions per non-financial inherited fact, per G7-4.
- One screen per fact, drawn from Sarah's Gap 3 capture: relationship status, cohabiting status, children (count, names, ages), property type, joint mortgage provider, children's schools.
- **Confirm** → bump trust level on that fact for the joint picture.
- **Correct** → raise conflict item into the Reconcile queue (resolved post-`M10_RECONCILE_INTRO`, not here).
- All questions answered → `IS2_STAGE`.
- Financial figures are NOT in IS1 per G7-4 — they reconcile naturally via each party's own bank connection downstream.

`IS2_STAGE` — Mark's own stage of separation. Mirrors spec 65 §O2 with respondent-tailored copy. → `IS3_EX_SAFETY`.

`IS3_EX_SAFETY` — Mark's own view of relationship quality + safety. Mirrors spec 65 §O3.
- safety_concerns flag set for Mark → `IS3_SAFEGUARDING` (Mark's flag is private; Sarah does not see it).
- otherwise → `IS4_KNOWLEDGE`.

`IS3_SAFEGUARDING` — Mark's safety-resource signposting screen. Optional [continue] → `IS4_KNOWLEDGE`, or [exit] → resumable (state preserved).

`IS4_KNOWLEDGE` — what Mark knows about Sarah's finances. Mirror of spec 65 §O5 inverted to Mark's perspective. → `IS_OPT_FORK`.

`IS_OPT_FORK` — opt-in/opt-out fork per G7-2.
- **Default: build own AI plan** → `IS5_PRIORITIES`
- **Opt-out: skip to reviewing Sarah's picture** → `M3_SIGNUP` → `M4_WELCOME` (Mark retains M4's fork choice)

`IS5_PRIORITIES` — Mark's own priorities. Mirrors spec 65 §O6 first half. → `IS6_WORRIES`.

`IS6_WORRIES` — Mark's own worries. Mirrors spec 65 §O6 second half. → `IS_PLAN`.

`IS_PLAN` — Mark's own AI plan output, full parallel to spec 65 §O7 per G7-5. Same substance, tone/framing adapted for the respondent role. CTA → `M3_SIGNUP`.

`M3_SIGNUP` — account creation per spec 60 §M3. Email + password + safety-aware setup; the invitation token is bound to the new account so IS1 confirmations + corrections (and IS-Plan output if generated) carry forward. → `M4_WELCOME`.

---

## Phase 2 — Mark builds own picture

`M4_WELCOME` — per spec 60 §M4. Spec 67 step 5 "Moment 1 (Mark variant)": acknowledges shared context + Mark's own flagged state.
- [Review Sarah's picture] → `M5_SARAH_READ_ONLY`
- [Build my own side first] → `M6_WELLBEING`

`M5_SARAH_READ_ONLY` — full document mode view of Sarah's shared picture per spec 60 §M5.
- [Add my side] → `M6_WELLBEING`
- [Have questions] → `M5A_EARLY_COMMENTS`
- [Leave for now] → exit (resumable from dashboard)

`M5A_EARLY_COMMENTS` — pre-disclosure queries on Sarah's items per spec 60 §M5a. Sarah notified. → `M5_SARAH_READ_ONLY` or `M6_WELLBEING`.

`M6_WELLBEING` — wellbeing check per spec 60 §M6.
- [Managing] → `M7_PROFILING`
- [Finding this hard] → gentler-pacing flag set → `M7_PROFILING`
- [Need safety support] → safety resources → exit (resumable)

`M7_PROFILING` — Mark's own profiling per spec 60 §M7. Spec 67 step 6 "Moment 2": joint mortgage confirmed (light-confirm if Sarah captured); vehicles, pensions, accounts asked fresh. → `M8_BANK`.

`M8_BANK` — Mark's bank connection + section confirmation + spending per spec 60 §M8. Spec 67 step 8 "Moment 3".
- Joint account recognition by sort code + account number → merge with Sarah's record (no duplicate).
- Section-by-section confirmation; children section is light-confirm if Sarah already did the depth pass.
- Housing transition HT1/HT2 uses Mark's own view.
- → `M9_PICTURE_READY`.

`M9_PICTURE_READY` — Mark's own picture v0.9 per spec 60 §M9.
- [Review] → document-mode view (no transition out)
- [Continue to reconciliation] → `M10_RECONCILE_INTRO`

---

## Phase 3 — Joint reconciliation entry

`M10_RECONCILE_INTRO` — entry to joint reconciliation per spec 60 §M10. Beyond this state, behaviour belongs to spec 60 §"Reconciliation Flow" (M11+) and is out of scope here.

---

## Link-expiry rules (G7-3)

- Default expiry: 14 days from Sarah's invitation send.
- Resend issues a new token and invalidates the prior one; Sarah may specify a new expiry on resend ("configurable on resend").
- Timer is per-token, not per-Mark.
- Once Mark has reached `M3_SIGNUP`, the link is no longer needed for access — Mark logs in. Expired-link click post-account → "this invitation expired; access via login."
- Pre-account expiry → `LINK_EXPIRED` terminal.
- Sarah revoking a live link → `LINK_REVOKED` on next click.

---

## Edge cases

- **Mark before Sarah ready to share:** no token exists; no flow entry. (Sarah-side dashboard messaging is out of scope.)
- **Mark refuses to sign up:** `M2A_DECLINE` captures reason and notifies Sarah; spec 47 non-engagement paths apply downstream.
- **Mark in safety_concerns where Sarah was not:** `IS3_SAFEGUARDING` fork; Mark's flag is private to him and not visible to Sarah.
- **Sarah inaccuracies surfaced in IS1:** corrections raise conflict items into the Reconcile queue (resolved in M11+, not here).
- **Mark wants conventional solicitor route:** exposed at `M2A_DECLINE` and as a global exit affordance from any post-signup state. Export Sarah's picture as PDF on request (export mechanism is out of scope here).
- **Mark has children Sarah didn't mention:** captured during `M7_PROFILING` (children section) and surfaces as joint-picture additions in reconciliation.
- **Mark self-employed where Sarah was not:** full P2 profiling + Moment 3 business section invoked at `M7_PROFILING` + `M8_BANK` (mirrors Sarah's treatment).
- **Reconciliation asymmetry on trust levels visible to both** per spec 67 Gap 8 — applies post-`M10_RECONCILE_INTRO`, out of scope here.

---

## Status

- Created: session 71.
- Source locks: spec 67 §"Gap 7" G7-1..G7-5 (session 22) + spec 60 §"Party B journey" + spec 60 §"Reconciliation Flow" (M10 intro only).
- Closes the third of four logic-spec gaps from the session-69 design-input audit (P0 of session 71).
- Supersedes spec 67 §"Mark's journey outline" step 2's IS1 description per its own self-correcting note. Spec 67 cross-references updated in the same PR.
