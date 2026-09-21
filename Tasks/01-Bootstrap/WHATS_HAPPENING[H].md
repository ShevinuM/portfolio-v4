# Phase 01 — Bootstrap

Status: CLOSED. Verifier returned PASS.

`portfolio-v4` is a working Astro site, its own git repository, with one baseline commit:

```
04b3c6e  Import academic-portfolio-astro @ 6f296c2
```

124 files, on branch `main`, no git remote, no history inherited from the template author.

## What passed

1. `npm install` — exit 0, 294 packages.
2. `npm run build` — exit 0, 56 pages, `dist/index.html` present.
3. `git log` — exactly 1 commit. `git remote -v` — empty.
4. `Tasks/` — all 15 files committed, bracket filenames intact.
5. The tracked file list matches the template exactly (109 files each). Nothing was dropped.

I ran the install and build twice — once normally, then again after deleting `node_modules`, `dist` and `.astro` — so this is proven to build from a clean clone. Total phase time: about 6 minutes.

## Three things waiting for a later phase

1. **`typescript` is not installed.** `npm install` dropped it as an unused optional dependency. Nothing needs it today. Run `npm i -D typescript` when you first want `tsc` or `astro check`.
2. **`sharp`, the image optimizer, had its install script skipped.** All 56 pages built anyway. If images break in phase 03, run `npm install-scripts approve sharp`.
3. **13 npm vulnerabilities** in the untouched template (1 critical, 9 high). Not fixed — this phase was not allowed to edit the template. Look at these in phase 04, before pushing anywhere public.

## One thing to know about the tree

Everything outside `Tasks/` is committed and clean. The phase close-out files inside `Tasks/` are not committed, because committing them would break the "exactly one commit" rule this phase was just checked against. A dirty `Tasks/` is expected here and is not a problem. Deciding when those files get committed is the main session's call, not this phase's.

Full detail: `Results/COMPLETED[H].md`, `Results/NOT_DONE[H].md`, `Results/DEVIATIONS[H].md`.

Nothing is blocked. Nothing needs a decision from you.
