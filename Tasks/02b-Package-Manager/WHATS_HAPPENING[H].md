# Phase 02b — Switch to pnpm

Status: **CLOSED. Verifier said PASS.** One commit, zero fix rounds. Nothing is waiting on you.

## What landed

`666142a` — *Switch package manager from npm to pnpm*

1. **The repo runs on pnpm.** One lockfile, `pnpm-lock.yaml`. `package-lock.json` is gone.
2. **No package moved. 388 before, 388 after, zero differences.** `astro` is still 6.1.7. That was the whole risk and it is closed.
3. **Build is green at 8 HTML pages** — the same 8 files the npm build made.
4. **Tool pinned** as `"packageManager": "pnpm@11.20.0"`, which phase 04's CI will read.
5. **Your Q7 answer applied**: one line of `src/content.config.ts` now imports `astro/zod`. Exactly one line under `src/` changed.
6. **Docs converted** — all 10 npm references in `README.md` and `AGENTS.md`, including the backticked one on README line 97.

Full detail in `Results/COMPLETED[H].md`.

## Timeline

- 03:00 — Re-run started. Tree clean at `7420a3d`, `package-lock.json` present, which the import step needs.
- 03:01 — Re-captured the npm dependency set myself: 388 packages, `astro` 6.1.7.
- 03:02 — Checked `DESIGN-GUIDE.md` before dispatching. It mentions npm zero times, so nothing to convert sat outside this phase's scope.
- 03:03 — Executor dispatched.
- 03:07 — Executor returned. One commit, `666142a`, exactly 7 files, nothing under `Tasks/`.
- 03:08 — Ran the gates myself. All green: frozen install exit 0, build exit 0 at 8 pages, lockfile diff zero differences.
- 03:09 — Deleted `node_modules` and `dist` and rebuilt from nothing. Exit 0, 8 pages again.
- 03:10 — Verifier dispatched to judge that evidence.
- 03:13 — **PASS.** It re-derived the 388-vs-388 proof independently from git history and got the same answer.
- 03:15 — Results written. Phase closed.

## Two things for your attention later, neither urgent

1. **`README.md` line 104 documents `pnpm run format`, but `package.json` has no `format` script.** A template defect older than this phase. The word was converted; the missing script was not invented.
2. **`zod` is still not a declared dependency.** The code routes around it through `astro/zod`, which works and adds nothing. Declaring it properly is the real cure whenever you want it.

Both are in `Results/NOT_DONE[H].md`.
