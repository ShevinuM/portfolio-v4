# Phase 01 — Bootstrap: DEVIATIONS

Three deviations. None changed what the phase delivered. All eight steps ran as written.

## 1. `package-lock.json` is not byte-identical to the template

**Plan said:** copy the template, change nothing, commit it.
**We did:** committed a `package-lock.json` that is 15 lines shorter than the template's.
**Why:** `npm install` (step 6, which the plan requires) rewrote it. npm 11.19.1 dropped the `node_modules/typescript` entry — version 5.9.3, marked `optional: true, peer: true` — because nothing in the dependency tree actually needs it. Step 8 then committed it via `git add -A`, which the plan also requires. No human edited the file.

**Cost:** `node_modules/typescript` is now absent. The build does not need it and all 56 pages build. But `tsc` and `astro check` will not run in phases 02 to 04 until someone runs `npm i -D typescript`.

**Why we did not revert it:** restoring the template lockfile would make every future `npm install` dirty the tree again, forever. Pinning typescript in `package.json` would be a config edit, which this phase's stop condition forbids. I re-ran `npm install` from a clean slate to check it does not drift further — it does not. The lockfile is stable now.

This is recorded as ruling 6 in `PLAN[A].md`. The verifier reviewed it and judged that it breaks no acceptance criterion.

## 2. The "`git status --short` is empty" check excludes `Tasks/`

**Plan said:** `git status --short` must be empty.
**We did:** checked `git status --short -- . ':(exclude)Tasks'` instead.
**Why:** the phase commits `Tasks/` with the repo, but I am required to update `WHATS_HAPPENING[H].md` at every state transition — and two of those transitions happen after the commit. So the plan as written could never pass its own check. `Tasks/` is also explicitly outside this phase's declared scope.

I spotted this before dispatching the executor and wrote it down as ruling 3, rather than letting it surface as a false failure. The verifier ran both commands and confirmed the only dirty file was the status file itself, containing only status prose.

## 3. The install and build were run twice

**Plan said:** run `npm install` and `npm run build` once each.
**We did:** ran them again after deleting `node_modules`, `dist` and `.astro`.
**Why:** the first run was the executor's, over a directory it had just populated. A from-clean repeat proves the repo builds for someone who has only cloned it, and it is how I confirmed the lockfile had stopped drifting. Both runs exited 0. This cost about 5 seconds.
