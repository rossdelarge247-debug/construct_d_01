# S-F7-β · Dev surface routes + env banner reskin — In-browser verification

**Slice:** S-F7-beta-dev-surface
**Source:** CLAUDE.md DoD item 4 + engineering-phase-candidates.md §G.5
**Preview deploy URL:** `construct-dev-git-claude-s-f7-beta-dev-surface-*.vercel.app` (filled at first push)
**Integration URL (for regression check):** `construct-dev.vercel.app` (post-merge to main)

Run this before marking DoD item 4 complete. Record evidence against each row — commit SHA, screenshot, or short screen recording.

---

## AC sign-off

Filled at impl wrap. Each row points to evidence in this file's later sections + the impl commits.

| AC | Outcome | Evidence | Status |
|---|---|---|---|
| AC-1 · `/dev` route group + prod-notFound | dashboard route works in dev; 404 in prod build | _filled at impl_ | _pending_ |
| AC-2 · scenario picker + reset | pick → wipe → load → reload round-trip | _filled at impl_ | _pending_ |
| AC-3 · state inspector | JSON read + edit + save round-trip | _filled at impl_ | _pending_ |
| AC-4 · engine workbench moved | new path 200, old path 404 | _filled at impl_ | _pending_ |
| AC-5 · env banner reskin | mode chip + dropdown + reset render in (authed); null in prod | _filled at impl_ | _pending_ |
| AC-6 · 6 new scenarios | all 8 load via scenarioLoader; smoke render | _filled at impl_ | _pending_ |
| AC-7 · CLAUDE.md #14 lift | session-start.sh patched + bullet added + test extended | _filled at impl_ | _pending_ |

---

## Golden path

Main end-to-end flow this slice delivers: a fresh dev session, scenario switch, state inspect, reset.

| Step | Action | Expected outcome | Evidence |
|---|---|---|---|
| 1 | Open `/dev` in dev preview | Dashboard renders with mode chip "DEV", current scenario name visible, links to `/dev/scenarios`, `/dev/state-inspector`, `/dev/reset`, `/dev/engine-workbench` | _pending_ |
| 2 | Click "Scenarios" → pick `sarah-mid-build` → confirm | Wipe → load → redirect to `/dev`; banner now shows scenario name `sarah-mid-build`; localStorage `decouple:dev:store:v1` populated | _pending_ |
| 3 | Visit `/workspace` (or whichever post-auth route) | Workspace renders against the loaded fixture (no crashes, no missing-key errors) | _pending_ |
| 4 | Click "State inspector" in dev banner | JSON view of current dev store, pretty-printed monospace | _pending_ |
| 5 | Edit one field via Edit affordance → save | Validation passes; reload route shows the edited state | _pending_ |
| 6 | Click "Reset" in dev banner | Confirm dialog → wipe → redirect to `/dev`; banner shows "no scenario loaded" or default | _pending_ |

**Pass / fail:** _pending impl_

## Edge cases

Known edge cases per AC. Each row = one scenario that should behave gracefully.

| Scenario | Trigger | Expected outcome | Evidence |
|---|---|---|---|
| Empty state | Fresh visit, no fixture loaded | `/dev` dashboard renders; scenario name shows "(none loaded)" or default | _pending_ |
| Invalid JSON in state inspector edit | Malformed JSON saved | Inline validation error; original state unchanged in store | _pending_ |
| Scenario switch mid-flow | User on `/workspace`, picks new scenario from banner | Wipe → load → page reload at `/dev`; no zombie state from old scenario visible after reload | _pending_ |
| Back-navigation after scenario switch | Browser back from `/dev` to `/workspace` | Page renders against the *new* fixture (not stale closure of old one) | _pending_ |
| Reload mid-flow | F5 on `/dev/state-inspector` with edited unsaved JSON | Unsaved changes lost (dev-tool, not product); reload shows persisted state | _pending_ |
| Rapid double-click on Reset | Reset CTA clicked twice fast | Idempotent; only one wipe; no console error | _pending_ |
| Direct URL hit on `/dev` in prod build | `pnpm build && pnpm start` with `MODE=prod`; GET `/dev` | 404 page (notFound from layout); CI dev-mode-leak scan passes | _pending_ |
| Direct URL hit on `/workspace/engine-workbench` | After AC-4 move | 404 (old route removed) | _pending_ |
| Marketing route in dev mode | GET `/` in dev | No banner rendered (banner only inside `(authed)` layout) | _pending_ |

## Accessibility

- [ ] **Keyboard-only navigation** — every interactive element in dashboard + scenarios + state-inspector + reset reachable via Tab; focus ring visible (using S-F1 tokens); no keyboard traps
- [ ] **Screen reader sanity** — VoiceOver / NVDA pass on `/dev` dashboard golden path; headings hierarchical; landmarks present; scenario picker uses `<button>` semantics, not div-onclick
- [ ] **`prefers-reduced-motion`** — banner dropdown + reset confirm dialog respect reduced-motion (no slide / fade animations beyond essential)
- [ ] **Colour contrast** — banner mode chip + dropdown text meet WCAG AA against banner background; S-F1 tokens already pre-validated
- [ ] **Focus management** — confirm dialogs (reset, scenario switch) trap focus; focus returns to trigger on close

## Responsive viewport

| Viewport | Width | Expected behaviour | Evidence |
|---|---|---|---|
| Mobile | 375 px | Banner adapts (mode chip + truncated scenario name + reset icon-only); dashboard cards stack | _pending_ |
| Tablet | 768 px | Banner full text; dashboard cards 2-column | _pending_ |
| Desktop | 1440 px | Banner full text + scenario dropdown wide; dashboard cards 3-column | _pending_ |

## Cross-browser

- [ ] **Chrome latest** — golden path + edge cases
- [ ] **Safari latest** — golden path + edge cases (localStorage quirks)
- [ ] **Firefox latest** — optional V1; target V1.5
- [ ] **Mobile Safari** (iOS 16+) — golden path on real device or emulator

## Regression surfaces

| Adjacent slice / surface | Smoke check | Pass / fail | Evidence |
|---|---|---|---|
| S-F1 design tokens | Banner uses tokens (no inline colours): `grep '#[0-9a-f]\{3,8\}' src/components/layout/env-banner.tsx` returns 0 | _pending_ | grep output |
| S-F7-α auth + store contracts | `lib/auth/*` + `lib/store/*` untouched in this slice (only consumed); diff shows new files only | _pending_ | `git diff --stat 5d38f6d..HEAD -- src/lib/{auth,store}/` |
| Engine workbench preserved behaviour | Signal-rule testing still works post-move | _pending_ | smoke screen-record |
| Existing `/workspace/*` routes | Not affected by `/dev/*` route group | _pending_ | smoke check on `/workspace` (post-α) |

## Dev-mode sanity (this slice IS the dev mode surface)

- [ ] Dev preview: env banner visible with mode "DEV" + scenario chip
- [ ] Dev preview: scenario dropdown switches; reset wipes `decouple:dev:*` keys
- [ ] Production build (`pnpm build && pnpm start` with `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod`): `/dev/*` returns 404; banner returns null; no `decouple:dev:*` keys written; bundle inspection shows no `dev-store` / `dev-session` import paths in client chunks (CI dev-mode-leak scan covers this)
- [ ] Existing CI check **Dev-mode leak scan (spec 72 §7)** passes on this PR's HEAD

## Adversarial run

Filled at impl wrap. Run before tagging DoD item 3 complete:

- [ ] `/review` skill run on slice diff; findings triaged
- [ ] `/security-review` skill run on slice diff; findings recorded in `security.md` §12
- [ ] Manual poke-holes pass — minimum 5 concerns surfaced + addressed/deferred. Initial concerns to investigate at impl:
  - **Server vs client rendering of `MODE` check** — is `process.env.NEXT_PUBLIC_DECOUPLE_AUTH_MODE` read client-side at the layout boundary safely? Spec 72 §7 requires both build-time + runtime assertions.
  - **localStorage XSS surface** — state-inspector renders user-edited JSON; ensure no `dangerouslySetInnerHTML` path; React-default escaping is the only defence.
  - **Scenario JSON treated as code** — JSON loaded via `import` vs `fetch` matters for bundle vs network egress; spec 72 §7 disallows dev-fixture data in the prod bundle.
  - **`@dev.decouple.local` email leakage** — fixtures use this domain; CI dev-mode-leak scan must catch any prod-bundle reference.
  - **Engine-workbench old-path orphan** — confirm no internal links + no external bookmarks the user might still hit; document the move in HANDOFF + maybe a 410-Gone-style note in commit.

---

## Sign-off

- **Verified by:** _filled at impl wrap_
- **Date:** _filled at impl wrap_
- **Commit SHA verified:** _filled at impl wrap_
- **Preview URL:** _filled at impl wrap_
- **Outstanding issues:** _filled at impl wrap_
- **DoD item 4 status:** _filled at impl wrap_ (complete · blocked · partial w/ reason)
