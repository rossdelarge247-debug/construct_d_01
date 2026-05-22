# S-PROTO-journey-restore — test plan

## Approach

This slice spans data (registry rows + schema enum), static UI (sign-up shell, marketing-landing href edits, O8 CTA edit), and infrastructure (PR template, CI workflow, hook, settings, CLAUDE.md sections). Tests focus on the data-shape changes (schema enum + registry rows) and the new bash hook (shellspec). UI changes are static-markup and verified via render-smoke assertions; infrastructure changes are verified by file-content + CI-job-shape inspection in `verification.md`.

## Tests

### `tests/unit/app/dev/proto/registry.test.ts` (extend)

Existing file covers status-enum + row-shape invariants. Extend with:

| Assertion | AC |
|---|---|
| `statusSchema.options` contains `'shell-built'` between `'canvas-drafted'` and `'prototype-built'` | AC-1 |
| Each of the 6 row ids (`marketing-landing`, `how-it-works`, `pricing`, `faq-trust`, `welcome-tour`, `hub-day-7-state-f`) carries `lastTouched.session === 115` and the documented `status` value | AC-1 |
| `sign-up` row carries `status: 'shell-built'`, `lastTouched.session === 115`, `links.prototype === 'src/app/dev/proto/sign-up/'` | AC-3 |
| Each of those 7 rows carries `links.prototype` pointing at `src/app/dev/proto/<surface>/` | AC-1 + AC-3 |

### `tests/unit/proto-marketing-landing/start-cta-href.test.tsx` (new)

| Assertion | AC |
|---|---|
| Top-nav `Start` link resolves to `href="/dev/proto/pre-signup-interview"` (not `#start`) | AC-2 |
| Top-nav `Pricing` link resolves to `href="/dev/proto/pricing"` (not `#pricing`) | AC-2 |
| Top-nav `Sign in` link still resolves to `href="#signin"` (deferred to future slice) | AC-2 |

### `tests/unit/proto-sign-up/shell.test.tsx` (new)

Mirrors `tests/unit/proto-faq-trust/shell.test.tsx` shape, scaled to the smaller shell.

| Assertion | AC |
|---|---|
| H1 `"Sign up"` renders | AC-3 |
| Body paragraph rendering canvas-pending placeholder | AC-3 |
| Back-link with `href="/dev/proto"` renders | AC-3 |

### `tests/shellspec/journey-declared.spec.sh` (new)

(Renamed from acceptance.md's `journey-declared_spec.sh` to match repo's `.spec.sh` convention — all other entries under `tests/shellspec/` use the dot form. Noted in verification.md AC-5 evidence.)

| Scenario | Expected | AC |
|---|---|---|
| Slice acceptance.md with `**Journey:** inbound from = X · outbound to = Y` present | silent (exit 0, no advisory) | AC-5 |
| Slice acceptance.md missing `**Journey:**` field | advisory message printed (exit 0) | AC-5 |
| Non-PROTO slice (e.g. `S-F1-design-tokens`) edited | silent regardless | AC-5 |
| Slice acceptance.md with `**Journey:** orphan — pending wiring in slice S-X` | silent (orphan declaration counts as declared) | AC-5 |

## Test-pain audit

Spec 72d §3 L39 verbatim: *"Test-pain audit. If any unit test in this slice requires more than 2 mock setups for collaborators, step back and reconsider seams before continuing implementation."*

For `category: prototype` slices the threshold raises to >5 (spec 76 §3). All planned tests are static-render or schema-shape — zero mocks needed. Threshold not approached.

## Run

```bash
npm test -- tests/unit/app/dev/proto/registry.test.ts \
            tests/unit/proto-marketing-landing/start-cta-href.test.tsx \
            tests/unit/proto-sign-up/shell.test.tsx
shellspec tests/shellspec/journey-declared.spec.sh
```
