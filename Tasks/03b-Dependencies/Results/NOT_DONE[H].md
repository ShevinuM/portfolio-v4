# Phase 03b — what was in scope and is not done

## 1. The critical Astro advisory is not cleared. It needs a decision from you.

**This is the one failed check.** The plan assumed the fix was in-range and free. It is not.

The critical advisory is `Astro: Remote code execution through AVIF image optimization` (GHSA-26w7-cxv4-gfx2). It is patched only in Astro **7.2.8**. This phase was limited to Astro 6.4.8.

**Full write-up, with both options and my read: Q8 in `Tasks/OPEN_QUESTIONS[H].md`.** Short version: your site has no server side, so exposure looks low, and staying on 6.4.8 is defensible. Doing Astro 7 is the real fix and it is your call.

## 2. The 13 type errors are recorded, not fixed.

This was the plan's rule: run the checker once, write down what it says, change nothing. `src/` was read-only to this phase. Fixing these is a separate job.

Run `pnpm run check` yourself to see them. **13 errors in 4 files:**

1. **`src/pages/tags/[tag].astro`** — 5 errors. Lines 33-35 read `date`, `author`, `journal`, `event` and `institution` off a listing item whose type has none of them. This is the tag page reading fields that only exist on some collections.
2. **`src/layouts/BaseLayout.astro`** — 3 errors, lines 129-132. `ANALYTICS.umami` may be undefined and the code reads `.websiteId` and `.src` off it without checking.
3. **`src/pages/posts/[id].astro`** — 3 errors. Line 34 passes `readingTime` to a component that does not declare it. Line 16 sorts by `new Date(post.data.date)` where `date` may be undefined.
4. **`src/components/content/ContentLinks.astro`** — 2 errors, lines 18 and 20. Reads `link.external`, which is not on the `DisplayLink` type.

**8 hints, all unused variables or imports:** `LeftSidebar.astro:2` (`SITE`), `ShareButtons.astro:10` (`description`), `resume/index.astro:19` (`name`, `title`), `tags/[tag].astro:5,6,16` (`getListingItem`, `SITE`, `tag`), `utils/adapters.ts:10` (`collection`).

**None of these break the build.** The site builds and renders. These are type-level problems only.

## 3. The 14 remaining security advisories are not fixed.

1 critical + 4 Astro rows need Astro 7 (see item 1).
The other 9 are transitive — `nanoid`, `postcss`, `sharp`, `esbuild`, deep inside Astro's own dependency tree. **No change to your `package.json` can reach them.** They move when Astro moves.

## 4. `astro check` was not added to CI.

Deliberate, per the plan. It reports 13 errors, so adding it would break your deploy on the first push.

## 5. Nothing was removed.

`@fontsource-variable/inter` is still installed and still imported zero times. KaTeX is still installed at 4.4 MB. Both removals were offered to you earlier and not chosen, so this phase left them alone. They stay in `DEFERRED[H].md`.
