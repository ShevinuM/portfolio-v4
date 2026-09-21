# Deferred

## Waiting on a decision from you

1. **Astro 6 → 7. THIS IS NOW THE OPEN QUESTION Q8 — see `OPEN_QUESTIONS[H].md`.**
   The plan's premise was wrong and phase 03b caught it: **the critical advisory is NOT fixable in-range.** GHSA-26w7-cxv4-gfx2 (remote code execution through AVIF image optimization) is patched only at Astro **`>=7.2.8`**. The in-range update to 6.4.8 did clear five other real advisories, including an XML-injection flaw in `@astrojs/rss` — but not that one.
   Astro `7.3.3` is a major with breaking changes, and the migration will have to touch `astro.config.mjs`: it emits a 6.x deprecation on every check run, because `markdown.remarkPlugins` / `rehypePlugins` / `remarkRehype` are superseded by `unified({...})` from `@astrojs/markdown-remark` — and that is exactly the block wiring up `remark-math` and `rehype-katex`.
   **On real exposure:** the site is fully static. There is no `output` or `adapter`, so no request-time `/_image` endpoint exists in production, and the only `astro:assets` use is your own avatar JPEG. Read the GitHub advisory yourself before deciding — phase 03b deliberately did not characterise the attack vector, because the advisory record pnpm returns carries no description text and it refused to guess.

2. **KaTeX 0.16 → 0.18.** Same reasoning. `0.16.47` is what phase 03b installs.

3. **KaTeX could be removed entirely.** 4.4 MB installed, and `katex.min.css` is imported globally in `BaseLayout.astro`, so every page pays for it. No content on the site uses math once the Shannon posts are gone. Offered on 2026-09-22 and not chosen — recorded so the option is not lost.

4. **`@fontsource-variable/inter` is installed and imported zero times.** `BaseLayout.astro` uses five static weights from `@fontsource/inter` instead. Either drop the variable package, or switch to it and replace five CSS imports with one. Offered and not chosen.

5. **`astro check` will exist but is not enforced.** Phase 03b adds the script and runs it once. If it reports errors, they are recorded in that phase's `Results/NOT_DONE[H].md` and left alone — fixing them is a separate task.

6. **`zod` is used but never declared.** `src/content.config.ts` imports it, and `package.json` does not list it. npm's flat `node_modules` made that work by accident; pnpm's strict layout broke it, which is how it was found. Phase 02b routed around it with `import { z } from 'astro/zod'` — correct and proven, and it keeps that phase's no-drift guarantee. The straightforwardly honest fix is `"zod": "^4.3.6"` in `dependencies`, which you may prefer. This is a bug in the upstream template, not something the rebuild introduced.

7. **The README documents a `format` script that does not exist.** `README.md:104` tells a reader to run `pnpm run format`, but `package.json` declares no such script. A pre-existing template defect — phase 02b converted the command verbatim rather than inventing a script, which was correct. Either add a formatter (the template has no prettier config either) or drop the line. Phase 03 rewrites the README and will not carry the false claim forward.

8. ~~**The avatar `<Image>` emitted malformed markup.**~~ **FIXED** in `48e4f22`, outside the phase structure, after a visual check. `src/components/layout/LeftSidebar.astro` line 18 had a `/* ... */` comment inside the `<Image>` attribute list, which Astro parsed as six junk HTML attributes (`*="true" Maximum="true" in="true" global.css="true" for="true" sidebar-avatar="true"`) plus `width="1"`.
   **The earlier "renders 1 pixel wide" description was wrong** — `.sidebar-avatar { width: 160px }` in `global.css` overrode the attribute, so the portrait always displayed correctly. The real damage was invalid DOM attributes and a `srcset` that never resized the image. Confirmed fixed: the markup is now clean and the page renders correctly in both themes.

9. **`/favicon.ico` 404s.** The template's `favicon.ico` was deleted and `SITE.favicon` points at the `.svg`, but browsers still probe `/favicon.ico` by default. Harmless, noisy in logs.

10. **Two unused social icons ship in the bundle** — `Facebook.svg` and `Twitter.svg` in `src/assets/icons/`. Nothing references them.

11. **The talks detail route is never exercised.** `src/pages/talks/[id].astro` exists but `talks/` is empty by your choice, so the route has never rendered. If you ever add a talk, that page runs for the first time.

12. **The licence is still Rubén Gijón's.** `LICENSE` is the template author's MIT, correctly kept — MIT requires the notice. But you have not chosen terms for your own content and writing. Worth deciding before the repo is public.

13. **A timezone bug in date rendering.** `date: "2025"` renders as "January 2025" here and on GitHub Actions, but as "December 2024" for a reader west of UTC. Affects the NER publication's date. Pre-existing in the template's date handling.

14. **A purpose-built OG card.** Your social-share image is currently your portrait (`picofme.jpeg`), which works but is not a designed 1200×630 card. See `Tasks/03-Content/Results/DEVIATIONS[H].md` for why v3's `og_image.png` was not reused.

15. **13 TypeScript errors, now visible for the first time.** `pnpm run check` exists and exits 1. All 13 predate this run — the strict tsconfig had simply never been enforced. They cluster in five files: `ContentLinks.astro` (a `DisplayLink.external` property that is not on the type), `BaseLayout.astro` (`ANALYTICS.umami` possibly undefined, ×3), `posts/[id].astro` (a `readingTime` prop the component does not declare, and `new Date(undefined)` ×2), and `tags/[tag].astro` (six properties read off a union that does not have them). The build does not care, and the check is deliberately NOT in CI. Full output with code frames is in `Tasks/03b-Dependencies/Results/NOT_DONE[H].md`.

20. **The README says the site is live when it is not.** `README.md` lines 4–5 claim the site is "live at https://shevinum.dev". Nothing is published yet — the repo has no git remote. Phase 04's README scope was the deploy section only, so it left the line alone and flagged it. Fix it, or leave it until the site actually is live.

## Dropped, no decision needed

16. **Photo gallery.** portfolio-v3 has a "My Recent Travels" section with 9 photos in `portfolio-v3/public/photos/`. The new template has no gallery route or component. Dropped on 2026-09-22 by your decision. The photos still exist in v3 if you want a gallery later — it would mean a new collection, a new route and a new component.

17. **Project demo videos.** v3 links two R2-hosted mp4 demos. No template content schema has a video field, so they have no home. The URLs are preserved here:
   - NER: `https://pub-242f479808604bc19262827ef055097f.r2.dev/subsea_ner_framework_polished.mp4`
   - Digest: `https://pub-242f479808604bc19262827ef055097f.r2.dev/daily-tech-digest-demo.mp4`

18. **SpideyHub project.** Commented out in v3's `resume.tsx`, so it was already disabled. Not carried over.

19. **Blog search box.** Asked for on 2026-09-22 and withdrawn a minute later. Nothing was written. The template ships no search of any kind; adding one would mean a new component, a client-side index and styling in `global.css`.
