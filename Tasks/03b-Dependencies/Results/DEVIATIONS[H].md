# Phase 03b — where the work diverged from the plan

Five deviations. Four are the plan being wrong about the outside world. One is a doc line I let the executor fix beyond its brief.

## 1. The plan's central premise was false. The critical advisory cannot be fixed in range.

**Plan said:** "the fix is in-range and therefore free", and step 4 said "confirm the critical advisory is gone".

**Actual:** the critical is patched only in Astro 7.2.8. No Astro 6 release fixes it. I found this before starting any work, by reading the advisory data directly.

**What I did:** ran the rest of the phase, which does not depend on this, and wrote the trade-off up as **Q8 in `Tasks/OPEN_QUESTIONS[H].md`** for you. I did not adopt Astro 7 — your own earlier decision reserves that, and the plan's ruling 1 forbids it. Recorded as ruling 4 in `PLAN[A].md`.

## 2. `pnpm update` had to be run with `--no-save`.

**Plan said:** `pnpm update`.

**Actual:** plain `pnpm update` rewrites the version ranges in `package.json` — that is pnpm's default. The plan's own verification then demanded those ranges be untouched. The two contradict each other.

**What I did:** used `pnpm update --no-save`, so only the lockfile changed. Recorded as ruling 5.

## 3. The type checker needed a second package the plan did not know about.

**Plan said:** `pnpm add -D typescript`.

**Actual:** `astro check` loads `@astrojs/check` at runtime. Without it, the command would have sat waiting for an install prompt that nobody was awake to answer.

**What I did:** installed `typescript` and `@astrojs/check` together. Recorded as ruling 6.

## 4. `typescript` had to be pinned to version 6, not the default.

**Not in the plan at all.** A plain `pnpm add -D typescript` installs **7.0.2** today. `@astrojs/check` only supports TypeScript 5 and 6, so 7 left it broken — any result it printed would have been a tooling failure, not a real report about your code.

**What the executor did:** pinned `typescript@^6`, which installed 6.0.3. The checker then ran cleanly. Recorded as ruling 8.

**Consequence you should know about:** `pnpm outdated` now lists three packages behind, not two — `astro`, `katex` and `typescript`. All three are majors being held back on purpose. The `^6` range on `typescript` is load-bearing; do not let a future update push it to 7 unless `@astrojs/check` supports 7 by then.

## 5. One extra line of `AGENTS.md` was rewritten.

I told the executor to change 2 specific lines. It changed a third: the closing note said **"No lint/typecheck scripts configured"**, which this phase made false. It now says there is no lint script, that `pnpm run check` exists but is not in CI, and that it currently reports pre-existing errors in `src/`.

**I am keeping it.** `AGENTS.md` is in this phase's scope and the old line was a false statement about the repo. It does need rewording the day someone fixes those errors.

## Two smaller notes

- **The audit numbers in the plan do not match the ones I report.** The plan recorded 13 vulnerabilities from `npm audit`. `pnpm audit` counts the same tree as 34. Same single critical, different counting method. **Every before/after number in these results is pnpm's**, measured with the same command both times, so the 34 → 14 drop is a real like-for-like comparison.
- **The verifier flagged that the plan's verification commands are unreliable.** Four of them give the wrong answer on correct work: the critical-advisory grep can never return zero, the workflow line-count returns 4 because diff headers start with `-` and `+`, `grep -c "24"` in the README also matches the year 2024, and the `pnpm outdated` row was written before `typescript` existed. I gave the verifier the raw output for each instead of the broken command, and said which ones were broken and why.
