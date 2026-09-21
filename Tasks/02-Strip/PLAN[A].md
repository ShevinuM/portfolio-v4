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

## Steps

- [ ] 1. **Enumerate before deleting.** Run and record the output in this file as a ruling:
      ```
      cd /Users/shev/Development/portfolio-v4 && grep -rn "teaching\|Teaching\|dev-tools\|DevTools\|Settings\|addDevToolsInProduction" src/ README.md AGENTS.md DESIGN-GUIDE.md
      ```
      Every hit must be resolved by the end of this phase.
- [ ] 2. Delete the Teaching section:
      - `src/content/teaching/` (whole directory)
      - `src/pages/teaching/` (whole directory)
      - the `teaching` collection in `src/content.config.ts` (definition and the `collections` export entry)
      - the `teaching` entry in `src/config/pages.ts` and its field in `PagesConfig` (`src/types/config.ts`)
      - the Teaching link in `src/config/navigation.ts`
      - any `Teaching` type in `src/types/content.ts` and any teaching branch in `src/utils/adapters.ts`
- [ ] 3. **Keep the Talks section.** Delete only its demo content, `src/content/talks/bandwagon.md`. Leave `src/pages/talks/`, the `talks` collection in `content.config.ts`, `PAGES.talks`, the `TalksPage` type field and the nav link exactly as they are. Confirm `/talks` still renders as an empty listing after the build — if it throws on a zero-entry collection, fix the page to handle empty, do not restore the demo talk.
- [ ] 4. Check `src/utils/tags.ts`, `src/pages/tags/index.astro`, `src/pages/tags/[tag].astro` and `src/pages/rss.xml.ts` for references to the removed `teaching` collection and remove them. Leave every `talks` reference intact.
- [ ] 5. Delete the developer tools:
      - `src/pages/dev-tools/` (whole directory, 5 pages)
      - `src/layouts/DevToolsLayout.astro`
      - `src/assets/icons/Settings.svg` and its entry in `src/assets/icons.ts`
      - the `showDevTools` const and the whole `{showDevTools && (...)}` block in `src/components/layout/Footer.astro`
      - `addDevToolsInProduction` from `SETTINGS` in `src/config/site.ts` and from `SettingsConfig` in `src/types/config.ts`
- [ ] 6. Rework the footer (`src/components/layout/Footer.astro`):
      - remove the `currentYear` const and the `&copy; {currentYear} {SITE.author}.` span
      - move the "Built with Academic Portfolio Astro" span into the now-empty left `<div>`, keeping the link to `https://github.com/rubzip/academic-portfolio-astro/`
      - drop `hidden sm:inline-block` from that span
      - keep the RSS link and the theme toggle on the right
      - confirm `SITE` is still used in the file; if not, remove the now-unused import
- [ ] 7. Set `themeLight: "light_notepad"` in `src/config/site.ts`. Leave `themeDark: "dark_notepad"`.
- [ ] 8. Delete Shannon demo content and assets:
      - every file under `src/content/posts/`, `src/content/publications/`, `src/content/projects/`, `src/content/talks/` (keep the directories; phase 03 refills posts, publications and projects — `talks/` stays empty on purpose. Add a `.gitkeep` where git would otherwise drop an empty directory)
      - `public/shannon.jpg`, `public/main_page.jpg`
      - `example_contents/` (whole directory)
      - **Do not** delete `src/content/bio.md` or `src/content/cv.md`. Phase 03 rewrites them.
- [ ] 9. `npm run build` must exit 0. If a collection with zero entries breaks a listing page or the RSS feed, fix the page to handle an empty collection — do not reintroduce demo content.
- [ ] 10. Commit. Suggested split, one reviewable unit each: (a) remove Teaching, (b) remove dev tools, (c) footer + theme, (d) remove Shannon content and assets. Each commit ends with the `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` trailer, and the tree must build green at each one.

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
| clean tree | `git status --short` | empty |

## Acceptance criteria

- [ ] All verification checks above pass.
- [ ] No page under `dist/` 404s that is linked from the navbar — check every `NAV_LINKS` href resolves to a file in `dist/`.
- [ ] Each commit builds green on its own.
- [ ] The step-1 grep enumeration is recorded as a ruling in this file, with every hit resolved.

## Stop conditions

Do not add any of Shevinu's content in this phase — that is phase 03. Do not touch `astro.config.mjs`, `package.json` or deploy config. Do not restyle anything beyond the two theme-selection lines and the footer layout change named above. If removing a collection requires redesigning a shared page beyond deleting a branch, stop and report it as a planning defect.
