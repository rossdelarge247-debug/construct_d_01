# 75 — Account administration (V1 minimum)

**Status:** Logic-only spec. Defines the minimum administrative surface for V1 launch: Settings (§A), Notifications (§B), Account profile (§C). Closes the fourth of four logic-spec gaps from the session-69 design-input audit.

**Sources:**
- spec 56 §"L8 Commercial Setup" — billing-adjacent items (deferred to V1.5 per `docs/v2/v2-backlog.md` #72)
- `docs/v2/v2-backlog.md` #67 (auth upgrade — magic link + Google; V1 baseline this spec assumes), #71 (PostHog analytics — post-V1; event analytics, NOT user-facing notifications), #72 (Stripe billing — V1.5)
- spec 47 — non-engagement paths (account deletion + counterpart-side handling)
- spec 67a — respondent state machine (notification trigger sources)
- spec 56 §1 — GDPR retention rules (referenced from §A.3 hard-delete behaviour)

**Scope:** Three administrative sub-domains required for V1 launch.

**Out of scope:**
- Billing / Stripe integration — V1.5 per v2-backlog #72
- In-app, push, or SMS notification delivery — post-V1
- Profile editing (display name change, photo, bio) — V1.5
- Multi-factor authentication — V1.5
- User-facing audit log — V1.5
- Connected-device management — V1.5
- Data export from settings — separate spec (PDF export covered in spec 56 §10)

---

## A. Settings (V1)

**V1 controls — three flows:**

### A.1 Change email

- Verify new email with confirmation token sent to the new address.
- Old address remains active until the new address is verified.
- On verification, new email replaces old in the account record.
- Cross-party impact: invitation tokens record email-at-send-time; resend uses the current email.
- Triggers `notification.security.email_changed` to BOTH old and new addresses (per §B).

### A.2 Change password

- Current-password challenge + new-password set.
- No email confirmation required — the current-password challenge gates the change.
- Triggers `notification.security.password_changed` to the current email (per §B).

### A.3 Delete account

- Soft-delete with grace period.
- On request: account marked `pending_deletion`, all sessions invalidated, 30-day grace before hard delete.
- During grace: login restores the account (cancels the deletion) with a warning banner.
- After grace: hard delete = data anonymisation per spec 56 §"1. GDPR & Data Protection".

**Cross-party effects on delete:**
- If the deleting party is solo (no shared picture): hard-delete only their data.
- If shared: spec 47 non-engagement paths apply — counterpart notified neutrally; counterpart's picture preserved; deleted-party's data redacted from the joint picture.

**V1.5 additions:** billing controls, notification opt-out preferences, profile editing, MFA enrolment.

---

## B. Notifications (V1)

**Delivery channel:** email only. No in-app, no push, no SMS at V1.

**Notification types — transactional only:**

| Event | Recipient | Trigger |
|---|---|---|
| `invite.sent_confirmation` | Inviter | Invitation link issued |
| `invite.opened` | Inviter | Counterpart reaches `M2_LANDING` per spec 67a |
| `invite.declined` | Inviter | Counterpart selects `M2A_DECLINE` per spec 67a |
| `invite.accepted` | Inviter | Counterpart completes `M3_SIGNUP` per spec 67a |
| `invite.opened_no_action` | Inviter | 7-day no-action prompt (resend nudge) |
| `share.early_comment` | Inviter | Counterpart posts a pre-disclosure comment from `M5A_EARLY_COMMENTS` per spec 67a |
| `share.reconciliation_started` | Inviter | Counterpart reaches `M10_RECONCILE_INTRO` per spec 67a |
| `security.password_changed` | Account holder | §A.2 |
| `security.email_changed` | Both old + new email | §A.1 |
| `account.deletion_requested` | Account holder + counterpart (if shared) | §A.3 |
| `account.deletion_grace_ending` | Account holder | T-3 days from grace-period end |

**Opt-out at V1:** none. All transactional events are required for safety + auditability. V1.5 adds opt-out for `invite.opened_no_action` only — security and account-deletion events remain mandatory at every release.

**Sender:** single transactional sender address. Reply-to: support address.

**Boundary note:** PostHog analytics (`docs/v2/v2-backlog.md` #71) is event tracking for product metrics, NOT user-facing notifications. Two separate concerns; analytics deferred to post-V1.

---

## C. Account profile (V1)

**Read-only display fields:**

| Field | Source | Editable V1? |
|---|---|---|
| Display name | Signup form | No (V1.5) |
| Email | Settings §A.1 | Yes (via §A) |
| Account role | Signup context | No — derived |
| Account created | System | No — immutable |
| Counterpart link state | Joint-picture state | No — system-derived |

**Account roles V1:**
- `party_a` — initiator (Sarah variant per spec 65)
- `party_b` — invited respondent (Mark variant per spec 67a)
- `solo` — account exists but no invitation sent or received yet

**Counterpart link states V1:**
- `not_invited` — solo
- `invitation_pending` — link sent, not yet accepted
- `linked` — counterpart account exists and has accepted invitation
- `revoked` — invitation revoked or counterpart's account deleted

**V1.5 additions:** display-name edit, profile photo, preferences (notification opt-outs surface here).

---

## V1.5 deferrals (consolidated)

- Billing controls + Stripe payment management (v2-backlog #72)
- Notification opt-outs beyond `invite.opened_no_action`
- Profile editing (display name, photo, bio)
- MFA / 2FA enrolment
- User-facing audit log
- In-app / push / SMS notification channels
- Connected-device management
- New-device login alerts (`security.login_new_device`) — depends on device-tracking infrastructure not yet specced
- Data export from settings (PDF export elsewhere per spec 56 §10)

---

## Status

- Created: session 71.
- Closes the fourth of four logic-spec gaps from the session-69 design-input audit (P1 of session 71). Logic-spec phase is complete after this lands.
- Cross-references: spec 47 (non-engagement on delete), spec 56 §1 (GDPR retention), spec 56 §"L8 Commercial Setup" (billing-V1.5), spec 67a (notification triggers), `docs/v2/v2-backlog.md` #72 (billing-V1.5).
