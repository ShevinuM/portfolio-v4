# Handoff into Phase 02b

Phases 01 and 02 both closed with a verifier PASS.

This phase was added after the run started, at the developer's request: switch the project from npm to pnpm.

## Tree state you inherit

- `/Users/shev/Development/portfolio-v4` is a git repo on `main` at `fef6594`, **no remote**. Clean outside `Tasks/`.
- Commits so far: `5ec2b22` template import, `f471ae7` task state, then phase 02's four — `ecdcc40` teaching, `071a717` dev tools, `fe20a39` copyright + Notepad theme, `fef6594` Shannon content.
- **`npm run build` is exit 0 at 8 HTML pages.** That is your step-1 baseline figure. It dropped from 56 because phase 02 deleted all demo content.
- `node_modules/` is installed via npm. `dist/` holds a current 8-page build.
- Four content directories (`posts/`, `publications/`, `projects/`, `talks/`) hold only a `.gitkeep`. Phase 03 refills three of them; `talks/` stays empty for good.

## Rulings that still bind

1. **Check the tree with `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'`.** A bare `git status --short` always shows `Tasks/` churn the protocol itself requires. Both prior phases hit this.
2. **The Astro content-cache trap.** After deleting or renaming content, clear `node_modules/.astro/data-store.json` and `.astro/data-store.json` — otherwise the build happily re-emits the *previous* tree and exits 0. Phase 02 verified the cure; the mechanism is executor-reported and provisional. **This matters to you directly:** step 2 deletes `node_modules` wholesale, which takes `node_modules/.astro` with it, so a stale store cannot survive your reinstall. Do not treat a page-count change after the pnpm install as a cache artefact — it would be real.
3. **If you verify in a git worktree, copy `node_modules` with `cp -al`, never a symlink.** A symlink fails every commit identically with a bogus Vite "no cached compile metadata" error.
4. **Judge grep output, not exit status.** A grep that correctly finds nothing exits 1. Several verification rows expect empty output.
5. `package-lock.json` was rewritten by npm during phase 01 — it dropped an unused `node_modules/typescript` optional-peer entry — and committed that way. You delete the file, so that drift becomes moot.
6. **`node_modules/typescript` is absent.** Nothing runs `tsc` and there is no typecheck script. Phase 03b installs typescript deliberately; **do not install it here.**
7. **sharp's install script was skipped by npm** and the build was green anyway (prebuilt binaries). pnpm also blocks build scripts by default. Only allow it if the build actually fails — see plan step 5.

## Falsified assumptions — do not waste time on these

- Heredocs work fine in this session. An early `cat <<'EOF'` hang was a one-off, not a pattern.
- `npm run build` takes about 1 second on this tree. It is not a slow gate.

## Known, not yours to fix

- **13 npm audit vulnerabilities**, 1 critical (`astro` 6.1.7). **Phase 03b fixes this** with an in-range update to 6.4.8. Your stop condition forbids changing the dependency set — do not run `pnpm audit --fix` or `pnpm update`.
- **`src/config/site.ts` and `src/config/social.ts` still carry the full Claude Shannon identity**, and `src/content/bio.md` still declares `avatar: "shannon.jpg"` against a deleted file. All licensed; phase 03 owns them. Not a sign anything went wrong.
- `.github/workflows/deploy.yml` is committed and unaudited. Phase 04 owns it. Leave it alone — including its `node-version` line, which phase 03b changes.

## Scope reminder

You own `package.json`, the lockfiles, `pnpm-workspace.yaml` (only if a build failure forces it), `.gitignore`, `README.md`, `AGENTS.md`. Everything under `src/`, `public/` and `.github/` is read-only to you.
