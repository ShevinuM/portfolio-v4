# Deferred

## Waiting on a decision from you

1. **Astro 6 → 7.** Phase 03b updates Astro to `6.4.8`, which clears the critical advisory. Astro `7.3.3` is a major release with breaking changes. It was deliberately not done overnight — a framework migration on a site whose content landed hours earlier makes any breakage impossible to attribute. Decide when you are around to look at the result.

2. **KaTeX 0.16 → 0.18.** Same reasoning. `0.16.47` is what phase 03b installs.

3. **KaTeX could be removed entirely.** 4.4 MB installed, and `katex.min.css` is imported globally in `BaseLayout.astro`, so every page pays for it. No content on the site uses math once the Shannon posts are gone. Offered on 2026-09-22 and not chosen — recorded so the option is not lost.

4. **`@fontsource-variable/inter` is installed and imported zero times.** `BaseLayout.astro` uses five static weights from `@fontsource/inter` instead. Either drop the variable package, or switch to it and replace five CSS imports with one. Offered and not chosen.

5. **`astro check` will exist but is not enforced.** Phase 03b adds the script and runs it once. If it reports errors, they are recorded in that phase's `Results/NOT_DONE[H].md` and left alone — fixing them is a separate task.

6. **`zod` is used but never declared.** `src/content.config.ts` imports it, and `package.json` does not list it. npm's flat `node_modules` made that work by accident; pnpm's strict layout broke it, which is how it was found. Phase 02b routed around it with `import { z } from 'astro/zod'` — correct and proven, and it keeps that phase's no-drift guarantee. The straightforwardly honest fix is `"zod": "^4.3.6"` in `dependencies`, which you may prefer. This is a bug in the upstream template, not something the rebuild introduced.

7. **The README documents a `format` script that does not exist.** `README.md:104` tells a reader to run `pnpm run format`, but `package.json` declares no such script. A pre-existing template defect — phase 02b converted the command verbatim rather than inventing a script, which was correct. Either add a formatter (the template has no prettier config either) or drop the line. Phase 03 rewrites the README and will not carry the false claim forward.

## Dropped, no decision needed

6. **Photo gallery.** portfolio-v3 has a "My Recent Travels" section with 9 photos in `portfolio-v3/public/photos/`. The new template has no gallery route or component. Dropped on 2026-09-22 by your decision. The photos still exist in v3 if you want a gallery later — it would mean a new collection, a new route and a new component.

7. **Project demo videos.** v3 links two R2-hosted mp4 demos. No template content schema has a video field, so they have no home. The URLs are preserved here:
   - NER: `https://pub-242f479808604bc19262827ef055097f.r2.dev/subsea_ner_framework_polished.mp4`
   - Digest: `https://pub-242f479808604bc19262827ef055097f.r2.dev/daily-tech-digest-demo.mp4`

8. **SpideyHub project.** Commented out in v3's `resume.tsx`, so it was already disabled. Not carried over.

9. **Blog search box.** Asked for on 2026-09-22 and withdrawn a minute later. Nothing was written. The template ships no search of any kind; adding one would mean a new component, a client-side index and styling in `global.css`.
