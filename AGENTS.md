# AGENTS.md

## Commands
- `pnpm run dev` - Start dev server
- `pnpm run build` - Production build
- `pnpm run check` - Run the Astro/TypeScript type checker
- `pnpm run preview` - Preview build

## Requirements
- Node.js >= 24
- pnpm is the package manager (`packageManager: pnpm@11.20.0`). Install with `pnpm install --frozen-lockfile`
- `pnpm-lock.yaml` is the only lockfile — never run `npm install`, it would regenerate `package-lock.json`

## Architecture
- **Barrel files:** `src/config/index.ts`, `src/types/index.ts`
- **Content:** `src/content/` - Add `.md` files to subdirectories (posts/, publications/, projects/, talks/)
- **Resume page:** the route is `src/pages/resume/`, but the content file stays `src/content/cv.md` and the collection key stays `cv`. The rename was reader-facing only — moving the file would need the loader glob in `src/content.config.ts` moved with it
- **Config:** `src/config/` - site.ts (SITE, THEME_CONFIG, SETTINGS, ANALYTICS), pages.ts (PAGES), navigation.ts (NAV_LINKS), social.ts (SOCIALS), themes.ts
- **Types:** `src/types/` - content.ts (Bio, CVItem, CV, EducationItem, ExperienceItem, Blog, Project, Publication, Talk), display.ts (ListingItem, DetailItem), config.ts, themes.ts
- **Styles:** `src/styles/global.css` - Theme colors, base styles
- **Assets:** `src/assets/icons.ts` - Icon definitions

## Key Constraints
- **No `<style>` in `.astro` files** - Use global.css and Tailwind classes in components
- **Two-column layout:** Left sidebar (sticky profile), Right main (scrollable content)
- **Markdown-driven:** All content in `.md` files with YAML frontmatter
- **Theme config:** Use `THEME_CONFIG` for theme settings (lightAndDark, themeLight, themeDark)

## Notes
- Tailwind CSS v4 uses `@tailwindcss/vite` plugin (no tailwind.config.js)
- LaTeX math rendering via remark-math/rehype-katex
- Analytics supported via GA4 (`ga4Id`) and Umami (`umami.websiteId`) — configure in `src/config/site.ts`
- No lint script configured; `pnpm run check` runs `astro check` but is not wired into CI, and currently reports pre-existing type errors in `src/`