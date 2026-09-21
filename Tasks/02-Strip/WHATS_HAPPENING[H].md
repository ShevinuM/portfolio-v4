# Phase 02 — Strip

Status: IN PROGRESS.

---

**Orientation done; step-1 enumeration recorded.** Ran the plan's enumeration grep before touching anything — 69 hits across 23 files, every one now resolved by name in `PLAN[A].md` as Ruling 5, split across the four commits. The enumeration falsified four of the plan's assumptions (Ruling 6): `adapters.ts` has no teaching branch, `icons.ts` is an auto-glob so deleting the SVG is the whole fix, `PagesConfig` is a `Record` with no field to remove, and the tags/RSS pages have no teaching references at all — the entire shared-aggregate exposure is `src/utils/tags.ts` alone.

**Three conflicts ruled before dispatch, none blocking.** The "Shannon gone" check's allowlist was too narrow — `src/config/site.ts` and `src/config/social.ts` also carry Shannon identity, and they belong to phase 03, so the allowlist is widened to four files rather than inventing placeholder identity now (Ruling 8). Doc references to files this phase deletes are removed by minimal deletion, which does not collide with phase 03's rewrite (Ruling 7). Machine-local caches under `.memsearch/` hit the grep and are ruled out of scope (Ruling 9).

**Executor (a) dispatched — remove the Teaching section.** It owns one commit and returns; it has the 16-item file list from Ruling 5, the falsified-assumption list so it does not hunt for a teaching branch that was never in `adapters.ts`, and the `':(exclude)Tasks'` form of the tree check.

**Executor (a) returned; commit `8a76635` "Remove the Teaching section".** 13 files, 118 deletions. Build green at 52 pages (down from 56 — the two teaching routes plus their index). `/talks` still builds, `dist/teaching/` is gone, and the tree outside `Tasks/` is clean. The only surviving `teaching` string in `src/` is one line inside the demo blog post that commit (d) deletes anyway.

**Executor (b) dispatched — remove the developer tools.** Five `dev-tools` pages, `DevToolsLayout.astro`, the `Settings.svg` icon, the footer's gated block, and the `addDevToolsInProduction` flag and its type field.

**Executor (b) returned; commit `1cb7d6a` "Remove the developer tools pages and Settings icon".** 11 files, 870 deletions. Build green at 47 pages (the five dev-tools pages gone). `Settings.svg` deleted, and it confirmed firsthand that `icons.ts` needed no edit because it globs the icon directory — Ruling 6.2 holds. The footer's RSS link and theme toggle still render. Tree outside `Tasks/` clean.

It also caught an error in my own dispatch note: I told it the `dev-tools` grep should print nothing, but Ruling 5 already licenses one surviving hit inside the demo blog post that commit (d) deletes. The ruling was right and my note was wrong; the commit is not at fault.

**Executor (c) dispatched — footer rework and the Notepad theme.** Drop the `©` line, move the attribution span into the left slot and un-hide it on mobile, and switch `themeLight` to `light_notepad`.

**Executor (c) returned; commit `c574460` "Drop the copyright line and switch to the Notepad light theme".** The `©` line is gone (zero hits in the built page), the attribution span now sits in the left slot without `hidden sm:inline-block` so it shows on mobile, and the MIT attribution link survives. `SITE` became genuinely unused in the footer and was dropped from the import. Both Notepad hexes now appear in the built page — six hits each — which is the proof the light theme switched; before this commit only the dark one appeared.

**Executor (d) dispatched — delete the Shannon demo content and assets.** This is the commit that empties four collections at once, so it carries an explicit instruction to prove `/posts`, `/tags`, `/talks` and the RSS feed still build with zero entries, and to fix the page rather than restore demo content if one of them throws.

**Executor (d) returned; commit `fe03d22` "Remove the Claude Shannon demo content and assets".** 26 files, 1164 deletions — all 12 demo markdown files, both Shannon JPEGs and the whole `example_contents/` directory, with a `.gitkeep` in each of the four collection directories so they survive a clone.

**It also found a real trap that the plan never predicted.** Astro's content-layer cache does not drop entries for deleted source files, so after the deletion `npm run build` kept happily emitting the old 47-page site with the demo posts still in it — green, and wrong. `astro sync` does not purge it either. Clearing `data-store.json` gives the true tree at 8 pages. Recorded as Ruling 12, because anyone who builds on a warm cache after deleting content will measure the previous tree.

**No empty collection broke anything (Ruling 13).** The licensed fallback of patching a listing page was not needed: paginating an empty array still emits `/posts`, `getCollection` on an empty collection warns rather than throws, and the tags page renders its own "no tags" branch. All seven nav links plus the RSS feed resolve.

**Both long gates run by me, not delegated.** The full build from a purged cache: exit 0, 8 pages. Then each of the four commits built in isolation from a cold cache — 52 / 47 / 47 / 8, all exit 0, no errors — which satisfies "each commit builds green on its own" and proves the cache staleness masked nothing. The first attempt at that gate failed on all four commits at once; that turned out to be a symlinked `node_modules` confusing Vite, not a bad commit, and the workaround is recorded as Ruling 14.

**Verifier returned PASS.** All 13 verification rows and all four acceptance criteria satisfied. It independently re-ran the step-1 enumeration grep and got back exactly the four licensed `SettingsConfig` hits and nothing else — no teaching, no dev-tools, no stale doc references. It confirmed all seven nav links resolve in `dist/` and that the footer markup matches the ruling.

It also caught something I owed and had not yet written: three rulings each said "record this in `DEVIATIONS[H].md`" and the file did not exist yet. Fair catch — that is a close-out artefact and it is now written.

**Phase 02 closed.** Four commits, `8a76635` → `fe03d22`, build green at 8 pages, tree clean outside `Tasks/`. Results written to `Tasks/02-Strip/Results/`.

The one thing phase 03 must not miss: `bio.md` still points its avatar at the deleted `shannon.jpg`, so the portrait 404s on every page until phase 03 rewrites it. The site title and social links likewise still say Claude Shannon — deliberately, since inventing placeholder identity would only have been overwritten.

Nothing was committed under `Tasks/`; the main session owns that.


