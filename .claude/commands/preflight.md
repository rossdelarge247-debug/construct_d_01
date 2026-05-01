---
description: Run preflight multi-agent review on current branch.
allowed-tools: Bash(scripts/preflight-review.sh:*)
---

!scripts/preflight-review.sh

Based on the verdict + findings above:

- `approve` or `nit-only`: ready to push.
- `request-changes`: address the findings, or accept as informational (doesn't gate the merge button).
- `block` or `parse-failed`: must address before merge — these gate the merge button at PR time.
