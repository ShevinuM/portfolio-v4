# Phase 04 — Deviations from the plan

Three. Only the first one changes anything you have to do.

## 1. The manual-steps list is three items, not two

**Plan said:** the README should document "the two manual steps the developer still owns
(Pages source setting, DNS)".

**We wrote three.** The middle one was missing from the plan.

**Why.** The plan assumed `public/CNAME` is what sets your custom domain. It is not, for the
way this repo publishes. GitHub's own documentation says:

> If you are publishing from a custom GitHub Actions workflow, no CNAME file is created,
> and any existing CNAME file is ignored and is not required.

Your repo publishes from a custom Actions workflow, so the file alone would have left the
apex domain dead with nothing in the repo to explain why. You must also set the domain in
**Settings → Pages → Custom domain**. Verified by fetching GitHub's doc page directly
(HTTP 200), not from memory. Recorded in full as plan ruling 5.

## 2. `.github/workflows/deploy.yml` was not edited

**Plan step 1b said:** confirm the workflow installs with pnpm, and "if it needs an explicit
input or a `pnpm/action-setup` step, add it".

**We added nothing.** The investigation concluded the file is already correct, and that the
belt-and-braces change would actively break CI. Both findings are recorded as plan rulings 3
and 4, with the action's source quoted. This is the plan's own conditional resolving to "no
change", not a step skipped.

## 3. `public/CNAME` was created anyway, knowing GitHub ignores it

Given finding 1, the file is not load-bearing. It was still created because you chose it
explicitly, it costs 13 bytes, and it is the correct file if the publishing source is ever
switched to "Deploy from a branch". The README says plainly that it is a fallback, so nobody
later mistakes it for the thing that sets the domain.
