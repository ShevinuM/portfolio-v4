# Phase 03b — Dependencies, Node 24, type checking

## Objective

Every dependency is at the newest version its existing semver range allows, which clears the critical Astro advisory. The project targets Node 24 locally and in CI. `typescript` is installed and a `check` script exists, so the strict tsconfig is finally runnable. Build green, page count unchanged.

## Scope

`/Users/shev/Development/portfolio-v4/` — `package.json`, `pnpm-lock.yaml`, `.nvmrc`, `README.md`, `AGENTS.md`, and **only the `node-version:` line** of `.github/workflows/deploy.yml`.

Read-only: `Tasks/`, `src/`, `public/`, `astro.config.mjs`, `tsconfig.json`, `LICENSE`, and the rest of `.github/`.

## Context

- This phase runs **after** phase 03 (content) and **before** phase 04 (deploy). Phase 04 verifies the workflow; this phase is the only one that changes its Node pin.
- The repo is on pnpm by now (phase 02b). Use `pnpm`, never `npm` — a bare `npm install` regenerates `package-lock.json` and reintroduces a second lockfile.
- Audit state measured on 2026-09-22 against Astro 6.1.7: **13 vulnerabilities — 1 critical, 9 high, 2 moderate, 1 low.** The critical is `astro` itself (9 CVEs: XSS via spread attributes and `transition:*` directives, RCE through AVIF image optimization, host-header SSRF, auth bypass in base-path stripping). Most need SSR or server islands, which this static site does not use, so real exposure is low — but the fix is in-range and therefore free.
- `npm outdated` at the same moment, `current → wanted (latest)`:

  | package | current | wanted | latest |
  |---|---|---|---|
  | astro | 6.1.7 | **6.4.8** | 7.3.3 |
  | katex | 0.16.45 | **0.16.47** | 0.18.7 |
  | tailwindcss | 4.2.2 | **4.3.3** | 4.3.3 |
  | @tailwindcss/vite | 4.2.2 | **4.3.3** | 4.3.3 |
  | @astrojs/rss | 4.0.18 | **4.0.19** | 4.0.19 |
  | @astrojs/sitemap | 3.7.2 | **3.7.4** | 3.7.4 |
  | @fontsource/inter | 5.2.8 | **5.3.0** | 5.3.0 |
  | @fontsource-variable/inter | 5.2.8 | **5.3.0** | 5.3.0 |
  | @fontsource/jetbrains-mono | 5.2.8 | **5.3.0** | 5.3.0 |

- `tsconfig.json` extends `astro/tsconfigs/strict` but nothing enforces it: there is no `check` script and `typescript` is not installed (phase 01 recorded npm dropping it as an unused optional peer).
- Local Node is **v26.9.0**. The workflow pins **22**. The developer wants **24**.
- `@fontsource-variable/inter` is installed but imported **zero** times — `BaseLayout.astro` imports five static weights from `@fontsource/inter` instead. It is still updated here rather than removed; removal was offered and not chosen.

## Rulings

1. **In-range updates only. The two majors are deferred, not done.** `astro` 6→7 and `katex` 0.16→0.18 are breaking-change migrations. Doing one unattended, overnight, on a site whose content landed hours earlier would make any breakage impossible to attribute — and the critical advisory is already cleared by the in-range 6.4.8. Rejected: `pnpm update --latest`. Record both majors in `DEFERRED[H].md` as explicit decisions for the developer. Constraint that would make this re-break: raising a range in `package.json` turns a later routine `pnpm update` into a silent major bump.
2. **Node 24 is a floor, not an exact pin.** `engines.node` becomes `">=24"`; `.nvmrc` and the CI workflow say `24`. Rejected: `"node": "24.x"` in engines — the developer's machine runs 26.9.0 and that would fail its own engine check on every install.
3. **`astro check` is added as a script but is NOT added to CI, and source is NOT edited to satisfy it.** Root cause: the strict tsconfig has never been enforced, so the error count is unknown until it is first run. Licensed: install `typescript`, add the script, run it once, record the result. If it reports errors, list them in `Results/NOT_DONE[H].md` and leave the source alone — rewriting `src/` to satisfy a checker nobody has run before is a different task with its own risk, and this phase's scope is read-only over `src/`. Rejected: gating the build on `astro check` — a red check would block phases the developer is asleep for.

## Steps

- [ ] 1. **Record the baseline first.** Save the output; the verifier compares against it:
      ```
      cd /Users/shev/Development/portfolio-v4
      pnpm run build 2>&1 | tail -3
      find dist -name '*.html' | wc -l
      ```
- [ ] 2. Update every dependency inside its existing range: `pnpm update`. Do **not** pass `--latest`. Do not hand-edit any version range in `package.json`.
- [ ] 3. Confirm the result matches the "wanted" column in the Context table — `pnpm outdated` afterwards should list **only** `astro` (6.4.8 → 7.3.3) and `katex` (0.16.47 → 0.18.7). If any other package is still behind, stop and report it.
- [ ] 4. Confirm the critical advisory is gone: `pnpm audit` — the `astro` critical entry must be absent. Record the new total. Do **not** run `pnpm audit --fix`; anything left needs a major bump and belongs to the deferred decision.
- [ ] 5. Add `typescript` as a dev dependency: `pnpm add -D typescript`. Add `"check": "astro check"` to `package.json` scripts, after `"build"`.
- [ ] 6. Run `pnpm run check` once. Record the exact output — error count and the first few messages — in `PLAN[A].md` as a ruling. **Do not edit any file under `src/` to fix what it reports** (ruling 3).
- [ ] 7. Node 24:
      - `package.json`: `engines.node` → `">=24"`
      - create `/Users/shev/Development/portfolio-v4/.nvmrc` containing `24`
      - `.github/workflows/deploy.yml`: change `node-version: 22` → `node-version: 24`. **Change nothing else in that file** — phase 04 owns the rest, including whether the action installs with pnpm.
- [ ] 8. `pnpm install` (to re-resolve against the new engines floor), then `pnpm run build` — must exit 0 with the same HTML page count as step 1.
- [ ] 9. Update `README.md` and `AGENTS.md`: the Node requirement becomes 24, and document the new `pnpm run check` script alongside `dev` / `build` / `preview`.
- [ ] 10. Commit in two reviewable units: (a) in-range dependency updates + lockfile, (b) Node 24 pin + typescript + check script + docs. Each ends with
      `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`

## Verification

Run from `/Users/shev/Development/portfolio-v4`:

| check | command | expected |
|---|---|---|
| build | `pnpm run build` | exit 0 |
| page count unchanged | `find dist -name '*.html' \| wc -l` | equals the step-1 baseline |
| astro updated | `node -p "require('./node_modules/astro/package.json').version"` | `6.4.8` or newer 6.x |
| critical gone | `pnpm audit 2>&1 \| grep -ci critical` | 0 |
| only majors remain | `pnpm outdated` | lists only `astro` and `katex`, nothing else |
| ranges untouched | `git diff HEAD~2 -- package.json \| grep '^[-+].*"\^'` | no range string changed — only `engines`, `scripts` and the new `typescript` devDependency differ |
| node floor | `node -p "require('./package.json').engines.node"` | `>=24` |
| nvmrc | `cat .nvmrc` | `24` |
| CI node pin | `grep -c "node-version: 24" .github/workflows/deploy.yml` | 1 |
| workflow otherwise untouched | `git diff HEAD~1 -- .github/workflows/deploy.yml \| grep -c '^[-+]'` | exactly 2 changed lines (the `-`/`+` of node-version), plus the diff header |
| check script exists | `node -p "require('./package.json').scripts.check"` | `astro check` |
| typescript installed | `test -d node_modules/typescript` | pass |
| docs updated | `grep -c "24" README.md; grep -c "pnpm run check\|pnpm check" README.md AGENTS.md` | Node 24 named; check script documented |
| one lockfile | `test ! -e package-lock.json && git ls-files pnpm-lock.yaml` | absent; one line |
| clean tree | `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'` | empty — **use this exact form** |

## Acceptance criteria

- [ ] All verification checks pass.
- [ ] The critical Astro advisory no longer appears in `pnpm audit`.
- [ ] No semver range in `package.json` was widened, and no major version was adopted.
- [ ] `pnpm run check` has been run once and its result is recorded, whether it passed or failed.
- [ ] Nothing under `src/` changed. Prove it: `git diff HEAD~2 --name-only | grep -c '^src/'` → 0.
- [ ] Two commits, tree clean outside `Tasks/`.

## Stop conditions

Do not adopt Astro 7 or KaTeX 0.18. Do not run `pnpm update --latest` or `pnpm audit --fix`. Do not edit anything under `src/`, including to satisfy `astro check`. Do not remove any dependency — the `@fontsource-variable/inter` removal was offered to the developer and not chosen. Do not touch `.github/workflows/deploy.yml` beyond its `node-version:` line. If the build breaks after the update, identify which package caused it, report it, and do not start pinning versions to work around it.
