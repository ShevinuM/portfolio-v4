# Handoff into Phase 03b

Phases 01, 02, 02b and 03 all closed with a verifier PASS. The site is now the developer's own: bio, Resume, the NER publication, the blog article, the Digest project, real socials and metadata.

## Tree state you inherit

- `/Users/shev/Development/portfolio-v4`, branch `main` at `392d0f1`, **no remote**. Clean outside `Tasks/`.
- **`pnpm run build` → exit 0, 26 pages.** That is your step-1 baseline figure. It must not change.
- The only collection warning is **`talks` (×19)**, which is empty by design and will warn forever. **Any *other* collection warning after your update is real breakage**, even though the build still exits 0.
- `node_modules/` is a pnpm frozen install. `dist/` is a current 26-page build.

## Rulings that still bind

1. **Tree check: `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'`.**
2. **pnpm only.** A bare `npm install` regenerates `package-lock.json` and undoes phase 02b. Never delete `pnpm-lock.yaml` (the only thing pinning versions) or `pnpm-workspace.yaml` (without its `allowBuilds` denial, pnpm 11 exits 1 with `ERR_PNPM_IGNORED_BUILDS`, and because `pnpm run <script>` re-invokes install through `runDepsStatusCheck`, *every* script fails).
3. **Clear the content cache before every gate:** `rm -f node_modules/.astro/data-store.json && rm -rf .astro dist`. Phase 03 did this before every build and it removed stale-build ambiguity from every verdict.
4. **Judge grep output, not exit status.**

## The one thing your update could silently break

**`src/content.config.ts` line 3 is `import { z } from 'astro/zod';`.** `zod` is still not a declared dependency; that import path is the only thing making the build work. **After updating Astro to 6.4.8, verify `"./zod"` is still in astro's `package.json` export map** — read it directly:

```
node -p "require('./node_modules/astro/package.json').exports['./zod']"
```

Do not trust a green build alone here. If the export is gone, that is a finding to report, and the fallback is declaring `"zod": "^4.3.6"` — which the developer has already been offered in `DEFERRED[H].md`.

## Four grep patterns that are defective — do not copy them into your verification

Phase 03 found these produce false failures on a correct site:

1. `>Label<` never matches an Astro nav label — the emitted HTML has whitespace around it.
2. `Icon Not Found` can never render. `Icon.astro:14` throws at build time, so a missing icon fails the build rather than printing that text. The check is vacuous.
3. A bare `/academic-portfolio-astro/` also matches the **required** MIT attribution link in the footer. Match `href="/academic-portfolio-astro` instead.
4. `icon-tabler-school` appears once, not twice.

## What `pnpm run check` will flag — expected, not yours to fix

When you add `astro check` (step 5), expect it to report **`LeftSidebar.astro:19`** and possibly the nested `<svg>` in every icon component. **Both are pre-existing template defects.** Ruling 3 of your plan forbids editing `src/` to satisfy the checker — record the output and move on. The `LeftSidebar.astro:19` bug (a stray comment making the avatar render `width="1"`) is already in `DEFERRED[H].md` for the developer.

## Environment gotchas

- `ls` returns empty output in this sandbox. Use `find . -maxdepth 1 -name …`.
- `${PIPESTATUS[0]}` is empty under zsh, so `cmd | tail` loses the exit status. Capture to a file and read `$?`; append `echo "EXIT=$?"` to gate logs.
- npm's `packages` object has a root `""` self-entry, so raw key counts read one higher than the real package count. Not relevant unless you re-derive a lockfile diff.

## Not yours

- `public/CNAME` **does not exist** and phase 04 creates it. `astro.config.mjs` has `site: 'https://shevinum.dev'` and **no `base`** — do not reintroduce one.
- `.github/workflows/deploy.yml` is otherwise phase 04's. **You change only its `node-version:` line** (22 → 24).
- `LICENSE` is the template author's MIT and stays.
- Everything in `DEFERRED[H].md` is the developer's decision, not yours — in particular Astro 7 and KaTeX 0.18, which your ruling 1 explicitly refuses.
