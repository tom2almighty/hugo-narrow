# AGENTS.md

This file provides guidance to coding agents working in this repository.

## What this repo is

This is **Hugo Narrow**, a Hugo *theme* (not a site), built on Tailwind CSS 4 and Hugo
Extended ≥ 0.165.0. There is no site at the repo root — the theme is developed and previewed
against `exampleSite/`, which mounts the theme from its parent via `--themesDir=../..`. All
theme code lives in `layouts/`, `assets/`, `i18n/`, `data/`, and `archetypes/`.

Branch layout:

- `main` — Hugo Narrow 2.x.
- `v1` — legacy Hugo Narrow 1.x; v1.4.1 is its final release.

## Commands

```bash
pnpm install              # install dev deps (pnpm is the package manager)

pnpm run dev:parallel     # ← USE THIS for development: Tailwind --watch + hugo server together
pnpm run dev              # compile CSS once, then hugo server (won't pick up NEW classes)
pnpm run build            # compile CSS + hugo --minify, output to exampleSite/public
pnpm run check            # format:check + build — the closest thing to CI; run before pushing

pnpm run compile          # build assets/css/compiled.css from assets/css/main.css (one-shot)
pnpm run format:check     # prettier --check on all *.html (go-template) and *.js
pnpm run format:write     # prettier --write on all *.html and *.js
```

There is **no test suite**. CI (`.github/workflows/github-pages.yml`) builds `exampleSite` and
deploys it to GitHub Pages on push to `main`; tags `v*` create a GitHub Release. The Hugo version
is hardcoded per branch in the workflow (`0.168.0` on `main`, `0.165.0` on `v1`) so the two lines
can build independently. Release notes for a tag are read from
`.github/release-notes/<tag>.md` when present.

## Critical: the CSS is compiled outside Hugo and committed

`assets/css/compiled.css` is a **checked-in build artifact**. The asset pipeline is split:

- **Tailwind CSS is compiled by the standalone Tailwind CLI**, *not* by Hugo. `main.css`
  (`@import "tailwindcss"` + `@import`s of the partial CSS files) → `compiled.css`. Hugo only
  fingerprints/minifies the already-built `compiled.css` (see `_partials/layout/head/css.html`).
- **JS is bundled by Hugo** via `js.Build` (esbuild) at render time — no separate JS build step.
  `assets/js/main.js` is the always-on entry; it composes `announcement.js`, `appearance.js`,
  `viewport.js`, `popovers.js`, `fold.js`, `dock.js`, `tabs.js`, and `codeblock.js`. `search.js`, `toc.js`, and
  `gallery.js` are separate entries loaded only when their feature is on the page, so nothing imports
  them from `main.js`. Shared storage, events, and breakpoints live in `core.js` / `layout.js`; keep
  the matching CSS media queries in sync. Third-party code (MiniSearch, smart-gallery) is vendored in
  `assets/js/vendor/` and imported as ESM — never load a script from a CDN at runtime.

Consequence: **if you add or change Tailwind utility classes in any `layouts/**/*.html`, you must
recompile** (`pnpm run compile`, or use `pnpm run dev:parallel` which watches). Running plain
`hugo server` alone serves a stale `compiled.css`. Commit the regenerated `compiled.css` alongside
template changes.

## Architecture

### Theming & dark mode (two independent axes)

1. **Color scheme** — set by `data-theme="<name>"` on `<html>`. Each scheme is a block of CSS
   custom properties (oklch colors) in `assets/css/themes.css`. `main.css` maps those vars into
   Tailwind via `@theme inline` so utilities like `bg-background`, `text-foreground`,
   `text-primary`, `bg-sidebar`, and `border-input` work. A new scheme requires **both** a
   `[data-theme="x"]` block in `themes.css` **and** an entry in `data/themes.yaml` (the latter
   populates the UI switcher).
2. **Light/dark** — toggled by the `.dark` class on `<html>` (`@custom-variant dark` in
   `main.css`). Each color scheme defines its own `.dark` overrides.

`data-theme` colors are **oklch**. Keep new themes in the same color space and define both the
base and `.dark` variants.

`assets/js/theme-init.js` is rendered with `resources.ExecuteAsTemplate` and **inlined into `<head>`**
in `baseof.html` so it runs before first paint (reads `localStorage` `theme`/`colorScheme` to avoid
FOUC). State persists in `localStorage`.

### Page shell, dock, and context bar

`layouts/baseof.html` renders a width-constrained `#page-container` with, in order: inline
announcement, sticky context bar (`navigation/context-bar.html`, non-home pages), `<main>`, and the
footer. The dock, TOC panel, search dialog, and KaTeX/Mermaid assets sit outside that container.

- The context bar uses breadcrumbs and, for series posts, a second row with progress dots and
  previous/next controls that opens `navigation/series-popover.html`. Series data is resolved by
  `content/series-info.html`.
- `ui/dock.html` is the only page/function chrome: Home, Menu, Search, TOC (when present),
  Appearance, and a contextual Back-to-top.
- Placement is CSS-first in `assets/css/components.css`: a floating capsule on the right for wide
  landscape viewports, a bottom capsule everywhere else. `dock.js` mirrors placement into
  `aria-orientation`, updates reading progress and back-to-top, and implements toolbar arrow keys.
- The content width is `--content-width-base` (from `contentWidth`) overridable at runtime by
  `--content-width` (40–90rem slider, `localStorage` key `contentWidth`). On folded devices
  `fold.js` reads `window.viewport.segments` (Chrome 138+) and sets `--fold-content-width` /
  `--fold-margin-start`, which `base.css` applies to `#page-container`.
- Popovers use native `popover` plus CSS anchor positioning with fixed-position fallbacks.
- The appearance panel is always fully available; there are no appearance/language feature flags.
  Language selection is a secondary popover rendered by `ui/language-options.html`.

### Config resolution pattern (`layouts/_partials/config/*.html`)

Feature settings support **page-front-matter overrides of site params**. Templates call a config
partial (`config/toc.html`, `config/gallery.html`, `config/search.html`, `config/comments.html`,
`config/script.html`) that merges global `site.Params.*` with page `.Params.*` (page wins) and
`return`s a resolved dict. When adding a configurable feature, follow this pattern instead of
reading params directly in the consuming template.

### Markdown render hooks (`layouts/_markup/`)

Goldmark output is customized via render hooks: `render-image.html` (wraps images in a `<figure>`
with lightbox/gallery data attributes), `render-codeblock.html` + `render-codeblock-mermaid.html`,
`render-heading.html`, `render-link.html`, `render-blockquote.html` (GitHub-style alerts —
note/tip/important/warning/caution, whose colors are the `--note` etc. vars).

Syntax-highlighting CSS is generated at build time by Hugo's `css.ChromaStyles`. Colors come from
`markup.highlight.style`, which must be a style with a dark counterpart (for example
`catppuccin-latte`, `github`, or `monokai`). Both the light and dark stylesheets are generated in
`head/css.html`; there is no checked-in Chroma stylesheet and no `params.codeblock.style`.

### Date formatting

`layouts/_partials/helpers/date.html` renders three variants: `long`, `short`, and `month`.
Resolution order is site/language `params.dateFormat`, then `data/dateFormats.yaml`, then Hugo's
localized tokens. `data/dateFormats.yaml` holds month-year formats for languages where the default
month-first order is wrong (CJK and Vietnamese) and natural wording for Spanish/Portuguese. Use
valid Hugo locales (`zh-Hans`, `zh-Hant`; `zh-CN` falls back to English).

### Gallery / lightbox: render-time detection → conditional JS

`render-image.html` calls `.Page.Store.Set "hasImageFigure" true` (and `hasLightboxFigure` when
lightbox is on) as a side effect of rendering content. Later, `_partials/layout/head/js.html` reads
those flags and **only loads the gallery/lightbox JS bundles on pages that actually contain images**.
`_partials/ui/gallery-switcher.html` emits a `<template>` for the single layout button; `gallery.js`
clones it per gallery and cycles justified → masonry → grid. Image path resolution (page-resource vs.
global-resource vs. static, external URLs, dimensions) is centralized in
`_partials/content/image-processor.html`.

### Pluggable features (comments & analytics)

`_partials/features/comments.html` and `features/analytics.html` are dispatchers. The comments
dispatcher resolves the merged config and passes the selected provider's config to
`features/comments/<system>.html` (giscus, disqus, utterances, waline, artalk, twikoo, comentario).
Providers that can follow light/dark mode delegate to `features/comments/theme-sync.html`, which
listens for the `themeChanged` event instead of observing the DOM. Analytics supports google, baidu,
clarity, and umami. Add a provider by adding a sub-partial and a params block.

### Output formats, search, and PWA

`home` outputs `HTML, RSS, JSON, WebAppManifest` (see `hugo.yaml`). The **search index is the JSON
output** rendered by `layouts/index.json`; client-side search lives in `assets/js/search.js` and the
index content length is configurable via `search.indexContentLength`. `config/search.html` resolves
`search.enabled` (default true) and feeds the dock button, the dialog, the script tag, and the index
alike — turning search off drops all four.
`layouts/index.webappmanifest` produces the PWA manifest; theme/background colors, orientation, and
the optional Apple touch icon are configured under `params.pwa`.

### i18n, RTL, and extension points

- UI strings live in `i18n/*.toml` (13 languages); use `{{ i18n "key" }}` in templates, never
  hardcode display text. Content is multilingual via `.<lang>.md` filename suffixes.
- `exampleSite` ships `en` + `zh-hans`; `defaultContentLanguageInSubdir: false`.
- `<html dir>` and the manifest `dir` follow `language.direction`. Use logical CSS properties
  (`inset-inline-*`, `margin-inline-*`, `padding-inline-*`) for direction-sensitive rules and add
  the `icon-directional` class to mirrored chevrons/arrows.
- Custom CSS: files in a site's `assets/css/custom/*.css` are auto-included by `head/css.html`.
- Custom JS: files in `assets/js/custom/*.js` are auto-bundled by `head/js.html`.
- Home page sections: partials in `_partials/home/` ordered by the `home.contentOrder` param list.
  Built-in names are `author-section`, `recent-posts`, `featured-projects`, and `page-content`.
- Custom page layouts beyond posts/projects: `about.html`, `resume.html`, `timeline.html`,
  `archives.html`, `series/taxonomy.html` (with matching archetypes in `archetypes/`).

## Conventions

- HTML/templates and JS are formatted by Prettier with `prettier-plugin-go-template` and
  `prettier-plugin-tailwindcss` (2-space indent, double quotes, 100 col). Run `pnpm run format:write`.
  `assets/js/vendor/`, `assets/js/theme-init.js` (Hugo-templated), and `refer/` are in `.prettierignore`.
- Many template/JS comments are in Chinese — match the surrounding language when editing a file.
- Do not reintroduce `header.*`, `dock`, `themes`, `timeFormat`, or the removed appearance flags.
- Do not add separate light/dark code-block style parameters; use `markup.highlight.style`.
