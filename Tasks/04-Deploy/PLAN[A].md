# Phase 04 — Deploy

## Objective

The repo is configured to deploy to GitHub Pages at the custom domain `https://shevinum.dev`. No Cloudflare config is present. Build green, tree clean.

## Scope

`/Users/shev/Development/portfolio-v4/` — `.github/workflows/deploy.yml`, `public/CNAME`, `astro.config.mjs` (only the `site`/`base` lines, if phase 03 left them wrong), `README.md` (deploy section only).

Read-only: everything else, including `src/`.

## Context

- The developer chose GitHub Pages with the custom domain `shevinum.dev` (CNAME), at the stop gate.
- The template is fully static. No adapter, no SSR, no `@astrojs/cloudflare`, no `wrangler`. Do not port v3's Cloudflare worker config — v3 used an SSR adapter this template does not need.
- The template ships `.github/workflows/deploy.yml` using `withastro/action@v3`. Its action versions (`checkout@v4`, `deploy-pages@v4`, `withastro/action@v3`) are current — nothing to bump. **Phase 03b changed `node-version: 22` to `24`** at the developer's request; `engines.node` is `">=24"` and `.nvmrc` says `24`. Local Node is v26.9.0, which satisfies the floor.
- **The repo uses pnpm** (phase 02b switched it) and `package.json` pins `"packageManager": "pnpm@11.20.0"`. `withastro/action` detects the package manager from the lockfile, so `pnpm-lock.yaml` should be enough — but **read the workflow and confirm** it will install with pnpm rather than assuming npm. If it needs an explicit `package-manager: pnpm` input or a `pnpm/action-setup` step, add it and record a ruling. A workflow that runs `npm ci` against a repo with no `package-lock.json` fails on the first push, and the developer will not see that failure until they push.
- Use `pnpm run build` for every local gate, never `npm`.
- A custom domain at the apex means **no base path**. Phase 03 already sets `site: 'https://shevinum.dev'` and deletes `base` from `astro.config.mjs`. This phase verifies that, it does not redo it.
- `public/CNAME` must contain exactly `shevinum.dev` and a trailing newline, nothing else. Astro copies `public/` verbatim into `dist/`, so the file lands at the root of the published site, which is what GitHub Pages reads.
- DNS and the GitHub repo itself are the developer's to set up. This phase writes config only.

## Rulings

1. GitHub Pages, custom domain `shevinum.dev`. Rejected: Cloudflare (developer's choice at the gate), and the project-page form `shevinum.github.io/<repo>/` (it would require keeping `base`, which changes every emitted link and invalidates phase 03's link checks).
2. No Cloudflare artefacts are created. v3's `wrangler.jsonc` and `@astrojs/cloudflare` dependency are not carried forward.

3. **Step 1b is settled: `withastro/action@v3` installs with pnpm 11.20.0 with the workflow exactly as it stands. No input is added and no `pnpm/action-setup` step is added.** Evidence is the action's own source at `https://raw.githubusercontent.com/withastro/action/v3/action.yml` (tag `v3`, commit `56781b97402ce0487b7e61ce2cb960c0e2cc5289`), fetched and read directly. Three lines settle it:
   - Detection runs `pnpm-lock.yaml` **first**, before `yarn.lock` and `package-lock.json`, so a pnpm-only repo can never fall through to npm:
     ```
     elif [ $(find "." -maxdepth 1 -name "pnpm-lock.yaml") ]; then
         echo "PACKAGE_MANAGER=pnpm" >> $GITHUB_ENV
         echo "LOCKFILE=pnpm-lock.yaml" >> $GITHUB_ENV
     ```
   - The action embeds its own pnpm setup, so the caller does not add one:
     ```
     - name: Setup PNPM
       if: ${{ env.PACKAGE_MANAGER == 'pnpm' }}
       uses: pnpm/action-setup@v4
       with:
         version: ${{ env.VERSION }}
         package_json_file: "${{ inputs.path }}/package.json"
     ```
   - In the pnpm branch `VERSION` is **never assigned** (only the npm and bun branches set `VERSION="latest"`), so line 61's `echo "VERSION=$VERSION" >> $GITHUB_ENV` writes an empty value. `pnpm/action-setup@v4` treats an empty `version` as falsy and falls through to reading `packageManager` from `package.json` — verified in its bundled `dist/index.js`, function `readTarget`: `if(t){...}` then `if(typeof d!=="string"){throw new Error("No pnpm version is specified...")}`. `package.json` has `"packageManager": "pnpm@11.20.0"`, so **pnpm 11.20.0** is what CI installs.
   - Install and build are `$PACKAGE_MANAGER install` and `$PACKAGE_MANAGER run build`, i.e. `pnpm install` / `pnpm run build`. pnpm defaults to a frozen lockfile under `CI=true`, which is consistent with handoff ruling 4.
   - `node-version` is a real v3 input (default `"20"`), so the existing `node-version: 24` is passed through to the action's embedded `actions/setup-node@v4` and is **not** silently ignored. The v3 input list is exactly three: `node-version`, `package-manager`, `path`.

4. **Do NOT add `package-manager: pnpm` to the workflow as a belt-and-braces measure. It would break CI.** Reading the same `action.yml`, the explicit-input branch does two things the auto-detection branch does not:
   ```
   if [ $len -gt 1 ]; then
     PACKAGE_MANAGER=$(echo "$INPUT_PM" | grep -o '^[^@]*')
     VERSION=$(echo "$INPUT_PM" | { grep -o '@.*' || true; } | sed 's/^@//')
     if [ -z "$VERSION" ]; then
         VERSION="latest"
     fi
     echo "PACKAGE_MANAGER=$PACKAGE_MANAGER" >> $GITHUB_ENV
   fi
   ```
   (a) It forces `VERSION="latest"` when no `@version` suffix is given. A non-empty `version` passed to `pnpm/action-setup@v4` alongside a `packageManager` field in `package.json` is the documented "Multiple versions of pnpm specified" hard failure. (b) It never sets `LOCKFILE`, so the later `cache-dependency-path: "${{ inputs.path }}/${{ env.LOCKFILE }}"` degrades to `./`. Auto-detection sets both variables correctly. **The safe configuration is the one already in the file — leave `deploy.yml` byte-for-byte unchanged.**

## Steps

- [x] 1. Read `.github/workflows/deploy.yml`. **Phase 03b already changed its `node-version:` line from 22 to 24** — that change is expected and correct, leave it. Nothing else in the file should differ from the template. Do not rewrite the file unless step 1b requires it.
- [x] 1b. Confirm the workflow will install with **pnpm**, not npm. `withastro/action@v3` detects the package manager from the lockfile, and `package.json` pins `"packageManager": "pnpm@11.20.0"` — but verify rather than assume. If the action needs an explicit input or a `pnpm/action-setup` step, add it and record a ruling. A workflow that runs `npm ci` against a repo with no `package-lock.json` fails on the developer's first push, and they will not see it until then.
- [x] 2. Create `/Users/shev/Development/portfolio-v4/public/CNAME` containing the single line `shevinum.dev`.
- [x] 3. Verify `astro.config.mjs` has `site: 'https://shevinum.dev'` and **no** `base` key. If phase 03 left either wrong, fix it here and note it in `DEVIATIONS[H].md`.
- [x] 4. Confirm no Cloudflare artefacts exist anywhere: no `wrangler.jsonc`, no `wrangler.toml`, no `@astrojs/cloudflare` or `wrangler` in `package.json`, no `adapter:` in `astro.config.mjs`.
- [x] 5. `pnpm run build` — must exit 0.
- [x] 6. Add a short **Deploying** section to `README.md`: push to `main` and the workflow publishes to GitHub Pages; the repo's Pages setting must use "GitHub Actions" as the source; the `shevinum.dev` DNS must point at GitHub Pages (apex A/ALIAS records) before the custom domain resolves.
- [x] 7. Commit as one unit, message ending with the trailer
      `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`

## Verification

Run from `/Users/shev/Development/portfolio-v4`:

| check | command | expected |
|---|---|---|
| build | `pnpm run build` | exit 0 |
| CNAME published | `cat dist/CNAME` | exactly `shevinum.dev` |
| workflow present | `test -f .github/workflows/deploy.yml` | pass |
| no Cloudflare config | `ls wrangler.* 2>/dev/null; grep -c "cloudflare\|wrangler" package.json astro.config.mjs` | no files, count 0 |
| site URL correct | `grep -c "https://shevinum.dev" dist/sitemap-0.xml` | ≥ 1 |
| no base path | `grep -c 'href="/academic-portfolio-astro\|src="/academic-portfolio-astro' dist/index.html` | 0. **Do not use a bare `grep -c "/academic-portfolio-astro/"`** — it also matches the MIT attribution link `https://github.com/rubzip/academic-portfolio-astro/` in the footer, which is required and must stay. Phase 03 flagged this as a false-failure trap. |
| no adapter | `grep -c "adapter" astro.config.mjs` | 0 |
| clean tree | `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'` | empty — **use this exact form**. A bare `git status --short` always shows `Tasks/` churn that the protocol itself requires, and would FAIL spuriously. |

## Acceptance criteria

- [x] All verification checks pass. Verifier returned PASS on all 19 checks.
- [x] `public/CNAME` exists, holds `shevinum.dev`, and reaches `dist/CNAME` after a build. 13 bytes, byte-identical.
- [x] README documents the deploy flow and the manual steps the developer still owns. **Three, not two** — ruling 5 supersedes this line: Pages source, Pages custom domain, DNS.
- [x] One commit (`291166f`), tree clean outside `Tasks/`.

## Stop conditions

Do not run a deployment. Do not create a GitHub repository, add a git remote, push anything, or change DNS. Do not install new dependencies. Configuration only.

5. **A plan assumption is falsified: with a custom Actions workflow, GitHub ignores the `CNAME` file.** The Context section above says `public/CNAME` "lands at the root of the published site, which is what GitHub Pages reads". That is true only for *branch* publishing. Verified first-hand by fetching `https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site` (HTTP 200) and extracting the sentence verbatim:

   > Under "Custom domain", type your custom domain, then click Save. If you are publishing your site from a branch, this will create a commit that adds a CNAME file directly to the root of your source branch. **If you are publishing from a custom GitHub Actions workflow, no CNAME file is created, and any existing CNAME file is ignored and is not required.**

   This repo publishes from a custom Actions workflow (`deploy.yml` → `withastro/action@v3` → `actions/deploy-pages@v4`), so the CNAME file is in the "ignored and not required" case.

   **What is licensed as a result:**
   - **Still create `public/CNAME`.** Rejected: skipping it. The developer chose it explicitly (`OPEN_QUESTIONS[H].md`, answered question 3), it costs one file, it is harmless under Actions publishing, and it is the correct artefact if the publishing source is ever switched to a branch. Deleting it would silently overturn a developer decision on a doc detail they have not seen.
   - **The README must not claim the file is what sets the domain.** It states that the custom domain is set in **Settings → Pages → Custom domain**, and that the file is a fallback.
   - **The manual-steps list is three items, not the plan's two.** (1) Settings → Pages → Source = GitHub Actions. (2) Settings → Pages → Custom domain = `shevinum.dev`, then Enforce HTTPS once available. (3) Apex DNS records. Record this in `DEVIATIONS[H].md`.
   - **DNS values are quoted from GitHub's doc page, not from memory.** A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. AAAA records `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`. All four of each verified in the fetched page.
   - Enforce HTTPS: the doc says only "It can take up to 24 hours before this option is available." It states no explicit "DNS must resolve first" precondition, so the README must not invent one.

   **What would make this re-break:** writing a README that tells the developer the CNAME file alone is enough. They would push, the site would serve on `<user>.github.io`, the apex would not resolve, and nothing in the repo would explain why.
