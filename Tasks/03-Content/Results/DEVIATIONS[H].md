# Phase 03 — Deviations from the plan

Seven. The first three are the ones to look at — each is a case where following the plan
literally would have put someone else's branding or a made-up detail on your site.

## 1. I did not copy your v3 `og_image.png`. It is not yours.

**Plan said:** copy `public/og_image.png` from portfolio-v3.

**What it actually is:** the Astrofolio template's stock social card — a React logo on a circuit
board background, the word "Astrofolio", and the caption *"Create a personal portfolio site from a
single config files. Built with Astro."* I opened it and looked. It is upstream boilerplate that
was sitting in your v3 public folder, the same class of leftover as `alex@alexmercer.dev`.

Copying it would have put another project's branding — and a sentence you never wrote — on every
LinkedIn, Slack and iMessage preview of your site.

**What I did:** `SITE.ogImage = "/picofme.jpeg"`. Your real portrait.

**Your move if you want:** a purpose-built 1200×630 card. Good small task, needs a designer's eye.

## 2. I did not copy your v3 `favicon.svg` either. It is the letter "A".

**Plan said:** copy `public/favicon.svg` from portfolio-v3.

**What it is:** a dark rounded square with a white **"A"** — starfolio's icon for its fictional
"Alex Mercer". Your v3 site has been shipping someone else's initial this whole time.

**What I did:** same square, same colours, same font — with an **S**. One line in
`public/favicon.svg` if you want something else.

## 3. The ResearchGate icon is a graduation cap, not the ResearchGate logo

**Plan preferred:** Tabler's official `brand-researchgate` glyph.

**It does not exist.** I checked the published `@tabler/icons@3.47.0` icon list: the brand icons go
`brand-react`, `brand-reason`, `brand-reddit`, `brand-redhat`, `brand-redux`, `brand-revolut` —
and stop. No ResearchGate.

**What I did:** the plan's own fallback — the graduation-cap glyph that used to serve Google
Scholar. It renders correctly and reads as "academic profile". It is *not* a broken image and not
a hand-drawn scribble.

**Swap it whenever** by replacing `src/assets/icons/ResearchGate.svg`. It must be a 24×24 SVG,
`fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`.

## 4. The publication page is one paragraph, not the 2–4 the plan asked for

Your entire v3 source for the NER survey is **one sentence**. A second paragraph could only have
repeated it or made something up — an invented venue, a citation count, an accuracy figure.

One honest paragraph plus a ResearchGate link was the right answer. If you want it longer, send me
the abstract and it becomes a five-minute job.

Only text edit made: your typo "survery" → "survey".

## 5. "Groq + OpenRoute" became two tags

`src/pages/tags/[tag].astro` puts the raw tag straight into the URL, so a `+` or a space breaks the
link. Your v3 technology list had `"Groq + OpenRoute"` as one entry; it is now `groq` and
`openroute`.

**I did not "correct" `openroute` to `openrouter`** — that is how you spelled it, so that is what
it says. Change it if it was a typo.

## 6. The publication shows "January 2025", not "2025"

Your source says the year and nothing more. The template's date formatter always prints a month,
so a bare `"2025"` comes out as "January 2025".

The month is a rendering artefact, **not a claim from your source**. If the real month matters, set
`date: "2025-06"` (or whichever) in
`src/content/publications/named-entity-recognition-subsea-inspections.md`.

One caveat: on a machine west of UTC the same value renders "December 2024". This machine and
GitHub Actions both give January.

## 7. AGENTS.md still mentions `talks/`

**Plan said:** remove the `teaching/` and `talks/` references.

`teaching/` was already gone — an earlier phase removed it. But `talks` is still a live collection
with live routes, and you decided to keep the section with an empty listing. Deleting it from the
architecture notes would have made the documentation wrong. It stays.
