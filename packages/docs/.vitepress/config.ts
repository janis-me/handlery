import { defineConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'handlery',
  srcDir: 'src',
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],
  description: 'Type-save event handling for ALL emitters!',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/handlery-logo.png',
    siteTitle: false,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/handlery' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Getting started', link: '/guide/getting-started' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'The `handlery` function', link: '/reference/handlery' },
          { text: 'Adapters', link: '/reference/adapters' },
          { text: 'Context', link: '/reference/context' },
        ],
      },
      {
        text: 'FAQ',
        link: '/faq',
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/janis-me/handlery' }],
  },
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    plugins: [groupIconVitePlugin()],
  },
});
