# I18N Refactor Design (RFC5646 + CLDR + Hugo Best Practices)

Date: 2026-03-15

## Goals
- Rename language IDs to RFC5646/BCP47 form and align i18n filenames.
- Remove dotted i18n keys; adopt lowercase underscore keys.
- Rebuild all translation files using CLDR plural rules (go-i18n forms).
- Use Hugo date/time localization best practices (built-in localized formats).
- Remove unused keys; fill missing keys across all locales.
- No backward compatibility.

## Non-goals
- Region-specific variants beyond script-level Chinese.
- Preserving legacy keys or dotted key aliases.

## Current Findings
- Templates call dotted keys (e.g. nav.menu) while i18n files are nested.
- Menu identifiers are i18n keys and currently include dots.
- Missing keys by locale (relative to en.yaml):
  - ar: 114 missing
  - zh-tw: 114 missing
  - fr/it/pt/ru: 12 missing each
  - vi: 13 missing
  - de/es: 2 missing each
- Large sets of keys in en.yaml are unused by templates (footer.* except all_rights_reserved, common.*, form.*, pagination.*, toc.*, time.* formats, search.match_score, project.demo/source/github/website/tech_stack/view_project, post.read_more/share/view_more_posts, license.cc_by_*).

## Design Decisions
### Language IDs and Filenames
- language keys: en, zh-hans, zh-hant (lowercase)
- languageCode: en, zh-Hans, zh-Hant
- i18n filenames: i18n/en.yaml, i18n/zh-hans.yaml, i18n/zh-hant.yaml
- Update exampleSite params.language default to en (or zh-Hans where appropriate).

### Key Naming
- Lowercase, underscore-delimited keys only.
- No dots in any key names.
- Menu identifiers updated to new underscore keys (e.g. nav_more_about).

### CLDR Plurals (go-i18n)
Use count-based messages with one/few/many/other where required:
- nav_total_pages
- post_total_posts
- section_total_items
- archives_total_posts
- archives_posts_count
- taxonomy_total_tags
- taxonomy_total_categories
- taxonomy_total_terms
- term_total_posts
- project_total_projects
- search_results_count (handled in JS)
- time_minutes
- post_word_count

### Dates and Time
- Remove time.date_format, time.date_format_short, time.month_format.
- Replace with Hugo localized formats via time.Format (e.g. :date_long, :date_short, :date_month).
- Reading time uses time_minutes (CLDR plural), not post_reading_time_unit.

### Search Results Count (JS)
- Replace %d template string with plural forms in data attributes.
- Use Intl.PluralRules in search.js to select correct form per locale.

## Canonical Key Set (Post-refactor)
alert_caution
alert_important
alert_note
alert_tip
alert_warning
archives_desc
archives_no_posts
archives_no_posts_desc
archives_posts_count
archives_timeline
archives_total_posts
code_click_to_expand
code_collapse
code_copied
code_copy
code_expand
code_selected
comments_artalk_config_desc
comments_artalk_not_configured
comments_disqus_config_desc
comments_disqus_noscript
comments_disqus_not_configured
comments_giscus_config_desc
comments_giscus_not_configured
comments_javascript_required
comments_powered_by_disqus
comments_title
comments_twikoo_config_desc
comments_twikoo_not_configured
comments_unsupported_system
comments_unsupported_system_desc
comments_utterances_config_desc
comments_utterances_not_configured
comments_waline_config_desc
comments_waline_not_configured
dock_aria_label
dock_back
dock_back_to_top
dock_comments
dock_search
dock_toc
dock_top
footer_all_rights_reserved
heading_anchor
home_recent_posts
home_view_all_posts
language_toggle
license_author
license_link
license_title
license_type
links
nav_archives
nav_back_home
nav_breadcrumb
nav_categories
nav_menu
nav_more
nav_more_about
nav_more_projects
nav_next
nav_next_page
nav_page_info
nav_pagination
nav_post_navigation
nav_posts
nav_prev
nav_prev_page
nav_projects
nav_tags
nav_timeline
nav_total_pages
post_author
post_categories
post_list_desc
post_next
post_no_next
post_no_next_desc
post_no_posts
post_no_posts_desc
post_no_previous
post_no_previous_desc
post_previous
post_published_on
post_reading_time_label
post_related_posts
post_tags
post_total_posts
post_updated_on
post_view_series_archive
post_word_count
post_word_count_label
project_featured
project_featured_projects
project_list_desc
project_no_projects
project_no_projects_desc
project_status
project_status_completed
project_status_in_progress
project_status_planning
project_tags
project_total_projects
project_view_all_projects
project_visit_project
search_clear
search_close
search_empty_description
search_empty_title
search_hint_close
search_hint_navigate
search_hint_select
search_hint_shortcut
search_loading
search_no_results_description
search_no_results_title
search_placeholder
search_results_count
section_list_desc
section_no_content
section_no_content_desc
section_total_items
taxonomy_categories_desc
taxonomy_desc
taxonomy_no_terms
taxonomy_no_terms_desc
taxonomy_tags_desc
taxonomy_total_categories
taxonomy_total_tags
taxonomy_total_terms
term_category_desc
term_date_range
term_desc
term_no_posts
term_no_posts_category
term_no_posts_desc
term_no_posts_tag
term_tag_desc
term_total_posts
theme_dark
theme_light
theme_system
theme_toggle
time_minutes

## Migration Plan (High Level)
1. Rename i18n files and language keys/codes.
2. Replace dotted keys with underscore keys in templates and menus.
3. Rebuild all i18n files from the canonical key set.
4. Convert count strings to CLDR plural forms.
5. Replace date formatting with time.Format localized presets.
6. Update search.js to use Intl.PluralRules and plural forms.

## Risks
- Search results count string requires JS change (template behavior change).
- Menu identifiers must be updated everywhere (config + content using .Identifier).

## Verification
- Run hugo build for exampleSite to ensure no missing i18n keys.
- Spot-check plural forms for ru/ar/zh-hans/zh-hant.
