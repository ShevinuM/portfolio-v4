# Phase 02b — Completed

**Verifier verdict: PASS.** One commit. Zero fix rounds. Nothing is waiting on you.

## The commit

`666142a` — *Switch package manager from npm to pnpm*

It changed 7 files: `package-lock.json` (deleted), `pnpm-lock.yaml` (new), `pnpm-workspace.yaml` (new), `package.json`, `README.md`, `AGENTS.md`, and one line of `src/content.config.ts`.

## What landed

1. **The repo runs on pnpm.** `pnpm-lock.yaml` is committed. `package-lock.json` is gone from disk and from git. Exactly one lockfile exists.
2. **No package moved. 388 before, 388 after, zero differences.** This was the whole risk of the phase. `astro` is still 6.1.7 — a plain `pnpm install` would have pushed it to 6.4.8. The trick was running `pnpm import` *before* deleting npm's lockfile, so npm's own resolutions carried straight over.
3. **The build is green and unchanged.** `pnpm run build` exits 0 and makes the same **8 HTML pages**, file for file, that the npm build made.
4. **The tool is pinned.** `package.json` now says `"packageManager": "pnpm@11.20.0"`. This is what CI and corepack read in phase 04.
5. **`pnpm-workspace.yaml` denies build scripts for `esbuild` and `sharp`.** pnpm 11 refuses to install until you decide this, and the refusal spreads into every `pnpm run` script. The denial matches what npm did in practice.
6. **A hidden bug is fixed.** `src/content.config.ts` imported `zod` without declaring it. npm hid this; pnpm exposed it. It now imports `astro/zod` — your answer to Q7. One line.
7. **The docs say pnpm.** All 10 npm references in `README.md` and `AGENTS.md` converted, including the backticked one on README line 97 that a naive search misses. `DESIGN-GUIDE.md` never mentioned npm.

## How it was checked

I ran the slow gates myself; the verifier judged them and re-derived the important one from scratch.

| gate | result |
|---|---|
| `pnpm install --frozen-lockfile` | exit 0 |
| `pnpm run build` | exit 0 |
| HTML pages | 8 — identical file list to the npm baseline |
| lockfile diff, npm vs pnpm | 388 vs 388, **zero differences**, `astro` at 6.1.7 |
| delete `node_modules` + `dist`, install and build from nothing | exit 0, exit 0, 8 pages |
| lockfile fingerprint, sampled 5 times | never changed |
| lines changed under `src/` | exactly 1 — line 3 of `content.config.ts` |
| tree clean outside `Tasks/` | yes |

The verifier rebuilt the 388-vs-388 comparison independently from git history and got byte-identical answers.

## Two things you may want to look at later

1. **`README.md` line 104 documents `pnpm run format`, but `package.json` has no `format` script.** A template defect that predates this phase. The line was converted as-is, not fixed — rewriting docs content is not this phase's job.
2. **The build prints "collection does not exist or is empty" for `posts`, `publications`, `projects` and `talks`, and still exits 0.** Not new. Phase 02 emptied those folders. Phase 03 refills three of them; `talks` stays empty on purpose, so that one warning is permanent.
