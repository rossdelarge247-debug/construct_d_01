#!/usr/bin/env bash
# lockfile-divergence-check.sh — detect version drift between
# package-lock.json and pnpm-lock.yaml for packages present in both.
# Companion to CLAUDE.md §"Negative constraints" item #20 ("Dual-
# lockfile divergence guard"): catch transitive divergence at PR
# time before it accumulates as recurring friction.
#
# Args:
#   $1 — repo root (defaults to .)
# Exit:
#   0 — no divergence (or no shared packages)
#   1 — divergence found
#   2 — usage / lockfile missing

set -euo pipefail

ROOT="${1:-.}"
cd "$ROOT" || exit 2

[[ -f package-lock.json ]] || { echo "::error::package-lock.json missing in $PWD" >&2; exit 2; }
[[ -f pnpm-lock.yaml    ]] || { echo "::error::pnpm-lock.yaml missing in $PWD"    >&2; exit 2; }

python3 - <<'PYEOF'
import json, sys, yaml
from collections import defaultdict

with open('package-lock.json') as f:
    npm_data = json.load(f)
with open('pnpm-lock.yaml') as f:
    pnpm_data = yaml.safe_load(f) or {}

npm = defaultdict(set)
for key, val in (npm_data.get('packages') or {}).items():
    if not key.startswith('node_modules/'):
        continue
    name = key[len('node_modules/'):]
    v = (val or {}).get('version')
    if v:
        npm[name].add(v)

pnpm = defaultdict(set)
for section in ('packages', 'snapshots'):
    for key in (pnpm_data.get(section) or {}).keys():
        k = key.lstrip('/')
        paren = k.find('(')
        if paren != -1:
            k = k[:paren]
        idx = k.rfind('@')
        if idx <= 0:
            continue
        name, version = k[:idx], k[idx + 1:]
        pnpm[name].add(version)

shared = npm.keys() & pnpm.keys()
drift = []
for name in sorted(shared):
    if not (npm[name] & pnpm[name]):
        drift.append((name, sorted(npm[name]), sorted(pnpm[name])))

if drift:
    print('::error::Lockfile divergence detected for shared packages:', file=sys.stderr)
    for name, n, p in drift:
        print(f'  {name}: npm={",".join(n)} pnpm={",".join(p)}', file=sys.stderr)
    print('', file=sys.stderr)
    print('Resolve by aligning versions across both lockfiles:', file=sys.stderr)
    print('  1. Pin to a single version in package.json (or update the offending dep)', file=sys.stderr)
    print('  2. Run: npm install && pnpm install', file=sys.stderr)
    print('  3. Commit both lockfiles', file=sys.stderr)
    sys.exit(1)

print(f'OK: no lockfile divergence (compared {len(shared)} shared packages)')
PYEOF
