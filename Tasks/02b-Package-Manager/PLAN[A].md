# Phase 02b — Switch to pnpm

## Objective

The repo uses pnpm instead of npm. `pnpm-lock.yaml` is committed, `package-lock.json` is gone, `pnpm run build` is green and produces the same pages as the npm build did, and every document that tells a human how to run this project says `pnpm`.

## Scope

`/Users/shev/Development/portfolio-v4/` — `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.gitignore`, `README.md`, `AGENTS.md`, **and line 3 of `src/content.config.ts` only** (scope extension granted by the main session — see ruling 10).

Read-only: `Tasks/`, the rest of `src/`, `public/`, `astro.config.mjs`, `LICENSE`, `.github/` (phase 04 owns the workflow).

## Context

- pnpm 11.20.0 and npm 11.19.1 are both installed. Node is v26.9.0.
- portfolio-v3 also used pnpm, so this matches the developer's existing habit.
- Phase 01 committed `package-lock.json` after npm rewrote it (it dropped an unused `node_modules/typescript` optional-peer entry). That file is deleted here, so that drift stops mattering.
- **`node_modules/typescript` is absent under npm.** pnpm resolves optional peers differently and may install it. Either outcome is fine — nothing in the project runs `tsc`, and there is no typecheck script. Do not add one.
- **sharp's install script was skipped by npm** and the build was green anyway (prebuilt binaries). pnpm blocks build scripts by default too. If the build fails on sharp, see step 5. Do not pre-emptively allow build scripts that nothing needs.
- v3's `pnpm-workspace.yaml` is `allowBuilds: { esbuild: false, sharp: false, workerd: false }`. That is v3's Cloudflare-era setup, not a template to copy. Only create this file if a build failure forces it.
- The template's `package.json` has no `packageManager` field. Adding one pins the tool for CI and corepack, which matters in phase 04.

## Rulings

1. pnpm replaces npm repo-wide, not just in docs. A repo that ships `pnpm-lock.yaml` while its README says `npm install` produces a second, divergent lockfile the first time anyone follows the README. Rejected: switching the lockfile only.
2. `package-lock.json` is deleted, not kept alongside. Two lockfiles is the ambiguity this phase exists to remove. Rejected: keeping it "in case" — it is recoverable from git history at `f471ae7`.
3. Phases 03 and 04 switch their build gate to `pnpm run build`. Their plans are updated by the main session when this phase closes. Constraint that would make this re-break: any later step that runs bare `npm install` regenerates `package-lock.json` and silently reintroduces the split.

4. **A fresh `pnpm install` against a deleted lockfile re-resolves every range and breaks the stop condition.** Root cause: with no lockfile present, pnpm resolves each semver range in `package.json` to the newest satisfying version. `astro` is `^6.1.7` and 6.4.8 is in range (the handoff names it), so plan steps 2→4 as written would install 6.4.8 and silently drift several other packages too. That is exactly the drift this phase must stop on, so running the plan verbatim ends in BLOCKED for no reason.
   Alternatives rejected: (a) run steps 2–4 as written and stop on the drift — wastes the run and produces no lockfile; (b) pin exact versions in `package.json` to force pnpm to match — changes the dependency declarations, which the plan's step 3 forbids.
   Licensed fix: run `pnpm import` **while `package-lock.json` still exists** to generate `pnpm-lock.yaml` from npm's resolved tree, then delete `package-lock.json` and `node_modules`, then install with `pnpm install --frozen-lockfile` so the imported resolutions are proven satisfiable without re-resolution. This replaces the ordering of steps 2 and 4; steps 3 and 5–8 are unchanged. If `--frozen-lockfile` refuses the install, that is a finding to report, not a cue to drop the flag.
   Constraint that would make this re-break: anyone who deletes `pnpm-lock.yaml` and reinstalls gets fresh resolution again. The committed lockfile is the only thing holding the versions.

5. **Equivalence is proved by a lockfile-to-lockfile diff, run by the phase orchestrator, not the executor.** The npm side is the key set of `packages` in `package-lock.json` (388 entries, captured before any change); the pnpm side is the key set of the `packages:` section of `pnpm-lock.yaml`. Both enumerate the full resolved set including platform-optional entries, so they compare like for like. Same name at a different version is a STOP. A name present on only one side is a finding to report; the plan's context licenses `typescript` appearing or not, and nothing else.

10. **ANSWER TO Q7, decided by the main session on 2026-09-22 at 03:00. Take option (a): `import { z } from 'astro/zod';`.**
    Root cause: `src/content.config.ts` line 3 imports `zod`, which `package.json` never declared. npm's flat `node_modules` made it resolvable by accident; pnpm's strict layout does not. This is a pre-existing template bug that pnpm exposed — it is not version drift, and the 388-of-388 equivalence proof stands.
    **Licensed:** phase 02b may edit **line 3 of `src/content.config.ts` and nothing else**, changing it to `import { z } from 'astro/zod';`. That path is a verified export of astro 6.1.7 (`"./zod": "./dist/zod.js"` in its `package.json`) re-exporting the same `zod@4.3.6` already in the lockfile.
    **Alternatives rejected:** (b) declaring `"zod": "^4.3.6"` in `package.json` — it changes the dependency set, which forfeits this phase's central guarantee and its frozen-install proof, to describe a dependency the code should not be reaching for directly anyway. Hoisting workarounds (`publicHoistPattern`, `nodeLinker: hoisted`) — they recreate npm's flat layout so the bug survives and phases 03 and 04 inherit it silently. Switching to `astro:content`'s `z` — plausibly the more idiomatic form, but **unverified**, and `astro/zod` is proven; do not gamble on an unverified import at 3am.
    **Constraint that would make this re-break:** any future code that imports `zod` by bare specifier fails the same way. The real cure is declaring the dependency, and that decision is recorded for the developer in `DEFERRED[H].md`.

11. **`pnpm-workspace.yaml` with `allowBuilds` is mandatory, not conditional.** Root cause: `ERR_PNPM_IGNORED_BUILDS` is a hard exit-1 error in pnpm 11, not the advisory warning that plan step 5 and handoff ruling 7 both assumed. pnpm writes a placeholder stub demanding a decision, and `pnpm run <script>` re-invokes `pnpm install` through `runDepsStatusCheck` and inherits its exit code — so every script fails until the file is filled in. Both earlier assumptions are falsified.
    **Licensed:** commit `pnpm-workspace.yaml` containing `allowBuilds: { esbuild: false, sharp: false }` — an explicit *denial*, matching what npm did in effect and what portfolio-v3 declares. Rejected: `true` for either — that runs install scripts npm never ran, changing behaviour in a phase meant to change only the tool.
    **Constraint:** phase 04's CI runs `pnpm install` too. It fails the same way unless this file is committed. It is, so this is settled — but phase 04 must not delete it.

## Steps

- [x] 1. **Record the baseline before changing anything.** Run and save the output — the verifier compares against it:
      ```
      cd /Users/shev/Development/portfolio-v4
      npm run build 2>&1 | tail -5
      find dist -name '*.html' | wc -l
      ```
      Note the page count. It must not change across the switch.
- [x] 2. **`pnpm import` FIRST, while `package-lock.json` still exists** (ruling 4). This generates `pnpm-lock.yaml` from npm's already-resolved tree instead of re-resolving every range. It regenerates deterministically in about 10 seconds; the previous run produced md5 `f25de839628c5ef1f30bfd6b430b8fe7` and a copy is at `/private/tmp/claude-501/-Users-shev-Development-portfolio-v4/b943f36f-95a2-4570-ac0b-d73145bfbfa8/scratchpad/pnpm-lock.yaml.verified`.
      A bare `pnpm install` here would resolve `astro` `^6.1.7` to 6.4.8 and drift several other packages — the exact failure this phase must not produce.
- [x] 3. Now delete `/Users/shev/Development/portfolio-v4/package-lock.json` and `rm -rf /Users/shev/Development/portfolio-v4/node_modules`.
- [x] 4. Add `"packageManager": "pnpm@11.20.0"` to `package.json`, directly after `"engines"`. Change nothing else in that file. Do not touch `name` — phase 03 owns it.
- [x] 4b. Write `/Users/shev/Development/portfolio-v4/pnpm-workspace.yaml` (ruling 11):
      ```yaml
      allowBuilds:
        esbuild: false
        sharp: false
      ```
      This is required, not conditional. Without it `pnpm install` exits 1 with `ERR_PNPM_IGNORED_BUILDS`, and so does every `pnpm run` script.
- [x] 4c. Fix the undeclared `zod` import (ruling 10). In `src/content.config.ts`, change **line 3 only**:
      `import { z } from 'zod';` → `import { z } from 'astro/zod';`
      Touch nothing else in that file and nothing else under `src/`.
- [x] 5. `cd /Users/shev/Development/portfolio-v4 && pnpm install --frozen-lockfile` — must exit 0. The `--frozen-lockfile` flag is what proves the imported resolutions are satisfiable without re-resolution. **If it refuses the install, that is a finding to report, not a cue to drop the flag.**
- [x] 5b. `cd /Users/shev/Development/portfolio-v4 && pnpm run build` — must exit 0 and produce **8 HTML pages**, the same as the step-1 baseline.
- [x] 6. Confirm `.gitignore` still covers `node_modules/`. pnpm needs no extra ignore entries for this project — there is no local store directory inside the repo.
- [x] 7. Update the commands in `README.md` and `AGENTS.md`: every `npm install` → `pnpm install`, every `npm run <x>` → `pnpm run <x>`.
      **Known straggler both of the plan's original greps missed: `README.md` line 97**, ``All standard build commands run through `npm`:`` — the word is inside backticks, not followed by a space. Convert it.
      **Use this grep, not the original one:** `grep -rnE '(^|[^p])npm' README.md AGENTS.md DESIGN-GUIDE.md`. The naive `grep "npm run"` false-passes *and* false-fails, because `npm run` is a substring of `pnpm run`.
      Leave `.github/workflows/deploy.yml` alone — phase 04 owns it.
- [x] 8. Commit as one unit. Message names both halves — the lockfile swap and the docs — and ends with
      `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`

## Verification

Run from `/Users/shev/Development/portfolio-v4`:

| check | command | expected |
|---|---|---|
| build | `pnpm run build` | exit 0 |
| page count unchanged | `find dist -name '*.html' \| wc -l` | equals the step-1 baseline |
| pnpm lockfile committed | `git ls-files pnpm-lock.yaml` | one line |
| npm lockfile gone | `test ! -e package-lock.json && git ls-files package-lock.json` | file absent, no output |
| packageManager pinned | `grep -c '"packageManager": "pnpm@' package.json` | 1 |
| docs say pnpm | `grep -rnE '(^\|[^p])npm' README.md AGENTS.md DESIGN-GUIDE.md` | no output. **Do not use `grep "npm run"`** — `npm run` is a substring of `pnpm run`, so it both false-passes and false-fails |
| zod import fixed | `grep -n "from 'zod'" src/content.config.ts; grep -c "astro/zod" src/content.config.ts` | no bare-`zod` hit; 1 |
| only that line changed in src | `git diff HEAD --stat -- src/` | exactly `src/content.config.ts \| 2 +-` |
| allowBuilds committed | `git ls-files pnpm-workspace.yaml && grep -c "false" pnpm-workspace.yaml` | one line; 2 |
| no drift | compare the `packages:` key set of `pnpm-lock.yaml` against the 388 `packages` keys of `package-lock.json` at `ac3b592` | identical sets, zero lines of diff; `astro` at 6.1.7 |
| no npm state left | `ls -a \| grep -c "^\.npmrc$"` | 0, unless one was created deliberately and ruled |
| clean tree | `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'` | empty — **use this exact form** |

## Acceptance criteria

- [ ] All verification checks pass.
- [ ] `pnpm install --frozen-lockfile` from a deleted `node_modules` reproduces a green build. Prove it: delete `node_modules` and `dist`, re-run both, confirm exit 0 and 8 pages.
- [ ] Exactly one line under `src/` changed, and it is line 3 of `content.config.ts`.
- [ ] Exactly one lockfile exists in the repo.
- [ ] One commit, tree clean outside `Tasks/`.

## Stop conditions

Do not change any dependency version, add a dependency, or run `pnpm update` / `npm audit fix`. This is a tool swap, not a dependency upgrade — the dependency set must be identical before and after. Do not touch `src/`, `public/`, or `.github/workflows/deploy.yml`. If pnpm resolves a dependency to a version npm did not, stop and report it rather than accepting the drift silently.

## Rulings added during execution (continued)

6. **`pnpm install` under pnpm 11.20.0 exits 1 on ignored build scripts, and that failure propagates into `pnpm run build`.** Root cause: pnpm 11 raises `ERR_PNPM_IGNORED_BUILDS` (esbuild@0.27.7, sharp@0.34.5) as a hard error, not a warning, and scaffolds a placeholder `pnpm-workspace.yaml` demanding an explicit decision. `pnpm run build` re-invokes `pnpm install` via `runDepsStatusCheck` and inherits exit 1, so the build never starts. This contradicts plan step 5, which anticipated only a *missing native binary* failure, and contradicts the handoff's ruling 7, which assumed the message was advisory. Both are now falsified.
   Alternatives rejected: (a) `pnpm approve-builds` / `allowBuilds: true` — runs install scripts npm never ran, which changes what lands on disk and is not a tool swap; (b) leaving the placeholder in place — pnpm keeps failing; (c) `strict-dep-builds=false` — needs an `.npmrc`, which the plan's verification forbids.
   Licensed fix (in scope: `pnpm-workspace.yaml` is scoped to this phase and a build failure forced it): write `allowBuilds: { esbuild: false, sharp: false }` — an explicit **denial**, which is exactly what npm did in effect (it skipped sharp's script and built green) and what portfolio-v3 did. **Verified:** with this file, `pnpm install --frozen-lockfile` exits 0, the lockfile is unchanged, and the install is byte-identical.
   Constraint that would make this re-break: adding any dependency with an install script adds a third key pnpm will refuse until it is decided; `allowBuilds` must then be extended, not switched to `true`.

7. **Dependency equivalence is PROVEN. No drift.** `pnpm import` carried npm's exact resolutions across. The orchestrator ran the authoritative diff: npm `packages` keys (388) vs `pnpm-lock.yaml` `packages:` keys (388), **zero diff lines**. `astro` installed at 6.1.7, not 6.4.8. `node_modules/typescript` is still absent. `.npmrc` was not created. The lockfile is correct and must be kept; regenerating it with a bare `pnpm install` would re-resolve and drift.

8. **BLOCKER — `zod` is a phantom dependency and the fix is outside this phase's scope.** `/Users/shev/Development/portfolio-v4/src/content.config.ts:3` is `import { z } from 'zod'`, but `zod` is not in `package.json`. npm's flat `node_modules` hoisted `zod@4.3.6` (a transitive dep of astro) to the top level and masked this. pnpm's symlinked layout exposes only declared dependencies, so the import fails and `pnpm run build` dies in `astro sync` with `Cannot find module 'zod'`. This is pre-existing latent breakage that pnpm surfaced — **not** drift caused by this phase. `zod` is the only phantom: every other bare specifier in `src/` and `astro.config.mjs` maps to a declared dependency.
   The phase cannot close: `src/` is read-only to this phase, and every in-scope workaround is a semantic decision the developer has not licensed. Written to `Tasks/OPEN_QUESTIONS[H].md`; phase returns BLOCKED.

9. **The plan's own doc-verification greps false-fail on a CORRECT conversion.** Root cause: `npm run` is a substring of `pnpm run`. After step 7 converts the docs, the verification row `grep -rn "npm install\|npm run" README.md AGENTS.md DESIGN-GUIDE.md` matches every converted line, and step 7's straggler grep `grep -rn "npm "` does the same. A correct tree would be failed by its own check.
   Replacement to use instead: `grep -rnE '(^|[^p])npm' README.md AGENTS.md DESIGN-GUIDE.md` — expected output: none.
   Also note **README line 97**, ``All standard build commands run through `npm`:`` — a real straggler that BOTH the original greps miss, because `npm` is followed by a backtick rather than a space. It is in scope and must be converted. The doc half of this phase was never started; no doc edits were made.

12. **The verification row "only that line changed in src" is written against the wrong base and would spuriously FAIL a correct commit.** Root cause: `git diff HEAD --stat -- src/` compares the working tree to `HEAD`. Once the phase's single commit lands, `HEAD` *is* that commit, so the diff is empty and the row's expected `src/content.config.ts | 2 +-` never appears. The row silently only works before the commit exists.
    **Licensed correction (orchestrator, before dispatch):** the check is `git diff 7420a3d HEAD --stat -- src/`, where `7420a3d` is the pre-phase HEAD. Expected output: exactly `src/content.config.ts | 2 +-` and nothing else. The acceptance criterion "exactly one line under `src/` changed" is judged against the same base.
    Alternatives rejected: running the row before committing — it then cannot be re-checked after the fact, and the verifier only ever sees a committed tree (§3 of the protocol forbids verifying a dirty tree).
    Constraint that would make this re-break: if this phase ever produces more than one commit, the base is the phase's first parent, not a hard-coded sha.

13. **Docs inventory, captured at `7420a3d` before any edit — `DESIGN-GUIDE.md` is clean, so the plan's scope holds.** Root cause of the concern: the verification table greps `DESIGN-GUIDE.md`, which is *not* in this phase's scope; a hit there would be an unfixable check. It has zero hits, so no scope defect exists.
    The full inventory (`grep -rniE '(^|[^p])npm|npx|package-lock' README.md AGENTS.md DESIGN-GUIDE.md`, broadened beyond the plan's grep to catch uppercase `NPM`, `npx`, and lockfile prose) is exactly **10 lines**, all in scope:
    `AGENTS.md:4,5,6` (`npm run dev|build|preview`); `README.md:43` (`npm install`), `:48` (`npm run dev`), `:97` (the backticked straggler), `:101,102,103,104` (the command table).
    No `npmjs.com` URL, no `npx` invocation, no `package-lock` prose exists anywhere in the three files — so after conversion the plan's `(^|[^p])npm` grep has no legitimate false positive to tolerate, and its expected output really is empty.
    Constraint that would make this re-break: adding an `npmjs.com` link to any of the three docs later makes the verification grep fail on a correct tree; it would then need an explicit exclusion.

14. **Three pre-existing conditions the pnpm build surfaces. None is a regression, and none is this phase's to fix — recorded so no later phase mistakes them for breakage caused by the tool swap.**
    (a) **`pnpm run build` prints `The collection "posts"/"publications"/"projects"/"talks" does not exist or is empty` and still exits 0.** Cause: phase 02 emptied those four directories; each holds only a `.gitkeep`. The only real content files are `src/content/cv.md` and `src/content/bio.md`. The npm build printed the same warnings. Phase 03 refills three of the four.
    (b) **`README.md:104` documents `pnpm run format`, but `package.json` declares no `format` script.** A template defect that predates this phase; ruling 13's inventory listed the line, so it was converted verbatim rather than fixed. Converting it was correct — deleting or rewriting the row is a docs decision this phase does not own. Candidate for `DEFERRED[H].md`.
    (c) **`pnpm install` reports `Packages: +294` while the lockfile holds 388 entries.** Not a discrepancy: the 94-entry gap is platform-optional packages (linux/windows `@esbuild/*` and `@img/sharp-*`) that darwin-arm64 does not install. npm's lockfile enumerates them too, which is why the like-for-like comparison is lockfile-to-lockfile, never installed-count-to-installed-count.
    Constraint that would make (a) re-break its own diagnosis: once phase 03 adds content, a *remaining* "does not exist or is empty" warning for a refilled collection would be real breakage, not this known noise. Only `talks` is expected to keep warning.

15. **Gate results, run by the orchestrator against the committed tree at `666142a`.** `pnpm install --frozen-lockfile` exit 0; `pnpm run build` exit 0, 8 HTML pages, page *list* identical to the npm baseline file-for-file. `pnpm-lock.yaml` md5 `f25de839628c5ef1f30bfd6b430b8fe7` before install, after install, after build, after a from-scratch reinstall, and after a from-scratch build — five samples, no silent mutation. No-drift diff: 388 npm keys (from `ac3b592:package-lock.json`, md5 `276d52fa6aa1bca4861d2b437d39ba6b`) vs 388 pnpm `packages:` keys, **zero diff lines**; `astro@6.1.7` on both sides; `typescript` on neither side and absent from `node_modules`. Clean-reinstall proof (`rm -rf node_modules dist`, then frozen install + build) exit 0 / exit 0 / 8 pages. Tree clean outside `Tasks/` after every gate.
    Raw logs: `/private/tmp/claude-501/-Users-shev-Development-portfolio-v4/b943f36f-95a2-4570-ac0b-d73145bfbfa8/scratchpad/G-*.log` and `G-*.txt`.

16. **The npm `packages` object has 389 keys, not 388 — the extra one is npm's root `""` self-entry.** Raised by the verifier, which independently re-derived both key sets from git objects and reproduced the zero-diff result. Named packages are 388, which is the number every equivalence claim in this phase refers to.
    Recorded so a later reader who counts raw JSON keys sees 389, does not read it as drift, and does not re-open a settled proof. Any future re-derivation must drop the `""` key before comparing.

17. **VERDICT: PASS.** Verifier checked all 16 cheap rows plus the five captured gates against commit `666142a`, and independently reproduced the central no-drift proof from git objects (388 vs 388, zero lines; its own key sets byte-identical to the orchestrator's). All five acceptance criteria met. No stop condition violated. Zero fix rounds.
