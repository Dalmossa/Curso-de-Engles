/**
 * Tailwind CSS v4 is wired through PostCSS only — the v4 "CSS-first" workflow.
 * There is deliberately no `tailwind.config.ts`: the design tokens live in
 * `src/app/globals.css` inside `@theme { … }`, which is where v4 reads them.
 *
 * @type {import('postcss-load-config').Config}
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
