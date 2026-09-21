# Handoff into Phase 03b

Stub. Rewritten for real when Phase 03 closes.

Added mid-run at the developer's request, after an audit of the template's dependencies.

## Inherited from earlier phases

- `/Users/shev/Development/portfolio-v4` is a git repo on `main`, no remote. Everything outside `Tasks/` is committed and clean.
- **Check the tree with `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'`.** A bare `git status --short` always shows `Tasks/` churn the protocol itself requires, and reads as a false failure.
- **The repo is on pnpm** (phase 02b). `package-lock.json` is deleted and `"packageManager": "pnpm@11.20.0"` is pinned. Never run bare `npm install` — it recreates the npm lockfile.
- `typescript` is absent. Phase 01 recorded npm dropping it as an unused optional peer. **This phase installs it deliberately** — that is step 5, not an accident to undo.
- sharp's install script was skipped under npm and the build was green anyway. Watch whether the dependency update or pnpm changes that.

## What phase 03 is expected to settle first

- The final content set and page count. This phase's step 1 captures that count itself, but the count must not change across the dependency update.
- `astro.config.mjs` final state — `site: 'https://shevinum.dev'`, no `base`. This phase does not touch it.
- That `pnpm run build` is green on the finished site.

## Decisions already made, do not relitigate

- **In-range updates only.** Astro 7 and KaTeX 0.18 are deferred to the developer as separate decisions. See ruling 1.
- **KaTeX stays.** Removing it was offered and not chosen, even though no remaining content uses math and it imports 4.4 MB plus a global stylesheet on every page.
- **`@fontsource-variable/inter` stays**, despite being imported zero times. Removal was offered and not chosen.
- **`astro check` is added but not enforced.** See ruling 3. Do not edit `src/` to satisfy it.
