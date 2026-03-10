# Menu Accessibility And GitHub Pages Design

**Date:** 2026-03-10

**Scope**

- Refine the menu behavior in `assets/js/main.js` without replacing the current class-based structure.
- Upgrade the mobile navigation panel from a visually distinct panel to a fully accessible drawer interaction.
- Replace Vercel deployment with GitHub Actions building and publishing the site to GitHub Pages when a `v*` tag is pushed.

## Current Context

- Menu coordination lives in `UIManager`, `ToolDropdown`, and `NavDisclosure`.
- Dropdown instances are currently paired by global index, which is brittle when desktop and mobile markup diverge.
- Mobile navigation now uses a panel-based interaction, but it still lacks drawer-grade accessibility behavior.
- The example site is built from `exampleSite` through `pnpm run build`.
- The Hugo config still assumes Vercel via `baseURL: https://hugo-narrow.vercel.app/`.
- `vercel.json` defines a second deployment-specific build path that should be retired.

## Approved Direction

### Frontend Interaction

- Keep the existing class split between `UIManager`, `ToolDropdown`, and `NavDisclosure`.
- Replace dropdown pairing by index with local container-based lookup from the clicked toggle.
- Consolidate repeated dropdown click handlers into delegated handling where practical.
- Treat the mobile navigation panel as a drawer:
  - move focus into the panel when opened
  - trap focus within the panel while open
  - restore focus to the toggle when closed
  - lock background scroll while open
  - keep `aria-expanded`, `aria-hidden`, and related state synchronized
- Preserve desktop submenu behavior as a floating submenu rather than converting it into a dialog.

### Deployment

- Stop using Vercel as the deployment target.
- Publish the built site to GitHub Pages through GitHub Actions when a `v*` tag is pushed.
- Target a GitHub project page, not a user page.
- Use the official GitHub Pages workflow actions rather than pushing build artifacts to a `gh-pages` branch manually.
- Make the production `baseURL` configurable at build time so the repository remains reusable outside the final Pages URL.

## Design Details

### Menu Refactor

- `ToolDropdown.bindToggle()` should resolve its menu from the clicked toggle's nearest component wrapper rather than from `document.querySelectorAll(...)[index]`.
- Shared menu-close behavior should remain centralized in `UIManager.closeAllMenus()`.
- Theme and color-scheme selection should be delegated through a single listener path instead of one listener per rendered dropdown instance.
- Language selection should keep its current behavior, but the current-language detection should avoid hard-coding assumptions that can drift from Hugo config.

### Mobile Drawer Accessibility

- `NavDisclosure.openPanel()` should:
  - reveal the panel
  - update `aria-expanded`
  - store the previously focused element
  - lock document scroll
  - focus the first interactive control inside the drawer
- `NavDisclosure.closePanel()` should:
  - hide the panel
  - reset accordion state
  - unlock document scroll
  - restore focus to the menu button when appropriate
- Keyboard handling should support:
  - `Escape` to close
  - `Tab` and `Shift+Tab` cycling within drawer focusables while open
- Clicking outside the drawer should continue to close it.

### GitHub Pages Release Flow

- Add a Pages workflow under `.github/workflows/` triggered by `push.tags: ['v*']`.
- Build from the existing example site entrypoint rather than adding a separate deployment build path.
- The workflow should install the required Node and Hugo versions, run the existing asset build, build Hugo output, upload the result, and deploy via GitHub Pages actions.
- The build should supply a project-page `baseURL` that includes the repository path segment.
- `vercel.json` should be removed once the workflow is in place.

## Testing Strategy

- Add targeted automated coverage for the JS interaction changes so menu refactors are not validated only by manual clicking.
- Keep the JS tests narrow:
  - dropdown toggle-to-menu pairing
  - delegated theme or color-scheme action handling
  - drawer focus trapping and focus restoration
- Use build verification for deployment changes:
  - local production build
  - workflow syntax validation by running the same build commands locally where feasible
  - static output spot-checks for project-page asset URLs

## Risks And Mitigations

- Project-page URLs can break root-relative assets if `baseURL` handling is incomplete.
  - Mitigation: test against a project-page `baseURL` during implementation.
- Focus-trap logic can easily become fragile if selectors are too broad.
  - Mitigation: keep the focusable-element query small and local to the drawer.
- Event delegation can accidentally change behavior if menu item selectors are ambiguous.
  - Mitigation: scope delegated handlers to explicit `data-*` attributes and existing menu containers.

## Out Of Scope

- Replacing the current menu classes with a global state machine.
- Changing desktop submenu interaction into a modal or drawer.
- Adding preview deployments or branch-based Pages environments.
- Adding custom domain handling in this pass.
