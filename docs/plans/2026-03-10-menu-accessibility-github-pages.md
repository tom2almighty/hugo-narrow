# Menu Accessibility And GitHub Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve the existing menu accessibility in the current Hugo theme and publish the example site to GitHub Pages from GitHub Actions when a `v*` tag is pushed.

**Architecture:** Keep the current `UIManager` / `ToolDropdown` / `NavDisclosure` structure and directly adjust the existing JS and partial templates instead of adding a new abstraction or test harness. For deployment, reuse the current Hugo build flow, remove Vercel-specific setup, and add one GitHub Pages workflow for project-page releases.

**Tech Stack:** Hugo Extended, Tailwind CSS CLI, plain browser JavaScript, GitHub Actions, GitHub Pages

---

## Constraints

- Do not create test scripts, test harnesses, or new automated UI tests in this task.
- Directly modify the current Hugo project files.
- Keep the solution simple and local. Do not introduce a new menu architecture, state machine, or deployment pipeline beyond what is required.
- Use repository-relative paths only. Ignore the old Windows absolute paths from the earlier draft.

### Task 1: Refine Existing Menu Behavior In Place

**Files:**
- Modify: `assets/js/main.js`
- Modify: `layouts/_partials/navigation/mobile-nav-panel.html`

**Step 1: Review the current menu interactions**

Check the existing logic in `ToolDropdown`, `NavDisclosure`, and `UIManager` so the changes stay inside the current structure.

**Step 2: Fix dropdown pairing**

Replace the current global index-based dropdown lookup with local lookup from the clicked toggle's nearest wrapper so each toggle only controls its own menu.

**Step 3: Simplify dropdown action handling**

Move theme and color-scheme item handling to a delegated click path in `UIManager` so the current behavior is preserved without binding repeated listeners to every rendered dropdown.

**Step 4: Improve mobile drawer accessibility without expanding scope**

Update the mobile navigation panel behavior so it:
- keeps `aria-expanded` and related state in sync
- moves focus into the drawer when opened
- restores focus to the toggle when closed
- supports `Escape` to close
- keeps `Tab` navigation inside the open drawer
- locks page scroll while the drawer is open

Keep the desktop submenu behavior as it is today.

**Step 5: Manually verify menu behavior**

Run: `pnpm run dev`

Check these cases in the browser:
- each dropdown toggle opens only its own menu
- theme and color-scheme actions still work
- mobile drawer focus moves in correctly and returns to the toggle on close
- `Escape` closes the drawer
- `Tab` and `Shift+Tab` stay inside the drawer while it is open

**Step 6: Commit**

```bash
git add assets/js/main.js layouts/_partials/navigation/mobile-nav-panel.html
git commit -m "fix: improve menu accessibility behavior"
```

### Task 2: Prepare Hugo For GitHub Pages Project-Page Builds

**Files:**
- Modify: `exampleSite/config/_default/hugo.yaml`

**Step 1: Remove deployment assumptions tied to Vercel**

Replace the current Vercel-specific production URL with a neutral default value that keeps the theme reusable.

**Step 2: Keep project-page support simple**

Document the expectation that the GitHub Pages workflow will pass the final project-page `baseURL` at build time, instead of hard-coding a repository-specific URL into the theme.

**Step 3: Manually verify the production build**

Run: `pnpm run build`

Then run a build equivalent to the Pages release with a project-page URL, for example:

```bash
hugo --source=exampleSite --themesDir=../.. --minify --baseURL "https://<owner>.github.io/<repo>/"
```

Confirm the generated output uses the expected project-page asset and page URLs.

**Step 4: Commit**

```bash
git add exampleSite/config/_default/hugo.yaml
git commit -m "chore: prepare hugo config for pages builds"
```

### Task 3: Add GitHub Pages Release Workflow

**Files:**
- Create: `.github/workflows/github-pages.yml`
- Delete: `vercel.json`

**Step 1: Add the Pages workflow**

Create a GitHub Actions workflow that:
- triggers on `push` tags matching `v*`
- checks out the repository
- installs the required Node and Hugo versions
- runs `pnpm install --frozen-lockfile`
- runs `pnpm run compile`
- runs Hugo with a project-page `baseURL`
- uploads the built site and deploys it with the official GitHub Pages actions

**Step 2: Keep the release path aligned with the existing project**

Build from `exampleSite` and the existing theme sources. Do not add a second build entrypoint or a separate deployment-specific site directory.

**Step 3: Remove the old Vercel deployment file**

Delete `vercel.json` after the Pages workflow is added.

**Step 4: Validate workflow shape locally**

Review that the workflow uses:
- `permissions` required for Pages deployment
- `concurrency` for the Pages environment
- official actions for configure/upload/deploy

No extra preview, branch deployment, or `gh-pages` branch push logic should be added.

**Step 5: Commit**

```bash
git add .github/workflows/github-pages.yml vercel.json
git commit -m "ci: deploy releases to github pages"
```

### Task 4: Final Manual Verification

**Files:**
- No file changes required

**Step 1: Re-run local checks**

Run:

```bash
pnpm run build
```

**Step 2: Review the release flow**

Confirm the final implementation matches these constraints:
- no new test files or test tooling were added
- the menu changes stay inside the current JS and Hugo partials
- the release flow is triggered by `v*` tags
- the output targets a GitHub project page

**Step 3: Commit any final adjustments if needed**

If manual verification reveals a small issue, fix it in place and create one final focused commit.
