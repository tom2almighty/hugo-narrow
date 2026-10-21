<img src="https://cdn.jsdelivr.net/gh/tom2almighty/hugo-narrow@main/images/screenshot.png" />

# Hugo Narrow

[中文](README.zh-Hans.md)

A reading-first Hugo theme with an adaptive dock, a breadcrumb context bar, Shadcn-style semantic tokens, and a centered content width that readers can adjust.

Version 2.0 removes the top navbar and introduces a floating adaptive dock, separate card-style breadcrumb items, and card-based content surfaces without heavy shadows. Configuration moved from `header.*` to `ui.appearance.*` and `ui.language.*`; the home section names are `author-section`, `recent-posts`, `featured-projects`, and `page-content`. The announcement is dismissible and no longer auto-hides.

## Development environment

- Hugo Extended 0.165.0 or newer
- Node.js 18 or newer
- pnpm 10

```bash
pnpm install
pnpm run dev:parallel
```

`dev:parallel` runs the Tailwind watcher and the Hugo server together. Run `pnpm run compile` after changing Tailwind classes if you use plain `hugo server`.

## Build and deploy

```bash
pnpm run check   # prettier check + production build
pnpm run build   # compile assets/css/compiled.css, then hugo --minify
```

The example site is built into `exampleSite/public`. When packaging the theme, ship the regenerated `assets/css/compiled.css`; Hugo only fingerprints and minifies it. The theme has no Nginx or container configuration; mount it in a Hugo site or serve the static output from your own runtime.

## License

AGPL-3.0. See [LICENSE](LICENSE).
