# Phase 04 — Not done

## Yours to do, and the site is not live until you do it

These are not oversights. This phase writes configuration only; it cannot click buttons in
the GitHub UI or change DNS. All three are one-time.

1. **Create the GitHub repository and push.** The repo has **no git remote** at all right
   now. Nothing has been pushed anywhere.
2. **Settings → Pages → Source = GitHub Actions.** Not "Deploy from a branch". The workflow
   will not publish until this is set.
3. **Settings → Pages → Custom domain = `shevinum.dev`**, then Save. This is required —
   `public/CNAME` does not do it for you. Tick **Enforce HTTPS** afterwards; it can take up
   to 24 hours to become available.
4. **Apex DNS for `shevinum.dev`** at your registrar: either an ALIAS/ANAME record to the
   Pages default domain, or four A records —
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` — plus,
   optionally, the four AAAA records
   `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

Steps 2-4 are written into `README.md` under `## Deploying`, so they stay with the repo.

## In scope, deliberately left alone

- **`.github/workflows/deploy.yml` was not modified.** It is already correct. See
  `DEVIATIONS[H].md` item 2.
- **`astro.config.mjs` was not modified.** It already has `site: 'https://shevinum.dev'`
  and no `base`, which is what an apex custom domain needs. Verified, not changed.
- **Only the README's deploy section was touched.** One line in the README's opening
  paragraph says the site is "live at https://shevinum.dev". It is not live yet. That line
  is outside this phase's README scope, so it was left as-is — worth a one-word edit
  ("will be live at") when you get to it, or just leave it, since it becomes true once you
  finish the four steps above.

## Out of scope by instruction

Everything in `Tasks/DEFERRED[H].md` — 19 items, all yours to decide. Untouched this phase,
including the two that are genuinely worth doing before you show the site to anyone:

- **The 1-pixel avatar bug** (`src/components/layout/LeftSidebar.astro` line 18). A stray
  comment inside the `width={160}` attribute makes it emit `width="1"`. Your photo is broken
  on every page. One-line fix, and `astro check` does not catch it.
- **The open Astro security advisory** (question Q8). Needs an Astro 6 → 7 major upgrade.
  Low exposure on a fully static site, but it is your call and it is still open.

Also not done, by instruction: no deployment was run, no repository created, no remote added,
nothing pushed, no DNS touched, no dependencies installed, and `pnpm run check` was not run.
