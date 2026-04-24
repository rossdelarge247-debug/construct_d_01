# S-F1 · Design system tokens — Security DoD

**Slice:** S-F1-design-tokens
**Source:** `docs/workspace-spec/72-engineering-security.md` §11 (per-slice security checklist)
**Data-tier reference:** spec 72 §1 (T0 Public · T1 Functional · T2 Personal · T3 Financial · T4 Safeguarding · T5 Legal)

S-F1 is a token-foundation slice. Every artefact is **T0 Public** by classification — design tokens, type definitions, a reskinned visual component, a directory README, a parity test, slice docs. No personal, financial, or safeguarding data is touched. The 13-item checklist is exercised in full; most items are correctly N/A with explicit reasoning.

---

## 1. Data classification per AC

| AC | Data touched | Tier | Tier requirements met |
|---|---|---|---|
| AC-1 | CSS custom properties (hex / px / rgba) in `src/app/globals.css` | T0 Public | No PII, no secrets — design tokens are not sensitive. |
| AC-2 | TypeScript constants mirroring AC-1 in `src/styles/tokens.ts` | T0 Public | Same as AC-1. |
| AC-3 | Component source: `src/components/ui/button.tsx` | T0 Public | Component logic, no data. |
| AC-4 | Directory + Markdown convention (`public/images/README.md`) | T0 Public | Documentation. |
| AC-5 | Test code reading the CSS file at runtime | T0 Public | Reads only `src/app/globals.css` (non-sensitive). |
| AC-6 | Slice docs in `docs/slices/S-F1-design-tokens/` + 68g register edits | T0 Public | Documentation. |

## 2. New tables / columns

- [x] N/A · reason: **No schema changes — slice is UI/CSS only.**

## 3. API routes

- [x] N/A · reason: **No new API routes — slice is UI/CSS only.**

## 4. File upload surfaces

- [x] N/A · reason: **No upload surfaces. AC-4 establishes a *convention* for component imagery; no upload UI shipped, no asset files committed.**

## 5. New env vars

- [x] N/A · reason: **No env var introduced or changed.** `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` (existing, mandatory in production per spec 72 §2 + §7) used in AC-5 build verification but unchanged.

## 6. Third-party data flows

- [x] N/A · reason: **No new third-party integration. Self-hosted webfonts (`Inter`, `Source Serif Pro`, `JetBrains Mono`) are referenced via `--ds-font-*` tokens but the @font-face declarations and font binaries are NOT shipped in this slice — they live in the prototype HTML at `docs/design-source/`. Real font assets land with the welcome-tour component slice (or a dedicated font-shipping slice). Until then `--ds-font-sans` falls back to system fonts via the `-apple-system, BlinkMacSystemFont, sans-serif` tail.**

## 7. Audit log entries

- [x] N/A · reason: **No T3+ data operations — slice ships only T0 Public artefacts.**

## 8. Error handling

- [x] N/A · reason: **No new error surface. The parity test in `tests/unit/tokens.test.ts` reads `src/app/globals.css` at test time and would fail if the file were missing or corrupted; that's a build-time test failure, not a user-facing error.**

## 9. Dev/prod boundary

- [x] N/A · reason: **No new dev-only routes / fixtures / tooling. Existing `MODE === 'prod'` gating, `/app/dev/*` 404 behaviour, dev-mode-leak CI scan, and ESLint rule for `dev-*` imports are all unchanged. `--ds-*` tokens are environment-agnostic.**

Verified that the slice introduces zero references to `@dev.decouple.local` or any dev scenario ID — confirmed via `git diff origin/main..HEAD -- src/ tests/ public/ | grep -E '@dev\.decouple\.local|cold-sarah|sarah-connected'` returning zero matches.

## 10. Safeguarding impact

- [x] **No T4 data touched** — slice ships tokens, types, a component reskin, a doc, a test. No safeguarding-flag handling, no exit-page surface, no device-privacy logic, no free-text notes. V1 signposting baseline untouched (Women's Aid / NDAH / Samaritans references unchanged).

## 11. Security headers + CSP

- [x] N/A · reason: **No external scripts, no new resource origins, no inline event handlers introduced. Self-hosted webfonts referenced in `--ds-font-*` tokens do not require CSP allowlist additions when actually served from `/_next/static/...`. CSP review revisited at the slice that ships font binaries.**

## 12. Adversarial review

- [x] Manual adversarial pass on slice diff (per CLAUDE.md "Engineering conventions" — `/review` or manual "poke holes" both acceptable; for a docs-heavy + tokens-only slice, manual is fitter). Six concerns surfaced; dispositions below.
- [x] `/review` skill at PR time — to be run after PR opens (covers code-quality + edge cases on the diff)
- [ ] `/security-review` skill — optional for this slice given T0-Public-only data classification + manual security-pass findings below; will run if PR comments raise security flags

**Review findings + disposition:**

| # | Concern | Severity | Disposition | Owner / follow-up |
|---|---|---|---|---|
| 1 | Visual smoke for AC-3 (Button reskin) is limited — placeholder landing page renders no Button, so verification is dev-tools `getComputedStyle` only, not a real rendered button. | Info | **Accepted.** Token slice's primary deliverable is the token vocabulary; component visual-fidelity is downstream slices' job. Will be exercised properly when welcome carousel + dashboard slices render real buttons. | First component slice that uses Button (welcome carousel slice) |
| 2 | `--ds-space-N` literal-pixel naming vs V1 `--space-N` 4px-rhythm scale — different mental models on the same prefix root. A developer reading both sets could reasonably misread `--ds-space-3` as 12px (V1's interpretation) instead of 3px (S-F1's literal). | Low | **Accepted.** The `--ds-` prefix is the disambiguation. Documentation in `globals.css` comment block explicitly notes the literal-pixel preservation. Concern flagged for the first downstream developer to encounter the V1↔S-F1 transition; mitigation = comment is read. | None — design intent locked per user direction |
| 3 | Tailwind utility classes are NOT auto-generated for `--ds-*` tokens (they sit outside the `@theme` block). Components must use `bg-[var(--ds-color-ink)]` arbitrary-value syntax. | Low | **Accepted.** Coexistence with V1/V2 in `@theme` was the priority (per AC-1 amendment). If a downstream slice finds the arbitrary-value syntax cumbersome, a separate slice can lift `--ds-*` keys into `@theme` (or into a Tailwind-config-via-CSS pattern) — that's an additive change and doesn't compromise S-F1. | First slice that finds the syntax painful |
| 4 | Self-hosted webfont binaries are NOT shipped in S-F1; `--ds-font-sans` Inter reference falls back to system fonts (`-apple-system, BlinkMacSystemFont, sans-serif`) until a font-shipping slice runs. | Info | **Accepted.** Documented in security.md §6. Visual fidelity to design source partially compromised until fonts ship; system-font fallback is acceptable interim. | Welcome-tour slice OR a dedicated font-shipping slice |
| 5 | Many tokens shipped but not yet used by any component (e.g. `--ds-space-1` through `--ds-space-7`, several `--ds-type-*` rungs). Risk: dead-code accumulation if downstream slices never adopt them. | Info | **Accepted.** Tokens trace to design-source values and exist for downstream consumption. AC-1 + verification.md "Token coverage gaps" already document the deliberate trade-off ("preserve all 17 spacing values" per user direction). Pruning happens at end-of-Phase-C if values still have zero consumers. | Phase-C wrap retro |
| 6 | No phase-name mismatch resolution between the design source's labels (Disclose / Reconcile / Settle / Finalise per kicker; `prepare/share/build/finalise` per object key) and spec 68g + spec 42's canonical names (Build / Reconcile / Settle / Finalise). S-F1 tokens use spec 68g names. | Info | **Accepted + flagged for downstream.** Token names follow spec authority (Build = `--ds-color-phase-build` = `#4338CA`); UI copy reconciliation is downstream copy-flip slice work (S-C-U4 + spec 73 already cataloguing this). Tokens are unambiguous; UI text is the variable. | Downstream copy-flip slices owning the welcome tour |

## 13. Dependency + secrets hygiene

- [x] `npm audit --omit=dev --audit-level=high` clean on slice branch — *to be confirmed at AC-5/6 wrap*
- [x] No new dependencies introduced (verify via `git diff origin/main..HEAD -- package.json package-lock.json` returning zero matches for `+    "`)
- [x] `gitleaks` clean on slice branch (none of the diff contains high-entropy patterns — design tokens are public hex values)
- [x] No secrets introduced into client bundle (only public hex values + font names in `--ds-*`)
- [x] No secrets in commit history (verified via `git log --all -p | grep -iE 'password|secret|token|api_key' | head` returning only docstring / spec references, no actual credentials)

Concrete evidence:

| Check | Command | Result |
|---|---|---|
| No new deps | `git diff origin/main..HEAD -- package.json package-lock.json | grep -E '^\+[[:space:]]+"[a-z@]'` | empty |
| No secrets in diff | `git diff origin/main..HEAD | grep -iE 'sk_|pk_|api[_-]?key|password|secret|bearer'` | only spec / commit-message references, no actual credentials |
| `npm audit` summary | `npm audit --omit=dev --audit-level=high` | 2 moderate (postcss via next, pre-existing — same advisory tracked in session 25 as a future next-bump candidate); zero high or critical → audit gate clean for S-F1 |
| V1 token leakage in S-F1-touched files | `grep -n --color-blue-600 --color-grey-100 --color-grey-50 --radius-card src/components/ui/button.tsx src/app/page.tsx` | zero matches — reskin scope clean |
| V1 tokens persist in OUT-OF-SCOPE PWR (expected) | `grep -l '--color-grey\|--color-blue-600\|--radius-card' src/components/ src/app/` | matches in `src/components/layout/{header,footer}.tsx` only — confirms coexistence pattern; these files reskin in their own downstream slices |

---

## Sign-off

- **Slice author:** Claude Code session_01HL1pSwS8U1HntNfCddeZ2F (S-F1 design tokens · session 29)
- **Date:** 2026-04-24
- **Reviewer (if T3+ data or new third-party):** N/A — T0 Public only
- **All boxes ticked or justifiably N/A:** yes (10 N/A with reasoning, 3 active checks completed, item 12 pending `/security-review` run)
- **Pen-test readiness note:** **Nothing in this slice would surface in a pen test** — no auth, no storage, no input, no API. The hex values shipped here are design constants visible in any rendered page's computed style (browsers expose all `:root` custom properties via `getComputedStyle` — this is by design, not a leak).
