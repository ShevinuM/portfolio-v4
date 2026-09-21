# Phase 02b — Deviations from the plan

The steps ran exactly as written. The plan itself was corrected twice before dispatch, and both corrections are recorded as rulings.

## 1. Two verification rows in the plan were wrong and were fixed before the executor ran

**Ruling 12 — the `src/` diff row checked against the wrong point in history.** The plan said `git diff HEAD --stat -- src/`. Once the phase commits, `HEAD` *is* that commit, so the diff is empty and the check would have failed a correct tree. Corrected to `git diff 6d8a8bc HEAD --stat -- src/`, where `6d8a8bc` is the commit before the phase. It returned exactly `src/content.config.ts | 2 +-`.

**Ruling 13 — the plan's docs grep could have pointed outside this phase's scope.** The check greps `DESIGN-GUIDE.md`, which this phase is not allowed to edit. A hit there would have been unfixable. I checked before dispatching: `DESIGN-GUIDE.md` mentions npm zero times, so no problem existed. The full list of 10 lines to convert, all in `README.md` and `AGENTS.md`, was captured up front and handed to the executor rather than left to a search.

## 2. Everything else matched

- Steps 2 to 8 ran in the plan's order, with the plan's commands.
- `pnpm import` produced a lockfile with the exact fingerprint the plan predicted, first try.
- `.gitignore` needed no change — it already covered `node_modules/`.
- No `.npmrc` was created.
- One commit, as planned. No fix round was needed.

## 3. Three findings that look like problems and are not

Recorded as ruling 14 so no later phase mistakes them for damage done here.

- The build's "collection does not exist or is empty" warnings for the four content folders. Pre-existing; the npm build printed the same; exit code is still 0.
- `README.md` line 104 documenting a `pnpm run format` script that `package.json` never declared. A template defect that predates this phase.
- `pnpm install` reporting `Packages: +294` against 388 lockfile entries. The 94-package gap is Linux and Windows builds of `esbuild`, `sharp`, `rollup` and `tailwindcss` that a Mac does not install. npm's lockfile lists them too, which is why the comparison is lockfile against lockfile.

One more, from the verifier (ruling 16): npm's lockfile has **389** raw keys, not 388. The extra one is npm's entry for the project itself. Named packages are 388. If you ever recount, drop that entry first.
