import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.k9expeditions.com',
  adapter: vercel(),
  integrations: [sitemap()],
});
