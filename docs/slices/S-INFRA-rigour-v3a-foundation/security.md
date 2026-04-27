# S-INFRA-rigour-v3a-foundation — Security review

**Spec reference:** spec 72 §11 (per-slice 13-item checklist).
**Status:** in-progress; full evidence consolidated at slice-wrap PR.

S-INFRA-rigour-v3a-foundation is a **control-plane / harness-hook / CI-workflow** slice. No user data, no auth surface, no UI. Most §11 boxes resolve to **n/a** with rationale below; substantive items concentrate in adversarial review (Box 11) and rollback (Box 12).

---

## §11 13-item checklist

| Box | Item | Verdict | Evidence / rationale |
|---|---|---|---|
| 1 | Data classification | n/a | infra slice — no user data flows |
| 2 | Env-var handling | n/a | no new env vars introduced |
| 3 | AuthN / AuthZ | n/a | no auth surface |
| 4 | Input validation | PASS | shellspec inputs validated via tmp-repo isolation (G15); allowlist parser strips comments + trims whitespace |
| 5 | Output encoding | n/a | no user-facing output |
| 6 | Logging | PASS | hooks emit only to stderr / additionalContext; no PII; no secrets |
| 7 | Dev-mode boundary | n/a | infra slice; no dev-mode toggle |
| 8 | Third-party deps | PASS | shellspec (already vetted in S-37-0); GitHub Actions (`actions/checkout@v4`) |
| 9 | Safeguarding | n/a | no user-facing copy or flow |
| 10 | Pen-test readiness | n/a | no externally exposed surface |
| 11 | Adversarial review | TBD | per-AC `/security-review` pass at slice wrap (DoD item 3) |
| 12 | Rollback | TBD | AC-8 documents rollback procedure (revert merge commit on main; `.claude/hooks/*` reset; PR carries `control-change` label per G19) |
| 13 | RLS | n/a | no DB |

## Threat-model addenda

- **AC-7 nonce-derivation** (when shipped, S-37-6 / session 37): `/dev/urandom` 16-byte entropy → 128-bit nonce; collision probability ~2^-64 per session per acceptance.md L52. Hard-fail on `/dev/urandom` unreadable. Log-leakage threat documented per acceptance.md L52(g).
- **Hooks-checksums drift** (AC-2, S-37-3 / `be78bc2`): integrity check surfaces drift in `session-start` additionalContext as warning (non-blocking); blocking enforcement deferred to AC-2's full label-workflow at session 38 per L71.
- **ESLint allowlist bypass** (AC-3, S-37-4 / `21f0b6b`): allowlist seeded empty; new entries gated by `control-change` label per AC-2 + AC-8 procedure.

## Sign-off

Per slice-wrap PR. Adversarial review pass per AC + DoD item 3.
