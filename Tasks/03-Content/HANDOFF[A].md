# Handoff into Phase 03

Phases 01, 02 and 02b all closed with a verifier PASS.

## Tree state you inherit

- `/Users/shev/Development/portfolio-v4`, branch `main` at `172b8bb`, **no remote**. Clean outside `Tasks/`.
- **The project is on pnpm.** `pnpm install --frozen-lockfile` and `pnpm run build` are the commands. `package-lock.json` is deleted.
- `node_modules/` is a fresh pnpm frozen install. `dist/` holds a current **8-page** build.
- `src/content/posts/`, `publications/`, `projects/`, `talks/` each contain only a `.gitkeep`. You refill the first three. `talks/` stays empty for good.

## Rulings that still bind — read all seven

1. **Check the tree with `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'`.** A bare `git status --short` always shows `Tasks/` churn the protocol requires. Every prior phase hit this.
2. **`npm` is gone and must stay gone.** A bare `npm install` anywhere regenerates `package-lock.json` and silently reinstates the split phase 02b removed. Never run it.
3. **Never delete `pnpm-lock.yaml`.** It is the only thing pinning the tree. Deleting it and reinstalling re-resolves `astro` `^6.1.7` to 6.4.8 — real drift, attributed to you.
4. **Never delete `pnpm-workspace.yaml`.** Without its `allowBuilds` decision, pnpm 11 exits 1 with `ERR_PNPM_IGNORED_BUILDS`, and because `pnpm run <script>` re-invokes install through `runDepsStatusCheck`, *every* script fails, not just install.
5. **`zod` is NOT a declared dependency and a bare `import ... from 'zod'` fails under pnpm.** `src/content.config.ts` line 3 now reads `import { z } from 'astro/zod';`. **You will touch collections — if you add any schema code, use `astro/zod`, never `zod`.**
6. **The Astro content-cache trap.** After deleting or renaming content, clear `node_modules/.astro/data-store.json` and the repo-root `.astro/` (it holds `content.d.ts`, `types.d.ts`, `collections/`) — otherwise the build re-emits the *previous* tree and still exits 0. Verified to survive the pnpm switch unchanged. **This bites you if you rename any of the `.gitkeep`'d directories or remove a content file.**
7. **Judge grep output, not exit status.** A grep that correctly finds nothing exits 1.

## Must-fix — these are broken right now, by design, and they are yours

1. **`src/content/bio.md` declares `avatar: "shannon.jpg"` against a deleted file.** A 404 portrait on every page until you fix it. Plan step 2 covers it.
2. **`SITE.ogImage` is `"shannon.webp"`, which never existed in `public/` — not even in the untouched template.** The `og:image` tag is dangling independently of the Shannon removal. Plan step 8 covers it.
3. **`src/config/site.ts` and `src/config/social.ts` still carry the full Claude Shannon identity** — name, description, bell-labs email, fake ORCID, scholar link. Licensed by phase 02's ruling 8; phase 03 is where it gets fixed. Plan steps 7 and 8.
4. **README prose.** Phase 02's edits to it were delete-only. **Re-read README lines 18 and 21 for grammar** rather than assuming they still read well. You rewrite the README anyway (plan step 13).

## The one new failure mode you need to watch

The build currently prints, and exits 0 on:

```
The collection "posts"/"publications"/"projects"/"talks" does not exist or is empty
```

That is expected noise today. **Once you refill `posts`, `publications` and `projects`, a remaining warning on any of those three is REAL BREAKAGE, not known noise** — it means the content file was not picked up (wrong directory, wrong frontmatter, or the stale content cache from ruling 6). Only `talks` should still warn after you are done. Treat any other surviving warning as a failure even though the build exits 0.

## Environment gotchas that cost earlier agents round-trips

- `ls` returns empty output in this sandbox. Use `find . -maxdepth 1 -name …`.
- `${PIPESTATUS[0]}` is empty under zsh (it is `pipestatus`, 1-indexed), so `cmd | tail` pipelines lose the exit status. Capture to a file and read `$?`.
- Heredocs work fine. `pnpm run build` takes about 1 second.
- Gate logs should append `echo "EXIT=$?"` so the evidence is self-contained — the verifier had to infer exit 0 from pnpm's `Done in …` line last phase.

## Known, not yours to fix

- **13 audit vulnerabilities, 1 critical (`astro` 6.1.7).** Phase 03b fixes it with an in-range update. **Do not run `pnpm update` or `pnpm audit --fix`** — a dependency change mid-content-migration makes any breakage impossible to attribute.
- **`typescript` is not installed** and nothing runs `tsc`. Phase 03b installs it deliberately.
- **`README.md:104` documents a `pnpm run format` script that `package.json` does not declare.** A pre-existing template defect. It is in `DEFERRED[H].md`. You rewrite the README in step 13 — just do not carry the false claim forward.
- `.github/workflows/deploy.yml` is committed and unaudited. Phase 04 owns it. It delegates to `withastro/action@v3` and does not run `npm ci`, so the pnpm switch does not obviously break it.
