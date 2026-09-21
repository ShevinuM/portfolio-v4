# Phase 02b — Switch to pnpm

Status: **BLOCKED. Needs one answer from you.** No commit was made. The repo is back at `b34a577`, clean.

## The question — `Tasks/OPEN_QUESTIONS[H].md`, Q7

`src/content.config.ts` line 3 imports `zod`, but `zod` is not in `package.json`. npm hid this because it puts everything in one flat folder. pnpm only exposes what you declared, so the import fails and the build stops.

Pick one:
- **(a) Recommended.** Change that one line to `import { z } from 'astro/zod';`. No dependency added. I verified `astro/zod` gives the same `zod@4.3.6` the code already uses. It needs your OK because `src/` is outside this phase.
- **(b)** Add `"zod": "^4.3.6"` to `package.json`. Honest, but it contradicts this phase's "add no dependency" rule.

Full detail and the rejected options are in `Tasks/OPEN_QUESTIONS[H].md`.

## What is already proven — none of this needs redoing

1. **No version drift. 388 packages, zero differences.** This was the main risk. `pnpm import` copies npm's exact resolutions, so `astro` stays at 6.1.7 and nothing moved. I ran the lockfile-to-lockfile diff myself.
2. **`pnpm install --frozen-lockfile` exits 0.** pnpm 11 refuses to install until you decide about build scripts. Writing `allowBuilds: {esbuild: false, sharp: false}` into `pnpm-workspace.yaml` settles it. That is a denial — the same thing npm did in practice, and the same thing portfolio-v3 does.
3. **`packageManager: "pnpm@11.20.0"`** slots into `package.json` as a single added line.

Only the build gate and the README/AGENTS.md wording are left.

## Timeline

- 02:41 — baseline captured. `npm run build` green, **8 HTML pages**.
- 02:45 — added ruling 4 to the plan, then dispatched the executor. The plan's original order would have let pnpm pick newer versions. `pnpm import` prevents that.
- 02:51 — executor returned BLOCKED, no commit, after finding the `zod` problem.
- 02:56 — I confirmed every finding myself, fixed the build-script blocker, and proved `zod` is the only thing left.
- 02:58 — reverted the tree and wrote the question. Rulings 4 to 9 are in `PLAN[A].md`.

## One thing to know about the repo right now

Tracked files are untouched. But `node_modules/` is pnpm-shaped and `dist/` is gone, so **`npm run build` will not work until someone reinstalls.** Both folders are gitignored, so nothing is lost. The next run on this repo is pnpm-based anyway.
