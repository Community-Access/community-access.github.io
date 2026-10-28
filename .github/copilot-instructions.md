# Copilot Instructions

## Architecture

Static GitHub Pages site with two standalone HTML files — no build system, no package manager, no framework.

- `index.html` — Homepage: org overview, project cards, install instructions
- `docs.html` — Documentation page: the sidebar is built from `manifest.json` in `Community-Access/accessibility-agents` (read live), and each document is rendered from that repository
- `manifest.json` — Fallback copy of that manifest, used only when the live one cannot be read
- `site-chrome.css` — Type family, footer and current-page styles shared by every page
- `scripts/a11y-crawl.js` — Playwright + axe-core crawler used by the CI audit workflow

## CSS Conventions

Both HTML files use the same inline `<style>` block (no external stylesheet). Key patterns:

- All custom properties use the `--ca-*` prefix (e.g., `--ca-indigo`, `--ca-gray-800`, `--ca-focus`)
- Dark mode is handled by overriding `--ca-*` variables inside `@media (prefers-color-scheme: dark)` — never use hardcoded colors
- Reduced motion is handled globally: `@media (prefers-reduced-motion: reduce)` zeroes all animation/transition durations
- Responsive breakpoint: `48rem`
- Max content width: `72rem` (`--max-width`); docs sidebar width: `18rem` (`--sidebar-width`)
- Focus indicator: `3px solid var(--ca-focus)` (`#f59e0b` amber) with `outline-offset: 3px`

## Accessibility Requirements

Accessibility is the core purpose of this project — every UI change must maintain or improve it.

- Each page must have a skip link (`.skip-link`) as the first focusable element, revealing on `:focus`
- Use `:focus-visible` (not `:focus`) for all focus ring styles
- Interactive elements must have visible focus indicators using `--ca-focus`
- All images need descriptive `alt` text; decorative images use `alt=""`
- Use semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`) with appropriate ARIA labels when landmark roles are ambiguous

## Running the Accessibility Audit Locally

```bash
# Install dependencies (no package.json — install ad-hoc)
npm install --no-save @axe-core/playwright playwright
npx playwright install --with-deps chromium

# Audit the live site
node scripts/a11y-crawl.js https://community-access.github.io ./screenshots

# Audit a specific URL
node scripts/a11y-crawl.js https://community-access.github.io/docs ./screenshots
```

Set `A11Y_SESSION_COOKIE` env var to crawl authenticated pages.

## CI Workflows

| Workflow | Trigger | Purpose |
|---|---|---|
| `accessibility-audit.yml` | Daily 9 AM CT + manual | axe-core WCAG 2.1 AA audit; creates/updates GitHub issues labeled `accessibility` + `automated` |
| `generate-feed.yml` | Pull requests touching `posts/` | Fails if `feed.xml` is out of date; regenerate with `node .github/scripts/generate-feed.js` |
| `branch-protection.yml` | Hourly + manual | Enforces branch protection across all org repos via `ORG_ADMIN_TOKEN` secret |

The audit workflow pushes screenshots to the `a11y-screenshots` branch and uploads artifacts (report JSON, crawl log, screenshots) to the workflow run.
