# Phase 03 — Not done

Five things. None of them block the site. Three are pre-existing template bugs in files this
phase was not allowed to edit.

## 1. Your avatar ships broken markup (it still looks right)

`src/components/layout/LeftSidebar.astro:19` reads:

    width={160} /* Maximum width in global.css for sidebar-avatar class */

A `/* */` comment inside an Astro tag is **not a comment** — it is parsed as attributes. Every page
ships `width="1"` on your portrait, plus six junk attributes: `*="true" Maximum="true" in="true"
global.css="true" for="true" sidebar-avatar="true"`.

**You will not see anything wrong.** I checked `src/styles/global.css:430` — `.sidebar-avatar` sets
`width: 160px; height: 160px`, and CSS beats the HTML attribute. The photo renders correctly.

What it does cost: invalid HTML on every page, and `width="1"` with `height="160"` is what the
browser uses to reserve space before the CSS applies, so there may be a layout shift on first paint.

**This is not new.** It did the same thing with the template's own photo, before this rebuild
started. `src/components/` was read-only to this phase, so I did not touch it.

**Fix:** move the comment out of the tag. One line.

## 2. `/favicon.ico` now 404s

I deleted `public/favicon.ico` — it was the academic template's icon and would have clashed with
your new "S". But `src/layouts/BaseLayout.astro:56` still declares `<link rel="icon"
href="/favicon.ico" sizes="any" />`, and layouts were read-only to this phase.

**Effect:** one 404 in the network tab. Browsers use the SVG favicon on line 55, so you will not
see a broken icon. **Fix:** delete line 56, or add a real `.ico`.

## 3. Two unused icon files are still in the tree

`src/assets/icons/Facebook.svg` and `src/assets/icons/Twitter.svg`. Nothing references either one.
Removing them was not in any plan step, so I left them.

Worth deleting — a future check grepping for "Twitter" will hit the filename and think an X handle
survived the cleanup.

## 4. The talks detail page has never been built

`talks` is empty by design, so `src/pages/talks/[id].astro` has never run. The listing page
`/talks` works and is in the nav. If you ever add a talk, that route is the one untested path.

## 5. You have not chosen a licence for your own site

`LICENSE` is the **template's** MIT licence — `Copyright (c) 2026 Rubén Gijón`. The README credits
it correctly as the template's licence and does not claim you picked MIT for your own writing.

That is a real decision for you, not something to patch. Your blog post and your bio are your
work; the template is his.
