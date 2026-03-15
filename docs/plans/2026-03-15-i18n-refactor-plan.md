# I18N Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor i18n to RFC5646/BCP47 language tags, underscore-only keys, CLDR plurals, and Hugo localized date formats, with no backward compatibility.

**Architecture:** Update language configuration and content suffixes to new language keys; rename i18n files; replace template keys with underscore equivalents; move all count strings to CLDR plurals; migrate date formatting to `time.Format` presets; align all translation files to a canonical key set; handle client-side pluralization for search results.

**Tech Stack:** Hugo templates, YAML i18n files, JavaScript (`assets/js/search.js`), Hugo config YAML.

---

> Note: Per user request, **do not run tests or baseline tests** during implementation. Use `pnpm` for any Node-related commands.

### Task 1: Update Language Config + Content Suffixes

**Files:**
- Modify: `exampleSite/config/_default/hugo.yaml`
- Modify: `exampleSite/config/_default/languages.yaml`
- Modify: `exampleSite/config/_default/params.yaml`
- Rename: `exampleSite/content/_index.zh-cn.md`
- Rename: `exampleSite/content/archives/_index.zh-cn.md`
- Rename: `exampleSite/content/about/_index.zh-cn.md`
- Rename: `exampleSite/content/timeline/_index.zh-cn.md`
- Rename: `exampleSite/content/projects/_index.zh-cn.md`
- Rename: `exampleSite/content/projects/gohugo/index.zh-cn.md`
- Rename: `exampleSite/content/projects/narrow/index.zh-cn.md`
- Rename: `exampleSite/content/posts/gallery/index.zh-cn.md`
- Rename: `exampleSite/content/posts/shortcode.zh-cn.md`
- Rename: `exampleSite/content/posts/markdown-test.zh-cn.md`

**Step 1: Update Hugo language config**
- Set `languageCode: en` in `exampleSite/config/_default/hugo.yaml`.
- Keep `defaultContentLanguage: en`.

**Step 2: Update `languages.yaml` keys and codes**
- Rename language key `zh-cn` → `zh-hans`.
- Change `languageCode: en-US` → `en`.
- Change `languageCode: zh-CN` → `zh-Hans`.

**Step 3: Update params language tag**
- Set `language: "en"` in `exampleSite/config/_default/params.yaml`.

**Step 4: Rename Chinese content suffixes**
- Rename `*.zh-cn.md` → `*.zh-hans.md` (list above).

**Step 5: Commit**
```bash
git add exampleSite/config/_default/hugo.yaml exampleSite/config/_default/languages.yaml exampleSite/config/_default/params.yaml exampleSite/content
git commit -m "refactor: align language tags to BCP47"
```

### Task 2: Rename i18n Files

**Files:**
- Rename: `i18n/zh-cn.yaml` → `i18n/zh-hans.yaml`
- Rename: `i18n/zh-tw.yaml` → `i18n/zh-hant.yaml`

**Step 1: Rename files**
- Use `mv` to rename the files.

**Step 2: Commit**
```bash
git add i18n/zh-hans.yaml i18n/zh-hant.yaml
git commit -m "refactor: rename i18n files to zh-hans/zh-hant"
```

### Task 3: Update Menu Identifiers to Underscore Keys

**Files:**
- Modify: `exampleSite/config/_default/menus.yaml`

**Step 1: Replace identifiers with underscore keys**
- `nav.posts` → `nav_posts`
- `nav.categories` → `nav_categories`
- `nav.tags` → `nav_tags`
- `nav.archives` → `nav_archives`
- `nav.more` → `nav_more`
- `nav.more.about` → `nav_more_about`
- `nav.more.projects` → `nav_more_projects`
- `nav.timeline` → `nav_timeline`
- Footer menu `nav.projects` → `nav_projects`
- Update `parent: nav.more` → `parent: nav_more`

**Step 2: Commit**
```bash
git add exampleSite/config/_default/menus.yaml
git commit -m "refactor: update menu identifiers to underscore keys"
```

### Task 4: Replace i18n Keys in Templates + Date Formatting

**Files (representative list, update all i18n calls):**
- Modify: `layouts/posts/list.html`
- Modify: `layouts/archives.html`
- Modify: `layouts/list.html`
- Modify: `layouts/single.html`
- Modify: `layouts/taxonomy.html`
- Modify: `layouts/term.html`
- Modify: `layouts/projects/list.html`
- Modify: `layouts/projects/single.html`
- Modify: `layouts/_partials/content/post-meta.html`
- Modify: `layouts/_partials/content/post-navigation.html`
- Modify: `layouts/_partials/content/card-base.html`
- Modify: `layouts/_partials/ui/search-modal.html`
- Modify: `layouts/_partials/ui/dock.html`
- Modify: `layouts/_partials/ui/language-switcher.html`
- Modify: `layouts/_partials/ui/theme-switcher.html`
- Modify: `layouts/_partials/navigation/pagination.html`
- Modify: `layouts/_partials/layout/footer.html`
- Modify: `layouts/_partials/features/comments/*.html`
- Modify: `layouts/_markup/render-codeblock.html`
- Modify: `layouts/_shortcodes/tab.html`

**Step 1: Global key rule**
- Replace dots with underscores for all keys, **except** the special cases below.

**Step 2: Special-case key changes**
- `post.reading_time` → `post_reading_time_label` (aria label only)
- `post.reading_time_unit` → removed; use `time_minutes` with count
- `time.minute` → removed; use `time_minutes` with count
- `post.words_count` → `post_word_count_label` (aria label only)
- `post.words` → removed; use `post_word_count` with count
- `time.date_format`, `time.date_format_short`, `time.month_format` → removed; use `time.Format` presets
- `search.results_count` → handled in Task 6 (client plural forms)

**Step 3: Replace date formatting**
- Use `time.Format ":date_long"` for full dates.
- Use `time.Format ":date_short"` for short dates in lists.
- Use `time.Format ":date_month"` for archive month headings.

**Step 4: Commit**
```bash
git add layouts
git commit -m "refactor: replace i18n keys and date formats"
```

### Task 5: Update Reading Time + Word Count Output

**Files:**
- Modify: `layouts/_partials/content/post-meta.html`
- Modify: `layouts/_partials/content/card-base.html`
- Modify: `layouts/archives.html`

**Step 1: Reading time**
- Replace `{{ .ReadingTime }} {{ i18n "time.minute" }}` with:
```go-html-template
{{ T "time_minutes" (dict "count" .ReadingTime) }}
```
- Set aria label key to `post_reading_time_label`.

**Step 2: Word count**
- Replace `{{ .WordCount }} {{ i18n "post.words" }}` with:
```go-html-template
{{ T "post_word_count" (dict "count" .WordCount) }}
```
- Set aria label key to `post_word_count_label`.

**Step 3: Commit**
```bash
git add layouts/_partials/content/post-meta.html layouts/_partials/content/card-base.html layouts/archives.html
git commit -m "refactor: use pluralized reading time and word count"
```

### Task 6: Client-Side Search Results Pluralization

**Files:**
- Modify: `layouts/_partials/ui/search-modal.html`
- Modify: `assets/js/search.js`

**Step 1: Add plural templates to HTML**
- Replace `data-template` with plural form data attributes, e.g.:
```go-html-template
<div id="search-stats"
  data-count-one='{{ i18n "search_results_count_one" }}'
  data-count-few='{{ i18n "search_results_count_few" }}'
  data-count-many='{{ i18n "search_results_count_many" }}'
  data-count-other='{{ i18n "search_results_count_other" }}'>
</div>
```

**Step 2: Update JS to choose CLDR category**
- Use `Intl.PluralRules` with `document.documentElement.lang` (fallback to `en`).
- Pick template for category; fallback order: category → `other` → existing text.
- Replace `%d` with the number.

**Step 3: Commit**
```bash
git add layouts/_partials/ui/search-modal.html assets/js/search.js
git commit -m "refactor: pluralize search results in JS"
```

### Task 7: Rebuild i18n Files to Canonical Key Set

**Files:**
- Modify: `i18n/en.yaml`
- Modify: `i18n/ar.yaml`
- Modify: `i18n/de.yaml`
- Modify: `i18n/es.yaml`
- Modify: `i18n/fr.yaml`
- Modify: `i18n/it.yaml`
- Modify: `i18n/ja.yaml`
- Modify: `i18n/ko.yaml`
- Modify: `i18n/pt.yaml`
- Modify: `i18n/ru.yaml`
- Modify: `i18n/vi.yaml`
- Modify: `i18n/zh-hans.yaml`
- Modify: `i18n/zh-hant.yaml`

**Step 1: Use canonical key list**
- Use the canonical key list in `docs/plans/2026-03-15-i18n-refactor-design.md`.
- Remove all unused keys listed in the design doc.

**Step 2: Add new plural keys**
- `time_minutes` (CLDR plural forms)
- `post_word_count` (CLDR plural forms)
- `nav_total_pages` (CLDR plural forms)
- `post_total_posts`, `section_total_items`, `archives_total_posts`, `archives_posts_count`
- `taxonomy_total_tags`, `taxonomy_total_categories`, `taxonomy_total_terms`, `term_total_posts`
- `project_total_projects`

**Step 3: Add new label keys**
- `post_reading_time_label`
- `post_word_count_label`

**Step 4: Add search plural templates**
- `search_results_count_one`, `search_results_count_few`, `search_results_count_many`, `search_results_count_other`
- For languages without `few/many`, duplicate `other`.

**Step 5: Commit**
```bash
git add i18n
git commit -m "refactor: rebuild i18n keys and plurals"
```

### Task 8: Remove Legacy Keys References

**Files:**
- Modify: `layouts` (any remaining old keys)
- Modify: `exampleSite/config/_default/menus.yaml` (ensure identifiers match)

**Step 1: Verify no old dotted keys remain**
- Use `rg '"[a-z]+\.[a-z]+' layouts exampleSite/config` to confirm.

**Step 2: Commit**
```bash
git add layouts exampleSite/config/_default/menus.yaml
git commit -m "chore: remove legacy i18n key references"
```
