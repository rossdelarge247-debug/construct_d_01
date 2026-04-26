# S-INFRA-rigour-v3c · Quality controls + multi-provider reviewer + CLAUDE.md "Hard controls" rewrite

> **STATUS: deferred — full AC draft lands when this slice begins.**

**Slice ID:** `S-INFRA-rigour-v3c-quality-and-rewrite`
**Predecessor:** `S-INFRA-rigour-v3b-subagent-suite` (must merge first)
**Successor:** none — final slice in the rigour-v3 program
**Single-concern:** *Substantive code-quality enforcement (mutation testing, multi-provider review) plus the consolidating CLAUDE.md "Hard controls" rewrite that documents the now-live system.*

**Scope marker (full ACs drafted at slice start):**
- Multi-provider 3rd-agent PR reviewer (GitHub Action invoking non-Anthropic LLM via API; anchor-free context; adversarial role-prompt; severity-calibrated PR-blocking) — addresses cognitive-diversity gap that same-model self-review can't
- Structured-findings JSON Schema for `/security-review` + `/review` skill outputs, parsed by verify-slice.sh; bound to spec 72 §11 13-item security checklist (each box is a required JSON field)
- Stryker mutation testing config + per-slice threshold (≥75% mutants killed)
- Control-tightening-only ratchet — thresholds anchored to origin/main HEAD (NOT in-repo configurable file per F5c finding from v3a-v1 review); coverage / mutation / function-size caps can only go UP; any tightening reversal requires a separate `loosen-control` PR with multi-provider-reviewer + user-GPG-signed-commit dual approval
- Time-bound + slice-bound allowlist parser — every entry has `target-slice` + `expires`; CI fails if entry persists past target-slice merge or past expiry date
- `scripts/open-slice-pr.sh` auto-opener generating PR body from acceptance.md + verification.md + skill outputs + security.md (author can't phrase around concerns)
- `scripts/audit-controls.sh` + cron GitHub Action — monthly state-of-rigour issue catching silent control atrophy
- CLAUDE.md "Hard controls" §rewrite — promotes every memory-dependent rule to enforced-by-hook-X reference; catalogues every gate with file path + bypass procedure (concretely defined: user GPG-signed commit + multi-provider-reviewer green, NOT theatrical "multi-key sign-off" per F5b finding); lands LAST so it documents the actual system rather than aspirations
- DoD-evidence-parser AC — programmatically verifies every spec 72 §11 + 6-item DoD item has either evidence link or explicit deferral string in verification.md (per F1 finding from v3a-v1 review)

*(AC-arithmetic verifier (F4c) consolidated to **v3b** only per v3a-v3 revision — was previously listed in both v3b and v3c stubs.)*

**Estimated budget:** to be drafted bottom-up at slice start. Reviewer's session-36 estimate suggested ~1500-2000 lines for the full quality + multi-provider + rewrite stack.

**Blocks:** none — final slice
**Blocked by:** S-INFRA-rigour-v3b-subagent-suite merge to main

**External preconditions (per F6d finding):**
- User provisions a non-Anthropic API key as repo secret (for multi-provider reviewer)
- User configures GitHub branch protection on `main` requiring ≥1 human approval + all-checks-green (one-time repo settings change; verified by `scripts/audit-controls.sh` via gh API per F3 finding)

Full AC table, DoD, security.md, verification.md template all drafted when this slice begins. Premature drafting now would be ahead of the constraints v3a + v3b will surface.
