# Phase 03 — Content

## Objective

The site is Shevinu Nawalage's: bio, a Resume page (the template's CV section, renamed reader-facing and reduced to experience and education), the NER paper under Publications, the "How Brain Rotted Are We?" article under Blog, the Shevinu's Digest project under Code, real social links, real site metadata, and a README that describes this repo. Build green, every route reachable.

## Scope

`/Users/shev/Development/portfolio-v4/` — `src/content/`, `src/config/`, `src/pages/cv/` (which this phase renames to `src/pages/resume/`, see step 3b), `public/`, `astro.config.mjs`, `README.md`, `AGENTS.md`, `package.json` (the `name` field only).

Read-only:
- `/Users/shev/Development/portfolio-v3` — content source. Never write to it.
- `Tasks/`, `src/components/`, `src/layouts/`, `src/styles/`, `src/types/`, `src/utils/`, and every route under `src/pages/` except the CV one.

## Context

- Absolute paths everywhere. Quote any path containing `[` or `]`.
- **v3 contains its own leftover boilerplate from the starfolio template. Do not copy it.** Specifically: `DATA.contact.email` is `alex@alexmercer.dev`, `DATA.contact.tel` is `+1 512 000 0000`, `CONFIG.site.url` is `https://alexmercer.dev`, `CONFIG.site.twitterHandle` is `@alexmercer_dev`. All four are fake. The real values are `DATA.url` (`https://shevinum.dev`), `DATA.contact.social.email.url` (`mailto:shevinu2002@gmail.com`), and the GitHub/LinkedIn URLs.
- Template content schemas are in `/Users/shev/Development/portfolio-v4/src/content.config.ts`. `publications` accepts: `title, author, date, journal, external_url, image, description, tags`. `projects` accepts: `title, description, tags, external_url, image`. `posts` accepts: `title, date, description, author, tags, external_url, image`. There is **no** `video` field — the v3 r2.dev mp4 demo links have no home and are dropped.
- Before writing any content file, run `head -12` on the phase-02 git history version of a template post/publication to confirm the exact `date` string format the adapters parse (`git show HEAD~N:src/content/posts/<file>.md`, or read `src/utils/adapters.ts` and `src/utils/readingTime.ts`). Match that format exactly.
- `SITE.ogImage` in the template is `"shannon.webp"`, which does not exist in `public/` — a pre-existing dangling reference. Point it at the real image copied from v3.
- The template's `astro.config.mjs` has `site: 'https://rubzip.github.io'` and `base: '/academic-portfolio-astro'`. Both are wrong for this site.
- `public/robots.txt` may hardcode a `rubzip.github.io` sitemap URL. Check it.
- **The repo uses pnpm by the time this phase runs** (phase 02b switched it). Use `pnpm run build`, never `npm`. Running bare `npm install` would regenerate `package-lock.json` and reintroduce a second lockfile.

## Rulings

1. The NER work goes to **Publications**, not Projects. The user asked for it in the publications section. It is a research survey with a ResearchGate DOI-style landing page, so `external_url` is the ResearchGate link.
2. The r2.dev demo videos from v3 are dropped. No content schema has a video field, and adding one would mean redesigning the card components — outside this phase's scope.
3. v3's `alexmercer.dev` / `alex@alexmercer.dev` / `+1 512 000 0000` values are upstream template leftovers and are never copied forward.

4. **"CV" is renamed to "Resume" everywhere the reader sees it, including the URL.** That means the nav label, the page title, and the route — `/cv` becomes `/resume`. Rejected: renaming the label only. It would leave the nav reading "Resume" while the address bar reads `/cv`, which is the kind of mismatch the "remove leftover stuff" instruction is aimed at.
   **The internal identifiers stay `cv`**: the collection key in `content.config.ts`, the `cv.md` filename, the `PagesConfig.cv` key, and the `CVItem` type. Rejected: renaming those too — the collection key is wired into the loader glob, the types barrel and the adapters, so renaming it risks the build for zero reader-visible gain. Constraint that would make this re-break: if a later phase "tidies" the remaining internal `cv` names, it must move `src/content/cv.md` and the loader glob pattern together, or the collection silently resolves to zero entries and the Resume page renders blank rather than failing loudly.

## Source → target mapping

| source (in `/Users/shev/Development/portfolio-v3`) | target (in v4) |
|---|---|
| `src/data/resume.tsx` → `DATA.name`, `description`, `summary` | `src/content/bio.md` |
| `public/picofme.jpeg` | `public/picofme.jpeg`, referenced as `avatar: "picofme.jpeg"` |
| `DATA.work[]`, `DATA.education[]` | `src/content/cv.md` frontmatter |
| `DATA.projects[0]` — Named Entity Recognition in Subsea Inspections | `src/content/publications/named-entity-recognition-subsea-inspections.md` |
| `DATA.projects[1]` — Shevinu's Digest | `src/content/projects/shevinus-digest.md` |
| `src/content/blog/how-brain-rotted-are-we.mdx` | `src/content/posts/how-brain-rotted-are-we.md` |
| `DATA.contact.social` (GitHub, LinkedIn, email) | `src/config/social.ts` — plus ResearchGate, `https://www.researchgate.net/profile/Shevinu-Nawalage`, which has no v3 equivalent and replaces the template's Google Scholar link |
| `DATA.url`, `DATA.name`, `DATA.description` | `src/config/site.ts` → `SITE` |
| `public/og_image.png`, `public/favicon.svg` | `public/` (overwrite template favicon) |

## Steps

- [x] 1. Copy assets from v3 to v4 `public/`: `picofme.jpeg`, `og_image.png`, `favicon.svg`. Overwrite the template `favicon.svg`. Delete the template `favicon.ico` if v3 has no equivalent.
- [x] 2. Rewrite `src/content/bio.md`:
      - frontmatter: `name: "Shevinu Nawalage"`, `avatar: "picofme.jpeg"`, `shortBio` from `DATA.description`, `institution: "Enaimco · St. John's, NL"`
      - body: an About section built from `DATA.summary` plus the research-interest framing (ML on climate and weather data). Keep it first-person and factual. Do not invent biography.
- [x] 3. Rewrite `src/content/cv.md`:
      - `name: "Shevinu Nawalage"`, `title: "Software Engineer"`
      - `experience`: the two Enaimco roles from `DATA.work[]` — role, institution, period (`Sep 2025 - Present`, `May 2024 - Sep 2025`), description verbatim from v3
      - `education`: Memorial University of Newfoundland (BSc Computer Science, Sep 2021 - Jun 2026) and Tecnológico de Monterrey (International Visiting Student, Feb 2026 - Jun 2026)
      - **body: empty.** The developer asked for the whole markdown body to go — both the `## Skills` list (Information Theory, Mathematics, Electrical Engineering, Cryptography, Computer Science) and the `## Biographical Summary` section with its "Extra biographical notes or a summary can go here." placeholder. Write no replacement Skills list. The file ends after the closing `---` of the frontmatter.
      - Check that the CV page still renders correctly with an empty body. If it renders a bare empty `<div class="prose">` or similar, that is acceptable; if it throws or leaves a visible empty box, gate the body render on content being present.
- [x] 3b. **Rename CV to Resume, reader-facing only** (see ruling 4):
      - `git mv src/pages/cv src/pages/resume` — keep `index.astro` inside it. Use `git mv`, not `cp`, so the rename is visible in history.
      - In `src/config/pages.ts`: set the `cv` entry's `title` to `"Resume"` and write a subtitle that fits, or `""`. Leave the object key `cv` alone.
      - In `src/config/navigation.ts`: change the CV link to `{ href: "/resume", label: "Resume", isActive: true }`.
      - Grep the whole of `src/` for any other `/cv` href or "CV" label a reader would see — `grep -rn '"/cv"\|>CV<\|Curriculum' src/` — and update each. Leave internal identifiers (`cv` collection key, `CVItem`, `cv.md`) untouched.
      - Confirm nothing links to `/cv` any more. There is no redirect from the old path and none is wanted — the site has never been published at this URL.
- [x] 4. Create `src/content/publications/named-entity-recognition-subsea-inspections.md`:
      - `title: "Named Entity Recognition in Subsea Inspections"`
      - `author: "Shevinu Nawalage"`
      - `date: "2025"` — in the format the adapters parse (see Context)
      - `external_url: "https://www.researchgate.net/publication/406006394_Named_Entity_Recognition_in_Subsea_Inspections"`
      - `description`: the v3 text, with the typo fixed — "survery" → "survey"
      - `tags`: `["nlp", "named-entity-recognition", "bert", "subsea-inspection"]`
      - body: 2–4 paragraphs expanding the abstract from the v3 description only. Do not invent results, metrics, venue or citation counts.
- [x] 5. Create `src/content/projects/shevinus-digest.md` from `DATA.projects[1]`: title, description verbatim, `external_url: "https://digest.shevinum.dev"`, tags from `technologies`. Mention the GitHub source (`https://github.com/ShevinuM/daily-tech-digest`) in the body.
- [x] 6. Create `src/content/posts/how-brain-rotted-are-we.md` from the v3 `.mdx`. The body is pure markdown — no JSX, no imports — so it copies verbatim. Rename frontmatter fields: `publishedAt` → `date` (`2026-09-19`, matching the adapters' expected format), `summary` → `description`; keep `title` and `tags`; add `author: "Shevinu Nawalage"`.
- [x] 7. Rewrite `src/config/social.ts`. Final set, in this order: GitHub (`https://github.com/ShevinuM`), LinkedIn (`https://www.linkedin.com/in/shevinum/`), **ResearchGate (`https://www.researchgate.net/profile/Shevinu-Nawalage`)**, Mail (`mailto:shevinu2002@gmail.com`).
      - **ResearchGate replaces Google Scholar.** Delete the Google Scholar entry and the ORCID entry. Add a `ResearchGate` entry with `linkTitle: "Shevinu Nawalage on ResearchGate"`. Rewrite every other `linkTitle` — they all currently name Claude Shannon.
      - `SOCIAL_ICONS`: drop the `"Google Scholar"` and `ORCID` keys, add `ResearchGate: "ResearchGate"`.
      - **The icon set has no ResearchGate glyph.** Every icon in `src/assets/icons/` is a 24×24 Tabler outline SVG: `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, first child `<path stroke="none" d="M0 0h24v24H0z" fill="none" />`. `src/assets/icons.ts` auto-globs the directory, so adding the file is the whole wiring — no registration needed. Create `src/assets/icons/ResearchGate.svg`:
        - **Preferred:** Tabler's official `brand-researchgate` icon (MIT licensed, so redistribution is fine). Fetch it from the Tabler icons repository and keep its path data byte-exact. Normalise only the wrapper attributes to match the neighbouring files.
        - **Fallback, only if that fetch fails:** copy the existing `GoogleScholar.svg` graduation-cap glyph to `ResearchGate.svg` unchanged. It renders correctly and reads as "academic profile". **Do not hand-author letterform paths** — a fabricated "RG" glyph is very likely to render as a scribble, and nobody is awake to look at it. If you take the fallback, record it in `DEVIATIONS[H].md` as a known cosmetic substitution the developer may want to swap later.
      - Delete `src/assets/icons/ORCID.svg`. Delete `src/assets/icons/GoogleScholar.svg` **only if** the preferred ResearchGate icon was used; under the fallback it is the source of the copy, so delete it only after the copy exists and the build is green.
- [x] 8. Rewrite `SITE` in `src/config/site.ts`: `website: "https://shevinum.dev"`, `author: "Shevinu Nawalage"`, `title: "Shevinu Nawalage"`, `desc` from `DATA.description`, `ogImage: "og_image.png"`, `favicon: "/favicon.svg"`. Leave `postPerPage` and `lang`.
- [x] 9. Update `src/config/pages.ts` subtitles so none of them describe Shannon ("Thoughts on physics, philosophy, and music." is his). Write subtitles that fit this site, or set them to `""`.
- [x] 10. `astro.config.mjs`: set `site: 'https://shevinum.dev'` and **delete** the `base` line. Leave the markdown plugins, sitemap and tailwind config alone.
- [x] 11. `public/robots.txt`: point the sitemap at `https://shevinum.dev/sitemap-index.xml`.
- [x] 12. `package.json`: set `"name": "portfolio-v4"`. Change nothing else.
- [x] 13. Rewrite `README.md` to describe this site — what it is, how to run it, where content lives, and an attribution line crediting `rubzip/academic-portfolio-astro` (MIT). Delete the template's demo screenshot reference (`public/main_page.jpg` was removed in phase 02) and its "bootstrap from this template" instructions.
- [x] 14. Update `AGENTS.md`: remove the `teaching/` and `talks/` references left over after phase 02. Keep the rest — it is useful architecture documentation.
- [x] 15. `pnpm run build` must exit 0. — Satisfied by the phase orchestrator, not an executor. Final gate at `3ba2f5d` with `node_modules/.astro/data-store.json`, `.astro/` and `dist/` cleared first: `EXIT=0`, `26 page(s) built`, `talks` the only collection warning (x19), zero `Unknown Icon` lines.
- [x] 16. Commit in reviewable units: — Done as four commits, one executor each, each gated and verified before the next was dispatched: `69ce4b9` (a), `e995e3b` (b), `ffeb109` (c), `3ba2f5d` (d). All four trailers verified by the final verifier.
      Original text: (a) assets + bio + cv, (b) publication + project + post, (c) config + astro.config + robots, (d) README + AGENTS + package name. Each commit ends with the `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` trailer.

## Verification

Run from `/Users/shev/Development/portfolio-v4`:

| check | command | expected |
|---|---|---|
| build | `pnpm run build` | exit 0 |
| post route | `test -f dist/posts/how-brain-rotted-are-we/index.html` | pass |
| publication route | `test -f dist/publications/named-entity-recognition-subsea-inspections/index.html` | pass |
| project route | `test -f dist/projects/shevinus-digest/index.html` | pass |
| publication listed | `grep -c "Named Entity Recognition" dist/publications/index.html` | ≥ 1 |
| post listed | `grep -c "How Brain Rotted Are We" dist/posts/index.html` | ≥ 1 |
| researchgate link live | `grep -c "researchgate.net/profile/Shevinu-Nawalage" dist/index.html` | ≥ 1 |
| scholar and orcid gone | `grep -rn "scholar.google\|orcid\|Google Scholar" src/ dist/index.html; ls src/assets/icons/` | no output; no `ORCID.svg` |
| researchgate icon renders | `test -f src/assets/icons/ResearchGate.svg && grep -c "stroke=\"currentColor\"" src/assets/icons/ResearchGate.svg` | file exists, ≥ 1 — and the built page must contain an `<svg>` inside the ResearchGate `<a>`, not the `[Icon Not Found]` span |
| no missing icons | `grep -c "Icon Not Found" dist/index.html dist/resume/index.html` | 0 |
| resume route exists | `test -f dist/resume/index.html` | pass |
| old cv route gone | `test ! -e dist/cv` | pass |
| no CV label left | `grep -rn '"/cv"\|>CV<\|Curriculum Vitae' src/ dist/*.html dist/*/index.html` | no output |
| nav says Resume | `grep -c ">Resume<" dist/index.html` | ≥ 1 |
| cv body empty | `grep -c "Skills\|Biographical Summary\|Extra biographical notes" src/content/cv.md dist/resume/index.html` | 0 in both |
| resume page still renders | `grep -c "Memorial University" dist/resume/index.html` | ≥ 1 |
| no Shannon anywhere | `grep -rni "shannon\|bell-labs\|petoskey\|rubzip.github.io" src/ public/ dist/ README.md AGENTS.md` | no output (the footer link to `github.com/rubzip/...` is expected and allowed — exclude it by matching `rubzip.github.io` only) |
| no v3 leftovers | `grep -rni "alexmercer\|alex@\|512 000 0000\|starfolio" src/ public/ dist/ README.md package.json` | no output |
| sitemap host | `grep -c "shevinum.dev" dist/sitemap-0.xml` | ≥ 1 |
| sitemap has no template host | `grep -c "rubzip" dist/sitemap-0.xml` | 0 |
| no base path in links | `grep -c "/academic-portfolio-astro/" dist/index.html` | 0 |
| avatar resolves | `ls dist/_astro/ \| grep -i picofme` or confirm the `<img>` src in `dist/index.html` points at an existing file | pass |
| nav links resolve | for each href in `src/config/navigation.ts`, the matching `dist/<path>/index.html` exists | all pass |
| clean tree | `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'` | empty — **use this exact form**. A bare `git status --short` always shows `Tasks/` churn that the protocol itself requires, and would FAIL spuriously. |

## Acceptance criteria

- [x] All verification checks pass. (Final verifier, with the ruling-corrected substitutions for the four defective greps — rulings 11, 19, 22, 23.)
- [x] Every fact on the built site traces to `/Users/shev/Development/portfolio-v3`. Nothing invented — no fabricated publication venue, citation count, award, or biography. (Audited five times: once per commit and once at the end. The publication and project bodies were audited sentence by sentence against the single v3 source sentence.)
- [x] The NER paper appears under Publications and the article under Blog.
- [x] Each commit builds green on its own. (Gate run by the phase orchestrator after every commit, caches cleared each time.)

## Stop conditions

Do not redesign components, layouts or styles. Do not add new collections or new pages. Do not add content the user did not ask for (no talks, no photos section, no extra blog posts). Deployment configuration is phase 04. If a content field needs a schema change beyond what `content.config.ts` already allows, stop and report it rather than editing the schema.

---

## Rulings appended during execution (phase orchestrator, 2026-09-22)

5. **Tabler has no `brand-researchgate` icon. The fallback in step 7 is licensed.**
   Evidence gathered by the phase orchestrator, not an executor:
   `https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/brand-researchgate.svg` → HTTP 404.
   `https://unpkg.com/@tabler/icons@latest/icons/outline/brand-researchgate.svg` → HTTP 404 (resolved to 3.47.0).
   The unpkg directory listing for `@tabler/icons@3.47.0/icons/outline/` contains exactly these `brand-re*` files:
   `brand-react-native, brand-react, brand-reason, brand-reddit, brand-redhat, brand-redux, brand-revolut`. No `brand-researchgate`.
   **Licensed fix:** `cp src/assets/icons/GoogleScholar.svg src/assets/icons/ResearchGate.svg` — byte-identical copy of the graduation-cap glyph. Do not hand-author letterform paths.
   Delete `GoogleScholar.svg` only after the copy exists and `pnpm run build` is green.
   **Rejected:** fetching from a third-party icon CDN (unvetted licence, unverifiable path data); hand-drawing an "RG" monogram (very likely to render as a scribble and nobody is awake to look).
   **What would make this re-break:** if a later phase re-runs the Tabler fetch and finds an icon added upstream, it must keep the 24×24 / `fill="none"` / `stroke="currentColor"` / `stroke-width="1.5"` wrapper and the `<path stroke="none" d="M0 0h24v24H0z" fill="none" />` first child, or `Icon.astro` will double-apply stroke attributes.
   Record in `DEVIATIONS[H].md` as a cosmetic substitution.

6. **Step 3b (the CV → Resume rename) belongs entirely to commit (a).**
   Root cause of the ambiguity: step 16 lists four commits and never assigns 3b to one. Splitting it — `git mv` in (a), `navigation.ts` href in (c) — would leave commit (a) with a nav link pointing at a route that no longer exists, breaking the acceptance criterion "each commit builds green on its own".
   **Licensed:** commit (a) = assets + `bio.md` + `cv.md` + the *whole* of 3b (`git mv src/pages/cv src/pages/resume`, `navigation.ts` href/label, `pages.ts` `cv.title`/`subtitle`).
   Commit (c) = `site.ts`, `social.ts`, the ResearchGate/ORCID/GoogleScholar icon files, the *remaining* `pages.ts` subtitles (step 9), `astro.config.mjs`, `robots.txt`.
   Both commits touch `src/config/pages.ts`. That is intended and is not a conflict.

7. **v3's `public/og_image.png` is NOT the developer's image. Do not copy it.**
   Root cause: the plan's source→target table assumed `og_image.png` was Shevinu's. It was inspected directly: it is the **Astrofolio template's stock social card** — a React atom logo on a circuit-board background, the word "Astrofolio", and the caption "Create a personal portfolio site from a single config files. Built with Astro." It is upstream template boilerplate of exactly the class the plan's Context paragraph already bans (`alexmercer.dev`, `alex@alexmercer.dev`, `+1 512 000 0000`).
   Copying it would put another project's branding on every social share of this site, and would put a sentence the developer never wrote onto the site's own assets.
   **Licensed fix:** do not copy `og_image.png`. Set `SITE.ogImage = "/picofme.jpeg"` — the developer's real portrait, already being copied for the avatar, already root-absolute, already in `public/`.
   **Rejected:** copying it anyway (imports foreign branding); generating a new OG card (design work, not licensed by this phase, and it would require inventing a tagline); leaving `ogImage` empty (`BaseLayout.astro:114` does `new URL(ogImage, Astro.url)`, so `""` resolves to the page's own URL and the `og:image` tag becomes a link to the HTML page).
   Record in `DEVIATIONS[H].md`. A purpose-built 1200×630 OG card is a reasonable later task.

8. **`SITE.ogImage` must be root-absolute.**
   `src/layouts/BaseLayout.astro:114` and `:121` do `new URL(ogImage, Astro.url)`. With a bare `"og_image.png"`, the OG tag on `/posts/how-brain-rotted-are-we/` resolves to `/posts/how-brain-rotted-are-we/og_image.png`, which does not exist. This is why the template's `og:image` was dangling on every page, not only on the home page.
   **Licensed:** `ogImage: "/picofme.jpeg"` with the leading slash. This supersedes the literal string in step 8 of the plan.

9. **v3's `public/favicon.svg` is a template monogram and must not be copied verbatim.**
   It is a dark rounded square containing the single letter **"A"** — starfolio's stock favicon for its fictional "Alex Mercer". Same class as ruling 7.
   **Licensed fix:** write `public/favicon.svg` as the same 32×32 dark-rounded-square structure with the letter **"S"** (the developer's initial; the GitHub handle is `ShevinuM`). No new facts are asserted by a monogram.
   **Rejected:** copying the "A" verbatim (imports a fictional person's initial); keeping the v4 template's graduation-cap favicon (it is rubzip's academic-template branding, and this site is a software engineer's, not an academic's).
   Record in `DEVIATIONS[H].md` — the developer can swap this in ten seconds and should be told it exists.

10. **Deleting `public/favicon.ico` leaves one dangling reference that this phase cannot fix.**
    `src/layouts/BaseLayout.astro:56` is `<link rel="icon" href="/favicon.ico" sizes="any" />`. `src/layouts/` is read-only to phase 03.
    **Licensed:** delete `public/favicon.ico` as step 1 says (it is the academic template's 16×16 icon and would clash with the new favicon). Accept one 404 on a secondary icon; the primary `<link rel="icon" type="image/svg+xml">` on line 55 is what modern browsers use.
    Record the dangling line in `Results/NOT_DONE[H].md` for whichever later phase owns `src/layouts/`.

11. **`Icon.astro` throws on an unknown icon — the `[Icon Not Found]` span is dead code.**
    `src/components/ui/Icon.astro:14-18` does `if (!iconContent) throw new Error(...)` *before* the JSX that contains the `[Icon Not Found: {name}]` span. So the span can never render, and the plan's two `grep -c "Icon Not Found"` checks are vacuous — they return 0 whether or not the icon exists.
    **The real gate is the build**: a missing `ResearchGate.svg` makes `pnpm run build` fail with `[Unknown Icon]: ResearchGate`. Keep the grep checks (they cost nothing) but do not treat them as evidence the icon resolved. The positive evidence is `grep -c 'icon-tabler-school' dist/index.html` ≥ 1 together with a green build.
    Also: `LeftSidebar.astro:47` does `SOCIAL_ICONS[social.name] || social.name`. The template's `SOCIAL_ICONS` key `Linkedin` does not match `SOCIALS[].name` `"LinkedIn"`, and only the `|| social.name` fallback saves it. **Every `SOCIAL_ICONS` key must be byte-identical to its `SOCIALS[].name`**, and every value must be an existing filename in `src/assets/icons/`.

12. **Staging discipline for every executor: stage by explicit path.**
    `git add -A` / `git add .` would sweep `Tasks/` — including the `- [ ]` → `- [x]` ticks in this very file — into a commit whose message claims content work. Nothing under `Tasks/` is ever committed by this phase.
    Tree check is `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'`.

13. **Tags are lowercase-hyphen slugs, everywhere.**
    `src/pages/tags/[tag].astro:11` uses the raw tag string as the route param (`params: { tag: tag.name }`, where `getAllTags` only lowercases and trims). A tag containing `+` or a space becomes a path segment containing `+` or a space. The v3 post already uses lowercase-hyphen tags.
    **Licensed for `shevinus-digest.md`:** v3's `technologies` array is `["Python", "Groq + OpenRoute", "model2vec", "trafilatura", "sumy", "numpy"]`. Emit `["python", "groq", "openroute", "model2vec", "trafilatura", "sumy", "numpy"]` — `"Groq + OpenRoute"` names two services and becomes two tags. Do **not** "correct" `OpenRoute` to `OpenRouter`; that is the source spelling.
    Record the split in `DEVIATIONS[H].md`.

14. **`date: "2025"` on the publication renders as "January 2025".**
    `src/utils/adapters.ts:formatDate` does `new Date(value).toLocaleDateString('en-US', {year:'numeric', month:'long'})` — it always emits a month. The v3 source asserts only the year (`dates: "2025"`). Verified on this machine (TZ +0530) and true in UTC too, so the GitHub Actions build agrees. Keep `date: "2025"` per the plan; record the month artefact in `DEVIATIONS[H].md` so the developer knows the month is a rendering artefact and not a claim from the source.

15. **`public/robots.txt` has no `rubzip` host.** It currently reads `Sitemap: /sitemap-index.xml` — a relative URL, which is invalid in robots.txt. Step 11's fix (absolute `https://shevinum.dev/sitemap-index.xml`) still applies; the plan's Context guess about a hardcoded `rubzip.github.io` was wrong.

16. **Step 14 (AGENTS.md) — remove the `teaching/` reference only, keep `talks/`.**
    `AGENTS.md:13` reads: `**Content:** src/content/ - Add .md files to subdirectories (posts/, publications/, projects/, talks/)`. There is no `teaching/` reference left in the file. `talks` is still a live collection in `src/content.config.ts` and `OPEN_QUESTIONS[H].md` Q4 answered "keep the talks section with an empty listing", so removing `talks/` from the architecture notes would make the documentation wrong.
    **Licensed:** leave the `talks/` mention in place. Add the `resume` route rename and the pnpm facts. Record the divergence from step 14's literal wording in `DEVIATIONS[H].md`.

17. **The verification table is phase-wide; each per-commit verifier pass is scoped to what that commit touched.**
    Root cause: step 16 splits the work into four commits but the Verification table describes the finished phase. Running the whole table after commit (a) would produce a wall of FAILs about Shannon metadata and empty collections that commit (a) was never meant to fix, and those FAILs are forwarded verbatim.
    **Licensed split:**
    - after (a): resume route exists · `dist/cv` gone · `>Resume<` in `dist/index.html` · cv body empty (in `src/content/cv.md` and `dist/resume/index.html`) · "Memorial University" in `dist/resume/index.html` · avatar `<img src>` in `dist/index.html` points at a file that exists under `dist/` · no Shannon/Petoskey in `src/content/bio.md` or `src/content/cv.md` · `public/favicon.svg` contains `>S<` and not `>A<` · `public/og_image.png` does **not** exist · `public/picofme.jpeg` exists.
    - after (b): the three detail routes · the two listing greps · build log warns `does not exist or is empty` for **`talks` only** · post body byte-identical to the v3 `.mdx` body.
    - after (c): researchgate link in `dist/index.html` · scholar/orcid gone from `src/` and `dist/` · `icon-tabler-school` present in `dist/index.html` · sitemap host · no `/academic-portfolio-astro/` · no Shannon anywhere.
    - after (d): README / AGENTS / `package.json` greps.
    - after (d), one full pass of the whole table.
    **Note on the avatar check:** `LeftSidebar.astro` uses `<Image src={`/${bio.avatar}`} …>` with a *string* path into `public/`. Astro passes those through untouched, so `dist/_astro/` will contain **no** `picofme` file. The plan's `or confirm the <img> src … points at an existing file` branch is the live one. An empty `_astro` grep is not a failure.

18. **The publication body: fabrication beats the paragraph count.**
    The entire source for `named-entity-recognition-subsea-inspections.md` is one sentence in `/Users/shev/Development/portfolio-v3/src/data/resume.tsx`:
    `"Research survery on how Named Entity Recognition (from rule-based systems to BERT) can turn ROV pilots' spoken inspection notes into structured data, cutting manual tagging in subsea pipeline inspections."`
    Step 4 asks for "2–4 paragraphs expanding the abstract". **That target yields to the no-fabrication rule.** Every sentence in the body must either restate a clause already in that sentence (the rule-based → BERT progression; ROV pilots' spoken notes becoming structured data; reducing manual tagging in subsea pipeline inspections) or point at the ResearchGate page. Nothing about what the paper measured, found, concluded, where it appeared, who cited it, or what dataset it used. If two honest paragraphs are not possible, **one is correct** and the executor says so in its report.
    Only licensed text edit: `survery` → `survey`.
    **Omit `journal`. Omit `image`.** There is no source for either. `image` in particular would need a file that does not exist.
    Leave the three `.gitkeep` files in `src/content/posts|publications|projects/` in place — the loader glob is `**/*.md` and they are inert.

19. **The `>Resume<` and `>CV<` grep checks in the Verification table are defective. Rewrite them.**
    Root cause: Astro emits nav labels with surrounding whitespace inside the anchor, because `NavLinks.astro` puts the label on its own line next to a `<span class="nav-link-line">`. Rendered markup is `<a href="/resume" class="nav-link inactive"> Resume <span class="nav-link-line"></span> </a>`.
    Measured by the phase orchestrator on the commit-(a) build, with an untouched control:
    `grep -c ">Resume<" dist/index.html` → **0**; `grep -c "> Resume <" dist/index.html` → **1**; `grep -c ">Blog<" dist/index.html` → **0** (the control — `Blog` was never edited, so the 0 is the pattern's fault, not the work's).
    **Licensed replacement for Verification table line 113:** `grep -c 'href="/resume"' dist/index.html` ≥ 1 **and** `grep -c "> Resume <" dist/index.html` ≥ 1.
    **Licensed replacement for the `>CV<` half of line 112:** `grep -rnw 'CV' src/` plus `grep -rn '/cv' src/`, judged by output. Known internal-only hits that are correct and must be left alone: `src/types/content.ts:8` (`CVItem`), `src/types/content.ts:23` (`CV`), `src/types/index.ts:3` and `:6` (the barrel re-exports), and `src/pages/resume/index.astro:14` (`"CV content not found. Please ensure src/content/cv.md exists."` — a build-time developer error string, never rendered to a reader).
    **Correction to the executor-1 report:** it said "the type is `CV`, not `CVItem`". Both exist — `CVItem` at `content.ts:8` (extended by `EducationItem` and `ExperienceItem`) and `CV` at `content.ts:23`. Ruling 4's mention of `CVItem` was right; it was just incomplete.

20. **Pre-existing bug in `src/components/layout/LeftSidebar.astro:19` — out of phase 03's scope, NOT fixed here.**
    The line is `width={160} /* Maximum width in global.css for sidebar-avatar class */`. A `/* … */` comment inside an Astro element's attribute list is not a comment — it is parsed as attributes. The rendered `<img>` therefore carries junk attributes `*="true" Maximum="true" in="true" global.css="true" for="true" sidebar-avatar="true"` **and `width="1"` instead of `width="160"`**, on every page.
    Pre-existing: it rendered identically with the template's `shannon.jpg`, before this phase. `src/components/` is read-only to phase 03, so it is recorded in `Results/NOT_DONE[H].md` for whichever phase owns components. The fix is to move the comment into the frontmatter or use `{/* … */}` outside the tag.

21. **Commit (a) is verified-green at `69ce4b9`.** Gate run by the phase orchestrator with `node_modules/.astro/data-store.json`, `.astro/` and `dist/` cleared first: `EXIT=0`, `8 page(s) built`, warnings `posts` ×6, `publications` ×5, `projects` ×4, `talks` ×4 — all four still expected at this point, because commit (b) is what fills the first three.

22. **The `grep -c "/academic-portfolio-astro/" dist/index.html` check (Verification table line 120) is defective. Rewrite it.**
    Root cause: the pattern also matches the **allowed** footer attribution `https://github.com/rubzip/academic-portfolio-astro/`, hard-coded at `src/components/layout/Footer.astro:12` (read-only to phase 03, and the MIT attribution the plan explicitly wants kept). The table exempts that link from the `rubzip.github.io` grep but not from this one.
    Measured on the commit-(c) build: `grep -c "/academic-portfolio-astro/" dist/index.html` → **1**, and the only match is `https://github.com/rubzip/academic-portfolio-astro/`.
    **Licensed replacement:** `grep -c 'href="/academic-portfolio-astro' dist/index.html` → must be 0. Measured: **0**. That is the check that actually tests "no base path in links".

23. **`icon-tabler-school` in `dist/index.html` is 1, not ≥ 2.** The brief handed to executor 3 said ≥ 2; ruling 11 said ≥ 1, and ruling 11 is right. There is exactly one social link carrying that glyph — the graduation cap simply changed owner from Google Scholar to ResearchGate. Measured: **1**.
    Stronger positive proof, gathered by the phase orchestrator on the commit-(c) build: the ResearchGate anchor in `dist/index.html` is
    `<a href="https://www.researchgate.net/profile/Shevinu-Nawalage" aria-label="Shevinu Nawalage on ResearchGate" … class="social-link"> <svg …><svg … class="icon icon-tabler icons-tabler-outline icon-tabler-school">…`
    — a real `<svg>`, not an `[Icon Not Found]` span. Combined with a green build (`Icon.astro` throws on an unknown icon, ruling 11) the icon is proven resolved.
    The nested `<svg>` inside `<svg>` is how `Icon.astro` renders **every** icon (`set:html` of the whole file into a wrapper `<svg>`); it is pre-existing template behaviour, not something commit (c) introduced.

24. **Commit (c) is at `ffeb109`. The ResearchGate icon came from the FALLBACK, not Tabler.**
    `src/assets/icons/ResearchGate.svg` is a byte-identical copy of the former `GoogleScholar.svg` (git recorded it as `R100 GoogleScholar.svg => ResearchGate.svg`). Tabler was never fetched, per ruling 5. Goes in `DEVIATIONS[H].md` as a cosmetic substitution the developer may want to swap.
    Gate re-run independently by the phase orchestrator with caches cleared: `EXIT=0`, `26 page(s) built`, only `talks` warns (×19), zero `Unknown Icon` lines.
    Also independently confirmed: `og:image` on the deep route `/posts/how-brain-rotted-are-we/` is `https://shevinum.dev/picofme.jpeg` — root-absolute, not nested, so ruling 8's fix works in built output; the `shannon|bell-labs|petoskey|rubzip.github.io` sweep across `src/` and `dist/` returns **no output**; the `alexmercer|alex@|512 000 0000|starfolio` sweep returns **no output**.

25. **Commit (d) is at `3ba2f5d`. All four commits are in. Final gate, run by the phase orchestrator with caches cleared: `EXIT=0`, `26 page(s) built`, `talks` the ONLY collection warning (×19), zero `Unknown Icon` lines.**
    All seven `NAV_LINKS` hrefs resolve to a built page: `/` `/publications` `/talks` `/projects` `/posts` `/tags` `/resume` → all present under `dist/`. `dist/cv` does not exist.

26. **`LICENSE` is the upstream template's MIT license, `Copyright (c) 2026 Rubén Gijón`.** Found by executor 4. The rewritten README therefore attributes the *template's* licence ("Built from the academic-portfolio-astro template by rubzip, MIT licensed") rather than claiming the developer chose MIT for his own site. **Whether Shevinu wants his own licence terms for his own content is a real open decision for him, not a documentation fix, and this phase deliberately did not make it.** Carry it forward.

27. **Two unused template icon files survive: `src/assets/icons/Facebook.svg` and `src/assets/icons/Twitter.svg`.** Referenced by nothing — not by `SOCIAL_ICONS`, not by any component. Flagged by the commit-(c) verifier. Removing them was not in any plan step, so phase 03 left them. A later cleanup pass should delete both; a shallow future audit grepping for "Twitter" will otherwise hit a filename and think an X handle survived.

28. **The `talks` detail route `src/pages/talks/[id].astro` has never been exercised.** `talks` is empty by design, so no talk detail page has ever been built. `dist/talks/index.html` renders (empty listing) and is reachable from the nav. If a talk is ever added, that route is the one untested path in the site.

29. **AGENTS.md's type list was checked and is accurate.** Executor 4 rewrote line 18 to `content.ts (Bio, CVItem, CV, EducationItem, ExperienceItem, Blog, Project, Publication, Talk)` but cited line numbers for only four of the nine. Verified by the phase orchestrator — `grep -n "^export interface" src/types/content.ts` returns all nine: `Bio` 1, `CVItem` 8, `EducationItem` 14, `ExperienceItem` 19, `CV` 23, `BasePage` 30, `Blog` 36, `Project` 41, `Publication` 46, `Talk` 53. No fabricated type name. No fix round needed. (`BasePage` is the only interface not listed, which is fine — it is an internal base.)

30. **Correction to `Results/NOT_DONE[H].md` item 1: the avatar is NOT visually broken.** The `width="1"` attribute from ruling 20 is overridden by `src/styles/global.css:430`, where `.sidebar-avatar` sets `width: 160px; height: 160px` (with responsive overrides at `:911` 112px and `:932` 80px). The portrait renders at the right size. What the bug actually costs is invalid HTML on every page and a possible first-paint layout shift, since `width="1" height="160"` is what the browser uses to reserve space before CSS applies. The NOT_DONE entry was corrected before close so the developer does not chase a phantom.
