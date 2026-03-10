# Menu Accessibility And GitHub Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the menu code in `assets/js/main.js` more robust and accessible, then publish the example site to GitHub Pages from GitHub Actions on `v*` tags.

**Architecture:** Keep the current `UIManager` / `ToolDropdown` / `NavDisclosure` split, but make the dropdown and drawer logic more local and predictable. Introduce a minimal JS test harness so the interaction changes are implemented with TDD, then update Hugo and workflow configuration so production builds target a GitHub project page instead of Vercel.

**Tech Stack:** Hugo Extended, Tailwind CSS CLI, plain browser JavaScript, Vitest, jsdom, GitHub Actions, GitHub Pages

---

### Task 1: Add a Minimal JS Test Harness

**Files:**
- Modify: `D:\GitHub\hugo-narrow\package.json`
- Create: `D:\GitHub\hugo-narrow\vitest.config.js`
- Create: `D:\GitHub\hugo-narrow\tests\ui\main.test.js`

**Step 1: Write the failing test**

```javascript
import { describe, expect, test } from "vitest";

describe("placeholder harness", () => {
  test("loads jsdom tests", () => {
    expect(typeof document).toBe("object");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test tests/ui/main.test.js`
Expected: FAIL because no test runner or script exists yet

**Step 3: Write minimal implementation**

```json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

```javascript
export default {
  test: {
    environment: "jsdom"
  }
};
```

**Step 4: Run test to verify it passes**

Run: `pnpm test tests/ui/main.test.js`
Expected: PASS with a working jsdom environment

**Step 5: Commit**

```bash
git add package.json vitest.config.js tests/ui/main.test.js pnpm-lock.yaml
git commit -m "test: add jsdom harness for menu behavior"
```

### Task 2: Cover Dropdown Pairing With a Failing Test

**Files:**
- Modify: `D:\GitHub\hugo-narrow\tests\ui\main.test.js`
- Modify: `D:\GitHub\hugo-narrow\assets\js\main.js`

**Step 1: Write the failing test**

```javascript
test("opens the dropdown menu that belongs to the clicked toggle", async () => {
  document.body.innerHTML = `
    <div class="relative">
      <button class="dropdown-toggle" data-dropdown-type="theme" aria-expanded="false"></button>
      <div class="dropdown-menu hidden" data-dropdown-type="theme"></div>
    </div>
    <div class="relative">
      <button class="dropdown-toggle" data-dropdown-type="theme" aria-expanded="false"></button>
      <div class="dropdown-menu hidden" data-dropdown-type="theme"></div>
    </div>
  `;

  const ui = new UIManager();
  const [firstToggle] = document.querySelectorAll(".dropdown-toggle");
  const menus = document.querySelectorAll(".dropdown-menu");

  firstToggle.click();

  expect(menus[0].classList.contains("hidden")).toBe(false);
  expect(menus[1].classList.contains("hidden")).toBe(true);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test tests/ui/main.test.js -t "opens the dropdown menu that belongs to the clicked toggle"`
Expected: FAIL if the current index-based lookup opens the wrong element under asymmetric markup

**Step 3: Write minimal implementation**

```javascript
const wrapper = toggle.closest(".relative") || toggle.parentElement;
const dropdown = wrapper?.querySelector(dropdownSelector);
```

**Step 4: Run test to verify it passes**

Run: `pnpm test tests/ui/main.test.js -t "opens the dropdown menu that belongs to the clicked toggle"`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/ui/main.test.js assets/js/main.js
git commit -m "fix: pair dropdown toggles with local menus"
```

### Task 3: Cover Delegated Theme And Color-Scheme Actions

**Files:**
- Modify: `D:\GitHub\hugo-narrow\tests\ui\main.test.js`
- Modify: `D:\GitHub\hugo-narrow\assets\js\main.js`

**Step 1: Write the failing test**

```javascript
test("clicking a theme item updates state through delegated handling", () => {
  document.body.innerHTML = `
    <div class="dropdown-menu" data-dropdown-type="theme">
      <button data-theme="dark"></button>
    </div>
  `;

  const ui = new UIManager();
  const item = document.querySelector("[data-theme='dark']");

  item.click();

  expect(document.documentElement.classList.contains("dark")).toBe(true);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test tests/ui/main.test.js -t "clicking a theme item updates state through delegated handling"`
Expected: FAIL after removing per-dropdown listeners or before delegated logic exists

**Step 3: Write minimal implementation**

```javascript
document.addEventListener("click", (event) => {
  const themeButton = event.target.closest(".dropdown-menu [data-theme]");
  if (themeButton) {
    this.setTheme(themeButton.getAttribute("data-theme"));
    this.closeAllMenus();
  }
});
```

**Step 4: Run test to verify it passes**

Run: `pnpm test tests/ui/main.test.js -t "clicking a theme item updates state through delegated handling"`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/ui/main.test.js assets/js/main.js
git commit -m "refactor: delegate theme and color-scheme menu actions"
```

### Task 4: Cover Drawer Focus Management With Failing Tests

**Files:**
- Modify: `D:\GitHub\hugo-narrow\tests\ui\main.test.js`
- Modify: `D:\GitHub\hugo-narrow\assets\js\main.js`
- Modify: `D:\GitHub\hugo-narrow\layouts\_partials\navigation\mobile-nav-panel.html`

**Step 1: Write the failing test**

```javascript
test("opening the mobile nav drawer focuses the first interactive element and restores focus on close", () => {
  document.body.innerHTML = `
    <button id="mobile-nav-toggle" aria-expanded="false"></button>
    <div id="mobile-nav-panel" class="hidden">
      <a href="/one">One</a>
      <a href="/two">Two</a>
    </div>
  `;

  const toggle = document.getElementById("mobile-nav-toggle");
  const ui = new UIManager();

  toggle.focus();
  ui.navDisclosure.openPanel();

  expect(document.activeElement?.getAttribute("href")).toBe("/one");

  ui.navDisclosure.closePanel();

  expect(document.activeElement).toBe(toggle);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test tests/ui/main.test.js -t "opening the mobile nav drawer focuses the first interactive element and restores focus on close"`
Expected: FAIL because focus remains on the toggle or body

**Step 3: Write minimal implementation**

```javascript
this.lastFocusedElement = document.activeElement;
const firstFocusable = this.getFocusableElements()[0];
firstFocusable?.focus();
```

```javascript
if (this.lastFocusedElement instanceof HTMLElement) {
  this.lastFocusedElement.focus();
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test tests/ui/main.test.js -t "opening the mobile nav drawer focuses the first interactive element and restores focus on close"`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/ui/main.test.js assets/js/main.js layouts/_partials/navigation/mobile-nav-panel.html
git commit -m "feat: improve mobile nav drawer focus behavior"
```

### Task 5: Add Failing Tests For Focus Trap And Scroll Lock

**Files:**
- Modify: `D:\GitHub\hugo-narrow\tests\ui\main.test.js`
- Modify: `D:\GitHub\hugo-narrow\assets\js\main.js`
- Modify: `D:\GitHub\hugo-narrow\layouts\_partials\navigation\mobile-menu-toggle.html`
- Modify: `D:\GitHub\hugo-narrow\layouts\_partials\navigation\mobile-nav-panel.html`

**Step 1: Write the failing test**

```javascript
test("tab stays inside the open mobile nav drawer", () => {
  document.body.innerHTML = `
    <button id="mobile-nav-toggle" aria-expanded="false"></button>
    <div id="mobile-nav-panel" class="hidden">
      <a href="/one">One</a>
      <button>Two</button>
    </div>
  `;

  const ui = new UIManager();
  ui.navDisclosure.openPanel();

  const [first, last] = ui.navDisclosure.getFocusableElements();
  last.focus();
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));

  expect(document.activeElement).toBe(first);
  expect(document.body.style.overflow).toBe("hidden");

  ui.navDisclosure.closePanel();

  expect(document.body.style.overflow).toBe("");
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test tests/ui/main.test.js -t "tab stays inside the open mobile nav drawer"`
Expected: FAIL because focus escapes the panel and no scroll lock exists

**Step 3: Write minimal implementation**

```javascript
document.body.style.overflow = "hidden";
```

```javascript
if (event.key === "Tab" && this.isPanelOpen()) {
  // wrap focus between first and last focusable elements
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test tests/ui/main.test.js -t "tab stays inside the open mobile nav drawer"`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/ui/main.test.js assets/js/main.js layouts/_partials/navigation/mobile-menu-toggle.html layouts/_partials/navigation/mobile-nav-panel.html
git commit -m "feat: trap focus and lock scroll in mobile nav drawer"
```

### Task 6: Make Language Selection Independent Of Hard-Coded Default Language

**Files:**
- Modify: `D:\GitHub\hugo-narrow\tests\ui\main.test.js`
- Modify: `D:\GitHub\hugo-narrow\assets\js\main.js`
- Modify: `D:\GitHub\hugo-narrow\layouts\_partials\ui\dropdown-button.html`

**Step 1: Write the failing test**

```javascript
test("root language link selection uses configured default language metadata instead of hard-coded en", () => {
  document.documentElement.lang = "fr";
  document.body.innerHTML = `
    <div class="dropdown-menu" data-dropdown-type="language" data-default-language="fr">
      <a role="menuitem" href="/"></a>
    </div>
  `;

  const ui = new UIManager();
  ui.updateDropdownSelection();

  const link = document.querySelector("a[role='menuitem']");
  expect(link.classList.contains("bg-accent")).toBe(true);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test tests/ui/main.test.js -t "root language link selection uses configured default language metadata instead of hard-coded en"`
Expected: FAIL because `/` is currently treated as English only

**Step 3: Write minimal implementation**

```javascript
const defaultLanguage = dropdown.dataset.defaultLanguage;
if (href === "/" && currentLang === defaultLanguage) {
  return true;
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test tests/ui/main.test.js -t "root language link selection uses configured default language metadata instead of hard-coded en"`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/ui/main.test.js assets/js/main.js layouts/_partials/ui/dropdown-button.html
git commit -m "fix: derive default language selection from markup"
```

### Task 7: Add a GitHub Pages Release Workflow

**Files:**
- Create: `D:\GitHub\hugo-narrow\.github\workflows\pages-release.yml`
- Modify: `D:\GitHub\hugo-narrow\package.json`
- Modify: `D:\GitHub\hugo-narrow\exampleSite\config\_default\hugo.yaml`
- Delete: `D:\GitHub\hugo-narrow\vercel.json`

**Step 1: Write the failing test**

```yaml
name: Pages Release
on:
  push:
    tags:
      - "v*"
jobs: {}
```

Add a local verification command expectation:

```bash
pnpm run build:pages
```

**Step 2: Run test to verify it fails**

Run: `pnpm run build:pages`
Expected: FAIL because no Pages-specific build script or baseURL override exists yet

**Step 3: Write minimal implementation**

```json
{
  "scripts": {
    "build:pages": "pnpm run compile && hugo --source=exampleSite --themesDir=../.. --minify --baseURL \"$PAGES_BASE_URL\""
  }
}
```

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

```yaml
env:
  PAGES_BASE_URL: https://<owner>.github.io/hugo-narrow/
```

**Step 4: Run test to verify it passes**

Run: `pnpm run build:pages`
Expected: PASS with output generated for a project-page base URL

**Step 5: Commit**

```bash
git add .github/workflows/pages-release.yml package.json exampleSite/config/_default/hugo.yaml
git rm vercel.json
git commit -m "ci: deploy project page releases from version tags"
```

### Task 8: Verify Static Output And Document The Release Flow

**Files:**
- Modify: `D:\GitHub\hugo-narrow\README.md`
- Verify: `D:\GitHub\hugo-narrow\public\`

**Step 1: Write the failing test**

Document a missing release section in `README.md`:

```markdown
## Release Deployment

Push a tag like `v1.2.0` to trigger GitHub Pages deployment.
```

**Step 2: Run test to verify it fails**

Run: `rg -n "Release Deployment|GitHub Pages|v1\\.2\\.0" README.md`
Expected: FAIL because release deployment docs do not exist yet

**Step 3: Write minimal implementation**

```markdown
## Release Deployment

This repository publishes the example site to GitHub Pages.
Push a tag matching `v*` such as `v1.2.0` to trigger the release workflow.
```

**Step 4: Run test to verify it passes**

Run: `rg -n "Release Deployment|GitHub Pages|v1\\.2\\.0" README.md`
Expected: PASS

Run: `pnpm test && pnpm run build && pnpm run build:pages`
Expected: PASS

**Step 5: Commit**

```bash
git add README.md
git commit -m "docs: describe GitHub Pages release flow"
```
