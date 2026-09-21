# Handoff into Phase 04

You are the last phase of the run. Phases 01, 02, 02b and 03 closed with a verifier PASS. Phase 03b landed both its commits and passed 16 of 17 checks; its one unmet item is a decision for the developer (Q8, the critical Astro advisory needs a major upgrade) and **does not affect you or block deploying**. Its verifier judged the tree "sound, proceed" for this phase.

## Tree state you inherit

- `/Users/shev/Development/portfolio-v4`, branch `main` at `f3078a7`, **no remote**. Clean outside `Tasks/`.
- **`pnpm run build` → exit 0, 26 pages.** Only collection warning: `talks` (×19), empty by design and permanent. **Any other collection warning is real breakage**, even at exit 0.
- Astro 6.4.8, Node floor `>=24`, `typescript@^6.0.3` + `@astrojs/check` installed, `pnpm run check` exists and exits 1 on 13 pre-existing type errors. **The check is deliberately NOT in CI — do not add it.**
- `astro.config.mjs` has `site: 'https://shevinum.dev'` and **no `base`**. Do not reintroduce one.
- `public/robots.txt` points at `https://shevinum.dev/sitemap-index.xml`.
- **`public/CNAME` does not exist. Creating it is your job.**

## Already done for you — do NOT redo these

1. **`.github/workflows/deploy.yml` already says `node-version: 24`.** Phase 03b changed exactly that one content line and nothing else. The rest of the file is still untouched template and is yours. **Do not change the Node pin again.**
2. Action versions are current: `actions/checkout@v4`, `withastro/action@v3`, `actions/deploy-pages@v4`. Nothing to bump.
3. The workflow does **not** run `npm ci` — it delegates everything to `withastro/action@v3`.

## Rulings that still bind

1. **Tree check: `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'`.**
2. **pnpm only.** Never run a bare `npm install`. **Never delete `pnpm-lock.yaml` or `pnpm-workspace.yaml`** — without the latter's `allowBuilds` denial, pnpm 11 exits 1 with `ERR_PNPM_IGNORED_BUILDS`, and because `pnpm run <script>` re-invokes install through `runDepsStatusCheck`, *every* script fails, including in CI.
3. **Clear the content cache before every build gate:** `rm -f node_modules/.astro/data-store.json && rm -rf .astro dist`.
4. **`package.json` ranges read `^6.1.7`, `^0.16.45` etc. while the lockfile pins 6.4.8, 0.16.47. This is deliberate** — phase 03b used `pnpm update --no-save` so no range was widened. The lockfile's `specifier:` lines are unchanged, so a frozen install stays consistent; the post-update build passed pnpm's own `runDepsStatusCheck`, which is the same consistency test CI applies. **Do not "fix" the ranges.**
5. **`typescript@^6.0.3` is load-bearing.** A bare `pnpm add -D typescript` installs 7.0.2, which breaks `@astrojs/check@0.9.10`'s peer range (`^5 || ^6`). Do not move it.
6. **Judge grep output, not exit status.** `pnpm audit` and `pnpm outdated` both exit 1 whenever they find anything, which is always here.

## Defective grep patterns — do not copy these into verification

Earlier phases proved each of these produces a false failure on a correct site:

1. **A bare `/academic-portfolio-astro/` also matches the required MIT attribution link** `https://github.com/rubzip/academic-portfolio-astro/` in the footer, which must stay. Your plan's base-path row already uses the correct form — match `href="/academic-portfolio-astro` instead.
2. `>Label<` never matches an Astro nav label; the emitted HTML has whitespace around it.
3. `Icon Not Found` can never render — `Icon.astro:14` throws at build time instead.
4. `grep "npm run"` both false-passes and false-fails, because `npm run` is a substring of `pnpm run`. Use `grep -rnE '(^|[^p])npm'`.

## Environment gotchas

- `ls` returns empty output in this sandbox. Use `find . -maxdepth 1 -name …`.
- `${PIPESTATUS[0]}` is empty under zsh; capture gate output to a file, read `$?`, and append `echo "EXIT=$?"` so the evidence is self-contained.

## Not yours, and explicitly out of scope

- Everything in `DEFERRED[H].md` — 19 items, all the developer's decisions. In particular: the Astro 7 upgrade (Q8), the 1-pixel avatar bug at `LeftSidebar.astro:18`, the 13 type errors, and the licence choice.
- **Do not run a deployment.** Do not create a GitHub repository, add a git remote, push anything, or touch DNS. Configuration only — the developer runs the deploy.
