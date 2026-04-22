# Spec 66 — Post-Signup Profiling: Gaps to Resolve

**Date:** 20 April 2026
**Status:** WORKING DOCUMENT. Gaps listed, resolution pending. Will be replaced by the definitive post-signup profiling spec once all gaps are resolved.

---

## The question

After pre-signup (spec 65) and sign-up, what profiling must happen BEFORE bank connection to give the engine what it needs? And what should happen AFTER bank connection as part of confirmation?

## The 3-moment model (agreed architecture)

```
Moment 1: Immediate post-signup
  → Acknowledge what we already know (from pre-signup)
  → Safeguarding setup if flagged
  → Transition to profiling

Moment 2: Pre-bank profiling (the engine needs this)
  → Questions that give the classification engine context
  → Provider-level detail for matching
  → Typically 5-7 questions, ~2-3 min

Moment 3: Post-bank profiling (section-by-section in confirmation)
  → What the bank data revealed but can't answer alone
  → Property details, pension details, vehicle details
  → Children names/ages/arrangements
  → Future needs
```

## Gaps to resolve (12 total)

### GAP 1: Data bridge from pre-signup ⬜
**Problem:** Pre-signup captures relationship status, children count, property type, employment complexity, safety flags. Post-signup must USE this data without re-asking.

**Decision needed:** What's the exact bridge? What pre-signup answers gate which post-signup screens?

---

### GAP 2: Property details — when to capture ⬜
**Problem:** We need property value, mortgage balance, scheme (HTB/shared ownership), ownership type, occupation. These are important for the engine AND for the document.

**Decision needed:** Before or after bank connection? Bank data will show mortgage payments — should we ask for the balance estimate before or after showing what the bank says?

---

### GAP 3: Children — depth of capture ⬜
**Problem:** Pre-signup gives us count only. We need names, ages, current arrangements, school/childcare, Child Benefit recipient. But some of this is deeply personal and might be better asked later in the journey.

**Decision needed:** What children details are needed at profiling (before bank) vs what can come after (in the confirmation flow when we've seen Child Benefit)?

---

### GAP 4: Housing transition intent ⬜
**Problem:** "Do you want to sell, stay, or haven't decided?" affects the plan but also feels like a proposal-phase question.

**Decision needed:** Ask at profiling (before bank) or in the property confirmation section (after bank)?

---

### GAP 5: Future needs section — where captured? ⬜
**Problem:** Our document has 4 content areas (finances, children, housing, future needs). Future needs (post-separation budget, career plans, income projections, retirement) has NO capture point designed.

**Decision needed:** Where in the journey does this get captured? After spending review? As a separate step? Only at proposal time?

---

### GAP 6: Self-employed details — sequencing ⬜
**Problem:** Pre-signup flags self-employment. Post-signup needs: company name, structure, pay method, DLA, shareholders, accountant. This is medium-deep and only relevant for ~15% of users.

**Decision needed:** All at once in profiling? Or split: basics (name + structure) at profiling, deeper (DLA, shareholders, accountant) in confirmation?

---

### GAP 7: Invited party (Mark) profiling variant ⬜
**Problem:** Mark arrives via invitation. His journey is different: he's seen Sarah's picture, he needs to build his own. Does he get the same profiling questions?

**Decision needed:** Same questions? Modified order (review Sarah's items first, then profiling)? Lighter variant? What if he already answered some of these via the pre-signup interview on his side?

---

### GAP 8: Verification opt-in placement ⬜
**Problem:** Credit check (opt-in) strengthens the picture. When do we offer it?

**Decision needed:** Before bank connection? After confirmation? At the "picture ready" moment before sharing?

---

### GAP 9: Account structure capture ⬜
**Problem:** We need to know about app-based banks not yet connected, closed accounts, business accounts. Bank connection only shows what's connected.

**Decision needed:** Ask at profiling ("Do you have accounts with Monzo/Revolut/etc.?") or in the accounts confirmation section after bank connection?

---

### GAP 10: Pension depth — DB vs DC, CETV status ⬜
**Problem:** Pensions are the second-biggest asset and CETVs have 6-12 week lead times. We should prompt CETV requests as early as possible. But users might not know DB vs DC.

**Decision needed:** Ask pension type/provider at profiling? Or save for pension confirmation section? When do we first nudge "request your CETV now"?

---

### GAP 11: Safeguarding carry-through ⬜
**Problem:** If pre-signup flagged safety_concerns or device_not_private, what specifically changes in post-signup?

**Decision needed:** What does "gentler pacing" mean in practice? What does "discreet mode" include? Where do we surface specialist resources again (not just entry)?

---

### GAP 12: "What does your ex know?" (reverse partner awareness) ⬜
**Problem:** Pre-signup asks "what do YOU know about your PARTNER'S finances?" But we don't ask the reverse: "What does your partner know about YOUR finances?" This is relevant for: how much bank evidence would surprise them, whether they'll query items, how much reconciliation friction to expect.

**Decision needed:** Is this worth asking? Where?

---

## Resolution approach

For each gap, we need:
1. **Decision:** which moment does this belong to (1/2/3)?
2. **Design:** exact question wording, options, and follow-ups
3. **Logic:** what the answer gates/changes downstream
4. **Edge cases:** what if they say "don't know" or skip?

Ready to work through these one at a time.
