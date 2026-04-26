# S-F7-β · Dev surface routes — Security checklist (spec 72 §11)

**Slice:** S-F7-beta-dev-surface
**Spec ref:** spec 72 §3 (Session pattern) + §7 (Dev/prod boundary enforcement, multi-layer) + §11 (per-slice 13-item checklist)
**Status:** Skeleton · filled at impl wrap

This slice IS the dev/prod boundary surface, so the 13-item checklist is binding (no N/A escape per spec 72 §11). Each item gets evidence at impl wrap.

---

## 13-item per-slice checklist

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Data classification respected (no PII in dev fixtures beyond `@dev.decouple.local`) | _pending_ | grep + fixture audit |
| 2 | Env-var convention (no hardcoded keys; `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` is the gate) | _pending_ | env-var regex CI check |
| 3 | Auth/session correctness (dev-session honours Session interface contract from α) | _pending_ | vitest |
| 4 | RLS / authorisation (N/A in dev mode — no Supabase touch; documented) | _pending_ | inline note |
| 5 | Input validation at boundaries (state-inspector JSON.parse + reject on throw) | _pending_ | vitest case for malformed JSON |
| 6 | Logging hygiene (no fixture data in console; no PII to logs) | _pending_ | grep `console.log` audit |
| 7 | Dev/prod boundary multi-layer (build-time + runtime + CI dev-mode-leak scan all pass) | _pending_ | CI check + manual prod-build inspection |
| 8 | Third-party integrations (none new this slice) | _pending_ | dependency diff |
| 9 | Safeguarding (dev-mode banner is informational, not capable of triggering real-user actions) | _pending_ | review |
| 10 | Pen-test readiness (no new attack surface beyond existing engine-workbench, which is preserved) | _pending_ | review |
| 11 | Bundle inspection — prod build contains no `dev-store` / `dev-session` / `@dev.decouple.local` strings | _pending_ | CI dev-mode-leak scan |
| 12 | Adversarial review run (`/review` + `/security-review` skill or manual poke-holes; min 5 concerns) | _pending_ | verification.md §Adversarial run |
| 13 | Slice's spec-72 §3 + §7 obligations explicitly met (Session pattern + dev/prod boundary) | _pending_ | inline notes per route file |

---

## Per-AC security notes

- **AC-1 (route group + notFound):** spec 72 §7 requires `MODE === 'prod' → notFound()` at layout level. Implementation must verify both at runtime (server component) AND at build (CI dev-mode-leak scan reads bundle). Single-layer enforcement is insufficient per spec 72 §7.
- **AC-2 (scenario picker + reset):** wipe must remove ALL `decouple:dev:*` keys, not just specific ones. Confirm dialog prevents accidental wipe.
- **AC-3 (state inspector):** edit affordance reads JSON from textarea, runs `JSON.parse` in try/catch, rejects on throw without writing. No `eval`. No `dangerouslySetInnerHTML`. React default escaping for the JSON display.
- **AC-4 (engine workbench move):** old path must return 404, not redirect (per spec 72 §7 — old dev-routes must be unreachable in prod, not silently re-routed where bookmarks could leak).
- **AC-5 (env banner reskin):** banner returns `null` (not "hidden via CSS") on prod. CSS-hidden banners would still ship the component code in the prod bundle; null-return + tree-shaking + CI scan together enforce removal.
- **AC-6 (fixtures):** fixture JSON files are imported, not fetched, so bundle inspection catches any leak. CI dev-mode-leak scan must include `@dev.decouple.local` as a prohibited string in prod bundles.
- **AC-7 (#14 lift):** hook patch is shell-script-side; no production runtime impact. The `git remote set-head origin main 2>/dev/null || true` swallows errors safely (`|| true`); test must verify the swallow is intentional and not masking real failures.

---

## Sign-off

- **Verified by:** _filled at impl wrap_
- **Date:** _filled at impl wrap_
- **`/security-review` skill output:** _filled at impl wrap_
- **Outstanding security debt:** _filled at impl wrap_
