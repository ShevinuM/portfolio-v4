# Phase 02 — Strip — NOT DONE

Nothing in this phase's plan was left undone. Every step 1-10 is complete and the verifier returned PASS.

What follows is work this phase deliberately did **not** do, so phase 03 does not assume it was handled.

## Left for phase 03 — must-fix

1. **`src/content/bio.md` still contains Claude Shannon's biography**, including `name: "Claude Shannon"`, `institution: "MIT, Cambridge MA"`, the Petoskey/Bell Labs life story and the juggling-machine anecdote. Left in place on purpose — the `bio` collection is single-entry and the build needs the file.
2. **`avatar: "shannon.jpg"` in `bio.md` points at a file this phase deleted.** It 404s on every page right now. See `DEVIATIONS[H].md` §3.
3. **`src/content/cv.md` still contains Shannon's CV** — same reasoning, same treatment.
4. **`src/config/site.ts` still carries Shannon's identity:** `website`, `author`, `desc`, `title` and `ogImage: "shannon.webp"` (note: that file never existed in `public/` even in the template). The site `<title>` and the RSS feed title both read "Claude Shannon".
5. **`src/config/social.ts` still carries five fabricated Shannon links** — `github.com/shannon`, `mailto:shannon@bell-labs.com`, a Google Scholar query, ORCID `0000-0002-1825-0097` and a LinkedIn URL. All need replacing or disabling.
6. **`AGENTS.md` still describes the upstream template's architecture.** Only the one stale `teaching/` reference was removed; the substantive rewrite is phase 03's, per the plan's own Context.
7. **The four collection directories are empty**, each holding only a `.gitkeep`. Phase 03 refills `posts/`, `publications/` and `projects/`.

## Deliberately permanent — do NOT "fix" these

- **`src/content/talks/` stays empty forever.** The developer chose at the stop gate to keep Talks as an empty listing rather than remove the section. The collection, `src/pages/talks/`, `PAGES.talks` and the nav link all stay. `/talks` renders an empty listing and that is correct.
- **`src/config/themes.ts` keeps all palettes**, not just the two Notepad ones. They are a template feature; only the active selection changed.
- **`LICENSE` stays** and the footer keeps its "Built with Academic Portfolio Astro" link. MIT compliance is not satisfied by either one alone.

## Out of scope for this phase, still open

- **13 npm audit vulnerabilities** (1 critical, 9 high) inherited from the untouched template. Phase 04 gate. Not touched here — `npm audit fix` mid-strip would change dependencies underneath the build.
- **`sharp`'s install script is still skipped** by npm. Inert so far; all builds pass. If phase 03 adds real images and image handling breaks, the fix is `npm install-scripts approve sharp`.
- **`.github/workflows/deploy.yml`** is committed and unread by anyone — inert with no remote. Phase 04 owns it. Untouched.
- **No typecheck or lint gate exists.** `node_modules/typescript` is absent by design, so `tsc` and `astro check` cannot run. `npm run build` was the only automated gate available and it was the only one used.
