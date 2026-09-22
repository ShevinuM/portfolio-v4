# Phase 02 — Strip

## Objective

Every Claude Shannon demo artefact, the Teaching section, the developer-tools (Settings) icon and its pages, and the `©` footer line are gone from the repo. The Notepad theme is active in both light and dark mode. The build is still green and no route or aggregate page references a removed collection.

**Talks stays.** The developer chose to keep the Talks section with an empty listing.

## Scope

`/Users/shev/Development/portfolio-v4/` — `src/`, `public/`, `example_contents/`, `README.md`, `AGENTS.md`, `DESIGN-GUIDE.md`, `.github/`.

Read-only: `Tasks/`, `package.json`, `package-lock.json`, `LICENSE`, `astro.config.mjs` (phase 03 owns it).

## Context

- Absolute paths everywhere. Quote any path containing `[` or `]`.
- **Tags, RSS and the adapters aggregate across collections.** Deleting a collection without updating `src/utils/adapters.ts`, `src/utils/tags.ts`, `src/pages/tags/*` and `src/pages/rss.xml.ts` breaks the build or silently produces empty pages. Enumerate before deleting.
- The dev-tools icon in the footer is gated by `import.meta.env.DEV || SETTINGS.addDevToolsInProduction`. Setting the flag to `false` still shows the icon in dev. The block must be **removed**, along with the `addDevToolsInProduction` flag and its field in `SettingsConfig` (`src/types/config.ts`).
- Footer current state (`src/components/layout/Footer.astro`): left `<div>` holds `© {currentYear} {SITE.author}.`; right `<div>` holds "Built with Academic Portfolio Astro" (class `hidden sm:inline-block`), the RSS link, the theme toggle and the dev-tools link.
- Theme: `src/config/site.ts` already has `themeDark: "dark_notepad"`. Only `themeLight` needs changing to `"light_notepad"`.
- `src/config/themes.ts` keeps **all** palettes. They are a template feature, not boilerplate.
- `LICENSE` stays. The template is MIT; the licence notice is a legal requirement, not boilerplate.
- `AGENTS.md` stays. It documents the architecture for future agents. Update it in phase 03, do not delete it.
- Known Shannon assets: `public/shannon.jpg`, `public/main_page.jpg`, `example_contents/` (7 sample markdown files), all files under `src/content/posts/`, `src/content/publications/`, `src/content/projects/`, `src/content/talks/`, `src/content/teaching/`, plus `src/content/bio.md` and `src/content/cv.md`.
- `src/content/bio.md` and `src/content/cv.md` must **not** be deleted — their collections are single-entry and the build needs them. Phase 03 rewrites their contents. Leave them in place in this phase.

## Rulings

1. The `©` line is removed outright, not re-authored with the user's name. The user said "remove 2026 Claude Shannon". Consequence: the footer's left `<div>` becomes empty, so the "Built with Academic Portfolio Astro" span moves into it and loses `hidden sm:inline-block`, which satisfies "Built with Academic Portfolio Astro at the bottom" on mobile too. Record this in `DEVIATIONS[H].md`.
2. **Talks is kept**, with an empty listing. The developer chose this at the stop gate over removing it. Consequence: the `talks` collection, its pages, its `PAGES` entry and its nav link all stay; only the Shannon demo talk (`src/content/talks/bandwagon.md`) is deleted. The listing page and the tags/RSS aggregates must therefore survive a zero-entry `talks` collection.
3. Theme palettes in `themes.ts` are kept. Only the active theme selection changes.
4. `LICENSE` is kept. MIT compliance is not satisfied by the footer attribution alone.

---

### Ruling 5 — Step-1 enumeration (recorded 2026-09-22, before any edit)

Command run verbatim from `/Users/shev/Development/portfolio-v4`:

```
grep -rn "teaching\|Teaching\|dev-tools\|DevTools\|Settings\|addDevToolsInProduction" src/ README.md AGENTS.md DESIGN-GUIDE.md
```

69 hits across 23 files. Resolution of every hit, by commit:

**Commit (a) — remove Teaching**
| hit | resolution |
|---|---|
| `src/content/teaching/physics-of-information.md:33` | DELETE whole directory `src/content/teaching/` |
| `src/pages/teaching/[id].astro:6,16` · `src/pages/teaching/index.astro:5,9,12` | DELETE whole directory `src/pages/teaching/` |
| `src/content.config.ts:45,46,105` | DELETE `teaching` collection def + `collections` export entry |
| `src/config/pages.ts:29,30` | DELETE the `teaching` entry |
| `src/config/navigation.ts:7` | DELETE the Teaching nav link |
| `src/types/content.ts:59` | DELETE `interface Teaching` |
| `src/types/index.ts:12` | DELETE `Teaching,` from the re-export |
| `src/utils/tags.ts:8,10,35,47` | DELETE the four teaching lines/spread members |
| `src/layouts/BaseListing.astro:8` | DELETE `"teaching" \|` from the union |
| `src/layouts/BaseDetail.astro:11,28` | DELETE from union; collapse the `=== "teaching" ? "Institution"` ternary branch |
| `README.md:18,21,77,98` · `AGENTS.md:13` | DELETE the stale words/lines (see Ruling 7) |

**Commit (b) — remove dev tools**
| hit | resolution |
|---|---|
| `src/pages/dev-tools/*.astro` (5 files, ~25 hits) | DELETE whole directory |
| `src/layouts/DevToolsLayout.astro:117` | DELETE the file |
| `src/components/layout/Footer.astro:7,46,48,53` | DELETE `showDevTools` const and the whole `{showDevTools && (...)}` block |
| `src/types/config.ts:21` | DELETE the `addDevToolsInProduction` field |
| `src/config/site.ts:23` | DELETE `addDevToolsInProduction: true,` |
| `DESIGN-GUIDE.md:191` | DELETE the `DevToolsLayout.astro` tree line (see Ruling 7) |
| `src/assets/icons/Settings.svg` | DELETE the file (not a grep hit — binary-ish SVG, named in plan step 5) |

**Commit (d) — remove Shannon content**
| hit | resolution |
|---|---|
| `src/content/posts/setting-up-portfolio.md:102,113` | Vanishes — the whole file is deleted with `src/content/posts/*` |
| `README.md:8` (`public/main_page.jpg`) · `README.md:89` (link to `setting-up-portfolio.md`) | Not step-1 grep hits, but the same class: docs pointing at files this phase deletes. Remove (see Ruling 7) |

**KEEP — hits that are correctly resolved as "no change"**
| hit | why it stays |
|---|---|
| `src/types/config.ts:18` `export interface SettingsConfig` | Real type. It still holds `showTagsInNavbar` and `showRSSInFooter`. Only the `addDevToolsInProduction` **field** is removed. |
| `src/types/index.ts:20` `SettingsConfig,` | Re-export of that surviving type. |
| `src/config/site.ts:1` `import ... SettingsConfig ...` | Still used. |
| `src/config/site.ts:20` `export const SETTINGS: SettingsConfig = {` | Still used (two surviving flags). |

These four are why the Verification table greps `src/` for `dev-tools\|DevTools\|addDevToolsInProduction` and **not** for `Settings`. A verifier must not flag them.

### Ruling 6 — Four plan assumptions falsified by the enumeration

Root cause: the plan was written from the template's README/structure, not from a read of the files. No executor should hunt for these; they do not exist.

1. **`src/utils/adapters.ts` has NO teaching branch.** It is collection-agnostic — `extraInput: d.journal || d.event || d.institution` covers every collection by field name. Plan step 2's "any teaching branch in `src/utils/adapters.ts`" resolves to **no edit**. Alternative rejected: removing `|| d.institution` — `institution` is also a `bio` field and the expression is generic; deleting it would be an unrequested behaviour change.
2. **`src/assets/icons.ts` has no literal `Settings` entry.** It is `import.meta.glob('./icons/*.svg', { eager: true })`. Deleting `src/assets/icons/Settings.svg` is the *entire* fix; `icons.ts` needs no edit and the verification row `grep -c "Settings" src/assets/icons.ts → 0` already passes today. Alternative rejected: adding an explicit denylist to `icons.ts` — that would add code in a phase whose objective is removal.
3. **`PagesConfig` is `type PagesConfig = Record<string, PageConfig>`** (`src/types/config.ts:53`). There is no per-section field to remove. Plan step 2's "its field in `PagesConfig`" resolves to **no edit**, and step 3's "the `TalksPage` type field" likewise — no such type exists.
4. **`src/pages/tags/index.astro`, `src/pages/tags/[tag].astro` and `src/pages/rss.xml.ts` contain zero `teaching` references.** `rss.xml.ts` aggregates only `posts` + `publications`. The entire shared-aggregate exposure is **`src/utils/tags.ts` alone** (4 lines). Plan step 4 resolves to: edit `tags.ts`, leave the other three files untouched.

Files the plan did **not** name that nevertheless need a branch deleted: `src/layouts/BaseListing.astro:8`, `src/layouts/BaseDetail.astro:11,28`, `src/types/content.ts:59`, `src/types/index.ts:12`. This is "deleting a branch", explicitly licensed by the Stop conditions — not a planning defect, so the phase proceeds.

### Ruling 7 — Documentation hits are resolved by minimal deletion, not rewrite

Acceptance criterion 4 requires every step-1 hit resolved; the Context says "Update `AGENTS.md` in phase 03". Both hold: **the phase-03 reservation governs the substantive rewrite; removing a reference to a file this phase deletes is stripping.** A doc asserting the existence of `src/pages/teaching/` after that directory is gone is simply false.

Licensed edits, minimal, delete-only, no re-authoring:
- `README.md:18` — drop `, and \`Teaching\`` from the collection list (keep `Talks`).
- `README.md:21` — drop `or "Teaching"` from the toggleable-sections sentence.
- `README.md:77` — delete the `└── teaching/` line **and** change line 76 `│   │   ├── talks/` to `│   │   └── talks/`. The deleted line is the tree's leaf; without this the box-drawing is malformed.
- `README.md:98` — drop `, \`teaching\`` from the `pages.ts` row.
- `README.md:8` — delete the `![Page Screenshot](public/main_page.jpg)` line (commit d; the file is deleted there).
- `README.md:89` — delete the link line to `src/content/posts/setting-up-portfolio.md` and its lead-in paragraph at line 87 (commit d; the post is deleted there).
- `AGENTS.md:13` — drop `, teaching/` from the subdirectory list. Nothing else in `AGENTS.md` is touched.
- `DESIGN-GUIDE.md:191` — delete the `│   └── DevToolsLayout.astro` line **and** change line 190 to `│   └── BaseListing.astro      (uses .item-list, .page-header)`. Same leaf-connector problem.

Constraint that would make this re-break: re-authoring these docs for Shevinu now would collide with phase 03, which owns the rewrite. Deletion-only is the fix that phase 03 can build on.

### Ruling 8 — `SITE`/`SOCIALS` Shannon identity is NOT in this phase's scope; the Verification allowlist is widened to four files

Conflict found before dispatch: the Verification row "Shannon gone" allows only `src/content/bio.md` and `src/content/cv.md` to hit, but `src/config/site.ts` (`author`, `title`, `desc`, `website`, `ogImage`) and `src/config/social.ts` (five Shannon URLs and link titles) also hit.

Ruling: **the Verification row is inconsistent with the plan, not the tree.** Grounds: the Context's own "Known Shannon assets" inventory enumerates every artefact this phase removes and omits both files; step 7 touches `site.ts` for exactly one line (`themeLight`); the Stop conditions forbid adding Shevinu's content. The allowlist mirrors an inventory that never included them.

**Allowlist for the "Shannon gone" check is therefore: `src/content/bio.md`, `src/content/cv.md`, `src/config/site.ts`, `src/config/social.ts`.** Phase 03 rewrites all four.

Alternatives rejected:
- *Blank the values / insert placeholders.* Creates a third identity that phase 03 overwrites anyway, and `SITE.website` is consumed by `new URL(..., SITE.website)` in `src/pages/posts/[id].astro:31` and by `context.site || SITE.website` in `src/pages/rss.xml.ts:27`. An empty or invented URL is a new failure mode introduced by the strip.
- *Return BLOCKED.* The plan's own text resolves the conflict; nothing needs the developer.

Record in `DEVIATIONS[H].md` in plain words: the site `<title>` still reads "Claude Shannon" and `SOCIALS` still point at `github.com/shannon` and `shannon@bell-labs.com` at the end of this phase.

### Ruling 9 — Machine-local caches hit the Shannon grep and are not repo content

The Verification row's exact command excludes only `node_modules .git dist Tasks`. Run verbatim today it also returns `.memsearch/memory/2026-09-22.md`. `.memsearch/` is an untracked machine-local index (phase 01 recorded it as ignored only via `~/.gitignore_global`); `.remember/` and `.astro/` are the same class, and `.astro/data-store.json` caches content-collection bodies after every build.

Ruling: **untracked machine-local caches are outside the repo's content and do not falsify the check.** The verifier judges tracked files only. Same species as the `Tasks/`-churn ruling inherited from phase 01 — do not "simplify" the exclusions back and do not delete the caches.

### Ruling 10 — `bio.md` will reference a deleted avatar; this is accepted

After commit (d) deletes `public/shannon.jpg`, `src/content/bio.md` still declares `avatar: "shannon.jpg"` and `src/components/layout/LeftSidebar.astro:16` renders it as a plain `<img src={`/${bio.avatar}`}>`. Astro does not resolve or validate that path, so **the build stays green** and the image 404s at runtime on every page.

Licensed resolution: **leave `bio.md` untouched.** The plan reserves it for phase 03 twice (Context, step 8). Alternatives rejected: pointing `avatar` at `public/images/placeholder.svg` (edits a file the plan reserves, and phase 03 overwrites it anyway); keeping `shannon.jpg` (fails the "Shannon gone" check). Record in `DEVIATIONS[H].md` and carry to phase 03 as a must-fix.

### Ruling 11 — Verification rows that pass on a non-zero exit status

Four rows are satisfied by *empty output* or a *zero count*, both of which make `grep` exit 1. A checker that judges exit status instead of output will report a spurious FAIL on a correct tree: "no teaching/dev-tools routes", "no source references", "Settings icon gone" (`grep -c` → `0`), "no copyright" (`grep -c` → `0`), "attribution not hidden on mobile". Judge the output and the count, never `$?`.

### Ruling 12 — Astro's content-layer cache does NOT invalidate on deleted source files (found during commit (d))

Discovered empirically by executor (d), not predicted by this plan.

**Symptom.** After `git rm`-ing all 12 markdown files from `posts/`, `publications/`, `projects/` and `talks/`, `npm run build` kept emitting the **pre-deletion 47-page site**, with `/posts/setting-up-portfolio/`, `/talks/bandwagon/` and the rest still present in `dist/`. The build exited 0 the whole time. `npx astro sync` did not help: it correctly warned "No files found matching `**/*.md`" for all four directories and still left the stale entries in place.

**Root cause — reported by executor (d), NOT independently verified.** The orchestrator verified only that *clearing the store yields the true tree*; the mechanism below is one agent's inference from one observation. Astro 5's glob loader does track untouched entries for deletion, so the real cause may be something else (a stale `.astro/` types directory, a build racing the `git rm`). **Trust the cure, not the diagnosis.** As reported: Astro's content layer persists collection entries in `data-store.json` — at `node_modules/.astro/data-store.json` and a duplicate at `.astro/data-store.json`. The store is additive with respect to the glob scan: `astro sync` reports on files it newly scans but does not purge entries whose source file has disappeared. Deleting content therefore leaves a build that is green and wrong.

**Licensed fix.** Delete both `data-store.json` files before any build that must reflect a deletion:
```
rm -f /Users/shev/Development/portfolio-v4/node_modules/.astro/data-store.json /Users/shev/Development/portfolio-v4/.astro/data-store.json
```
Both are untracked (`.astro/` and `node_modules/` are in `.gitignore`) and both regenerate on the next build. This costs nothing and is safe to do unconditionally.

**This does not contradict Ruling 9.** Ruling 9 is scoped to the *Shannon grep sweep* — it says an untracked cache hitting that grep does not falsify the check. It says nothing about a stale cache producing a false-positive *build*. Both rulings stand.

**Constraint that would make this re-break.** Running the verification build without clearing the store first. Anyone — verifier or phase 03 — who builds on a warm store after deleting or renaming content will measure the previous tree and conclude the deletion did not take, or worse, conclude it did when it did not. **Clear the store, then build.**

**Consequence for the earlier commits.** Commits (a) and (b) removed files under `src/pages/`, which are routes and not content-layer entries, so their reported page counts (52 and 47) were accurate. Only commit (d) touched content collections, so only it was exposed. The post-clear count is **8 pages**: `/`, `/posts`, `/publications`, `/projects`, `/talks`, `/tags`, `/cv`, `/404`.

### Ruling 13 — Empty collections did not break any page; no page code was changed

Plan step 9 licensed fixing a listing page that throws on a zero-entry collection. **That fallback was not needed.** Measured on a cleared cache:

- `paginate([], { pageSize: 5 })` still emits a page-1 route, so `dist/posts/index.html` exists with `lastPage = 1` and no `/posts/2/`.
- `getCollection()` on an empty collection warns (`The collection "X" does not exist or is empty`) and returns `[]`; it does not throw. 19 such warnings appear in the build log and are benign.
- `src/pages/tags/index.astro`'s `Math.max(...[])` → `-Infinity` never reaches arithmetic: `getTagSize` is only called inside `tags.map(...)`, which is empty. The page renders its "No tags found in your content yet." branch.
- `src/pages/talks/[id].astro`'s `getStaticPaths` returns `[]`, generating zero detail pages, which is legal.
- `@astrojs/rss` emits a well-formed feed with zero `<item>` elements.

All seven `NAV_LINKS` hrefs plus `/rss.xml` resolve to files in `dist/`. **No demo content was reintroduced and no page was edited.**

### Ruling 14 — Per-commit build gate (acceptance criterion 3) passes; and how to run it

Acceptance criterion 3 requires each commit to build green on its own. Run by the orchestrator in a detached `git worktree` under the scratchpad, each commit built from a **cold** content-layer cache (`dist/`, `.astro/`, `node_modules/.astro` removed between runs) so Ruling 12's staleness could not mask a broken commit:

| commit | exit | pages | `[ERROR]` lines | subject |
|---|---|---|---|---|
| `ecdcc40` | 0 | 52 | 0 | Remove the Teaching section |
| `071a717` | 0 | 47 | 0 | Remove the developer tools pages and Settings icon |
| `fe20a39` | 0 | 47 | 0 | Drop the copyright line and switch to the Notepad light theme |
| `fef6594` | 0 | 8 | 0 | Remove the Claude Shannon demo content and assets |

Counts independently reproduce each executor's self-report, which is the point of running it separately.

**Method note, so this is not rediscovered.** The first attempt symlinked the main `node_modules` into the worktree and **every commit failed identically** with:
`Could not load .../astro/components/ClientRouter.astro?astro&type=style... No cached compile metadata found`.
That is a **harness artefact, not a commit defect** — Vite resolves the Astro component through the symlink to a path outside the worktree root and its compile-metadata cache misses. The tell was that `fef6594` failed there while building green in the real tree moments earlier. The fix is a hardlink copy instead of a symlink:
```
cp -al /Users/shev/Development/portfolio-v4/node_modules "$WT/node_modules"
```
This is instant, costs no disk, and all four commits then pass. Anyone verifying a commit in a worktree must copy rather than symlink `node_modules`, or they will read a spurious FAIL on a healthy tree — the same species of trap as the `Tasks/`-churn and exit-code rulings.

## Steps

- [x] 1. **Enumerate before deleting.** Run and record the output in this file as a ruling:
      ```
      cd /Users/shev/Development/portfolio-v4 && grep -rn "teaching\|Teaching\|dev-tools\|DevTools\|Settings\|addDevToolsInProduction" src/ README.md AGENTS.md DESIGN-GUIDE.md
      ```
      Every hit must be resolved by the end of this phase.
- [x] 2. Delete the Teaching section:
      - `src/content/teaching/` (whole directory)
      - `src/pages/teaching/` (whole directory)
      - the `teaching` collection in `src/content.config.ts` (definition and the `collections` export entry)
      - the `teaching` entry in `src/config/pages.ts` and its field in `PagesConfig` (`src/types/config.ts`)
      - the Teaching link in `src/config/navigation.ts`
      - any `Teaching` type in `src/types/content.ts` and any teaching branch in `src/utils/adapters.ts`
- [x] 3. **Keep the Talks section.** Delete only its demo content, `src/content/talks/bandwagon.md`. Leave `src/pages/talks/`, the `talks` collection in `content.config.ts`, `PAGES.talks`, the `TalksPage` type field and the nav link exactly as they are. Confirm `/talks` still renders as an empty listing after the build — if it throws on a zero-entry collection, fix the page to handle empty, do not restore the demo talk.
- [x] 4. Check `src/utils/tags.ts`, `src/pages/tags/index.astro`, `src/pages/tags/[tag].astro` and `src/pages/rss.xml.ts` for references to the removed `teaching` collection and remove them. Leave every `talks` reference intact.
- [x] 5. Delete the developer tools:
      - `src/pages/dev-tools/` (whole directory, 5 pages)
      - `src/layouts/DevToolsLayout.astro`
      - `src/assets/icons/Settings.svg` and its entry in `src/assets/icons.ts`
      - the `showDevTools` const and the whole `{showDevTools && (...)}` block in `src/components/layout/Footer.astro`
      - `addDevToolsInProduction` from `SETTINGS` in `src/config/site.ts` and from `SettingsConfig` in `src/types/config.ts`
- [x] 6. Rework the footer (`src/components/layout/Footer.astro`):
      - remove the `currentYear` const and the `&copy; {currentYear} {SITE.author}.` span
      - move the "Built with Academic Portfolio Astro" span into the now-empty left `<div>`, keeping the link to `https://github.com/rubzip/academic-portfolio-astro/`
      - drop `hidden sm:inline-block` from that span
      - keep the RSS link and the theme toggle on the right
      - confirm `SITE` is still used in the file; if not, remove the now-unused import
- [x] 7. Set `themeLight: "light_notepad"` in `src/config/site.ts`. Leave `themeDark: "dark_notepad"`.
- [x] 8. Delete Shannon demo content and assets:
      - every file under `src/content/posts/`, `src/content/publications/`, `src/content/projects/`, `src/content/talks/` (keep the directories; phase 03 refills posts, publications and projects — `talks/` stays empty on purpose. Add a `.gitkeep` where git would otherwise drop an empty directory)
      - `public/shannon.jpg`, `public/main_page.jpg`
      - `example_contents/` (whole directory)
      - **Do not** delete `src/content/bio.md` or `src/content/cv.md`. Phase 03 rewrites them.
- [x] 9. `npm run build` must exit 0. If a collection with zero entries breaks a listing page or the RSS feed, fix the page to handle an empty collection — do not reintroduce demo content.
- [x] 10. Commit. Suggested split, one reviewable unit each: (a) remove Teaching, (b) remove dev tools, (c) footer + theme, (d) remove Shannon content and assets. Each commit ends with the `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` trailer, and the tree must build green at each one.

## Verification

Run from `/Users/shev/Development/portfolio-v4`:

| check | command | expected |
|---|---|---|
| build | `npm run build` | exit 0 |
| no teaching/dev-tools routes | `ls dist \| grep -E "teaching\|dev-tools"` | no output |
| talks route still builds | `test -f dist/talks/index.html` | pass — empty listing, no error |
| no source references | `grep -rn "teaching\|dev-tools\|DevTools\|addDevToolsInProduction" src/` | no output |
| Settings icon gone | `test ! -e src/assets/icons/Settings.svg && grep -c "Settings" src/assets/icons.ts` | file absent, count 0 |
| no copyright | `grep -c "©\|&copy;" dist/index.html` | 0 |
| attribution present | `grep -o "Academic Portfolio Astro" dist/index.html` | 1+ hits |
| attribution not hidden on mobile | `grep -o 'hidden sm:inline-block' src/components/layout/Footer.astro` | no output |
| notepad theme live | `grep -o "#fdf8e9\|#241f1c" dist/index.html` | both present |
| Shannon gone | `grep -rni "shannon\|bell-labs\|petoskey" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude-dir=Tasks` | only `src/content/bio.md` and `src/content/cv.md` may hit (phase 03 rewrites them); `LICENSE` may hit on an unrelated name |
| example contents gone | `test ! -d example_contents` | pass |
| clean tree | `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'` | empty — **use this exact form**, see Context |

## Acceptance criteria

- [ ] All verification checks above pass.
- [ ] No page under `dist/` 404s that is linked from the navbar — check every `NAV_LINKS` href resolves to a file in `dist/`.
- [ ] Each commit builds green on its own.
- [ ] The step-1 grep enumeration is recorded as a ruling in this file, with every hit resolved.

## Stop conditions

Do not add any of Shevinu's content in this phase — that is phase 03. Do not touch `astro.config.mjs`, `package.json` or deploy config. Do not restyle anything beyond the two theme-selection lines and the footer layout change named above. If removing a collection requires redesigning a shared page beyond deleting a branch, stop and report it as a planning defect.
