<!--
  This template enforces CLAUDE.md §"Engineering conventions" Definition of Done.
  Delete the guidance comments before submitting.
-->

## Summary

<!-- 1-3 bullets: what changed and *why*. -->

## Slice / scope

- Slice: <!-- S-XX + short name, e.g. "S-F1 design-system tokens" -->
- Or mark docs-only / infra-only:
  - [ ] This PR does **not** touch `src/` (skip the src/ DoD below).
  - [ ] `src/` touch is trivial (placeholder / tooling only) — request `no-slice-required` label from a reviewer.

## Definition of Done (CLAUDE.md §"Engineering conventions")

**Required for any PR that touches `src/`.** Check each item; add evidence link or explain deferral.

- [ ] **AC met with evidence** — link `docs/slices/S-XX/verification.md` showing each acceptance criterion satisfied. *(CI will fail without this reference on src/ PRs.)*
- [ ] **Tests written + passing** — unit + integration + visual as applicable
- [ ] **Adversarial review done** — concerns addressed or explicitly deferred with reasoning (paste output or link)
- [ ] **Preview deploy verified in-browser** (UI only) — golden path + edge cases + `prefers-reduced-motion`
- [ ] **No regression in adjacent slices** — smoke check + automated tests across affected surfaces
- [ ] **Slice's open 68f/g entries resolved** or explicitly deferred with reasoning in slice wrap

## Security DoD (spec 72 §11 — 13 items)

**Required for any PR that touches `src/`.** See `docs/workspace-spec/72-engineering-security.md` §11.

- [ ] 13-item per-slice security checklist walked — paste the filled checklist or link to the slice's `security.md`.

## Test plan

<!-- Markdown checklist of what you ran / what a reviewer should verify. -->

- [ ] ...

## References

<!-- Kickoff, brief, spec sections, related PRs, decision refs (68f/g entries). -->

---

_Generated on branch `<branch-name>` — remember the 6-step wrap protocol in CLAUDE.md §"Wrapping up a session"._
