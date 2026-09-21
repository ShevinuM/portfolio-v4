# Phase 03 — Completed

**Status: closed. Verifier verdict: PASS.**

The site is yours. Nothing on it mentions Claude Shannon, and nothing on it was invented.

Build: `pnpm run build` exits 0, **26 pages** (was 8). `talks` is the only collection that still
warns, which is correct — you chose to keep the section with an empty listing.

## The four commits

1. **`69ce4b9`** — Replace the demo bio and CV with Shevinu Nawalage's, and rename CV to Resume
2. **`e995e3b`** — Add the NER survey, the Digest project and the brain-rot article
3. **`ffeb109`** — Replace the demo identity with real site metadata and social links
4. **`3ba2f5d`** — Rewrite the README and AGENTS notes for this repo, and set the package name

Each commit was built and checked on its own before the next one started.

## What landed

1. **Your bio** — `src/content/bio.md`. The About text is your v3 summary word for word.
2. **Your resume** — `src/content/cv.md`. Both Enaimco roles, Memorial University, Tecnológico de
   Monterrey. The old Skills list and the "Extra biographical notes" placeholder are gone, as asked.
3. **CV is now Resume everywhere you can see it** — the nav label, the page title, and the URL.
   `/cv` is gone; the page is at `/resume`. The internal file is still `cv.md` on purpose.
4. **The NER survey** is under Publications, linked to your ResearchGate page.
5. **"How Brain Rotted Are We?"** is under Blog. The body is byte-identical to your v3 original —
   the verifier diffed it and got no output.
6. **Shevinu's Digest** is under Code, linked to the live site and the GitHub source.
7. **Your real links** in the sidebar — GitHub, LinkedIn, ResearchGate, email. Google Scholar and
   the fake ORCID are deleted.
8. **Real site metadata** — `shevinum.dev`, your name, your own one-line description.
9. **A README that describes your site**, crediting the template it came from.

## What the verifier said

> PASS — All Verification-table checks (with the four ruling-corrected substitutions) and all
> Acceptance criteria pass.

Including the one that matters most: every fact on the site traces back to a file in
`portfolio-v3`. No invented venue, citation count, award, job duty, degree, thesis or biography.

## Four checks in the plan were written wrong. I fixed the checks, not the work.

They would have failed a correct site. All four are written up in `PLAN[A].md` (rulings 11, 19, 22).

1. `grep ">Resume<"` — Astro puts spaces around nav labels. The untouched `>Blog<` also returned 0.
2. `grep ">CV<"` — same problem, same fix.
3. `grep "/academic-portfolio-astro/"` — also matches the MIT credit link you want to keep.
4. `grep "Icon Not Found"` — can never match. A missing icon crashes the build instead.
