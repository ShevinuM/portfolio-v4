// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  build: {
    // Keep the stylesheet inline rather than linking it. Linking makes each
    // page ~3.7KB instead of ~33KB, which looks like the obvious win, but the
    // landing page then has to parse the HTML, discover the <link> and spend a
    // second round trip before it can paint: measured on a throttled mobile
    // profile that pushed first contentful paint from 256ms to 460ms. It buys
    // nothing back on navigation, because prefetch (below) has already put the
    // whole document in the cache before the tap.
    //
    // This only holds while the sheet stays a single byte-identical blob on
    // every route — ClientRouter reuses the existing <style> node when the
    // incoming one is an equal node, and re-parsing 89KB mid-swap is visible
    // on a phone. A page-scoped <style> block is enough to break that, so put
    // page-specific rules in global.css instead.
    inlineStylesheets: 'always'
  },
  // Pages are built as <route>/index.html, so the canonical URL always ends in
  // a slash. Saying so here makes Astro emit matching links from paginate()
  // and makes the dev server enforce the same shape the deployed site has.
  // Without it, every internal link missing its slash costs a 301 round trip,
  // which ClientRouter pays inside the click rather than during navigation.
  trailingSlash: 'always',
  // ClientRouter turns prefetching on by default, but only with the 'hover'
  // strategy, and hover never fires on a touch screen. Every phone tap was
  // therefore paying a full round trip that desktop had already absorbed.
  // 'viewport' prefetches links once they are on screen; the nav is six links
  // rendered at the top of every page, so all routes are warm before the tap.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://shevinunawalage.com',
  integrations: [sitemap()],
});
