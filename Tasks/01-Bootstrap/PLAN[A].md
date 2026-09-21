# Phase 01 — Bootstrap

## Objective

`/Users/shev/Development/portfolio-v4` holds a clean copy of the `academic-portfolio-astro` template, is its own git repository with one baseline commit, has dependencies installed, and builds green — before any customisation.

## Scope

The repo root of `/Users/shev/Development/portfolio-v4`, excluding `Tasks/`.

Read-only for this phase:
- `/private/tmp/claude-501/-Users-shev-Development-portfolio-v4/b943f36f-95a2-4570-ac0b-d73145bfbfa8/scratchpad/template` — the template clone (source).
- `/Users/shev/Development/portfolio-v3` — content source, used in phase 03, not here.

## Context

- Always use absolute paths. The session cwd has flipped between v3 and v4 once already.
- `Tasks/` and its `[A]`/`[H]` filenames contain `[` and `]`, which zsh treats as glob characters. **Quote every path containing them** in shell commands, e.g. `git add 'Tasks/01-Bootstrap/PLAN[A].md'`. An unquoted non-matching bracket pattern fails the whole command with `no matches found`.
- The template clone already exists at the scratchpad path above. Its upstream `.git` must NOT be copied — v4 is a fresh repo, not a fork of `rubzip/academic-portfolio-astro`.
- The template ships `package-lock.json` and no pnpm lockfile. Stay on npm. Do not introduce pnpm.
- Node is v26.9.0, npm 11.19.1. The template requires Node >= 22.12.0. Satisfied.
- `Tasks/` must never be deleted or overwritten by the copy.
- The template `.gitignore` exists — check it covers `node_modules` and `dist` before committing.

## Rulings

1. Destination is `portfolio-v4`, not `portfolio-v3`. `portfolio-v4` is empty and is the session's working directory; `portfolio-v3`'s git remote is the upstream template `webrating/starfolio`, so it is not the user's own repository. Rejected: overwriting v3 in place — it would destroy the only working copy of the current site while the new one is unproven.
2. The template's `.git` directory is not copied. Rejected: `git clone` of the template as the new repo — it inherits unrelated upstream history and a remote pointing at someone else's repository.
3. **The "`git status --short` is empty" check is evaluated excluding `Tasks/`.** Root cause: step 8 commits `Tasks/` via `git add -A`, but `WHATS_HAPPENING[H].md` must be written at the "executor returned" and "check dispatched" transitions — both after the commit and before the verifier runs. A bare `git status --short` would therefore always show `M Tasks/01-Bootstrap/WHATS_HAPPENING[H].md` and fail the criterion on a file that is outside this phase's declared scope and dirtied by design. Licensed: the verification row and acceptance criterion are checked with
   `git -C /Users/shev/Development/portfolio-v4 status --short -- . ':(exclude)Tasks'`
   Alternatives rejected: (a) add `Tasks/` to `.gitignore` — contradicts ruling in step 4, the plan history is meant to live with the work; (b) stop writing `WHATS_HAPPENING[H].md` until after verification — it is the developer's only window during an unattended run, and a missing transition reads as a stall; (c) re-commit after every status line — turns one baseline commit into many and defeats the one-commit phase. Constraint that would make this re-break: if a later check reverts to a bare `status --short`, it fails again for the same reason. The exclusion is scope-correct, not a workaround.
4. `.memsearch/` is excluded only by the machine-local `~/.gitignore_global`; `.remember/` self-excludes via its own `.gitignore` containing `*`. Neither is added to the repo `.gitignore` in this phase — the stop condition forbids config edits, and `git add -A` already leaves both untracked. Consequence carried forward: a fresh clone on another machine would see `.memsearch/` as untracked.
5. `git config --global user.name` is unset. Git derives `Shevinu Nawalage <105614862+ShevinuM@users.noreply.github.com>` from the OS and commits succeed (probed in a throwaway repo, exit 0). No git config is set by this phase. Rejected: setting `user.name` — not in the plan and not needed.
6. **The `package-lock.json` rewrite by `npm install` is accepted, not reverted.** Root cause: npm 11.19.1 dropped a 15-line `node_modules/typescript` entry (`5.9.3`, `optional: true, peer: true`) when resolving the template lockfile. It is the only file in the whole tree that differs from template `6f296c2`; `package.json` and `.gitignore` are byte-identical. Licensed: commit npm's output as-is. Alternatives rejected: (a) `git checkout` the template lockfile after install — it would be re-dropped on the next `npm install` and re-dirty the tree forever; (b) pin typescript in `package.json` — a config edit, forbidden by this phase's stop condition. Verified stable: a second from-clean `npm install` did not perturb it again, so the lockfile is now a fixed point. Constraint carried forward: **`node_modules/typescript` is therefore absent.** `tsc` and `astro check` will not run in phases 02–04 without an explicit `npm i -D typescript`. That install is licensed for a later phase, not this one.
7. **Phase 01 does not commit its own `Results/` files.** Root cause: acceptance criterion 2 requires exactly one commit, and `Results/` and the final `WHATS_HAPPENING[H].md` are written after that commit by definition. Licensed: leave the phase-close `Tasks/` churn uncommitted. Disposition belongs to the main session — it will dirty `Tasks/` further when it writes `HANDOFF[A].md` and flips `QUEUE[A].md`, so it is the natural owner of either a separate task-state commit or a decision to let phase 02 sweep it. Phase 01 does not prescribe phase 02's behaviour. Alternative rejected: a second "close phase 01" commit — it breaks the one-commit acceptance criterion the verifier just passed. Constraint: whoever runs phase 02 inherits a tree that is clean outside `Tasks/` but dirty inside it, and must not read that as a failed handoff.

## Steps

- [x] 1. Copy the template into v4, excluding `.git`:
      `rsync -a --exclude '.git' /private/tmp/claude-501/-Users-shev-Development-portfolio-v4/b943f36f-95a2-4570-ac0b-d73145bfbfa8/scratchpad/template/ /Users/shev/Development/portfolio-v4/`
      Confirm `/Users/shev/Development/portfolio-v4/.git` does not exist and `Tasks/` is still present.
- [x] 2. Record the template source commit for the commit message:
      `git -C <template path> rev-parse --short HEAD`
- [x] 3. Verify `.gitignore` ignores `node_modules/` and `dist/`. If either is missing, add it.
- [x] 4. Add `Tasks/` to `.gitignore`? **No** — commit `Tasks/` with the repo so the plan history stays with the work. Confirm nothing in `.gitignore` already excludes it.
- [x] 5. `git -C /Users/shev/Development/portfolio-v4 init -b main`
- [x] 6. `cd /Users/shev/Development/portfolio-v4 && npm install` — must exit 0.
- [x] 7. `cd /Users/shev/Development/portfolio-v4 && npm run build` — must exit 0.
- [x] 8. Commit everything as one baseline commit:
      message: `Import academic-portfolio-astro @ <short sha>` plus the Co-Authored-By trailer
      `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`
      Use `git add -A` with `Tasks/` included (bracket filenames are fine under `-A`).

## Verification

| step | command | expected |
|---|---|---|
| 1 | `test ! -e /Users/shev/Development/portfolio-v4/.git/refs/remotes` before init; `test -d /Users/shev/Development/portfolio-v4/Tasks` | both pass |
| 1 | `test -f /Users/shev/Development/portfolio-v4/package.json && test -d /Users/shev/Development/portfolio-v4/src/content` | pass |
| 6 | `npm install` | exit 0 |
| 7 | `npm run build` | exit 0, `dist/index.html` exists |
| 8 | `git -C /Users/shev/Development/portfolio-v4 status --short` | empty |
| 8 | `git -C /Users/shev/Development/portfolio-v4 log --oneline` | exactly 1 commit |
| 8 | `git -C /Users/shev/Development/portfolio-v4 remote -v` | empty — no remote |

## Acceptance criteria

- [x] v4 contains the full template tree and no `.git` inherited from upstream.
- [x] `git log` shows exactly one commit and `git remote -v` is empty.
- [x] `npm run build` exits 0 and produces `dist/index.html`.
- [x] `git status --short` is empty. (Evaluated per ruling 3, excluding `Tasks/`.)
- [x] `Tasks/` is intact and committed. (15 files, bracket filenames intact.)

## Stop conditions

Do not edit any template content, config, or styles in this phase. Removal and customisation belong to phases 02 and 03. If `npm install` or `npm run build` fails on the untouched template, stop and report — do not fix the template.
