# Phase 03b — Dependencies, Node 24, type checking

Status: PLANNED. Blocked on Phase 03.

Added mid-run at your request.

Next, in order:
1. Update all 9 outdated packages inside their existing ranges. This clears the critical Astro advisory (6.1.7 → 6.4.8).
2. Pin Node 24 — `engines`, a new `.nvmrc`, and the CI workflow.
3. Install `typescript` and add a `pnpm run check` script, so the strict tsconfig is finally runnable.

Astro 7 and KaTeX 0.18 are **not** done here. Both are major-version migrations and they go to `DEFERRED[H].md` as decisions for you.
