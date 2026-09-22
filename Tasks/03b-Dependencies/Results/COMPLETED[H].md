# Phase 03b — what landed

## The verifier's verdict, in its own words

> **Against the plan's acceptance criteria as written: FAIL.**

> **Fitness for what depends on it next (phase 04 and general project health): sound, proceed.**

1 of 17 checks failed. The other 16 passed. The failure is not fixable by this phase and needs a decision from you. See **Q8** in `Tasks/OPEN_QUESTIONS[H].md`. Nothing here blocks deploying.

**2 commits. Build still green: exit 0, 26 pages — the same as before the phase started.**

## 1. Dependencies updated — commit `a8ced33`

All 9 outdated packages moved to the newest version their existing range allows.

| package | was | now |
|---|---|---|
| astro | 6.1.7 | **6.4.8** |
| katex | 0.16.45 | 0.16.47 |
| tailwindcss | 4.2.2 | 4.3.3 |
| @tailwindcss/vite | 4.2.2 | 4.3.3 |
| @astrojs/rss | 4.0.18 | 4.0.19 |
| @astrojs/sitemap | 3.7.2 | 3.7.4 |
| @fontsource/inter | 5.2.8 | 5.3.0 |
| @fontsource-variable/inter | 5.2.8 | 5.3.0 |
| @fontsource/jetbrains-mono | 5.2.8 | 5.3.0 |

**No version range in `package.json` changed.** Only `pnpm-lock.yaml` did. Astro stayed on 6 and katex stayed on 0.16, as you decided.

**Security: 34 advisories down to 14.** High severity went from 18 to 7. Moderate went from 12 to 4. Low went from 3 to 2. Critical stayed at 1 — that is Q8.

Five real fixes came in: 2 high-severity Astro bugs (an XSS and a host-header SSRF), 1 moderate Astro XSS, 1 low, and an XML injection in the RSS feed generator.

## 2. Node 24 and the type checker — commit `e8ad7fd`

1. **Node 24 is set in three places.** `engines.node` is `">=24"` (a floor, not a pin — your machine runs 26). A new `.nvmrc` says `24`. The deploy workflow says `24`.
2. **Exactly one line of `.github/workflows/deploy.yml` changed**, the `node-version:` line. Phase 04 still owns the rest of that file.
3. **`pnpm run check` now exists and works.** It runs `astro check` against your strict tsconfig, which nothing had ever enforced.
4. **`README.md` and `AGENTS.md` now say Node 24** and document the new script.

## 3. The type checker's first ever run

**13 errors, 0 warnings, 8 hints, across 47 files.** It exits 1.

**All 13 are pre-existing defects in the template's `src/`. None were fixed, and nothing under `src/` was touched** — that was the plan's rule. They are listed in `NOT_DONE[H].md`.

**The check is deliberately not wired into CI.** A red check cannot block your deploy.

**It does not catch your 1-pixel avatar bug.** A malformed attribute in template markup is not a type error. That one-line fix is still worth doing by hand.

## What the verifier checked

Every row of the plan's verification table and every acceptance criterion, against evidence I collected: a full build with the content cache cleared first, `pnpm audit` before and after, `pnpm outdated`, the complete type-check output, and the diff of every changed file. The verifier re-ran the cheap checks itself rather than trusting my summary.

Confirmed: nothing under `src/` changed (0 files). `tsconfig.json` untouched. Nothing under `Tasks/` was committed. One lockfile. Clean tree.
