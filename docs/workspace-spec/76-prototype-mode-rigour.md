# 76 — Prototype-mode rigour

**Status:** SPEC LANDED (session 75 P0).

**Adjacent specs:** spec 72 (engineering security DoD) · spec 72a (preview-deploy rubric) · spec 72b (adversarial review budget) · spec 72c (multi-agent review framework) · spec 72d (architecture review additions) · CLAUDE.md §"Slice categories" + §"Engineering conventions" §"Test-pain audit" + §"Hard controls" §"Verdict vocabulary".

**Lineage.** Phase-3 prototype slices (`/dev/proto/*` per `docs/SESSION-CONTEXT.md` §"Phase 3 sequence") run static-data dev-mode UI for high-uncertainty interaction patterns. The first prototype-area slice shipped under production-calibrated rigour produced a high post-PR finding count dominated by doc-vs-impl mismatches rather than real defects. Production gates over-rigour prototype slices because the production calibration optimises for T1+ data, multi-actor surfaces, persistent state, and real auth — none of which prototype slices carry. Spec 76 introduces slice-category metadata so gate behaviour is category-aware: tight UI/UX rigour (loveable matters even more for prototypes; users see them on previews) but relaxed code rigour (TDD-guard, coverage, test-pain threshold, DoD-14 security checklist).

## §1 — Three slice categories

| Category | Definition | Path default |
|---|---|---|
| `production` | Real-product code paths shipping to end users; T1+ data; persistent state; multi-actor surfaces; auth-gated routes. | All `src/**` paths NOT matching prototype or infrastructure defaults. |
| `prototype` | Static-data dev-mode UI for high-uncertainty interaction patterns. T0 metadata only. Visible on Vercel preview at `/dev/proto/*`; pre-launch with no real users. | `src/app/dev/proto/<literal-slug>/**` where `<literal-slug>` is a literal directory whose name does NOT begin with `[`. |
| `infrastructure` | Control-plane changes: hooks, workflows, ESLint/coverage config, CODEOWNERS, persona files, scripts. No `src/` impl. | `.claude/**`, `.github/**`, `scripts/**`, `eslint.config.mjs`, `vitest.config.ts`, `tsconfig.json`, `CODEOWNERS`. |

**Hub override.** `S-PROTO-hub` (the design-uncertainty registry hub at `src/app/dev/proto/page.tsx` + `src/app/dev/proto/[slug]/page.tsx`) is calibration cohort row 1 and runs `production` rigour deliberately — it carries an explicit override (see §2). Future prototype slices live at `src/app/dev/proto/<literal-slug>/page.tsx` (e.g. `src/app/dev/proto/pre-signup-interview/page.tsx`) and pick up the prototype default automatically.

## §2 — Detection (canonical)

Two-step resolution per slice:

1. **Explicit override in slice's `acceptance.md`** — a line matching the literal-regex `^\*\*Category:\*\*[[:space:]]+(prototype|production|infrastructure)$` immediately after the slice's `# S-XX-NAME` title takes precedence over the path default. Authors override when a slice's primary surface contradicts the path-default mapping.
2. **Path default** (when no explicit override is present) — apply the §1 path mapping to the slice's primary `src/` surface. For multi-path slices, the most-restrictive applicable category wins (`production` > `prototype` > `infrastructure`).

**`[slug]` parametric-route disambiguation.** Next.js parametric route directories use the `[name]` filesystem convention. The `prototype` path-default explicitly excludes any directory whose name begins with `[`:

```bash
# Pseudocode for path-default detection (canonical)
case "$path" in
  src/app/dev/proto/page.tsx) category=production ;;       # hub itself
  src/app/dev/proto/\[*/*) category=production ;;          # parametric route (e.g. [slug]/page.tsx)
  src/app/dev/proto/*/*) category=prototype ;;             # literal-slug subroute
  src/app/dev/proto/*) category=production ;;              # bare proto/ files (defensive)
  .claude/*|.github/*|scripts/*|*.config.*|CODEOWNERS) category=infrastructure ;;
  src/*) category=production ;;
  *) category=infrastructure ;;
esac
```

Implementations sharing this logic include `.claude/hooks/tdd-guard.sh` (path-default-skip), `.claude/hooks/tdd-first-every-commit.sh` (path-default-skip), `.github/workflows/auto-review.yml` (specialist routing via slice-category grep), and any future fitness function asserting matrix consistency (deferred per §8).

## §3 — Per-category gate-behaviour matrix (canonical)

CLAUDE.md §"Slice categories" carries a 1-paragraph summary + pointer to this section. This table is the single source of truth.

| Gate | `production` | `prototype` | `infrastructure` |
|---|---|---|---|
| TDD-guard pre-commit (`.claude/hooks/tdd-guard.sh`) | Enforce | Skip path-default | N/A (no `src/**.{ts,tsx}` impl) |
| Coverage gate (`scripts/verify-slice.sh` Gate 3c, ≥90% added lines) | Enforce | Excluded from coverage corpus via `vitest.config.ts` `coverage.exclude` | N/A |
| Test-pain audit (spec 72d §3 mock-count threshold) | >2 mocks triggers step-back | >5 mocks triggers step-back | N/A |
| Multi-agent specialists (`.github/workflows/auto-review.yml`) | `security` · `correctness` · `style` | `security` · **`prototype-readiness`** (substitutes correctness) · `style` | `security` · `correctness` · `style` (control-plane scrutiny) |
| Plan-time review (`.claude/hooks/exit-plan-review.sh`) | `exit-plan-review` + `plan-architect` (dual-persona) | `exit-plan-review` + `plan-architect` (dual-persona; prototype-readiness adds NO plan-time hook at V1) | `exit-plan-review` + `plan-architect` (dual-persona) |
| DoD-14 security checklist (spec 72 §11) | Full 14 items | Short-form: items 1, 8, 12, 14 only (see §5) | Full 14 items |
| Preview-deploy rubric (spec 72a) | Full 6-dim | Full 6-dim — UI/UX rigour preserved (this is the load-bearing piece for prototype loveability) | N/A |

**Substitute, not add, for multi-agent specialists.** Prototype slices replace `reviewer-correctness` with `reviewer-prototype-readiness` rather than running both. Rationale: the goal is friction reduction; running both defeats it. Production-correctness criteria — particularly criterion 7 (hidden-effects) and criterion 2 (architectural-severity per spec 72c §4 absorption) — are calibrated for production code paths and surface findings about code that doesn't exist in prototype slices (no T1+ data, no auth gating, no persistent state). The `plan-architect` persona at plan-time still fires for ALL slices including prototypes, catching architectural concerns pre-code. Escape hatch: any prototype that turns out to carry production-equivalent risk gets `**Category:** production` override in `acceptance.md`.

## §4 — Prototype-readiness persona

**Location:** `.claude/agents/reviewer-prototype-readiness.md`. Spawned by `.github/workflows/auto-review.yml` matrix when slice category resolves to `prototype`. Same brief-job inputs as `reviewer-correctness` (PR diff + linked slice `acceptance.md` + CLAUDE.md §"Coding conduct"); same Conventional Comments output schema (per CLAUDE.md §"Hard controls" §"Verdict vocabulary"); same nonce-envelope wrapper (per spec 72c §6).

**Lens.** UI/UX integration of the prototype as a clickable artefact: interaction patterns, accessibility (keyboard nav, screen-reader cues, focus management), copy clarity, error/empty/loading/disabled states, motion handling (`prefers-reduced-motion`), mobile viewport behaviour, hit-target sizes. NOT: production logic correctness, hidden-effects analysis, architectural-severity (deferred for prototype category per §3 substitute pattern).

**Out of scope at V1:** synthetic-deliberate-injection fixture (spec 72c §7 first-3-slice gate); live-drift detection (spec 72c §9 carry-over); auto-blocking PR-merge (informational at V1; deferred until persona catch-rate is calibrated). Persona retain/drop measurement starts at first prototype slice that ships under category=prototype.

## §5 — DoD-14 security checklist short-form for prototypes

Spec 72 §11 specifies 14 checkbox items. For category=prototype, four items remain in scope:

1. **Item 1 — Data classification per AC.** Prototypes declare T0 metadata explicitly; the declaration itself is the audit.
2. **Item 8 — Error handling.** User-facing surface; generic errors with reference IDs apply even when the data is static. Prototype loveability includes graceful failure.
3. **Item 12 — Adversarial review.** `/security-review` skill run on slice diff. Cheap; catches regressions in patterns the spec doesn't otherwise enforce.
4. **Item 14 — Secrets hygiene.** `gitleaks` clean on slice branch. No exception for any category.

Items 2-7, 9-11, 13 auto-N/A for static-data dev-mode hubs (no DB tables, no API routes, no file upload, no new env vars, no third-party flows, no audit log surface, no T4 data, no external scripts, no new deps). Slice's `security.md` records `N/A — category: prototype, see spec 76 §5` against each dropped item rather than leaving them unchecked.

**Escalation.** A prototype that DOES touch a normally-N/A surface (e.g. introduces a new third-party SDK for a prototype-only experiment) escalates to full DoD-14 by adding the relevant items back into its `security.md` — the short-form is a default, not a ceiling.

## §6 — Sweep discipline (constraint #38 self-reference)

Constraint #38 from `docs/HANDOFF-SESSION-74.md` L55 verbatim: *"Slice doc drift after refactor. Refactors that change file paths / API surface need a sweep of acceptance.md + verification.md + test-plan.md + security.md in the same commit, or auto-review will catch the drift post-PR."*

This constraint applies recursively to spec 76 itself: any future amendment to the §3 gate-behaviour matrix that changes a per-category rule MUST sweep all the implementing files in the same PR — `vitest.config.ts` `coverage.exclude`, `.claude/hooks/tdd-guard.sh` path-default-skip block, `.claude/hooks/tdd-first-every-commit.sh` path-default-skip block, `.github/workflows/auto-review.yml` matrix routing, `.github/PULL_REQUEST_TEMPLATE.md` DoD-14 reference, and any slice's `acceptance.md` that overrides via `**Category:**`. The deferred fitness function (§8) would automate this sweep verification.

## §7 — Why "Path B" (slice-category metadata) over alternatives

- **Path A: path-globs alone (no metadata).** Rejected because authors need a way to override the path-default when a slice's primary surface contradicts the mapping (the hub case). Path-globs alone provide no override mechanism.
- **Path B: slice-category metadata** (this spec). Path-default + explicit acceptance.md override. Two-tier resolution gives sensible defaults (low boilerplate for the common case) plus an escape hatch (override for the exceptional case). Detection cost is low: regex grep against acceptance.md OR path classification, whichever applies.
- **Path C: full spec-grade framework** (e.g. category schema with frontmatter validation, per-gate plugin registry, CI-enforced category coherence checks). Rejected as over-engineered for the current cohort scale. Revisit if matrix complexity or cohort size grows past ~10 enforcement points / slices.

## §8 — Out of scope (deferred)

- **Matrix-consistency fitness function**: a shellspec or CI assertion that parses the §3 matrix and verifies each enforcement file's behaviour aligns with the canonical row. **Deferred** — the current implementation surface is sweepable manually per §6; recursive #38 covers the discipline gap. Revisit when the matrix grows past 5 enforcement touch-points OR after the first observed drift between matrix and implementation.
- **Synthetic-deliberate-injection fixture for `reviewer-prototype-readiness`** (spec 72c §7): defer until the first prototype slice ships under category=prototype to gather signal on what defects the persona should reliably catch.
- **Auto-blocking merge on prototype-readiness verdict**: informational at V1; deferred until persona catch-rate is calibrated.
- **Live-drift detection for `reviewer-prototype-readiness`** (spec 72c §9 quarterly cron carry-over).

## §Status

**Shipped (Session 75 P0; PR #__).**

Touch points landed atomically with this spec:

- `CLAUDE.md` — NEW §"Slice categories" pointer to spec 76 §3 + 13→14 reconciliation in L136 + L255 (per F-EPR3 plan-time review finding; constraint #38 swept).
- `.claude/agents/reviewer-prototype-readiness.md` — NEW persona file; substitutes `reviewer-correctness` for category=prototype.
- `vitest.config.ts` — `coverage.exclude` extended for `src/app/dev/proto/**` (excluding hub + `[slug]` paths via spec.config patterns).
- `.claude/hooks/tdd-guard.sh` — path-default skip block per §2 detection logic (with explicit `[slug]` disambiguation).
- `tests/shellspec/tdd-guard.spec.sh` — extended with three path-default cases per F-PA3 (literal-slug skip; `[slug]` enforce; bare `proto/` enforce).
- `.github/workflows/auto-review.yml` — brief job grep slice category from `acceptance.md` → matrix routes `correctness` ↔ `prototype-readiness` per category.
- `.github/PULL_REQUEST_TEMPLATE.md` — 13→14 base-count reconciliation + DoD-14 short-form rendering note for category=prototype.
- `docs/slices/S-PROTO-hub/acceptance.md` — explicit `**Category:** production` override (calibration cohort row 1 retains production rigour).

Calibration cohort row 1 (`S-PROTO-hub`) keeps production rigour by override; row 2 (`S-PROTO-pre-signup-interview`, P1 next session) is the first slice to exercise category=prototype path-default + the prototype-readiness persona.
