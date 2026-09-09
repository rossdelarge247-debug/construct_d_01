# HANDOFF — Session 126

**Branch:** `claude/session-126-kickoff-iioj8m` @ `42175f3`, stacked on `claude/trusting-brahmagupta-uFE21` @ `db162dc`; main @ `2e35ca3`. No PRs (held for the user's preview review).
**Date:** 2026-09-09

## What happened

### 1. Turn-0 verification

Kickoff facts held: main `2e35ca3`, the 125 branch 12 ahead with no PR. Two things the kickoff could not know: `node_modules` was absent in the fresh container (`npm ci`, 608 packages), and the session-125 artifacts (HANDOFF-125, the sign-up slice, the Playwright harness) exist only on the 125 branch, so the designated session branch was re-based onto that tip rather than main. That keeps the 125 PR small (user chose two stacked PRs).

### 2. P1 — design-system tokens (S-F1 extension), `fd3a4ea`

Diagnosed before adding tokens, with `document.fonts` on the live sign-up page:

- Inter at 400/500/600/700/800 is registered (next/font emits one `@font-face` per weight per unicode-range — the 90 rules session 125 read as "all 400"); 600 and 700 report `loaded`. No fix needed.
- `--ds-font-serif` said `'Source Serif Pro'`; next/font registers `Source Serif 4`. Every serif heading fell to Georgia. Fixed in tokens.ts + globals.css.
- The canvas Wordmark dot is `color:ACCENT` (#2F6D5F, teal) — the round-4 critic's "purple" was wrong; the drift table was right.
- The canvas's AI family is four constants, not three: `AI_PURPLE` #6D5BD0 (badge), `_DEEP` #4C3FB8, `_TINT` #F5F3FF, `_EDGE` #E4DEFD.

Shipped test-first: parity test rewritten (100 entries, CSS↔TS value assertions, serif family assertion) → red → tokens.ts + globals.css + `sign-up.module.css` re-point in one step → green. First attempt used `var(--font-source-serif)` in the serif token; two pre-signup unit tests went red because jsdom drops an inline `font:` shorthand whose family carries `var()`. Switched to the plain family list.

### 3. User decisions (AskUserQuestion, one round)

Keep the "Read the Terms and Privacy Policy." line · two stacked PRs · hold the sign-up PR until the preview is reviewed · sign-in asserts password + Forgot? only (decision B). Recorded in spec 65a §Status and the sign-in loop card.

### 4. P3 — sign-in as loop run 2 (`da16a76` → `42175f3`)

Cheaper shape than run 1, as HANDOFF-125 asked: bars written first (behaviour + a11y with axe before and after an invalid submit; visual), unit suite and registry assertion in the floor and red before the build, one builder (this session), one fresh-context blind critic per round on a smaller model, the design-system and interaction critics done by hand (grep for hex / tokens; the bars), one integration walk at the end. Run 1's capture code became `tests/e2e/helpers/canvas-capture.ts`; sign-up's visual bar now calls it.

| Round | Change | Critic's largest gap |
|---|---|---|
| 1 | Screen from `M_SignIn` L3609–3666 under decision B | Checkbox 22px vs 13px; heading 16px wider; inputs 4px taller + 44px remember row → button 38px low |
| 2 | Inputs `line-height: 1.2`; remember row keeps 44px behind negative margins; 14px box | Underlines (deliberate); heading width; wordmark→h1 +6px; password label→input −5px |
| 3 | Wordmark block at 1.2 line-height; label row margin 5px; heading diagnosed (below) | Password dots (canvas fakes a filled value); checkbox radius near-circular |
| 4 | Checkbox radius 2px; bar asserts box ≤16px, radius ≤3px, row ≥44px | Loop stops at 4/4; remaining reasons deliberate or ≤3px |

Ink-band measurement from the PNGs (PIL) replaced eyeballing from round 2 on; it caught that my own reading of the captures was wrong twice.

### 5. The heading investigation (worth recording)

The canvas h1 measured 249×33, the app's 265×36, at identical computed size / weight / letter-spacing. Ruled out in order: Georgia fallback (Georgia isn't installed; the default serif measures 237×29), font files (both sides fetch the same four woff2), font-optical-sizing / kerning / feature settings / smoothing / line-height (no effect), zoom or transform on the canvas host (none). The answer: the decoded canvas declares 28 `@font-face` rules for Inter and 12 for `'Source Serif Pro'` — it embeds its own faces and never fell back to Georgia. Source Serif Pro (the canvas) and Source Serif 4 (Google Fonts' current release, which next/font loads) differ in advance widths. Unfixable in-app; the two harness changes made along the way (rename the served serif; force-load fonts used in the host) changed no pixel and were reverted.

## What went well

- Diagnose-before-fix paid twice: two of the five kickoff escalations were non-defects, and the heading chase ended in a documented cause instead of a patch.
- The bars-first, unit-in-floor, majors-from-round-1 shape held: no round was spent on a floor failure; round 4 was a measured 2px radius, not a rediscovered a11y major.
- Every round is one commit with its verifier evidence in the message; progress.md and verification.md are the durable record.

## What could improve

- The adversarial-review subagent for the tokens diff died to the account's session rate limit mid-run; the gate was completed by hand (union/array/CSS counts, prefix-regex check, contrast). Constraint #51.
- Two harness "fixes" were made on a hypothesis before measurement disproved it; measuring ink bands first would have saved a round of edits. Constraint #53.
- Port 3000 was held after the dev server was killed; a Playwright run timed out on 3001 before the cause was found. Constraint #52.
- The commit gate blocked a CSS-only round until a test change was added — the added Playwright assertion is real coverage, but the gate's "tests/ change alongside" rule should be remembered before staging (constraint #47 already says so).

## Key decisions

1. Session branch stacked on the 125 branch, not main, so P1 could re-point `sign-up.module.css` and the 125 PR stays small.
2. Serif token is a plain family list (`'Source Serif 4', Georgia, serif`), not `var(--font-source-serif)`, because inline `font:` shorthands built from tokens cannot carry `var()` in jsdom.
3. Decision B (user): sign-in password + Forgot? only; Google/passkey stay logged for user testing with magic-link.
4. Forgot? is a button with a `role="status"` note, not a link to a route that does not exist.
5. Sign-in checkbox follows the canvas's native size (14px) inside a 44px row; sign-up's 22px box is left for its own PR.
6. Heading width drift accepted as font-version drift and recorded, not patched.

## Bugs found and how they were fixed

- `--ds-font-serif` named a family next/font never registers → `'Source Serif 4'`; verified via `document.fonts` and computed style on the live page.
- `var()` inside `tokens.font.serif` broke two pre-signup unit tests (jsdom `font` shorthand parser) → plain family list.
- Turbopack served stale `globals.css` after a Python file write (custom properties resolved to nothing) → dev server restart; re-verified before trusting any live number.
- `next dev` fell through to port 3001 because 3000 was still held → kill all `next` processes, confirm `ss -ltnp`, restart.
- Inherited `line-height: 1.5` made inputs 49px (canvas 45) and the wordmark line box 30px (canvas 24) → explicit line-heights.
- Commit gate refused a CSS-only round → added a behaviour-bar assertion covering the change.

## Persona findings recorded

The `.claude/agents/*` review personas were not spawned this session (the auto-review workflow runs them on the PR). Ad-hoc critics:

| Critic | Findings | Missed by the main conversation? |
|---|---|---|
| Adversarial review (general-purpose agent, tokens diff) | 0 — terminated by rate limit; gate completed by hand | n/a |
| Blind visual critic, round 1 (sonnet, fresh context) | 4: checkbox size, heading width, rhythm drift, checkbox x-offset | Y — checkbox size and the 4px input height |
| Blind visual critic, round 2 | 5: underlines, heading width, wordmark→h1 gap, label→input gap, muted grey hue | Y — the two gaps |
| Blind visual critic, round 3 | 4: password dot colour, checkbox radius, muted grey hue, 2px gaps | Y — the radius |

Verdict for the retain/drop habit: a fresh-context blind pick per round on a small model finds what the builder cannot see in its own work; three rounds cost ~285k subagent tokens in total.

## Next session

See `docs/SESSION-CONTEXT.md` §Prioritised deliverables — P1 is opening the two PRs once the user has reviewed the Vercel preview.
