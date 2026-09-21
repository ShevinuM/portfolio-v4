# Phase 02 — Strip — DEVIATIONS

Six deviations. None blocked the phase; four are carried into phase 03.

## 1. The `©` line was removed outright, not re-authored (Ruling 1)

The plan directed this and the developer asked for "remove 2026 Claude Shannon", so no replacement copyright was written. **Consequence:** the footer's left `<div>` would have been empty, so the "Built with Academic Portfolio Astro" span moved into it and lost its `hidden sm:inline-block` classes. The attribution is now visible on mobile, which it was not before. The MIT attribution link to `https://github.com/rubzip/academic-portfolio-astro/` is retained — `LICENSE` alone does not satisfy the notice requirement.

Side effect: `SITE` became unused in `Footer.astro` and was dropped from its import, leaving `import { THEME_CONFIG } from "../../config";`.

## 2. The "Shannon gone" allowlist was widened from two files to four (Ruling 8)

**The Verification row was inconsistent with the plan, and the row was corrected rather than the tree.** The row allowed only `src/content/bio.md` and `src/content/cv.md` to still contain "Claude Shannon", but `src/config/site.ts` (`author`, `title`, `desc`, `website`, `ogImage`) and `src/config/social.ts` (five Shannon URLs and link titles) also do. The plan's own "Known Shannon assets" inventory never listed either file, and the allowlist mirrored that inventory.

**At the end of this phase the site `<title>` still reads "Claude Shannon", `SITE.author` is still "Claude Shannon", and `SOCIALS` still point at `github.com/shannon`, `shannon@bell-labs.com` and a fake ORCID.** The RSS feed title reads "Claude Shannon" for the same reason.

Rejected: inserting placeholder identity. It would be a third identity that phase 03 overwrites anyway, and `SITE.website` feeds `new URL(...)` in `src/pages/posts/[id].astro` and `context.site || SITE.website` in `src/pages/rss.xml.ts` — a blank or invented URL would be a new failure mode introduced by the strip.

## 3. `bio.md` now points at a deleted avatar (Ruling 10)

`src/content/bio.md` declares `avatar: "shannon.jpg"` and `public/shannon.jpg` was deleted in `fe03d22`. `src/components/layout/LeftSidebar.astro` renders it as a plain `<img src={`/${bio.avatar}`}>`, which Astro does not resolve or validate, **so the build stays green and the image simply 404s at runtime on every page.**

`bio.md` was left untouched because the plan reserves it for phase 03 twice. **Phase 03 must fix this** — it is the most visible artefact of the strip.

## 4. Documentation was edited, which the plan reserved for phase 03 (Ruling 7)

The plan's Context says "Update `AGENTS.md` in phase 03". Acceptance criterion 4 nonetheless requires every step-1 grep hit resolved, and several hits were in docs. Both were honoured by ruling that **the phase-03 reservation governs the substantive rewrite, while removing a reference to a file this phase deletes is stripping.** A doc asserting that `src/pages/teaching/` exists after it is deleted is simply false.

Edits were delete-only, with no re-authoring for anyone: `README.md` (four teaching mentions, the `main_page.jpg` screenshot line, the `## 📖 Documentation & Setup` section whose only content linked a deleted post), `AGENTS.md` (one list item), `DESIGN-GUIDE.md` (one tree line). Two tree-diagram connector characters were repaired where the deleted line had been the branch's leaf.

## 5. Files the plan named that needed no edit, and files it did not name that did (Ruling 6)

The plan was written from the template's structure rather than from a read of the files. Four of its instructions had no referent:

- `src/utils/adapters.ts` has **no teaching branch** — it is collection-agnostic. No edit.
- `src/assets/icons.ts` has **no literal `Settings` entry** — it is `import.meta.glob('./icons/*.svg')`. Deleting the SVG was the entire fix.
- `PagesConfig` is `Record<string, PageConfig>` — there is **no per-section field** to remove, so neither the `teaching` field nor the "TalksPage type field" exist.
- `src/pages/tags/*` and `src/pages/rss.xml.ts` have **zero teaching references**. The whole shared-aggregate exposure was `src/utils/tags.ts` alone.

Conversely, four files the plan never named did need a branch deleted: `src/layouts/BaseListing.astro`, `src/layouts/BaseDetail.astro`, `src/types/content.ts`, `src/types/index.ts`. Covered by the Stop conditions' allowance for deleting a branch, so the phase proceeded rather than reporting a planning defect.

## 6. Astro's content-layer cache had to be cleared to get a truthful build (Ruling 12)

Ruling 9 says not to delete the machine-local caches, but that ruling is scoped to the Shannon grep sweep. It does not cover a stale cache producing a **false-positive build**, which is what happened: after deleting all content, `npm run build` kept emitting the old 47-page site with the demo posts still in it, exiting 0 the whole time. `astro sync` did not purge it.

`node_modules/.astro/data-store.json` and `.astro/data-store.json` were deleted to force a truthful build. Both are untracked (`.astro/` and `node_modules/` are gitignored) and regenerate automatically. Nothing tracked was affected.

**Caveat on the diagnosis.** Only the *cure* is verified: clearing the store yields the true 8-page tree, reproducibly. The *mechanism* ("the store is additive and never purges deleted entries") is executor (d)'s inference from a single observation and was not independently confirmed — Astro 5's glob loader does track untouched entries for deletion, so the real cause may be a stale `.astro/` types directory or a build that raced the `git rm`. Phase 03 should treat the workaround as reliable and the explanation as provisional. It bites on deletes and renames; phase 03 mostly **adds** content, where this is not in question.
