# shevinum.dev

Shevinu Nawalage's personal site — about, publications, code, blog, and a resume.
Built with [Astro](https://astro.build/) and Tailwind CSS v4, deployed to GitHub Pages
and live at <https://shevinum.dev>.

## Running it locally

Node.js >= 24 is required. The package manager is pnpm (`packageManager: pnpm@11.20.0`)
and `pnpm-lock.yaml` is the only lockfile in the repo — do not install with npm or yarn.

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

The dev server starts at `http://localhost:4321`.

| Command | Action |
| :--- | :--- |
| `pnpm run dev` | Start the local dev server |
| `pnpm run build` | Build the production site into `./dist/` |
| `pnpm run check` | Run the Astro/TypeScript type checker (see note below) |
| `pnpm run preview` | Serve the production build locally |
| `pnpm run astro` | Run the Astro CLI directly |

Those five are the only scripts in `package.json`.

`pnpm run check` currently exits 1 on **13 pre-existing type errors** inherited from
the template — unused imports, a few properties read off types that do not declare
them. None of them affect the build, and the check is deliberately not wired into CI
so it cannot block a deploy. A non-zero exit there does not mean you broke something.

## Where the content lives

Every page's content is markdown under `src/content/`:

```text
src/content/
├── bio.md            # the About page — name, avatar, short bio, and the About body
├── cv.md             # the Resume page — experience and education, all in frontmatter
├── posts/            # blog posts — served at /blog, not /posts
├── publications/     # papers
├── projects/         # code projects — nav label is "Code", route is /projects
└── talks/            # talks — section currently disabled, see below
```

The frontmatter each collection accepts is defined in `src/content.config.ts`.
For every section except talks, adding a `.md` file to one of those directories is
enough to make it appear in that section's listing and get its own detail page.

**Resume vs. `cv`.** The reader-facing page is `/resume`, and its route lives in
`src/pages/resume/`. The internal names were deliberately left as `cv`: the content
file is `src/content/cv.md`, and both the collection key and the `PAGES` key are `cv`.
Renaming them would mean moving the file and the content loader's glob together,
for no reader-visible gain.

**Blog vs. `posts`.** Same split. The route is `/blog`, living in `src/pages/blog/`,
while the collection stays `posts`. Because the collection name and the URL segment
differ, nothing should build a link by interpolating the collection name — use
`collectionPath()` from `src/utils/adapters.ts`, which is what the listing, the tag
pages and the detail back-link all go through.

**The Talks section is disabled.** Its routes sit in `src/pages/_talks/`, and Astro
ignores anything under `src/pages/` whose name starts with an underscore, so no
`/talks` page is built and none appears in the sitemap. `PAGES.talks.isActive` and
the `NAV_LINKS` entry are both `false` as well. To bring it back: rename the
directory to `src/pages/talks/`, flip both flags, and add a `.md` file to
`src/content/talks/`.

## Where the configuration lives

Everything configurable sits in `src/config/`, re-exported from `src/config/index.ts`:

| File | Purpose |
| :--- | :--- |
| `site.ts` | Site metadata (`SITE`), theme selection (`THEME_CONFIG`), toggles (`SETTINGS`), analytics IDs (`ANALYTICS`) |
| `pages.ts` | Each section's title, subtitle, and whether it is active (`PAGES`) |
| `navigation.ts` | The navigation bar links (`NAV_LINKS`) |
| `social.ts` | Profile and social links with their icon names (`SOCIALS`, `SOCIAL_ICONS`) |
| `themes.ts` | The colour palettes `THEME_CONFIG` chooses from (`THEMES`) |

Icons are SVG files in `src/assets/icons/`, auto-globbed by `src/assets/icons.ts` —
dropping a new file into that directory is the whole wiring, and its filename is
the name `SOCIAL_ICONS` refers to.

## Credits

Built from the [academic-portfolio-astro](https://github.com/rubzip/academic-portfolio-astro)
template by rubzip, MIT licensed — see `LICENSE`.

## Licence

Two different terms apply, and `LICENSE-CONTENT.md` sets them out in full:

- **Site code** — MIT, © 2026 Rubén Gijón. Layouts, components, styles and build
  setup. Reuse them.
- **Written content and images** — © 2026 Shevinu Nawalage, all rights reserved.
  The posts, publication entries, biography, résumé and photographs.
