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
  // 'always' inlined every stylesheet into every page, so each ClientRouter
  // navigation re-downloaded and re-parsed the same ~88kB of CSS. 'auto' (the
  // default) emits one shared stylesheet the browser caches across routes.
  build: {
    inlineStylesheets: 'auto'
  },
  // ClientRouter's default prefetch strategy is 'hover', which never fires on
  // a touchscreen — mobile taps paid the full round trip. 'tap' starts the
  // fetch on touchstart/mousedown; the navbar opts into 'viewport' so the tabs
  // are already warm by the time they're tapped.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'tap'
  },
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://shevinum.dev',
  integrations: [sitemap()],
});
