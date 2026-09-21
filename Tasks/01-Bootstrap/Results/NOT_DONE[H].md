# Phase 01 — Bootstrap: NOT DONE

Nothing in this phase's plan is unfinished. All 8 steps ran and all 5 acceptance criteria passed.

Four things were deliberately left alone. Each one belongs to a later phase or was forbidden here.

1. **The 13 npm vulnerabilities are not fixed** (1 critical, 9 high, 2 moderate, 1 low). The plan's stop condition forbids editing template content, config or styles in this phase, and `npm audit fix` rewrites `package-lock.json` and can bump versions. Check this in phase 04, before anything is pushed to a public repository.
2. **`typescript` is not installed.** `npm install` dropped it as an unused optional peer. Installing it would be a `package.json` edit, which the stop condition forbids. Whoever first wants `tsc` or `astro check` should run `npm i -D typescript` in their own phase.
3. **The `sharp` install script is not approved.** Approving it changes install behaviour, which is out of scope here, and the build passes without it. Run `npm install-scripts approve sharp` in phase 03 if image processing fails.
4. **`.github/workflows/deploy.yml` was committed as the template shipped it, unread and unaudited.** It is inert — there is no git remote, so nothing can trigger it. Phase 04 must read it before adding a remote, or it will fire on first push against the template author's assumptions, not yours.

No template content, config or styles were edited. The example content in `src/content` is untouched and is phase 02's removal target: 7 posts, 2 projects, 2 publications, 1 talk, 1 teaching entry, plus `bio.md` and `cv.md`.
