# S-PROTO-journey-restore — security

**Category:** prototype → short-form security checklist (items 1, 8, 12, 14 per CLAUDE.md §"Slice categories" + spec 76 §5).

## Short-form items

### Item 1: Secrets / credentials / sensitive defaults
✓ No secrets or credentials introduced. Registry rows, schema enum, shell page, marketing-landing href edits, PR template, CI workflow, hook, shellspec, CLAUDE.md edits are all static config / docs / placeholder UI.

### Item 8: Third-party dependencies
✓ No new dependencies. New sign-up shell imports `next/link` + `@/styles/tokens` (both already in use). CI workflow extension uses pre-installed `git` + `grep`. Author-time hook uses bash + `grep` only.

### Item 12: External surfaces
✓ No new external surfaces. Sign-up shell is static markup, no `fetch`, no API routes, no auth boundary, no `localStorage`. CI workflow runs in GitHub Actions sandbox; hook runs locally on PostToolUse.

### Item 14: PII handling
✓ No PII. Shell carries static template-literal copy only; hook/workflow process file paths + diff metadata only.

## N/A items (category: prototype)

- Items 2–7, 9–11, 13: `N/A — category: prototype, see spec 76 §5`.

## Adversarial review

Surface-by-surface:

- **`registry.ts` row updates + `registry-schema.ts` enum extension** — data + schema only; no runtime side effects beyond `FlowRow` / `StatusBadge` render of the new `'shell-built'` value.
- **`sign-up/page.tsx` shell** — static markup mirroring `faq-trust/page.tsx`; no logic, no state, no inputs.
- **`marketing-landing/page.tsx` href edits** — two `href` value swaps from `#hash` to absolute path; `next/link` already imported.
- **`O8.tsx` CTA edit** — single CTA `href` change to outbound route.
- **`.github/PULL_REQUEST_TEMPLATE.md`** — markdown-only addition; no execution path.
- **`.github/workflows/pr-dod.yml` extension** — adds a second job; uses the same `git diff --name-only` + `grep` pattern as the existing `slice-verification` job. Same trust model.
- **`.claude/hooks/journey-declared.sh`** — bash script, PostToolUse advisory (exits 0 always); runs locally during agent session; reads slice acceptance.md files via `grep`; no writes.
- **`.claude/settings.json`** — registers the new hook; no permission elevation.
- **`tests/shellspec/journey-declared_spec.sh`** — test fixture; runs in test sandbox only.
- **CLAUDE.md edits** — docs.

No injection surface, no auth boundary, no data flow change. Adversarial-review-equivalent: catalogued by surface above; concerns deferred = none.
