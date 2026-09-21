# Phase 02b — Not done

Every step in the plan was completed. Nothing in scope was skipped.

Four things were deliberately left alone. Each was in reach and each was refused on purpose.

1. **The 13 npm audit vulnerabilities, 1 critical (`astro` 6.1.7).** Phase 03b fixes this with an in-range update to 6.4.8. Fixing it here would have broken this phase's one guarantee — that no package version changes — during the very phase built to prove it. No audit was run.
2. **`typescript` was not installed.** It is absent under npm and still absent under pnpm. Nothing in the project runs `tsc`. Phase 03b installs it deliberately.
3. **`zod` was not added to `package.json`.** The code now reaches it through `astro/zod` instead, which adds no dependency. Declaring it properly is a real option and is recorded for you in `DEFERRED[H].md`.
4. **`README.md` line 104 still documents a `pnpm run format` script that does not exist.** The word `npm` was converted to `pnpm` as instructed; the missing script was not invented and the row was not deleted. That is a docs decision, not a package-manager one. Flagged for the main session to record in `DEFERRED[H].md` — no entry exists there yet.

Untouched by design, as the plan required: everything under `src/` except line 3 of `content.config.ts`, all of `public/`, `astro.config.mjs`, `DESIGN-GUIDE.md`, `LICENSE`, and `.github/workflows/deploy.yml`.
