# Handoff into Phase 02

Phase 01 closed with a verifier PASS.

## Tree state you inherit

- `/Users/shev/Development/portfolio-v4` is a git repo on branch `main`, **no remote**.
- Commits: `04b3c6e Import academic-portfolio-astro @ 6f296c2` (root), then a task-state commit holding phase 01's close-out. Everything outside `Tasks/` is clean and committed.
- `node_modules/` is installed (294 packages). `dist/` holds a green build of the untouched template — 56 HTML pages.
- The tracked file list is identical to template `6f296c2` (109 files). Nothing was dropped by `.gitignore`.

## Rulings that still bind

1. **Check the tree with `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'`.** A bare `git status --short` always shows `Tasks/` churn, because `WHATS_HAPPENING[H].md` must be written at transitions that happen after your commits and before the verifier runs. Phase 01 hit this. It is the single most likely source of a spurious FAIL. The plan's verification table already uses the correct form — do not "simplify" it back.
2. **`package-lock.json` differs from the template by 15 lines** — `npm install` dropped an unused `node_modules/typescript` optional-peer entry. This is accepted and committed. It is a verified fixed point: a second from-clean install did not perturb it again. Do not revert it, do not pin typescript in `package.json`.
3. **`node_modules/typescript` is absent as a consequence.** `tsc` and `astro check` will not run. The template has no lint or typecheck script anyway, so `npm run build` is your only gate. If you genuinely need a type check, `npm i -D typescript` is licensed — but it is not part of this phase's plan, so prefer not to.

## Falsified assumption

Heredocs are **not** broadly broken in this session. `python3 - <<'PYEOF'` ran twice without hanging. Only one `cat <<'EOF'` invocation hung, early on. Use whichever tool you like; the Write/Edit tools remain the safe default for files with `[` `]` in the path.

## Inventory for your removal work

Phase 01 counted what is in `src/content/`:

- `posts/` — 7 files
- `publications/` — 2 files
- `projects/` — 2 files
- `talks/` — 1 file (`bandwagon.md`)
- `teaching/` — 1 file
- plus `bio.md` and `cv.md` (**keep both files** — phase 03 rewrites their contents)

Also confirmed present and shipping in the build: `src/pages/dev-tools/` with four visualizer pages, and `src/layouts/DevToolsLayout.astro`.

## Known, not yours to fix

- **`sharp`'s install script was skipped** by npm. All 56 pages built anyway, so it is inert. If image handling breaks in phase 03, the fix is `npm install-scripts approve sharp`.
- **13 npm audit vulnerabilities** inherited from the untouched template (1 critical, 9 high). Phase 04 gate. Do not run `npm audit fix` here — it would change dependencies mid-strip.
- **`.github/workflows/deploy.yml` is committed but unread by anyone.** Inert with no remote. Phase 04 owns it. Leave it alone.
- **`.memsearch/` is ignored only via the machine-local `~/.gitignore_global`.** Untracked either way. Not your problem.

## Scope reminder

You own `src/`, `public/`, `example_contents/`, `README.md`, `AGENTS.md`, `DESIGN-GUIDE.md`, `.github/`. Read-only: `Tasks/`, `package.json`, `package-lock.json`, `LICENSE`, `astro.config.mjs`.

**Talks stays.** The developer chose to keep it as an empty listing. Delete only `src/content/talks/bandwagon.md`.
