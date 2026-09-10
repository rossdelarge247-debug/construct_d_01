# Parked workflows

These workflows are not run by GitHub Actions: only files directly under `.github/workflows/` are. They were parked at session 127 when the repo entered product mode (see `CLAUDE.md` §"Product mode"), because each one charged a per-PR cost (API tokens for the persona reviews; maintenance for the ratchets and gates) that outweighed its value for a solo builder with no users yet.

To restore one, `git mv` it back into `.github/workflows/`. The scripts and persona files they call are untouched under `scripts/`, `.claude/agents/` and `tests/`.

If branch protection on `main` still lists any of these as a required status check, the check will show as "expected" and never complete; remove it from the required list under Settings → Branches, or merge with the admin bypass.
