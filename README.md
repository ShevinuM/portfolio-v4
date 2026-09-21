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
| `pnpm run check` | Run the Astro/TypeScript type checker |
| `pnpm run preview` | Serve the production build locally |
| `pnpm run astro` | Run the Astro CLI directly |

Those five are the only scripts in `package.json`.

## Where the content lives

Every page's content is markdown under `src/content/`:

```text
src/content/
├── bio.md            # the About page — name, avatar, short bio, and the About body
├── cv.md             # the Resume page — experience and education, all in frontmatter
├── posts/            # blog posts
├── publications/     # papers
├── projects/         # code projects
└── talks/            # talks (no entries yet)
```

The frontmatter each collection accepts is defined in `src/content.config.ts`.
Adding a `.md` file to one of those directories is enough to make it appear in
that section's listing and get its own detail page.

**Resume vs. `cv`.** The reader-facing page is `/resume`, and its route lives in
`src/pages/resume/`. The internal names were deliberately left as `cv`: the content
file is `src/content/cv.md`, and both the collection key and the `PAGES` key are `cv`.
Renaming them would mean moving the file and the content loader's glob together,
for no reader-visible gain.

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

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
with `withastro/action@v3` and publishes it to GitHub Pages. The workflow also
has a `workflow_dispatch` trigger, so it can be run manually from the Actions tab.

CI installs with pnpm: the action detects `pnpm-lock.yaml` and installs the exact
pnpm version pinned by `packageManager` in `package.json`. Nothing npm-related is
involved.

The workflow needs no changes, but three one-time steps are still yours to do,
in the GitHub UI and at the DNS provider. The site will not be live at
`shevinum.dev` until all three are done:

1. Repo **Settings → Pages → Source** must be set to **GitHub Actions**, not
   "Deploy from a branch".
2. Repo **Settings → Pages → Custom domain** must be set to `shevinum.dev` and
   saved. This step is required: when publishing from a custom Actions workflow,
   GitHub ignores any `CNAME` file in the build output, so `public/CNAME` alone
   does not set the domain. Enforce HTTPS can be ticked afterwards — it can take
   up to 24 hours to become available.
3. DNS at the registrar for the apex `shevinum.dev`: either an ALIAS/ANAME record
   pointing at the Pages default domain, or four A records —
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` —
   and optionally the four AAAA records `2606:50c0:8000::153`,
   `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`. Check
   these against GitHub's docs:
   <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>

`public/CNAME` exists and holds `shevinum.dev`; Astro copies it to `dist/CNAME`
verbatim. It is a fallback that only matters if the publishing source is ever
switched to "Deploy from a branch" — it plays no role in the current
Actions-based setup.

The site is fully static, with no adapter and no SSR, so there is no
Cloudflare/worker configuration to maintain, and none is needed.

## Credits

Built from the [academic-portfolio-astro](https://github.com/rubzip/academic-portfolio-astro)
template by rubzip, MIT licensed — see `LICENSE`.
