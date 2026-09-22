# Phase 03b — Dependencies, Node 24, type checking

Status: PLANNED. Blocked on Phase 03.

Added mid-run at your request.

Next, in order:
1. Update all 9 outdated packages inside their existing ranges. This clears the critical Astro advisory (6.1.7 → 6.4.8).
2. Pin Node 24 — `engines`, a new `.nvmrc`, and the CI workflow.
3. Install `typescript` and add a `pnpm run check` script, so the strict tsconfig is finally runnable.

Astro 7 and KaTeX 0.18 are **not** done here. Both are major-version migrations and they go to `DEFERRED[H].md` as decisions for you.

---

## Live log — run started 2026-09-22 04:12

**04:12 — Phase started. Baseline recorded.** `pnpm run build` exits 0 and builds 26 pages. The only collection warning is `talks`, which is empty by design. Astro is at 6.1.7. `pnpm audit` finds 34 advisories: 1 critical, 18 high, 12 moderate, 3 low.

**04:15 — One finding you should see first: the critical advisory cannot be fixed by this phase.** The critical is an Astro remote-code-execution bug in AVIF image optimization, and it is patched only in Astro **7.2.8**. This phase is limited to Astro 6.4.8. Written up as **Q8 in `Tasks/OPEN_QUESTIONS[H].md`** with both options and my read. It does not block anything else, and it does not block deploying.

**Next: the rest of phase 03b runs as planned.** The in-range update still clears 5 other advisories, including 2 high-severity Astro bugs. Then Node 24, the type checker, and the docs.

**04:20 — Executor dispatched for commit 1 of 2: the in-range dependency updates.** It runs `pnpm update --no-save` so only the lockfile changes and no version range in `package.json` moves. Next: I run the build gate myself, then the verifier checks the result.

**04:23 — Commit 1 of 2 landed: `a8ced33`.** All nine packages are at the newest version their range allows. Only `pnpm-lock.yaml` changed — no version range in `package.json` moved. Astro is 6.4.8, katex 0.16.47, tailwind 4.3.3.

**Security: 34 advisories down to 14.** High severity dropped from 18 to 7, moderate from 12 to 4. The 1 critical remains, for the reason in Q8. The build still exits 0 with 26 pages and only the expected `talks` warning.

**04:25 — Verifier dispatched on commit 1.** Next: executor for commit 2 — Node 24, the type checker and the docs.

**04:29 — Verdict on commit 1: FAIL on one row, PASS on the other nine.** The failing row is "critical gone", for the reason in Q8: no Astro 6 release fixes that advisory. The verifier confirmed it is a real failure of the written criterion, not a checking artifact. I am not fixing it — the only fix is Astro 7, which is your decision.

Everything else passed: build exit 0, 26 pages, `talks`-only warnings, astro 6.4.8 and not 7.x, `astro/zod` still resolves, no range widened, nothing under `src/` touched, one lockfile, clean tree.

**No fix round is opened.** This is not something phase 03b is allowed to repair.

**04:30 — Executor dispatched for commit 2 of 2:** Node 24, `typescript` + `@astrojs/check`, the `pnpm run check` script, and the README/AGENTS updates.

**04:36 — Commit 2 of 2 landed: `e8ad7fd`.** Node 24 is set in three places: `engines.node` is `">=24"`, a new `.nvmrc` says `24`, and the deploy workflow says `24`. Exactly one line of the workflow changed — phase 04 still owns the rest of it. `README.md` and `AGENTS.md` now say Node 24 and document the new script.

**The type checker now runs, and it reports 13 errors.** `pnpm run check` works and exits 1. All 13 errors and 8 hints are pre-existing defects in the template's `src/`, in 7 files. **Nothing was fixed and nothing under `src/` was touched** — that was the plan's rule, and fixing them is a separate job. The check is deliberately not wired into CI, so it cannot block a deploy.

**One thing worth knowing: the type checker does NOT catch your 1-pixel avatar bug.** A malformed attribute in template markup is not a type error. That one-line fix is still worth doing by hand before you deploy.

**Build is still green: exit 0, 26 pages, `talks`-only warning.** Same as before the phase started.

**04:40 — Verifier dispatched on the whole phase.** Next: the verdict, then the three result files.

**04:45 — Verdict in: 16 checks PASS, 1 FAIL. Phase returns BLOCKED on that one.**

The failing check is the critical Astro advisory. The verifier called it "a plan-premise defect ... not a work-quality defect" and judged the phase "**sound, proceed**" for phase 04. **It needs your decision, not more work — see Q8 in `Tasks/OPEN_QUESTIONS[H].md`.**

**What landed: 2 commits.** `a8ced33` (9 dependencies updated in range, 34 security advisories down to 14) and `e8ad7fd` (Node 24 in three places, `typescript` + `pnpm run check`, docs).

**Build is green: exit 0, 26 pages, `talks`-only warning.** Unchanged from before the phase.

**Results written:** `Results/COMPLETED[H].md`, `Results/NOT_DONE[H].md`, `Results/DEVIATIONS[H].md`.

**Work complete. Phase status: BLOCKED on Q8** — the main session decides whether that acceptance criterion is amended. Nothing here blocks phase 04 or deploying.

## What needs you, in order

1. **Read Q8** in `Tasks/OPEN_QUESTIONS[H].md`. Two options, ~2 minutes to decide. Not urgent.
2. **Fix the 1-pixel avatar.** One line in `src/components/layout/LeftSidebar.astro:18` — the `/* ... */` comment sitting inside the `width={160}` attribute. (The handoff said line 19; it is line 18.) Visible on every page. The type checker does not catch it. **Worth doing before you deploy.**
3. **Optional:** look at the 13 type errors in `Results/NOT_DONE[H].md`. None break the build.
