# Phase 03 — Content

## Objective

The site is Shevinu Nawalage's: bio, CV, the NER paper under Publications, the "How Brain Rotted Are We?" article under Blog, the Shevinu's Digest project under Code, real social links, real site metadata, and a README that describes this repo. Build green, every route reachable.

## Scope

`/Users/shev/Development/portfolio-v4/` — `src/content/`, `src/config/`, `public/`, `astro.config.mjs`, `README.md`, `AGENTS.md`, `package.json` (the `name` field only).

Read-only:
- `/Users/shev/Development/portfolio-v3` — content source. Never write to it.
- `Tasks/`, `src/components/`, `src/layouts/`, `src/styles/`, `src/types/`, `src/utils/`.

## Context

- Absolute paths everywhere. Quote any path containing `[` or `]`.
- **v3 contains its own leftover boilerplate from the starfolio template. Do not copy it.** Specifically: `DATA.contact.email` is `alex@alexmercer.dev`, `DATA.contact.tel` is `+1 512 000 0000`, `CONFIG.site.url` is `https://alexmercer.dev`, `CONFIG.site.twitterHandle` is `@alexmercer_dev`. All four are fake. The real values are `DATA.url` (`https://shevinum.dev`), `DATA.contact.social.email.url` (`mailto:shevinu2002@gmail.com`), and the GitHub/LinkedIn URLs.
- Template content schemas are in `/Users/shev/Development/portfolio-v4/src/content.config.ts`. `publications` accepts: `title, author, date, journal, external_url, image, description, tags`. `projects` accepts: `title, description, tags, external_url, image`. `posts` accepts: `title, date, description, author, tags, external_url, image`. There is **no** `video` field — the v3 r2.dev mp4 demo links have no home and are dropped.
- Before writing any content file, run `head -12` on the phase-02 git history version of a template post/publication to confirm the exact `date` string format the adapters parse (`git show HEAD~N:src/content/posts/<file>.md`, or read `src/utils/adapters.ts` and `src/utils/readingTime.ts`). Match that format exactly.
- `SITE.ogImage` in the template is `"shannon.webp"`, which does not exist in `public/` — a pre-existing dangling reference. Point it at the real image copied from v3.
- The template's `astro.config.mjs` has `site: 'https://rubzip.github.io'` and `base: '/academic-portfolio-astro'`. Both are wrong for this site.
- `public/robots.txt` may hardcode a `rubzip.github.io` sitemap URL. Check it.

## Rulings

1. The NER work goes to **Publications**, not Projects. The user asked for it in the publications section. It is a research survey with a ResearchGate DOI-style landing page, so `external_url` is the ResearchGate link.
2. The r2.dev demo videos from v3 are dropped. No content schema has a video field, and adding one would mean redesigning the card components — outside this phase's scope.
3. v3's `alexmercer.dev` / `alex@alexmercer.dev` / `+1 512 000 0000` values are upstream template leftovers and are never copied forward.

## Source → target mapping

| source (in `/Users/shev/Development/portfolio-v3`) | target (in v4) |
|---|---|
| `src/data/resume.tsx` → `DATA.name`, `description`, `summary` | `src/content/bio.md` |
| `public/picofme.jpeg` | `public/picofme.jpeg`, referenced as `avatar: "picofme.jpeg"` |
| `DATA.work[]`, `DATA.education[]` | `src/content/cv.md` frontmatter |
| `DATA.projects[0]` — Named Entity Recognition in Subsea Inspections | `src/content/publications/named-entity-recognition-subsea-inspections.md` |
| `DATA.projects[1]` — Shevinu's Digest | `src/content/projects/shevinus-digest.md` |
| `src/content/blog/how-brain-rotted-are-we.mdx` | `src/content/posts/how-brain-rotted-are-we.md` |
| `DATA.contact.social` | `src/config/social.ts` |
| `DATA.url`, `DATA.name`, `DATA.description` | `src/config/site.ts` → `SITE` |
| `public/og_image.png`, `public/favicon.svg` | `public/` (overwrite template favicon) |

## Steps

- [ ] 1. Copy assets from v3 to v4 `public/`: `picofme.jpeg`, `og_image.png`, `favicon.svg`. Overwrite the template `favicon.svg`. Delete the template `favicon.ico` if v3 has no equivalent.
- [ ] 2. Rewrite `src/content/bio.md`:
      - frontmatter: `name: "Shevinu Nawalage"`, `avatar: "picofme.jpeg"`, `shortBio` from `DATA.description`, `institution: "Enaimco · St. John's, NL"`
      - body: an About section built from `DATA.summary` plus the research-interest framing (ML on climate and weather data). Keep it first-person and factual. Do not invent biography.
- [ ] 3. Rewrite `src/content/cv.md`:
      - `name: "Shevinu Nawalage"`, `title: "Software Engineer"`
      - `experience`: the two Enaimco roles from `DATA.work[]` — role, institution, period (`Sep 2025 - Present`, `May 2024 - Sep 2025`), description verbatim from v3
      - `education`: Memorial University of Newfoundland (BSc Computer Science, Sep 2021 - Jun 2026) and Tecnológico de Monterrey (International Visiting Student, Feb 2026 - Jun 2026)
      - body: a Skills list from real v3 skills (TypeScript, Python, Node.js, Go, PostgreSQL, Docker, Kubernetes, Terraform, Azure, MongoDB, Astro). Delete the template's "Extra biographical notes or a summary can go here." placeholder.
- [ ] 4. Create `src/content/publications/named-entity-recognition-subsea-inspections.md`:
      - `title: "Named Entity Recognition in Subsea Inspections"`
      - `author: "Shevinu Nawalage"`
      - `date: "2025"` — in the format the adapters parse (see Context)
      - `external_url: "https://www.researchgate.net/publication/406006394_Named_Entity_Recognition_in_Subsea_Inspections"`
      - `description`: the v3 text, with the typo fixed — "survery" → "survey"
      - `tags`: `["nlp", "named-entity-recognition", "bert", "subsea-inspection"]`
      - body: 2–4 paragraphs expanding the abstract from the v3 description only. Do not invent results, metrics, venue or citation counts.
- [ ] 5. Create `src/content/projects/shevinus-digest.md` from `DATA.projects[1]`: title, description verbatim, `external_url: "https://digest.shevinum.dev"`, tags from `technologies`. Mention the GitHub source (`https://github.com/ShevinuM/daily-tech-digest`) in the body.
- [ ] 6. Create `src/content/posts/how-brain-rotted-are-we.md` from the v3 `.mdx`. The body is pure markdown — no JSX, no imports — so it copies verbatim. Rename frontmatter fields: `publishedAt` → `date` (`2026-09-19`, matching the adapters' expected format), `summary` → `description`; keep `title` and `tags`; add `author: "Shevinu Nawalage"`.
- [ ] 7. Rewrite `src/config/social.ts`: keep GitHub (`https://github.com/ShevinuM`), LinkedIn (`https://www.linkedin.com/in/shevinum/`), Mail (`mailto:shevinu2002@gmail.com`). Delete the Google Scholar and ORCID entries and their `SOCIAL_ICONS` map entries. Delete the now-unused `GoogleScholar.svg` and `ORCID.svg` from `src/assets/icons/` and `src/assets/icons.ts`. Update every `linkTitle`.
- [ ] 8. Rewrite `SITE` in `src/config/site.ts`: `website: "https://shevinum.dev"`, `author: "Shevinu Nawalage"`, `title: "Shevinu Nawalage"`, `desc` from `DATA.description`, `ogImage: "og_image.png"`, `favicon: "/favicon.svg"`. Leave `postPerPage` and `lang`.
- [ ] 9. Update `src/config/pages.ts` subtitles so none of them describe Shannon ("Thoughts on physics, philosophy, and music." is his). Write subtitles that fit this site, or set them to `""`.
- [ ] 10. `astro.config.mjs`: set `site: 'https://shevinum.dev'` and **delete** the `base` line. Leave the markdown plugins, sitemap and tailwind config alone.
- [ ] 11. `public/robots.txt`: point the sitemap at `https://shevinum.dev/sitemap-index.xml`.
- [ ] 12. `package.json`: set `"name": "portfolio-v4"`. Change nothing else.
- [ ] 13. Rewrite `README.md` to describe this site — what it is, how to run it, where content lives, and an attribution line crediting `rubzip/academic-portfolio-astro` (MIT). Delete the template's demo screenshot reference (`public/main_page.jpg` was removed in phase 02) and its "bootstrap from this template" instructions.
- [ ] 14. Update `AGENTS.md`: remove the `teaching/` and `talks/` references left over after phase 02. Keep the rest — it is useful architecture documentation.
- [ ] 15. `npm run build` must exit 0.
- [ ] 16. Commit in reviewable units: (a) assets + bio + cv, (b) publication + project + post, (c) config + astro.config + robots, (d) README + AGENTS + package name. Each commit ends with the `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` trailer.

## Verification

Run from `/Users/shev/Development/portfolio-v4`:

| check | command | expected |
|---|---|---|
| build | `npm run build` | exit 0 |
| post route | `test -f dist/posts/how-brain-rotted-are-we/index.html` | pass |
| publication route | `test -f dist/publications/named-entity-recognition-subsea-inspections/index.html` | pass |
| project route | `test -f dist/projects/shevinus-digest/index.html` | pass |
| publication listed | `grep -c "Named Entity Recognition" dist/publications/index.html` | ≥ 1 |
| post listed | `grep -c "How Brain Rotted Are We" dist/posts/index.html` | ≥ 1 |
| no Shannon anywhere | `grep -rni "shannon\|bell-labs\|petoskey\|rubzip.github.io" src/ public/ dist/ README.md AGENTS.md` | no output (the footer link to `github.com/rubzip/...` is expected and allowed — exclude it by matching `rubzip.github.io` only) |
| no v3 leftovers | `grep -rni "alexmercer\|alex@\|512 000 0000\|starfolio" src/ public/ dist/ README.md package.json` | no output |
| sitemap host | `grep -c "shevinum.dev" dist/sitemap-0.xml` | ≥ 1 |
| sitemap has no template host | `grep -c "rubzip" dist/sitemap-0.xml` | 0 |
| no base path in links | `grep -c "/academic-portfolio-astro/" dist/index.html` | 0 |
| avatar resolves | `ls dist/_astro/ \| grep -i picofme` or confirm the `<img>` src in `dist/index.html` points at an existing file | pass |
| nav links resolve | for each href in `src/config/navigation.ts`, the matching `dist/<path>/index.html` exists | all pass |
| clean tree | `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'` | empty — **use this exact form**. A bare `git status --short` always shows `Tasks/` churn that the protocol itself requires, and would FAIL spuriously. |

## Acceptance criteria

- [ ] All verification checks pass.
- [ ] Every fact on the built site traces to `/Users/shev/Development/portfolio-v3`. Nothing invented — no fabricated publication venue, citation count, award, or biography.
- [ ] The NER paper appears under Publications and the article under Blog.
- [ ] Each commit builds green on its own.

## Stop conditions

Do not redesign components, layouts or styles. Do not add new collections or new pages. Do not add content the user did not ask for (no talks, no photos section, no extra blog posts). Deployment configuration is phase 04. If a content field needs a schema change beyond what `content.config.ts` already allows, stop and report it rather than editing the schema.
