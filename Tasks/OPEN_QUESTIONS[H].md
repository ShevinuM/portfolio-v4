# Open questions

Status: none open. Q7 was answered by the main session on 2026-09-22 at 03:00.

## Answered

1. **Destination.** Build into `portfolio-v4`. `portfolio-v3` is left untouched as a working fallback.
2. **Deploy target.** GitHub Pages.
3. **GitHub Pages URL.** Custom domain `shevinum.dev` via a `public/CNAME` file. No base path.
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
