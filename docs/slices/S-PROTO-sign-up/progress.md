# S-PROTO-sign-up — loop progress

Target: `acceptance.md` §OBJECTIVE. Base: `main` @ `2e35ca3`. Branch: `claude/trusting-brahmagupta-uFE21`.

## Rounds

| Round | Change | Verifier evidence | Critic's largest gap | Next action |
|---|---|---|---|---|
| 0 | Bars authored (`tests/e2e/sign-up.{journey,visual-bar}.e2e.ts`, `playwright.config.ts`, Chromium pinned to the sandbox build); shell untouched | Journey bar RED 6/7 against the 49-line shell — structure, validation, hand-off, keyboard all absent; the shell also overflows horizontally at 375px. A11y floor passes (near-empty page). Visual bar captures both sides bare at 402×874 (canvas: `M_SignUp` mounted standalone — the editor's device bezel and pan/zoom viewport were a blind-pick tell; the artboard `id` never reaches the DOM, slots are `[data-dc-slot]`). Canvas served over http (CORS blocked its state-JSON fetch on `file://`), Tailwind CDN stubbed, app's Inter shared via route stub. Thumbnail eyeballed: real screens both sides. Inter-loaded asserted on both captures; EnvBanner (dev banner) hidden in the rendered capture — dev chrome was a tell | — | Start the loop (gated on go + token cap) |

## Failed approaches

(none yet)

## Escalations

- **Serif token never resolves.** `layout.tsx` loads `Source_Serif_4` via next/font under its own CSS variable, but `--ds-font-serif` / `tokens.font.serif` hardcode `'Source Serif Pro'` — a different family name — so every serif heading in the prototype renders in Georgia (verified with `document.fonts` on `/dev/proto/sign-up`: only `Inter 400` loaded). Design-system fix (tokens.ts + globals.css, parity-tested), outside this loop's edit scope. Serif parity with the canvas holds today only because the canvas also falls back to Georgia in the sandbox.
- **Inter is registered at weight 400 only** (90 `@font-face` rules on `/dev/proto/sign-up`, all `font-weight: 400` unicode-range subsets). Every `fontWeight: 500/600/700` in the prototype is browser-synthesised faux bold. Fix belongs with the serif token fix (next/font `Inter` weights or the variable font in `layout.tsx`), outside this loop's scope. Parity with the canvas capture holds because both sides synthesise from the same 400 face.
- Sans parity for the visual bar: app has self-hosted Inter; the canvas cannot reach Google Fonts from headless Chromium. Capture spec serves the app's Inter to the canvas via a route stub so the blind pick isn't decided by font-family.
- Token drift (SUB · MUTE · LINE · ACCENT · AI-card purples) — raised to the user only if the visual critic's largest gap lands on it. See `acceptance.md` §Drift rule.
- "Pay" stepper label vs free-tier copy on the same screen — logged as an open question, not routed.

## Boundaries remaining

Rounds: 0/6 · Wall-clock: ~60 min · Same-gap-twice: 0/2
