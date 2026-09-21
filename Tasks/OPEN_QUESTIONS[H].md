# Open questions

Status: **Q8 is open** — see the bottom of this file. It does not block deploying. Q7 was answered by the main session on 2026-09-22 at 03:00.

## Answered

1. **Destination.** Build into `portfolio-v4`. `portfolio-v3` is left untouched as a working fallback.
2. **Deploy target.** GitHub Pages.
3. **GitHub Pages URL.** Custom domain `shevinum.dev`, no base path. **Correction, found by phase 04:** the original answer said "via a `public/CNAME` file". That premise was wrong. GitHub's own documentation is explicit — "If you are publishing from a custom GitHub Actions workflow, no CNAME file is created, and any existing CNAME file is ignored and is not required." The file was still created (it is harmless, and it is what a reader expects to find), but **the custom domain is set in Settings → Pages → Custom domain**, not by that file.
4. **Talks section.** Keep it, with an empty listing. Only the Shannon demo talk is deleted.
5. **Photos.** Drop the 9 travel photos. The template has no gallery and building one is out of scope. See `DEFERRED[H].md`.
6. **Run mode.** Unattended, with permissions set to auto.

## If a new question appears

Write it here, mark the phase BLOCKED, and stop that phase. Do not guess.

---

## Answered — Q7. The undeclared `zod` import (blocked phase 02b, now unblocked)

**Answer: option (a).** `src/content.config.ts` line 3 becomes `import { z } from 'astro/zod';`.

**Why this one.** It changes one line and adds no dependency, so phase 02b keeps its central guarantee — that the dependency set is identical before and after — and keeps the frozen-install proof intact. `astro/zod` was verified as a real export of astro 6.1.7 (`"./zod": "./dist/zod.js"`), re-exporting the same `zod@4.3.6` the code already receives.

**Rejected.** Declaring `"zod": "^4.3.6"` in `package.json` — honest, but it forfeits the no-drift guarantee during the one phase whose entire job is proving no drift. Hoisting workarounds — they recreate npm's flat layout, so the bug survives and later phases inherit it silently. Switching to `astro:content`'s `z` — plausibly more idiomatic, but unverified, and there was a proven option on the table.

**What this was.** Not a pnpm problem and not version drift. A pre-existing bug in the template: it imports a package it never declared. npm's flat `node_modules` made it work by accident. Recorded in `DEFERRED[H].md` as something you may want to revisit properly.

---

## Q8 — The critical Astro advisory needs Astro 7. Phase 03b cannot clear it. (2026-09-22, phase 03b)

**The short version.** Phase 03b was planned to clear the critical security advisory with an in-range update. It cannot. The critical advisory is fixed only in Astro `7.2.8`. The highest version phase 03b is allowed to install is `6.4.8`.

**What I was doing.** Measuring the audit baseline before starting the dependency update, as step 1 of phase 03b.

**What I found.** The single critical row is `Astro: Remote code execution through AVIF image optimization` (GHSA-26w7-cxv4-gfx2). It affects every Astro below `7.2.8`. No Astro 6 release fixes it. The plan's Context said the fix was in-range and free. That was wrong.

**What phase 03b did about it.** Nothing, and it ran everything else, because none of the other work depends on this. Both commits landed — `da9a3dd` and `f3078a7` — and the verifier returned 16 checks PASS and this one FAIL. The in-range update to `6.4.8` still clears 5 real advisories:
1. Astro, high — reflected XSS via unescaped slot name (fixed in 6.3.3).
2. Astro, high — host header SSRF in the prerendered error page (fixed in 6.4.6).
3. Astro, moderate — XSS via unescaped attribute names in spread props (fixed in 6.4.6).
4. Astro, low — server island encrypted parameter replay (fixed in 6.1.10).
5. `@astrojs/rss`, moderate — XML injection via unescaped feed fields (fixed in 4.0.19).

**Your decision — two options.**

1. **Do the Astro 6 → 7 migration.** Cost: a major-version migration with breaking changes, done with you awake so any breakage is attributable. Benefit: clears the critical advisory, and 4 more Astro rows that also need 7.x.
2. **Accept the advisory and stay on 6.4.8.** Cost: the advisory stays open. Benefit: no migration.

**What I can and cannot tell you about the real exposure.**
- I **can** tell you the site has no server side. `astro.config.mjs` sets no `output` and no `adapter`, so the build is static and GitHub Pages serves plain files. There is no request-time `/_image` endpoint in production for anyone to send anything to.
- I **can** tell you the site does use Astro's image pipeline at build time: `src/components/layout/LeftSidebar.astro:5` imports `Image` from `astro:assets` for your avatar. That is one JPEG you own, processed on your own machine and in your own CI.
- I **cannot** tell you the exact attack vector. The advisory record pnpm returns carries a title and version range but **no description text**, so I did not read what the bug actually is. If you want that before deciding, read <https://github.com/advisories/GHSA-26w7-cxv4-gfx2>.

**My read, for what it is worth.** With no SSR and no attacker-supplied images, this looks low-exposure, and option 2 is defensible today. Option 1 is the right thing eventually. Nothing here blocks deploying.

**Not decided by me.** `DEFERRED[H].md` item 1 already reserves Astro 7 for you, and phase 03b's ruling 1 refuses it. This note only tells you the trade-off changed: it is no longer "a free in-range fix now, a nice-to-have major later". The critical is on the far side of the major.
