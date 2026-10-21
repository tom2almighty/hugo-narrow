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

`assets/css/compiled.css` is a **checked-in build artifact** (roughly 110 KB). The asset pipeline is split:

- **Tailwind CSS is compiled by the standalone Tailwind CLI**, *not* by Hugo. `main.css`
  (`@import "tailwindcss"` + `@import`s of the partial CSS files) → `compiled.css`. Hugo only
  fingerprints/minifies the already-built `compiled.css` (see `_partials/layout/head/css.html`).
- **JS is bundled by Hugo** via `js.Build` (esbuild) at render time — no separate JS build step.
  `assets/js/main.js` is the always-on entry; it composes `appearance.js`, `viewport.js`,
  `popovers.js`, `fold.js`, `dock.js`, `search.js`, `announcement.js`, `tabs.js`, and
  `codeblock.js`. `toc.js` and `gallery.js` remain conditional. Shared storage, events, and
  breakpoints live in `core.js` / `layout.js`; keep the matching CSS media queries in sync.

Consequence: **if you add or change Tailwind utility classes in any `layouts/**/*.html`, you must
recompile** (`pnpm run compile`, or just use `pnpm run dev:parallel` which watches). Running plain
`hugo server` alone will serve a stale `compiled.css` and your new classes won't appear. Commit the
regenerated `compiled.css` alongside template changes.

## Architecture

### Theming & dark mode (two independent axes)

1. **Color scheme** — set by `data-theme="<name>"` on `<html>`. Each scheme is a block of CSS
   custom properties (oklch colors) in `assets/css/themes.css`. `main.css` maps those vars into
   Tailwind via `@theme` so utilities like `bg-background`, `text-foreground`, `text-primary`,
   `bg-sidebar`, `border-input` and `ring-ring` work. A new scheme requires **both** a
   `[data-theme="x"]` block in `themes.css` **and** an entry in `data/themes.yaml` (the latter
   populates the UI switcher).
2. **Light/dark** — toggled by the `.dark` class on `<html>` (`@custom-variant dark` in `main.css`).
   Each color scheme defines its own `.dark` overrides.

`themes.css` defines the base shadcn token set once in `:root` (`--radius`, `--destructive`,
`--input`, `--ring`, `--sidebar-*`). Scheme blocks override only colors; aliases such as
`--sidebar: var(--background)` resolve against the winning scheme values on `<html>`. Radius
utilities come from the single `--radius` scale (`rounded-sm/md/lg/xl`); do not reintroduce
`rounded-control/card/panel` or content-card shadow tokens.

### Page shell and adaptive dock

`layouts/baseof.html` renders a width-constrained `#page-container` with, in order: inline
announcement, sticky context bar (`navigation/context-bar.html`, non-home pages), `<main>`, and the
footer. The dock, TOC panel, search dialog and KaTeX/Mermaid assets sit outside that container.

- The context bar is a sticky bordered panel. Breadcrumbs use 14px links, a home icon, and
  chevron separators; series posts add a second row with progress dots and previous/next controls
  that opens `navigation/series-popover.html`. Series data is resolved once by
  `content/series-info.html` and reused by the context bar, the post header and post navigation.
- `ui/dock.html` is the only page/function chrome: Home, Menu, Search, TOC (when present),
  Appearance (color scheme, light/dark, width, language), and a contextual Back-to-top.
- Placement is CSS-first in `assets/css/components.css`: the dock is a floating opaque capsule on
  the right at `(min-aspect-ratio: 4/3) and (min-width: 75rem)` or
  `(horizontal-viewport-segments: 2)`, and a floating bottom capsule everywhere else, including
  vertical folds. It overlays the page margin and does not offset the centered content.
  `dock.js` mirrors the placement into `aria-orientation`, updates the top reading-progress line
  and back-to-top, and implements toolbar arrow keys.
- Cards have one implementation in `content/card.html` with `post` / `project` / `series`
  variants. `post-card.html`, `project-card.html`, and `series-card.html` are thin wrappers.
  Grids use `content/card-grid.html`; list page headers use `content/page-header.html`.
  Cards are bordered surfaces without content shadows and without cover images.
- The content width is `--content-width-base` (from `contentWidth`) overridable at runtime by
  `--content-width` (40–90rem slider, `localStorage` key `contentWidth`). CSS applies the max-width
  to `#page-container`; `viewport.js` resets from the configured base value.
- Popovers use native `popover` plus CSS anchor positioning with fixed-position fallbacks. Keep
  click-only behavior; hover-open was removed.
- The appearance panel is always fully available; there are no `ui.appearance.*` / `ui.language.*`
  flags. Language options appear automatically on multilingual sites.

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
note/tip/important/warning/caution, whose colors are the `--note` etc. vars). Collapsible alerts
use native `<details>`, so no inline script is emitted per block.
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
  Built-in names are `author-section`, `recent-posts`, `featured-projects`, and `page-content`.
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
