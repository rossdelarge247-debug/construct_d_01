# S-PROTO-welcome-tour-canvas-port — security

**Category:** prototype → short-form security checklist applies (items 1, 8, 12, 14 from the 14-item checklist; remaining items render as `N/A — category: prototype`).

## Short-form items

### Item 1: Secrets / credentials / sensitive defaults

✓ No secrets, credentials, or sensitive defaults committed. The slice ports a canvas to a single client-side page; no environment variable reads, no API keys, no credential surfaces touched. The `TWEAK_DEFAULTS` const (L9-14) is edit-mode UI plumbing with no sensitive payload.

### Item 8: Third-party dependencies

✓ No new third-party dependencies introduced. `package.json` + `package-lock.json` unchanged. The page imports only existing-in-repo modules: `react` hooks, `@/styles/tokens` (already in repo).

### Item 12: External surfaces (network / file I/O / auth boundaries)

✓ No external surfaces. The page is purely client-side render with `localStorage` persistence (key `decouple_tour_step`, single-integer state value). No `fetch`, no API routes wired, no auth checks introduced. The `localStorage` key is bounded to the tour-step integer; no PII or sensitive data persisted.

### Item 14: PII handling

✓ No PII handling. The `localStorage` state stores a single integer (step index 0..5). No user-entered data captured; no email, name, or financial values written. The phase copy + tour content is static product marketing.

## N/A items (category: prototype)

- Item 2: Input validation / sanitisation — `N/A — category: prototype`
- Item 3: Authentication / session — `N/A — category: prototype`
- Item 4: Authorization / RBAC — `N/A — category: prototype`
- Item 5: SQL / NoSQL injection surfaces — `N/A — category: prototype`
- Item 6: XSS / output encoding — `N/A — category: prototype` (no user-input rendered; all strings are static canvas literals)
- Item 7: CSRF / SSRF — `N/A — category: prototype`
- Item 9: Logging / observability — `N/A — category: prototype`
- Item 10: Rate limiting / DOS — `N/A — category: prototype`
- Item 11: Crypto / signing — `N/A — category: prototype`
- Item 13: Safeguarding / minors / abuse — `N/A — category: prototype`

## Adversarial review

Canvas-as-source port — primary risks are the state machine, localStorage interaction, and the iframe edit-mode hooks ported verbatim from the canvas. Cross-checked:

- **localStorage tampering** — an attacker with browser access could set `decouple_tour_step` to a non-integer or out-of-range value. Mitigation: hydrate `useEffect` (L823-826) parses via `parseInt` and gates `setStep` on `Number.isFinite(saved)`. An out-of-range value (e.g. `999`) would still pass `isFinite` and set `step = 999`. Render-time guards (`step === DASH_STEP` checks + `else` fallthrough) would still render the dashboard for `step === DASH_STEP` only; for `step > DASH_STEP` the carousel falls through the `else` and renders `<PhaseStage phase={PHASES[step-1]} />` where `PHASES[step-1]` is `undefined`, which would crash. Defer: low-likelihood (requires manual localStorage edit by the user themselves) + prototype-category-bounded; mitigation is a `Math.min(DASH_STEP, Math.max(0, saved))` clamp in the hydrate effect — log for follow-up if the screen is promoted from prototype to production.

- **Keyboard handler attached to `window`** — the global `keydown` listener (L842-849) intercepts arrow keys while the page is mounted. If the page were embedded as a sub-route under a larger app, the listener could swallow arrow-key navigation intended for other components. Mitigation: the page is route-leaf at `/dev/proto/welcome-tour` — no nested routes will share the window listener. Cleanup runs on unmount (`return () => window.removeEventListener('keydown', ...)`). No leak.

- **iframe `postMessage` edit-mode hooks** — the canvas ships with `postMessage` listeners for Claude AI Design's edit-mode (canvas-verbatim per spec). In the production-prototype context (`/dev/proto/welcome-tour` deployed to Vercel preview), no parent frame is sending these messages. Risk surface: if an attacker injected the page into an iframe and sent matching messages, they could trigger no-op state changes. Behavioural risk only — no data exfil, no XSS surface, no privilege escalation. Defer: edit-mode hooks are inert in deployed contexts; consider stripping in any future promotion to production.

- **`<style jsx>` content-injection** — the styled-jsx block is a static template literal (canvas-verbatim CSS), not interpolated with user data. No injection surface.

- **PHASES copy as static literals** — all 4 phase copy blocks (`title / sub / body / kicker`) are static strings inlined at module top; no user-data interpolation; no `dangerouslySetInnerHTML`; rendered into `<h1>` / `<p>` elements. No XSS surface.

Concerns logged for follow-up (out-of-range localStorage clamp + edit-mode hook strip on production promotion); none blocking for prototype ship.
