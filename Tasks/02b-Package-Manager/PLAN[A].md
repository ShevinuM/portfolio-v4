# Phase 02b — Switch to pnpm

## Objective

The repo uses pnpm instead of npm. `pnpm-lock.yaml` is committed, `package-lock.json` is gone, `pnpm run build` is green and produces the same pages as the npm build did, and every document that tells a human how to run this project says `pnpm`.

## Scope

`/Users/shev/Development/portfolio-v4/` — `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` (only if step 5 needs it), `.gitignore`, `README.md`, `AGENTS.md`.

Read-only: `Tasks/`, `src/`, `public/`, `astro.config.mjs`, `LICENSE`, `.github/` (phase 04 owns the workflow).

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
2. `package-lock.json` is deleted, not kept alongside. Two lockfiles is the ambiguity this phase exists to remove. Rejected: keeping it "in case" — it is recoverable from git history at `78eedda`.
3. Phases 03 and 04 switch their build gate to `pnpm run build`. Their plans are updated by the main session when this phase closes. Constraint that would make this re-break: any later step that runs bare `npm install` regenerates `package-lock.json` and silently reintroduces the split.

## Steps

- [ ] 1. **Record the baseline before changing anything.** Run and save the output — the verifier compares against it:
      ```
      cd /Users/shev/Development/portfolio-v4
      npm run build 2>&1 | tail -5
      find dist -name '*.html' | wc -l
      ```
      Note the page count. It must not change across the switch.
- [ ] 2. Delete `/Users/shev/Development/portfolio-v4/package-lock.json` and `rm -rf /Users/shev/Development/portfolio-v4/node_modules`. A stale npm-shaped `node_modules` next to a pnpm lockfile produces confusing half-states.
- [ ] 3. Add `"packageManager": "pnpm@11.20.0"` to `package.json`, directly after `"engines"`. Change nothing else in that file except the `name` field if phase 03 has not already set it — if unsure, leave `name` alone; phase 03 owns it.
- [ ] 4. `cd /Users/shev/Development/portfolio-v4 && pnpm install` — must exit 0 and create `pnpm-lock.yaml`.
- [ ] 5. `cd /Users/shev/Development/portfolio-v4 && pnpm run build` — must exit 0 and produce the same HTML page count as step 1.
      **If and only if the build fails on a missing native binary** (sharp, esbuild), create `pnpm-workspace.yaml` with an `allowBuilds:` entry set to `true` for exactly the failing package, re-run `pnpm install` and `pnpm run build`, and record it as a ruling. Do not allow builds for packages that did not fail.
- [ ] 6. Confirm `.gitignore` still covers `node_modules/`. pnpm needs no extra ignore entries for this project — there is no local store directory inside the repo.
- [ ] 7. Update the commands in `README.md` and `AGENTS.md`: every `npm install` → `pnpm install`, every `npm run <x>` → `pnpm run <x>`. Grep for stragglers: `grep -rn "npm " README.md AGENTS.md DESIGN-GUIDE.md`. Leave `.github/workflows/deploy.yml` alone — phase 04 owns it.
- [ ] 8. Commit as one unit. Message names both halves — the lockfile swap and the docs — and ends with
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
| docs say pnpm | `grep -rn "npm install\|npm run" README.md AGENTS.md DESIGN-GUIDE.md` | no output |
| no npm state left | `ls -a \| grep -c "^\.npmrc$"` | 0, unless one was created deliberately and ruled |
| clean tree | `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'` | empty — **use this exact form** |

## Acceptance criteria

- [ ] All verification checks pass.
- [ ] `pnpm install` from a deleted `node_modules` reproduces a green build. Prove it: delete `node_modules` and `dist`, re-run both, confirm exit 0 and the same page count.
- [ ] Exactly one lockfile exists in the repo.
- [ ] One commit, tree clean outside `Tasks/`.

## Stop conditions

Do not change any dependency version, add a dependency, or run `pnpm update` / `npm audit fix`. This is a tool swap, not a dependency upgrade — the dependency set must be identical before and after. Do not touch `src/`, `public/`, or `.github/workflows/deploy.yml`. If pnpm resolves a dependency to a version npm did not, stop and report it rather than accepting the drift silently.
