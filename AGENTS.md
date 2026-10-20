# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## What this repo is

This is **Hugo Narrow**, a Hugo *theme* (not a site), built on Tailwind CSS 4 and Hugo
Extended ≥ 0.165.0. There is no site at the repo root — the theme is developed and previewed
against `exampleSite/`, which mounts the theme from its parent via `--themesDir=../..`. All
theme code lives in `layouts/`, `assets/`, `i18n/`, `data/`, and `archetypes/`.

## Commands

```bash
pnpm install              # install dev deps (pnpm is the package manager)

pnpm run dev:parallel     # ← USE THIS for development: Tailwind --watch + hugo server together
pnpm run dev              # compile CSS once, then hugo server (won't pick up NEW classes)
pnpm run build            # compile CSS + hugo --minify, output to exampleSite/public
pnpm run check            # format:check + build — the closest thing to CI; run before pushing

pnpm run compile          # build assets/css/compiled.css from assets/css/main.css (one-shot)
pnpm run format:check     # prettier --check on all *.html (go-template parser)
pnpm run format:write     # prettier --write on all *.html
```

There is **no test suite**. CI (`.github/workflows/github-pages.yml`) builds `exampleSite` with
Hugo 0.165.0 and deploys to GitHub Pages on push to `main`; tags `v*` cut a release.

## Critical: the CSS is compiled outside Hugo and committed

`assets/css/compiled.css` is a **checked-in build artifact** (~114 KB). The asset pipeline is split:

- **Tailwind CSS is compiled by the standalone Tailwind CLI**, *not* by Hugo. `main.css`
  (`@import "tailwindcss"` + `@import`s of the partial CSS files) → `compiled.css`. Hugo only
  fingerprints/minifies the already-built `compiled.css` (see `_partials/layout/head/css.html`).
- **JS is bundled by Hugo** via `js.Build` (esbuild) at render time — no separate JS build step.

Consequence: **if you add or change Tailwind utility classes in any `layouts/**/*.html`, you must
recompile** (`pnpm run compile`, or just use `pnpm run dev:parallel` which watches). Running plain
`hugo server` alone will serve a stale `compiled.css` and your new classes won't appear. Commit the
regenerated `compiled.css` alongside template changes.

## Architecture

### Theming & dark mode (two independent axes)

1. **Color scheme** — set by `data-theme="<name>"` on `<html>`. Each scheme is a block of CSS
   custom properties (oklch colors) in `assets/css/themes.css`. `main.css` maps those vars into
   Tailwind via `@theme` so utilities like `bg-background`, `text-foreground`, `text-primary` work.
   A new scheme requires **both** a `[data-theme="x"]` block in `themes.css` **and** an entry under
   `themes:` in the site's `params.yaml` (the latter populates the UI switcher).
2. **Light/dark** — toggled by the `.dark` class on `<html>` (`@custom-variant dark` in `main.css`).
   Each color scheme defines its own `.dark` overrides.

`assets/js/theme-init.js` is rendered with `resources.ExecuteAsTemplate` and **inlined into `<head>`**
in `baseof.html` so it runs before first paint (reads `localStorage` `theme`/`colorScheme` to avoid
FOUC). State persists in `localStorage`.

### Config resolution pattern (`layouts/_partials/config/*.html`)

Feature settings support **page-front-matter overrides of site params**. Rather than reading params
inline, templates call a config partial (`config/toc.html`, `config/gallery.html`, `config/search.html`,
`config/script.html`) that merges global `site.Params.*` with page `.Params.*` (page wins) and
`return`s a resolved dict. When adding a configurable feature, follow this pattern instead of reading
params directly in the consuming template.

### Markdown render hooks (`layouts/_markup/`)

Goldmark output is customized via render hooks: `render-image.html` (wraps images in a `<figure>`
with lightbox/gallery data attributes), `render-codeblock.html` + `render-codeblock-mermaid.html`,
`render-heading.html`, `render-link.html`, `render-blockquote.html` (GitHub-style alerts —
note/tip/important/warning/caution, whose colors are the `--color-note` etc. vars).
Syntax-highlighting CSS is generated at build time by Hugo's `css.ChromaStyles` from
`params.codeblock.style` / `params.codeblock.darkStyle`; there is no checked-in Chroma stylesheet.

### Gallery / lightbox: render-time detection → conditional JS

`render-image.html` calls `.Page.Store.Set "hasImageFigure" true` (and `hasLightboxFigure` when
lightbox is on) as a side effect of rendering content. Later, `_partials/layout/head/js.html` reads
those flags and **only loads the gallery/lightbox JS bundles on pages that actually contain images**.
Image path resolution (page-resource vs. global-resource vs. static, external URLs, dimensions) is
centralized in `_partials/content/image-processor.html`.

### Pluggable features (comments & analytics)

`_partials/features/comments.html` and `features/analytics.html` are dispatchers: they read the
configured provider from params and include the matching sub-partial from `features/comments/<system>.html`
(giscus, disqus, utterances, waline, artalk, twikoo, comentario) or `features/analytics/<provider>.html`
(google, baidu, clarity, umami). Add a provider by adding a sub-partial + a params block.

### Output formats & search

`home` outputs `HTML, RSS, JSON, WebAppManifest` (see `hugo.yaml`). The **search index is the JSON
output** rendered by `layouts/index.json`; client-side search lives in `assets/js/search.js`.
`layouts/index.webappmanifest` produces the PWA manifest.

### Extension points (for site authors, don't hardcode into the theme)

- Custom CSS: files in a site's `assets/css/custom/*.css` are auto-included by `head/css.html`.
- Custom JS: files in `assets/js/custom/*.js` are auto-bundled by `head/js.html`.
- Home page sections: partials in `_partials/home/` ordered by the `home.contentOrder` param list.
- Custom page layouts beyond posts/projects: `about.html`, `resume.html`, `timeline.html`,
  `archives.html`, `series/taxonomy.html` (with matching archetypes in `archetypes/`).

### i18n & multilingual

UI strings live in `i18n/*.toml` (13 languages); use `{{ i18n "key" }}` in templates, never hardcode
display text. Content is multilingual via `.<lang>.md` filename suffixes (e.g. `index.zh-hans.md`).
`exampleSite` ships `en` + `zh-hans`; `defaultContentLanguageInSubdir: false`.

## Conventions

- HTML/templates are formatted by Prettier with `prettier-plugin-go-template` and
  `prettier-plugin-tailwindcss` (2-space indent, double quotes, 100 col). Run `pnpm run format:write`.
- Many template/JS comments are in Chinese — match the surrounding language when editing a file.
- `data-theme` color values are **oklch**; keep new themes in the same color space and define both
  the base and `.dark` variants.
