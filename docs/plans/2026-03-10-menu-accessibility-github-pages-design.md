# Menu Accessibility And GitHub Pages Design

**Date:** 2026-03-10

## Scope

- Directly improve the current menu behavior in `assets/js/main.js`.
- Make the mobile navigation panel more accessible without replacing the existing structure.
- Publish the example site to GitHub Pages from GitHub Actions when a `v*` tag is pushed.

## Constraints

- This is a Hugo project. The design should stay close to the current Hugo theme structure.
- Do not create test scripts, test harnesses, or extra testing infrastructure for this work.
- Prefer direct modification of existing files over adding new layers.
- Do not overcomplicate the menu logic or the deployment flow.

## Current Context

- Menu logic already lives in `UIManager`, `ToolDropdown`, and `NavDisclosure`.
- The current dropdown pairing depends on global index matching, which is fragile when markup differs.
- The mobile navigation panel opens and closes, but its accessibility behavior is still incomplete.
- The current production URL in `exampleSite/config/_default/hugo.yaml` is still tied to Vercel.
- `package.json` already has the build commands needed for local asset compilation and Hugo builds.

## Approved Direction

### Menu Behavior

- Keep the existing class split between `UIManager`, `ToolDropdown`, and `NavDisclosure`.
- Fix dropdown lookup locally from the clicked toggle instead of relying on matching array indexes.
- Consolidate repeated dropdown item handling where it simplifies the current code.
- Improve the mobile drawer interaction only as far as needed for basic accessibility:
  - focus moves into the drawer on open
  - focus returns to the toggle on close
  - `Escape` closes the drawer
  - `Tab` stays inside the drawer while it is open
  - page scroll is locked while the drawer is open
- Preserve the existing desktop submenu pattern.

### Deployment

- Stop using Vercel for deployment.
- Add one GitHub Pages workflow triggered by `v*` tags.
- Target a GitHub project page.
- Use the official GitHub Pages deploy actions.
- Keep the site reusable by letting the workflow pass the final `baseURL` during the production build.

## Design Details

### JS Refactor

- `ToolDropdown.bindToggle()` should resolve its menu from the clicked toggle's local container.
- `UIManager.closeAllMenus()` should remain the shared close path.
- Theme and color-scheme actions should be handled through one delegated listener path instead of separate listeners on every rendered dropdown.
- The changes should stay inside the current files and class structure.

### Mobile Drawer Accessibility

- `NavDisclosure.openPanel()` should:
  - show the panel
  - update button state
  - remember the previously focused element
  - lock background scroll
  - focus the first interactive element in the panel
- `NavDisclosure.closePanel()` should:
  - hide the panel
  - reset accordion state
  - unlock background scroll
  - restore focus to the toggle when appropriate
- Keyboard handling only needs the essential drawer behavior for this pass:
  - `Escape` closes
  - `Tab` and `Shift+Tab` stay within the panel while open

### GitHub Pages Release Flow

- Add `.github/workflows/github-pages.yml`.
- Build from the existing `exampleSite` entrypoint.
- Run the current asset build and Hugo production build in the workflow.
- Pass the project-page `baseURL` in the workflow instead of baking a repository-specific URL into the theme.
- Remove `vercel.json` after the Pages workflow is in place.

## Verification

This pass should rely on lightweight manual verification instead of new automated tests.

- Local interaction checks in the browser:
  - dropdown toggle opens its own menu
  - theme and color-scheme actions still work
  - mobile drawer focus behavior works as expected
- Local build checks:
  - `pnpm run build`
  - Hugo build with a project-page `baseURL`
- Release flow check:
  - workflow is triggered by `v*` tags
  - workflow uses the official Pages upload and deploy actions

## Risks And Mitigations

- Project-page URLs can break links if the release build does not receive the correct `baseURL`.
  - Mitigation: pass the final Pages URL in the workflow build step and verify the generated output locally.
- Focus handling can become brittle if the drawer selector scope is too broad.
  - Mitigation: keep focusable-element queries local to the mobile panel.
- Simplifying listeners can accidentally affect existing menu behavior.
  - Mitigation: limit delegated handling to explicit `data-theme` and `data-color-scheme` targets.

## Out Of Scope

- Adding Vitest, jsdom, or any test harness.
- Replacing the current menu classes with a new state model.
- Adding preview deployments, branch deployments, or custom domain support.
