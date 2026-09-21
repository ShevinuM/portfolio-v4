# Queue

Task: rebuild the portfolio on the `academic-portfolio-astro` template.
Destination repo: `/Users/shev/Development/portfolio-v4` (new git repo).
Source of content: `/Users/shev/Development/portfolio-v3` (READ-ONLY).
Template clone: `/private/tmp/claude-501/-Users-shev-Development-portfolio-v4/b943f36f-95a2-4570-ac0b-d73145bfbfa8/scratchpad/template` (READ-ONLY).

Mode: unattended. Questions go to `OPEN_QUESTIONS[H].md` and the phase returns BLOCKED. Never ask in chat.

| # | Phase | Scope | Goal | Status |
|---|-------|-------|------|--------|
| 01 | Bootstrap | repo root of v4 | Template copied without upstream `.git`, repo initialised, deps installed, baseline build green. | **CLOSED — PASS** (`04b3c6e`) |
| 02 | Strip | `src/`, `public/`, `example_contents/`, root docs | Teaching, dev-tools/Settings icon, Shannon demo content and the `©` line are gone. Talks kept but empty. Notepad theme on both modes. Build green. | NOT STARTED |
| 03 | Content | `src/content/`, `src/config/`, `public/`, `astro.config.mjs`, `README.md`, `package.json` | Shevinu's bio, CV, NER publication, blog article, Digest project and site metadata are live. Build green. | NOT STARTED |
| 04 | Deploy | `.github/`, `public/CNAME`, `astro.config.mjs`, `README.md` | GitHub Pages deploy at the custom domain `shevinum.dev`. Build green. | NOT STARTED |
