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

- [x] 1. **Record the baseline first.** Save the output; the verifier compares against it:
      ```
      cd /Users/shev/Development/portfolio-v4
      pnpm run build 2>&1 | tail -3
      find dist -name '*.html' | wc -l
      ```
- [x] 2. Update every dependency inside its existing range: `pnpm update`. Do **not** pass `--latest`. Do not hand-edit any version range in `package.json`.
- [x] 3. Confirm the result matches the "wanted" column in the Context table — `pnpm outdated` afterwards should list **only** `astro` (6.4.8 → 7.3.3) and `katex` (0.16.47 → 0.18.7). If any other package is still behind, stop and report it.
- [x] 3b. **Confirm `astro/zod` survived the update.** `src/content.config.ts` depends on it and `zod` is not a declared dependency, so this import path is the only thing making the build work:
      ```
      node -p "require('./node_modules/astro/package.json').exports['./zod']"
      ```
      It must still resolve. Do not trust a green build alone — a stale content cache can mask it. If the export is gone, that is a finding to report, not something to route around.
- [x] 4. Confirm the critical advisory is gone: `pnpm audit` — the `astro` critical entry must be absent. Record the new total. Do **not** run `pnpm audit --fix`; anything left needs a major bump and belongs to the deferred decision.
- [x] 5. Add `typescript` as a dev dependency: `pnpm add -D typescript`. Add `"check": "astro check"` to `package.json` scripts, after `"build"`.
- [x] 6. Run `pnpm run check` once. Record the exact output — error count and the first few messages — in `PLAN[A].md` as a ruling. **Do not edit any file under `src/` to fix what it reports** (ruling 3).
- [x] 7. Node 24:
      - `package.json`: `engines.node` → `">=24"`
      - create `/Users/shev/Development/portfolio-v4/.nvmrc` containing `24`
      - `.github/workflows/deploy.yml`: change `node-version: 22` → `node-version: 24`. **Change nothing else in that file** — phase 04 owns the rest, including whether the action installs with pnpm.
- [x] 8. `pnpm install` (to re-resolve against the new engines floor), then `pnpm run build` — must exit 0 with the same HTML page count as step 1.
- [x] 9. Update `README.md` and `AGENTS.md`: the Node requirement becomes 24, and document the new `pnpm run check` script alongside `dev` / `build` / `preview`.
- [x] 10. Commit in two reviewable units: (a) in-range dependency updates + lockfile, (b) Node 24 pin + typescript + check script + docs. Each ends with
      `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`

## Verification

Run from `/Users/shev/Development/portfolio-v4`:

| check | command | expected |
|---|---|---|
| build | `pnpm run build` | exit 0 |
| page count unchanged | `find dist -name '*.html' \| wc -l` | **26**, equal to the step-1 baseline |
| only talks warns | the build log's collection warnings | `talks` only. A warning naming `posts`, `publications` or `projects` is REAL BREAKAGE even at exit 0 |
| astro/zod still resolves | `node -p "require('./node_modules/astro/package.json').exports['./zod']"` | `./dist/zod.js` |
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

---

## Rulings appended during execution (phase 03b run, 2026-09-22)

4. **The critical Astro advisory is NOT clearable in range. The plan's central premise is false.** Measured directly from `pnpm audit --json` on the inherited tree at astro 6.1.7: the single `critical` row is **"Astro: Remote code execution through AVIF image optimization", patched only at `>=7.2.8`**. No 6.x release clears it. The plan's Context ("the critical is `astro` itself … the fix is in-range and therefore free") and step 4 ("Confirm the critical advisory is gone") both rest on this, and both are unachievable without adopting Astro 7 — which **ruling 1 explicitly refuses** and which `DEFERRED[H].md` item 1 already reserves as the developer's own decision. Licensed: run the phase's remaining, independent work; record the unmet criterion; write the question to `OPEN_QUESTIONS[H].md`. **Rejected: adopting Astro 7 to satisfy the criterion** — it is a major migration, refused by ruling 1, and pre-decided by the developer. **Rejected: silently restating the acceptance criterion as met** because the *other* astro advisories drop. What the in-range 6.4.8 does clear is real but partial: the two `high` astro rows (`>=6.3.3` unescaped slot name, `>=6.4.6` host-header SSRF), the `moderate` `>=6.4.6` spread-attribute XSS, the `low` `>=6.1.10` server-island replay, and the `moderate` `@astrojs/rss` `>=4.0.19` XML injection. Constraint that would make a fix re-break: bumping only `astro` to 7.x by hand would also silently adopt every other Astro 7 breaking change with no build-time signal beyond a still-green static build.

5. **`pnpm update` rewrites the caret floors in `package.json`; use `pnpm update --no-save`.** Confirmed from `pnpm update --help`: `--no-save  Don't update the ranges in package.json.` — i.e. saving is the default. Bare `pnpm update` would rewrite all nine specifiers (`^6.1.7` → `^6.4.8` and so on), which fails this plan's own verification row *"ranges untouched — no range string changed"* on every line. Licensed: **`pnpm update --no-save`**, leaving `pnpm-lock.yaml` as the only thing pinning versions, which is also what the handoff states is the case. Rejected: bare `pnpm update` plus amending the verification table — a floor bump is not a widening, but rewriting the check to match what the tool happened to do inverts the contract. Still forbidden: `--latest` (ruling 1).

6. **`astro check` needs `@astrojs/check` as well as `typescript`.** `node_modules/astro/dist/cli/check/index.js` dynamically imports `@astrojs/check`, and that package is **not installed**. Step 5 as written (`pnpm add -D typescript` alone) would leave `pnpm run check` either prompting for an install — which hangs forever in this non-TTY unattended run — or exiting non-zero for a reason that has nothing to do with the codebase's types. Licensed: `pnpm add -D typescript @astrojs/check`; both land in `devDependencies`, which is in scope. Record the extra package in `DEVIATIONS[H].md`. Rejected: dropping the `check` script — ruling 3 requires the checker to be run once and its result recorded.

7. **Baseline audit totals differ from the plan's Context figure, because the tools count differently.** The plan records 13 vulnerabilities (1 critical / 9 high / 2 moderate / 1 low) from `npm audit`. `pnpm audit` on the same inherited tree reports **34 — 3 low, 12 moderate, 18 high, 1 critical** (34 distinct advisories). Same single critical, different counting. **All before/after numbers this phase reports are pnpm's**, measured with the same command, so the delta is meaningful even though the absolute number does not match the plan.

8. **`pnpm run check` was run once; it fails with 13 pre-existing `src/` errors, and `typescript` had to be pinned below its default resolution to get a meaningful result.** `pnpm add -D typescript @astrojs/check` (ruling 6) resolved `typescript` to **7.0.2** by default — the newly released Go-based TypeScript major. `@astrojs/check@0.9.10` declares `peerDependencies: { "typescript": "^5.0.0 || ^6.0.0" }`, so 7.0.2 left an unmet-peer warning that would have made any `astro check` result uninterpretable (a tooling failure, not a codebase-types result). Licensed (consistent with ruling 6's intent — "the checker must be run once and its result recorded" — and not a widening of any *existing* range, since `typescript` is a brand-new devDependency): re-pinned with `pnpm add -D 'typescript@^6'`, which resolved to **6.0.3**. `pnpm peers check` then reports "No peer dependency issues found". `astro` stayed at 6.4.8 and `pnpm outdated` still lists only `astro` and `katex` as behind (plus the now-expected `typescript 6.0.3 → 7.0.2`). Constraint for the next person: a bare `pnpm add -D typescript` on this machine lands 7.x by default, so the `^6.0.3` range now in `package.json`'s `devDependencies` is load-bearing for `@astrojs/check` to function at all — do not let a future `pnpm update` move it past 6.x without also confirming `@astrojs/check`'s peer range has widened.

   With that resolved, `pnpm run check` (`astro check`) exits **1**. Full result summary: **13 errors, 0 warnings, 8 hints** across 47 files checked. (Several findings print with an inline `warning` label but are tallied into the "hints" count in the tool's own summary line, not "warnings" — recorded as the tool reports it.) All findings are pre-existing `src/` type defects, none are tooling/config errors:
   - `src/components/content/ContentLinks.astro:20:30` and `:18:34` — `error ts(2339)`: `Property 'external' does not exist on type 'DisplayLink'` (x2)
   - `src/components/layout/LeftSidebar.astro:2:10` — hint `ts(6133)`: `'SITE' is declared but its value is never read` (the handoff predicted a defect near this file; it is an unused-import hint, not the exact line/shape guessed)
   - `src/components/ui/ShareButtons.astro:10:21` — hint `ts(6133)`: `'description' is declared but its value is never read`
   - `src/layouts/BaseLayout.astro:132:31`, `:131:30`, `:129:14` — `error ts(18048)`: `'ANALYTICS.umami' is possibly 'undefined'` (x3)
   - `src/pages/posts/[id].astro:34:45` — `error ts(2322)`: `readingTime` does not exist on `Props`
   - `src/pages/posts/[id].astro:16:62` and `:16:28` — `error ts(2769)`: `new Date(...)` overload mismatch, `string | undefined` not assignable (x2)
   - `src/pages/resume/index.astro:19:15` and `:19:9` — hints `ts(6133)`: `'title'` / `'name'` declared but never read
   - `src/pages/tags/[tag].astro:35:79`, `:35:60`, `:35:39`, `:34:36`, `:33:33` — `error ts(2339)`: `institution` / `event` / `journal` / `author` / `date` do not exist on the listing item's data type (x5)
   - `src/pages/tags/[tag].astro:16:7`, `:6:1`, `:5:1` — hints `ts(6133)`: unused `tag`, `SITE`, `getListingItem`
   - `src/utils/adapters.ts:10:44` — hint `ts(6133)`: unused parameter `collection`

   No SVG-nesting issue in the icon components actually surfaced (the handoff flagged this as a possibility, not a certainty). `src/` was not touched to fix any of this, per ruling 3. Not added to CI, per ruling 3.

9. **`pnpm outdated` now lists three packages, not two — the verification row's "only `astro` and `katex`" is superseded by ruling 8.** Final output is `astro 6.4.8 → 7.3.3`, `typescript (dev) 6.0.3 → 7.0.2`, `katex 0.16.47 → 0.18.7`. The third row is `typescript`, which did not exist as a dependency when the plan was written, and is behind only because ruling 8 deliberately pinned it to `^6` so `@astrojs/check@0.9.10`'s peer range (`^5.0.0 || ^6.0.0`) is satisfied. This is not a missed in-range update: TypeScript 7 is a major, and taking it would break the type checker this phase exists to install. The row's *intent* — no non-major update was left on the table — holds.

10. **`astro check` does NOT catch the avatar bug, so the type checker is not a substitute for looking at the page.** The handoff predicted the checker would flag `src/components/layout/LeftSidebar.astro:19` (actually line 18 — the stray `/* ... */` comment inside the `width={160}` attribute of the `<Image>` tag that emits `width="1"`, `DEFERRED[H].md` item 8). It does not. The only `LeftSidebar.astro` finding is an unused-import hint at line 2:10. A malformed attribute in Astro template markup is not a type error, so nothing in this phase's tooling would ever surface it. **The avatar still renders 1 pixel wide and remains the developer's highest-value one-line fix before deploying.** The nested-`<svg>` icon-component defect the handoff flagged as a possibility did not surface either.

11. **`astro.config.mjs` emits a 6.x deprecation warning that Astro 7 will probably turn into a breakage.** First line of `pnpm run check` output: ``[astro] `markdown.remarkPlugins`, `markdown.rehypePlugins`, and `markdown.remarkRehype` are deprecated. Pass them to `unified({...})` from `@astrojs/markdown-remark` directly instead.`` This is new information for `DEFERRED[H].md` item 1 (the Astro 7 decision): the migration will have to touch `astro.config.mjs`'s markdown block, which is where `remark-math` and `rehype-katex` are wired in. Not fixed here — `astro.config.mjs` is read-only to this phase.
