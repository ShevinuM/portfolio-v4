# Phase 04 — Deploy

## Objective

The repo is configured to deploy to GitHub Pages at the custom domain `https://shevinum.dev`. No Cloudflare config is present. Build green, tree clean.

## Scope

`/Users/shev/Development/portfolio-v4/` — `.github/workflows/deploy.yml`, `public/CNAME`, `astro.config.mjs` (only the `site`/`base` lines, if phase 03 left them wrong), `README.md` (deploy section only).

Read-only: everything else, including `src/`.

## Context

- The developer chose GitHub Pages with the custom domain `shevinum.dev` (CNAME), at the stop gate.
- The template is fully static. No adapter, no SSR, no `@astrojs/cloudflare`, no `wrangler`. Do not port v3's Cloudflare worker config — v3 used an SSR adapter this template does not need.
- The template already ships `.github/workflows/deploy.yml` using `withastro/action@v3` with `node-version: 22`. Node on this machine is v26; the workflow pin is for CI and is fine as-is.
- A custom domain at the apex means **no base path**. Phase 03 already sets `site: 'https://shevinum.dev'` and deletes `base` from `astro.config.mjs`. This phase verifies that, it does not redo it.
- `public/CNAME` must contain exactly `shevinum.dev` and a trailing newline, nothing else. Astro copies `public/` verbatim into `dist/`, so the file lands at the root of the published site, which is what GitHub Pages reads.
- DNS and the GitHub repo itself are the developer's to set up. This phase writes config only.

## Rulings

1. GitHub Pages, custom domain `shevinum.dev`. Rejected: Cloudflare (developer's choice at the gate), and the project-page form `shevinum.github.io/<repo>/` (it would require keeping `base`, which changes every emitted link and invalidates phase 03's link checks).
2. No Cloudflare artefacts are created. v3's `wrangler.jsonc` and `@astrojs/cloudflare` dependency are not carried forward.

## Steps

- [ ] 1. Confirm `.github/workflows/deploy.yml` still exists and is unmodified from the template. Read it; do not rewrite it unless a step below requires it.
- [ ] 2. Create `/Users/shev/Development/portfolio-v4/public/CNAME` containing the single line `shevinum.dev`.
- [ ] 3. Verify `astro.config.mjs` has `site: 'https://shevinum.dev'` and **no** `base` key. If phase 03 left either wrong, fix it here and note it in `DEVIATIONS[H].md`.
- [ ] 4. Confirm no Cloudflare artefacts exist anywhere: no `wrangler.jsonc`, no `wrangler.toml`, no `@astrojs/cloudflare` or `wrangler` in `package.json`, no `adapter:` in `astro.config.mjs`.
- [ ] 5. `npm run build` — must exit 0.
- [ ] 6. Add a short **Deploying** section to `README.md`: push to `main` and the workflow publishes to GitHub Pages; the repo's Pages setting must use "GitHub Actions" as the source; the `shevinum.dev` DNS must point at GitHub Pages (apex A/ALIAS records) before the custom domain resolves.
- [ ] 7. Commit as one unit, message ending with the trailer
      `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`

## Verification

Run from `/Users/shev/Development/portfolio-v4`:

| check | command | expected |
|---|---|---|
| build | `npm run build` | exit 0 |
| CNAME published | `cat dist/CNAME` | exactly `shevinum.dev` |
| workflow present | `test -f .github/workflows/deploy.yml` | pass |
| no Cloudflare config | `ls wrangler.* 2>/dev/null; grep -c "cloudflare\|wrangler" package.json astro.config.mjs` | no files, count 0 |
| site URL correct | `grep -c "https://shevinum.dev" dist/sitemap-0.xml` | ≥ 1 |
| no base path | `grep -c "/academic-portfolio-astro/" dist/index.html` | 0 |
| no adapter | `grep -c "adapter" astro.config.mjs` | 0 |
| clean tree | `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'` | empty — **use this exact form**. A bare `git status --short` always shows `Tasks/` churn that the protocol itself requires, and would FAIL spuriously. |

## Acceptance criteria

- [ ] All verification checks pass.
- [ ] `public/CNAME` exists, holds `shevinum.dev`, and reaches `dist/CNAME` after a build.
- [ ] README documents the deploy flow and the two manual steps the developer still owns (Pages source setting, DNS).
- [ ] One commit, tree clean.

## Stop conditions

Do not run a deployment. Do not create a GitHub repository, add a git remote, push anything, or change DNS. Do not install new dependencies. Configuration only.
