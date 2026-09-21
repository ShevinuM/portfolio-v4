# Phase 04 — Deploy

Status: RUNNING (started 2026-09-22).

This is the last phase. It writes deploy configuration only. It does not deploy,
does not create a GitHub repo, does not push, and does not touch DNS.

## Log

1. **Phase started.** Tree is clean at `6e25a12` and the four in-scope files are read:
   `.github/workflows/deploy.yml`, `astro.config.mjs`, `public/` and `README.md`.
   `public/CNAME` does not exist yet. `astro.config.mjs` already has
   `site: 'https://shevinum.dev'` and no `base`, as expected.
2. **Research dispatched** on the one open technical question: whether
   `withastro/action@v3` installs with pnpm in a repo that has only `pnpm-lock.yaml`.
   Next: once that is settled, one executor makes all the edits in one commit.
3. **The pnpm question is answered: your workflow is already correct.** `withastro/action@v3`
   checks for `pnpm-lock.yaml` before any other lockfile, installs pnpm itself, and reads
   `pnpm@11.20.0` from your `package.json`. It will never reach for npm. Recorded as plan
   ruling 3, with the action's own source quoted.
   The same source showed that adding `package-manager: pnpm` "to be safe" would **break**
   CI — it forces pnpm version `latest`, which collides with your `packageManager` field.
   Recorded as ruling 4. So `deploy.yml` is not edited at all.
   Next: confirming GitHub's own rules for custom domains, then one executor makes the edits.
4. **One thing you were told earlier is wrong, and it matters.** GitHub's own docs say that
   when a site is published from a custom Actions workflow — which yours is — "no CNAME file
   is created, and any existing CNAME file is ignored and is not required." So `public/CNAME`
   alone will NOT give you `shevinum.dev`. You must also set the custom domain in
   **Settings -> Pages -> Custom domain**. The file is still created, because you asked for it
   and it is the right file if you ever switch to branch publishing. Recorded as plan ruling 5.
   Your manual-steps list is therefore **three** items, not two.
5. **Executor dispatched** for the single commit: create `public/CNAME`, add a `Deploying`
   section to `README.md`, and verify the workflow and `astro.config.mjs` without editing them.
   `deploy.yml` is deliberately not touched. Next: I run the build gate myself, then the
   verifier checks the committed tree.
6. **Executor returned and the commit landed: `291166f` "Configure GitHub Pages deploy for
   shevinum.dev".** Two files changed, `README.md` and `public/CNAME`, 38 lines added and
   nothing removed. `deploy.yml`, `astro.config.mjs`, `package.json` and the lockfiles are
   untouched, confirmed by diff.
7. **Build gate run: exit 0, 26 pages** — the same count as before the change. The only
   collection warning is `talks` (19 times), which is expected and permanent. The output is
   identical to the pre-change baseline apart from timings.
   Next: the verifier checks the committed tree against the plan's eight verification rows.
8. **Verdict in: PASS, all 19 checks.** Build exit 0 and 26 pages, `dist/CNAME` exactly
   `shevinum.dev`, no base path, no Cloudflare config, no adapter, exactly one commit,
   `deploy.yml` provably unmodified, and no git remote exists so nothing was deployed.
9. **Phase closed.** `Results/COMPLETED[H].md`, `NOT_DONE[H].md` and `DEVIATIONS[H].md` are
   written. The repo is ready to deploy; four manual steps are still yours and they are
   listed in `Results/NOT_DONE[H].md` and in `README.md`. No new open questions were raised.
