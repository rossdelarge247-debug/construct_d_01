# {S-XX · slice name} — In-browser verification

**Slice:** S-XX-{slug}
**Source:** CLAUDE.md DoD item 4 + engineering-phase-candidates.md §G.5
**Preview deploy URL:** `construct-dev-git-{slice-branch}-*.vercel.app`
**Integration URL (for regression check):** `construct-dev-git-phase-c-*.vercel.app`

Run this before marking DoD item 4 complete. Record evidence against each row — commit SHA, screenshot, or short screen recording.

---

## Golden path

The main end-to-end flow this slice delivers.

| Step | Action | Expected outcome | Evidence |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |

**Pass / fail:** {pass · fail — if fail, note blocking issue + ticket}

## Edge cases

Known edge cases per AC. Each row = one scenario that should behave gracefully.

| Scenario | Trigger | Expected outcome | Evidence |
|---|---|---|---|
| Empty state | {first visit, no data} | | |
| Error state | {API failure, offline} | | |
| Back-navigation | {browser back from mid-flow} | | |
| Reload mid-flow | {F5 on a mid-flow screen} | Lands on safe resting screen per spec 71 §6 state-machine pattern | |
| Rapid double-click | {CTA pressed twice fast} | Idempotent; no duplicate submit | |

## Accessibility

- [ ] **Keyboard-only navigation** — every interactive element reachable via Tab; focus ring visible; no keyboard traps; keyboard affordance pattern (C-V4) used for shortcuts
- [ ] **Screen reader sanity** — VoiceOver or NVDA pass on golden path; headings hierarchical; landmarks present; form inputs labelled; error messages associated
- [ ] **`prefers-reduced-motion`** — spec 26 animations gracefully degrade; no vestibular triggers; essential transitions remain visible without movement
- [ ] **Colour contrast** — tokens from S-F1 design system are WCAG AA minimum; no meaning conveyed by colour alone (trust-chip has label + colour per C-T1 lock)
- [ ] **Focus management** — modal traps focus; focus returns to trigger on close; skip links work

## Responsive viewport

Test at three viewports minimum.

| Viewport | Width | Expected behaviour | Evidence |
|---|---|---|---|
| Mobile | 375 px (iPhone SE) | Single-column; primary CTAs thumb-reachable | |
| Tablet | 768 px | Adapts cleanly; no awkward mid-points | |
| Desktop | 1440 px | Three-column document shell visible where applicable | |

## Cross-browser

At least Chrome + Safari for V1.

- [ ] **Chrome latest** — golden path + edge cases
- [ ] **Safari latest** — golden path + edge cases (iframe / cookie / storage quirks)
- [ ] **Firefox latest** — optional for V1; target V1.5
- [ ] **Mobile Safari** (iOS 16+) — golden path on real device or emulator

## Regression surfaces

Adjacent slices that share a component, library, or route with this slice. Smoke-check each.

| Adjacent slice / surface | Smoke check | Pass / fail | Evidence |
|---|---|---|---|
| | {one-sentence golden-path spot check} | | |

Use the spec 70 hub + slice dependency graph to identify adjacent slices. Lean: any slice that consumes a component / library this slice touches is in scope.

## Dev-mode sanity (if slice surface varies by MODE)

- [ ] Dev preview: env banner visible with correct mode + scenario chip
- [ ] Dev preview: scenario switcher works; reset wipes `decouple:dev:*` keys
- [ ] Production build (local `next build && next start` with `DECOUPLE_AUTH_MODE=prod`): `/app/dev/*` returns 404; no dev-fixture email references in bundle

## Adversarial run

- [ ] `/review` skill run on slice diff; findings triaged
- [ ] `/security-review` skill run on slice diff; findings recorded in `security.md` §12
- [ ] Optional: `.claude/agents/slice-reviewer.md` sub-agent run (if experiment retained per engineering-phase-candidates §E)

---

## Sign-off

- **Verified by:** {author / session ID}
- **Date:** {date}
- **Commit SHA verified:** {sha}
- **Preview URL:** {URL with timestamp}
- **Outstanding issues:** {list or "none"}
- **DoD item 4 status:** complete · blocked · partial (reason)
