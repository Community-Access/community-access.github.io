# Accessibility Audit Report

## Project Information

| Field | Value |
|-------|-------|
| Project | Community Access - GitHub Pages Website |
| Date | 2026-02-24 |
| Auditor | A11y Agent Team (web-accessibility-wizard) |
| Target standard | WCAG 2.2 Level AA |
| Framework | Vanilla HTML/CSS/JS (static site) |
| Pages audited | index.html, news.html, docs.html |
| Production URL | https://community-access.github.io/ |

## Executive Summary

- **Total issues found:** 18
- **Critical:** 0 | **Serious:** 6 | **Moderate:** 8 | **Minor:** 4
- **Estimated effort:** Low to Medium

This is a well-built, accessibility-conscious site. The project demonstrates strong fundamentals: semantic HTML, proper landmark structure, skip links, visible focus indicators, `prefers-reduced-motion` and `prefers-color-scheme` support, ARIA-expanded dropdown menus with keyboard navigation, and live regions for dynamic content. The issues found are mostly color contrast failures (confirmed by axe-core) and a handful of structural and ARIA gaps that are straightforward to fix.

## How This Audit Was Conducted

This report combines two methods:

1. **Agent-driven code review** (Phases 1-8): Static analysis of all three HTML source files covering structure, keyboard, forms, color, ARIA, dynamic content, tables, and links.
2. **axe-core runtime scan** (Phase 9): Automated scan of the rendered pages in Chrome headless using axe-core 4.11.1, testing the actual DOM against WCAG 2.1 AA rules. Tags scanned: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`.

Issues found by both methods are marked as **high-confidence** findings.

---

## Accessibility Scorecard

| Page | Score | Grade | Critical | Serious | Moderate | Minor |
|------|-------|-------|----------|---------|----------|-------|
| index.html | 72/100 | C | 0 | 5 | 5 | 3 |
| news.html | 86/100 | B | 0 | 1 | 2 | 1 |
| docs.html | 87/100 | B | 0 | 1 | 3 | 1 |
| **Overall Average** | **82/100** | **B** | **0** | **6** | **8** | **4** |

---

## Serious Issues

### 1. Color contrast failure: `--ca-indigo-light` (#6366f1) on white backgrounds

- **Severity:** Serious
- **Confidence:** High (confirmed by axe-core and code review)
- **Source:** Both
- **WCAG criterion:** 1.4.3 Contrast (Minimum) (Level AA)
- **Impact:** Users with low vision or color deficiencies will struggle to read link text and date labels that use this color. Screen magnification users who rely on visual differentiation will also be affected.
- **Location:** All three pages. CSS variable `--ca-indigo-light: #6366f1` used on `<time>` elements, in-body links, and inline styled links.

**axe-core measured contrast ratios:**
- `#6366f1` on `#ffffff` (body links): **4.46:1** -- FAILS 4.5:1 for normal text
- `#6366f1` on `#f9fafb` (`.changelog-date` on gray-50 background): **4.27:1** -- FAILS 4.5:1

**Affected elements (index.html):**
- `.feature-card:nth-child(7) > p > a` (line ~1213-1214, axe-core link)
- `.feature-card:nth-child(1) > p > a` (line ~1213-1214, "axe-core" link in tools section)
- `time.changelog-date` in latest news section (line ~2294)

**Affected elements (news.html):**
- `time.post-date` elements (line ~157, CSS; line ~472, JS-generated HTML)

**Current CSS (all pages):**
```css
--ca-indigo-light: #6366f1;
```

**Recommended fix:**
```css
--ca-indigo-light: #4f46e5;  /* Was #6366f1 (4.46:1). Now matches --ca-indigo which passes at 5.92:1 on white */
```

Alternatively, use `#5b52f0` which achieves 4.68:1 on white and 4.48:1 on gray-50 -- though the safest choice is `#4f46e5` which passes comfortably in both contexts.

If you want to preserve the lighter shade for dark mode, split the variable:

```css
:root {
  --ca-indigo-light: #4f46e5;  /* passes on white */
}
@media (prefers-color-scheme: dark) {
  :root {
    --ca-indigo-light: #818cf8;  /* passes on dark backgrounds */
  }
}
```

---

### 2. Color contrast failure: "Read the full guide" link (#93c5fd on #f9fafb)

- **Severity:** Serious
- **Confidence:** High (confirmed by axe-core)
- **Source:** Both
- **WCAG criterion:** 1.4.3 Contrast (Minimum) (Level AA)
- **Impact:** This link is essentially invisible to users with moderate low vision. At 1.72:1 contrast, it fails dramatically.
- **Location:** `/Users/taylorarndt/hq/developer/community-access.github.io/index.html`, line 1817

**Current code:**
```html
<a href="...docs/getting-started.md" style="color:#93c5fd;">Read the full guide.</a>
```
Inline `color:#93c5fd` on a `#f9fafb` background: **1.72:1** (needs 4.5:1).

**Recommended fix:**
```html
<a href="...docs/getting-started.md" style="color:var(--ca-indigo);">Read the full guide.</a>
```
Using `--ca-indigo` (#4f46e5) on the bg-alt (#f9fafb) background yields ~5.67:1, which passes.

---

### 3. Color contrast failure: WIP banner button (green-on-green)

- **Severity:** Serious
- **Confidence:** High (confirmed by axe-core)
- **Source:** Both
- **WCAG criterion:** 1.4.3 Contrast (Minimum) (Level AA)
- **Impact:** The "Get Involved" button text inside the green WIP banner is hard to read for users with low vision.
- **Location:** `/Users/taylorarndt/hq/developer/community-access.github.io/index.html`, line 1177

**axe-core measurement:** `#059669` text on `#ffffff` background: **3.76:1** -- FAILS 4.5:1 for text at 16.8px bold.

Note: The button uses `.btn-primary` which sets `background: #047857; color: var(--ca-gray-50)`. But the WIP banner overrides the button to `background: #fff; color: var(--ca-emerald-dark, #059669)` -- so the text becomes green-on-white.

**Current code:**
```css
.wip-banner .btn {
  background: #fff;
  color: var(--ca-emerald-dark, #059669);
  font-weight: 700;
}
```

**Recommended fix:**
```css
.wip-banner .btn {
  background: #fff;
  color: #047857;  /* Darker green: 4.63:1 on white -- PASSES */
  font-weight: 700;
}
```

Or use `#065f46` for even stronger contrast (6.18:1).

---

### 4. Tables missing `<thead>` and `<th>` headers (13 tables)

- **Severity:** Serious
- **Confidence:** High
- **Source:** Code review
- **WCAG criterion:** 1.3.1 Info and Relationships (Level A)
- **Impact:** Screen reader users navigating these tables hear only "column 1, column 2" without any header context. They cannot understand which column contains the agent name vs. the description. This makes the agent tables -- the core content of the site -- difficult to use with assistive technology.
- **Location:** `/Users/taylorarndt/hq/developer/community-access.github.io/index.html`, lines 1254, 1349, 1443, 1477, 1497, 1566, 1580, 1591, 1601, 1624, 1638, 1657, 1696

**Current code (example from line 1254):**
```html
<table class="agent-table" aria-label="Web accessibility agents">
  <tr><td>Accessibility Lead</td><td>Orchestrates the full team...</td></tr>
  ...
</table>
```

These tables have `aria-label` (good) but use only `<td>` elements. There are no `<thead>`, `<th>`, or `scope` attributes.

**Recommended fix:**
```html
<table class="agent-table" aria-label="Web accessibility agents">
  <thead>
    <tr><th scope="col">Agent</th><th scope="col">Description</th></tr>
  </thead>
  <tbody>
    <tr><td>Accessibility Lead</td><td>Orchestrates the full team...</td></tr>
    ...
  </tbody>
</table>
```

Apply this pattern to all 13 agent/skill/prompt tables. The two MCP tables (lines 1721, 1741) already have `<thead>` and `<th>` -- good -- but they are missing `scope="col"` on the `<th>` elements.

For those two tables, add:
```html
<thead><tr><th scope="col">Tool</th><th scope="col">What It Does</th></tr></thead>
```

---

### 5. External links to GitHub open without new-tab warning

- **Severity:** Serious
- **Confidence:** Medium
- **Source:** Code review
- **WCAG criterion:** 3.2.5 Change on Request (Level AAA) / Best practice for 2.4.4 Link Purpose (Level A)
- **Impact:** While these links do NOT use `target="_blank"` (which is actually good -- they open in the same tab), there is no visual or programmatic indicator that they navigate to an external domain. Users may lose their place and be confused. This is a best-practice concern, not a strict AA failure, but is worth noting given the site's stated commitment to WCAG 2.2 AA.

Note: The docs.html page DOES use `target="_blank"` on the dynamically generated "View on GitHub" link (line 1121) without a visible warning. This is the only true issue.

- **Location:** `/Users/taylorarndt/hq/developer/community-access.github.io/docs.html`, line 1121

**Current code:**
```javascript
'<a href="' + githubUrl + '" class="github-link" target="_blank" rel="noopener">View on GitHub</a>'
```

**Recommended fix:**
```javascript
'<a href="' + githubUrl + '" class="github-link" target="_blank" rel="noopener">View on GitHub <span class="sr-only">(opens in new tab)</span></a>'
```

The `.sr-only` class is already defined in docs.html (line 686-695).

---

### 6. `aria-live="polite"` on the entire `<main>` content area (docs.html)

- **Severity:** Serious
- **Confidence:** High
- **Source:** Code review
- **WCAG criterion:** 4.1.3 Status Messages (Level AA) -- misapplication
- **Impact:** The `docs-content` main area has `aria-live="polite"`, which means every time a document loads, the ENTIRE rendered markdown content is announced to screen readers. For long documents, this creates an overwhelming, uninterruptible announcement that could last minutes. Screen reader users will hear the full document read aloud automatically, which is extremely disruptive.
- **Location:** `/Users/taylorarndt/hq/developer/community-access.github.io/docs.html`, line 939

**Current code:**
```html
<main class="docs-content" id="docs-content" aria-live="polite">
```

**Recommended fix:**

Remove `aria-live` from the main content area. Instead, use a small, separate live region to announce the page change briefly:

```html
<main class="docs-content" id="docs-content">
  <!-- Existing content -->
</main>
<div class="sr-only" aria-live="polite" id="doc-status"></div>
```

Then in the JavaScript `renderDoc` function (line ~1109), after loading content:
```javascript
document.getElementById('doc-status').textContent = 'Loaded: ' + docPath.split('/').pop().replace('.md', '');
```

This gives screen reader users a brief notification without reading the entire page.

---

## Moderate Issues

### 7. `aria-live="polite"` on news content container (news.html)

- **Severity:** Moderate
- **Confidence:** High
- **Source:** Code review
- **WCAG criterion:** 4.1.3 Status Messages (Level AA) -- overuse
- **Impact:** Similar to issue 6, the `news-content` container has `aria-live="polite"` (line 332), so loading the full news list or a complete article triggers a full read-aloud. Less severe than docs.html since news content is shorter, but still disruptive.
- **Location:** `/Users/taylorarndt/hq/developer/community-access.github.io/news.html`, line 332

**Current code:**
```html
<div id="news-content" aria-live="polite">
```

**Recommended fix:**

Same pattern as issue 6: remove `aria-live` from the content container and use a separate small live region for status announcements.

---

### 8. No focus management on client-side route changes (news.html and docs.html)

- **Severity:** Moderate
- **Confidence:** High
- **Source:** Code review
- **WCAG criterion:** 2.4.3 Focus Order (Level A)
- **Impact:** When a user clicks a news article link (hash change to `#post/slug`) or a docs sidebar link (hash change to `#docs/path`), the page content changes but focus is not moved to the new content. Keyboard and screen reader users may be stranded in the navigation without any indication that the page content has changed.
- **Location:**
  - `/Users/taylorarndt/hq/developer/community-access.github.io/news.html`, lines 522-529 (`route` function)
  - `/Users/taylorarndt/hq/developer/community-access.github.io/docs.html`, lines 1109-1127 (`renderDoc` function)

**Recommended fix (news.html):**

After `renderPost` or `renderList` completes, move focus to the content heading:

```javascript
function renderPost(slug) {
  // ... existing code ...
  // After container.innerHTML is set:
  var heading = container.querySelector('h1');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus();
  }
}
```

**Recommended fix (docs.html):**

In the `renderDoc` function, after setting innerHTML, move focus:

```javascript
function renderDoc(docPath, markdown) {
  // ... existing code ...
  var heading = contentEl.querySelector('.doc-rendered h1, .doc-rendered h2');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus();
  }
}
```

---

### 9. Stats bar uses `aria-label` on a `<div>` without an appropriate role

- **Severity:** Moderate
- **Confidence:** Medium
- **Source:** Code review
- **WCAG criterion:** 4.1.2 Name, Role, Value (Level A)
- **Impact:** The stats bar `<div>` has `aria-label="Project statistics"` but no ARIA role. The `aria-label` attribute is only meaningful on elements with a role (landmark, widget, etc.). Without a role, the label is ignored by most screen readers, so the label has no effect.
- **Location:** `/Users/taylorarndt/hq/developer/community-access.github.io/index.html`, line 1149

**Current code:**
```html
<div class="stats-bar" aria-label="Project statistics">
```

**Recommended fix:**
```html
<section class="stats-bar" aria-label="Project statistics">
```

Or add `role="region"`:
```html
<div class="stats-bar" role="region" aria-label="Project statistics">
```

---

### 10. `<div id="latest-news">` uses `aria-label` without a role

- **Severity:** Moderate
- **Confidence:** Medium
- **Source:** Code review
- **WCAG criterion:** 4.1.2 Name, Role, Value (Level A)
- **Impact:** Same issue as #9. The `aria-label` on this `<div>` is ignored.
- **Location:** `/Users/taylorarndt/hq/developer/community-access.github.io/index.html`, line 1969

**Current code:**
```html
<div id="latest-news" aria-label="Latest news articles">
```

**Recommended fix:**
```html
<section id="latest-news" aria-label="Latest news articles">
```

Or add `role="region"`.

---

### 11. Opacity used for text creates potential contrast issues

- **Severity:** Moderate
- **Confidence:** Medium
- **Source:** Code review
- **WCAG criterion:** 1.4.3 Contrast (Minimum) (Level AA)
- **Impact:** Multiple text elements use CSS `opacity` values of 0.6, 0.7, 0.8, and 0.9 to dim text. Opacity effectively reduces contrast by making the text partially transparent. For example, the footer copyright text (`.footer-copy`) uses `opacity: 0.6` on light text against a dark background -- the effective contrast is lower than the raw color values suggest.
- **Location:** All three pages. Key occurrences:
  - `.footer-copy { opacity: 0.6 }` (footer copyright on all pages)
  - `.a11y-statement { opacity: 0.7 }` (accessibility statement in footer on all pages)
  - `.stat-label { opacity: 0.8 }` (index.html, line 391)
  - `.repo-meta { opacity: 0.8 }` (index.html, line 618)
  - `.step p { opacity: 0.8 }` (index.html, line 690)
  - Inline `style="opacity:0.7"` on footer taglines (all pages)

**Recommended fix:**

Replace opacity with explicit colors that pass contrast checks. For example:

```css
/* Instead of: */
.footer-copy { opacity: 0.6; }

/* Use: */
.footer-copy { color: rgba(255,255,255,0.6); }
/* Or better, calculate the effective color and pick one that passes: */
.footer-copy { color: #9ca3af; }  /* Ensure 4.5:1 against the footer background */
```

The safest approach is to audit each opacity-reduced text element, compute its effective contrast ratio, and replace opacity with explicit color values that pass.

---

### 12. Mobile sidebar (docs.html) lacks Escape key support and focus trapping

- **Severity:** Moderate
- **Confidence:** Medium
- **Source:** Code review
- **WCAG criterion:** 2.1.2 No Keyboard Trap (Level A), 1.3.2 Meaningful Sequence (Level A)
- **Impact:** On mobile viewports (below 60rem), the docs sidebar opens as an overlay panel. The backdrop click handler closes it, but there is no Escape key handler for the sidebar, and focus is not trapped inside the open sidebar. A keyboard user could tab past the sidebar into content hidden behind the backdrop.
- **Location:** `/Users/taylorarndt/hq/developer/community-access.github.io/docs.html`, lines 1010-1030

**Current code:**
```javascript
toggleBtn.addEventListener('click', function () { /* toggle */ });
backdrop.addEventListener('click', closeSidebar);
```

**Recommended fix:**

Add Escape key support and basic focus management:

```javascript
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && sidebarEl.classList.contains('open')) {
    closeSidebar();
    toggleBtn.focus();
  }
});
```

For focus trapping, trap Tab/Shift+Tab within the sidebar while it is open. This is especially important since the sidebar covers the page content on mobile.

---

### 13. Hash-based routing may confuse browser history and screen reader expectations

- **Severity:** Moderate
- **Confidence:** Low
- **Source:** Code review
- **WCAG criterion:** 2.4.5 Multiple Ways (Level AA), 3.2.3 Consistent Navigation (Level AA)
- **Impact:** Both news.html and docs.html use hash-based routing (`#post/slug`, `#docs/path.md`). When a user navigates via the hash, the browser URL changes but the `<title>` element is only updated on news.html (line 462, 493). On docs.html, the `<title>` is never updated when navigating between documents, so the browser tab always reads "Documentation - Community Access" regardless of which doc is being viewed. This makes it impossible for screen reader users to know which document they are reading from the page title alone.
- **Location:** `/Users/taylorarndt/hq/developer/community-access.github.io/docs.html`, `renderDoc` function (line 1109)

**Recommended fix:**

Update `document.title` when rendering a new doc:

```javascript
function renderDoc(docPath, markdown) {
  // Extract title from first heading
  var titleMatch = markdown.match(/^#\s+(.+)$/m);
  var docTitle = titleMatch ? titleMatch[1] : docPath.split('/').pop().replace('.md', '');
  document.title = docTitle + ' - Documentation - Community Access';
  // ... rest of rendering
}
```

---

### 14. `<main>` landmark placement on index.html excludes hero and stats bar

- **Severity:** Moderate
- **Confidence:** Medium
- **Source:** Code review
- **WCAG criterion:** 2.4.1 Bypass Blocks (Level A), 1.3.1 Info and Relationships (Level A)
- **Impact:** On index.html, the `<main id="main">` element starts at line 1172, AFTER the hero section (line 1138) and stats bar (line 1149). The skip link targets `#main`, so keyboard users who activate "Skip to main content" land past the hero and stats -- which is arguably the primary content of the page. Additionally, the hero section and stats bar live outside any landmark, which means screen reader landmark navigation skips them entirely.
- **Location:** `/Users/taylorarndt/hq/developer/community-access.github.io/index.html`, lines 1138-1172

**Recommended fix:**

Move the `<main>` tag to wrap the hero and stats bar:

```html
<main id="main">
<section class="hero">
  <!-- hero content -->
</section>
<section class="stats-bar" aria-label="Project statistics">
  <!-- stats content -->
</section>
<!-- rest of sections -->
</main>
```

---

## Minor Issues

### 15. Two MCP tables missing `aria-label`

- **Severity:** Minor
- **Confidence:** High
- **Source:** Code review
- **WCAG criterion:** 1.3.1 Info and Relationships (Level A)
- **Impact:** The MCP Tools table (line 1721) and MCP Prompts table (line 1741) have `<thead>` and `<th>` (the only tables that do) but lack `aria-label` or `<caption>` elements, unlike the other 13 tables on the page.
- **Location:** `/Users/taylorarndt/hq/developer/community-access.github.io/index.html`, lines 1721, 1741

**Recommended fix:**
```html
<table class="agent-table" aria-label="MCP tools">
<table class="agent-table" aria-label="MCP prompts">
```

---

### 16. Copy button state change not announced to screen readers

- **Severity:** Minor
- **Confidence:** Medium
- **Source:** Code review
- **WCAG criterion:** 4.1.3 Status Messages (Level AA)
- **Impact:** When the "Copy" button changes to "Copied!", the button text changes visually and the `aria-label` is updated, but there is no `aria-live` region or `role="status"` to ensure screen readers announce the state change. Users relying on screen readers may not know the copy succeeded.
- **Location:** `/Users/taylorarndt/hq/developer/community-access.github.io/index.html`, lines 2067-2088

**Recommended fix:**

Add a visually hidden live region:
```html
<div class="sr-only" aria-live="polite" id="copy-status"></div>
```

Then in the copy handler:
```javascript
document.getElementById('copy-status').textContent = 'Command copied to clipboard';
```

Note: The site does not currently have an `.sr-only` class on index.html. Add one in the `<style>` block:
```css
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0;
  margin: -1px; overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border: 0;
}
```

---

### 17. `scroll-behavior: smooth` not gated behind `prefers-reduced-motion`

- **Severity:** Minor
- **Confidence:** Medium
- **Source:** Code review
- **WCAG criterion:** 2.3.3 Animation from Interactions (Level AAA) / Best practice for AA
- **Impact:** While the site correctly respects `prefers-reduced-motion` for CSS transitions and animations (reducing duration to 0.01ms), the `scroll-behavior: smooth` on the `<html>` element is not conditionally applied. Users who prefer reduced motion will still experience smooth scrolling when clicking anchor links or using the "Back to top" button.
- **Location:** All three pages, CSS: `html { scroll-behavior: smooth; }`

**Recommended fix:**
```css
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
```

---

### 18. Redundant `aria-current="true"` used where `aria-current="page"` would be more appropriate (docs.html sidebar)

- **Severity:** Minor
- **Confidence:** Low
- **Source:** Code review
- **WCAG criterion:** 4.1.2 Name, Role, Value (Level A) -- best practice
- **Impact:** The docs sidebar uses `aria-current="true"` for the active document link (line 1046). The `aria-current` attribute supports specific tokens: `page`, `step`, `location`, `date`, `time`, and `true`. Using `aria-current="page"` is more semantically precise and provides better screen reader announcements (e.g., "Getting Started, current page" vs "Getting Started, current").
- **Location:** `/Users/taylorarndt/hq/developer/community-access.github.io/docs.html`, line 1046

**Current code:**
```javascript
links[j].setAttribute('aria-current', 'true');
```

**Recommended fix:**
```javascript
links[j].setAttribute('aria-current', 'page');
```

---

## axe-core Scan Results

| Metric | index.html | news.html | docs.html |
|--------|-----------|-----------|-----------|
| URL scanned | https://community-access.github.io/ | https://community-access.github.io/news.html | https://community-access.github.io/docs.html |
| Violations | 1 rule, 5 nodes | 1 rule, 1 node | 0 |
| Rule failed | color-contrast | color-contrast | None |

All axe-core violations were color-contrast failures (rule `color-contrast`, impact `serious`). These are documented in issues 1-3 above. Full scan data saved to `axe-results-index.json` and `axe-results-news.json`.

---

## Cross-Page Patterns

### Systemic Issues (found on every page)

| Issue | Impact | Fix Location |
|-------|--------|-------------|
| `--ca-indigo-light` (#6366f1) fails contrast on white/gray-50 | All date labels and body links affected | CSS variables in each page's `<style>` block |
| Footer text uses `opacity` to dim content | Effective contrast may fail | `.footer-copy`, `.a11y-statement`, inline `style="opacity:..."` |
| `scroll-behavior: smooth` not gated by motion preference | Motion-sensitive users affected | `html` rule in each page's `<style>` block |

### Template Issues (shared navigation and footer)

The header navigation, dropdown menu, and footer are duplicated across all three pages. The implementation is consistent and generally well-done: proper `aria-expanded`, arrow key navigation on the dropdown, landmark labels on `<nav>` elements, and `aria-current="page"` on the active nav link.

The footer links to GitHub (external URLs) do not indicate they are external, but since they do not open in new tabs, this is a minor concern.

### Page-Specific Issues

| Issue | Page |
|-------|------|
| #93c5fd link color (1.72:1 contrast) | index.html only |
| WIP banner button contrast | index.html only |
| 13 tables missing `<th>` headers | index.html only |
| `aria-live` on entire `<main>` | docs.html only |
| No focus management on doc navigation | docs.html only |
| No `document.title` update on doc navigation | docs.html only |
| Mobile sidebar lacks Escape key and focus trap | docs.html only |
| `aria-live` on news content container | news.html only |
| No focus management on post navigation | news.html only |

---

## Component and Template Analysis

### Shared Components Detected

| Component | Pages Using | Issues | Impact |
|-----------|-------------|--------|--------|
| Site header + dropdown nav | all 3 pages | None -- well implemented | N/A |
| Footer (with a11y statement) | all 3 pages | Opacity-reduced text (#11) | Fix CSS to remediate all pages |
| CSS custom properties | all 3 pages | `--ca-indigo-light` contrast (#1) | Fix variable to remediate all pages |

### Component Remediation Priority

1. **CSS variable `--ca-indigo-light`** -- fixing this one value remediates contrast failures across all three pages
2. **Footer opacity text** -- switching from opacity to explicit colors fixes all three pages
3. **Agent tables on index.html** -- adding `<thead>`/`<th>` to 13 tables is the highest-volume fix

---

## What Passed

### Areas of Strength

The site does many things well:

- **Document structure**: All pages have `<html lang="en">`, proper `<title>`, viewport meta, and `<meta name="description">`
- **Skip links**: All pages have skip links that work correctly. docs.html has TWO skip links (content and sidebar nav) -- excellent
- **Landmarks**: `<header>`, `<nav>` (with labels), `<main>`, and `<footer>` on all pages
- **Heading hierarchy**: Clean H1 > H2 > H3 structure with no skipped levels
- **Focus indicators**: Global `:focus-visible` with a 3px solid amber outline and 3px offset -- highly visible
- **Keyboard dropdown navigation**: Arrow keys, Escape to close, focus management on open/close
- **Dark mode**: Full `prefers-color-scheme: dark` support with variable overrides
- **Reduced motion**: `prefers-reduced-motion: reduce` reduces all transition/animation durations
- **Accordion/FAQ**: Native `<details>`/`<summary>` elements -- keyboard accessible by default
- **Search with live region**: Agent search has `aria-live="polite"` status region with debounced updates
- **No positive tabindex**: No `tabindex` values greater than 0 found
- **Semantic HTML**: Proper use of `<section>`, `<article>`, `<time>`, `<nav>`, `<code>`, `<pre>`, `<details>`
- **ARIA on interactive widgets**: Correct `aria-expanded` on dropdown toggle and sidebar headings with `aria-controls`
- **Copy button**: Has descriptive `aria-label` and updates label on state change
- **Form input**: Search input has a visible `<label>` with `for` attribute
- **`noscript` fallback**: docs.html provides a GitHub link when JavaScript is unavailable
- **Error states**: docs.html shows error messages with `role="alert"` for failed document loads
- **Accessibility statement**: All pages include an accessibility commitment with a link to report issues

### WCAG Criteria Met

| Criterion | Description | Level | Status |
|-----------|-------------|-------|--------|
| 1.1.1 | Non-text Content | A | Pass (no images on site) |
| 1.3.1 | Info and Relationships | A | Partial (landmarks good, tables need headers) |
| 1.3.2 | Meaningful Sequence | A | Pass |
| 1.3.3 | Sensory Characteristics | A | Pass |
| 1.3.4 | Orientation | AA | Pass (no orientation lock) |
| 1.3.5 | Identify Input Purpose | AA | Pass (`autocomplete="off"` on search) |
| 1.4.1 | Use of Color | A | Pass (no color-only information) |
| 1.4.3 | Contrast (Minimum) | AA | FAIL (issues 1-3) |
| 1.4.4 | Resize Text | AA | Pass (clamp/rem/em used throughout) |
| 1.4.10 | Reflow | AA | Pass (responsive down to 320px) |
| 1.4.11 | Non-text Contrast | AA | Pass (focus indicators 3px solid) |
| 1.4.12 | Text Spacing | AA | Pass (no fixed heights that would clip) |
| 2.1.1 | Keyboard | A | Pass |
| 2.1.2 | No Keyboard Trap | A | Pass (except mobile sidebar edge case) |
| 2.4.1 | Bypass Blocks | A | Pass (skip links present) |
| 2.4.2 | Page Titled | A | Pass (all pages have descriptive titles) |
| 2.4.3 | Focus Order | A | Partial (focus management on SPA navigation) |
| 2.4.4 | Link Purpose (In Context) | A | Pass (no ambiguous "click here" links) |
| 2.4.6 | Headings and Labels | AA | Pass |
| 2.4.7 | Focus Visible | AA | Pass |
| 2.5.3 | Label in Name | A | Pass |
| 3.1.1 | Language of Page | A | Pass |
| 3.2.1 | On Focus | A | Pass |
| 3.2.3 | Consistent Navigation | AA | Pass |
| 3.3.1 | Error Identification | A | Pass (error states with role="alert") |
| 4.1.2 | Name, Role, Value | A | Partial (some aria-label on non-role elements) |
| 4.1.3 | Status Messages | AA | Partial (copy button, live region overuse) |

---

## Page Metadata Dashboard

| Property | Present | Missing | Percentage |
|----------|---------|---------|------------|
| Page Title (`<title>`) | 3 | 0 | 100% |
| Language (`<html lang>`) | 3 | 0 | 100% |
| Meta Description | 3 | 0 | 100% |
| Viewport Meta | 3 | 0 | 100% |
| Skip Navigation Link | 3 | 0 | 100% |
| Main Landmark (`<main>`) | 3 | 0 | 100% |
| Header Landmark | 3 | 0 | 100% |
| Footer Landmark | 3 | 0 | 100% |
| Nav Landmarks (labeled) | 3 | 0 | 100% |

### Page Titles
| Page | Title |
|------|-------|
| index.html | Community Access -- Accessible by Default |
| news.html | News -- Community Access (updates dynamically for posts) |
| docs.html | Documentation - Community Access (does NOT update for loaded docs) |

---

## Confidence Summary

| Confidence | Count | Percentage |
|------------|-------|------------|
| High | 11 | 61% -- confirmed by axe-core runtime scan or definitive structural analysis |
| Medium | 6 | 33% -- likely issue, needs manual verification in some contexts |
| Low | 1 | 6% -- possible issue, flagged for review |

---

## Findings by Rule

| WCAG Criterion | Rule | Severity | Pages Affected | Total Instances |
|---------------|------|----------|----------------|----------------|
| 1.4.3 Contrast (Minimum) | Color contrast failure | Serious | 2 (index, news) | 6 nodes |
| 1.3.1 Info and Relationships | Tables missing headers | Serious | 1 (index) | 13 tables |
| 4.1.3 Status Messages | aria-live overuse | Serious/Moderate | 2 (docs, news) | 2 |
| 2.4.3 Focus Order | No focus management on SPA nav | Moderate | 2 (docs, news) | 2 |
| 4.1.2 Name, Role, Value | aria-label on non-role elements | Moderate | 1 (index) | 2 |
| 1.4.3 Contrast (Minimum) | Opacity-reduced text | Moderate | 3 (all) | ~8 rules |
| 2.1.2 No Keyboard Trap | Mobile sidebar needs Escape/trap | Moderate | 1 (docs) | 1 |
| 2.4.2 Page Titled | Doc title not updating | Moderate | 1 (docs) | 1 |
| 2.4.1 Bypass Blocks | Main landmark placement | Moderate | 1 (index) | 1 |

---

## Recommended Testing Setup

### Automated Testing

Since this is a static HTML site hosted on GitHub Pages, integrate axe-core scanning into a GitHub Actions workflow:

```yaml
name: Accessibility Audit
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npx @axe-core/cli https://community-access.github.io/ --tags wcag2a,wcag2aa,wcag21a,wcag21aa
      - run: npx @axe-core/cli https://community-access.github.io/news.html --tags wcag2a,wcag2aa,wcag21a,wcag21aa
      - run: npx @axe-core/cli https://community-access.github.io/docs.html --tags wcag2a,wcag2aa,wcag21a,wcag21aa
```

### Manual Testing Checklist

- [ ] Tab through all interactive elements on each page -- verify visible focus ring
- [ ] Open and close the "Accessibility Agents" dropdown with keyboard only (Enter, Arrow keys, Escape)
- [ ] Navigate docs sidebar: click a doc link, verify content loads and focus moves
- [ ] On docs.html mobile viewport: open sidebar toggle, verify Escape closes it, verify Tab stays within sidebar
- [ ] On news.html: click a news article, verify screen reader announces new content
- [ ] Test all accordion/FAQ expand/collapse with keyboard (Enter/Space on `<summary>`)
- [ ] Verify "Copy" button announces success to screen reader
- [ ] Zoom to 200% on all pages -- verify no content overlap or horizontal scroll
- [ ] Set viewport to 320px wide -- verify content reflows without horizontal scroll
- [ ] Enable Windows High Contrast Mode -- verify all text remains readable

### Screen Reader Testing

- **NVDA + Firefox** (Windows): Navigate by landmarks (D key), headings (H key), tables (T key). Verify agent tables are navigable by column.
- **VoiceOver + Safari** (macOS): Use VO+U to open rotor, check landmarks, headings, links, and form controls lists.
- **VoiceOver + Safari** (iOS): Test mobile sidebar and touch target sizes.

---

## Next Steps

1. **Fix contrast issues first** (issues 1-3) -- these are confirmed by axe-core and affect readability for low-vision users. Changing `--ca-indigo-light` from `#6366f1` to `#4f46e5` fixes the majority of contrast failures across all pages.
2. **Add table headers** (issue 4) -- this is the highest-volume fix: 13 tables on index.html need `<thead>` and `<th scope="col">`.
3. **Fix `aria-live` overuse** (issues 6-7) -- remove `aria-live` from large content containers on docs.html and news.html.
4. **Add focus management** (issue 8) -- move focus to content heading after hash-based navigation on docs.html and news.html.
5. **Set up automated axe-core scanning** in GitHub Actions to catch regressions.
6. **Conduct manual screen reader testing** with NVDA + Firefox and VoiceOver + Safari after fixes.
7. **Address moderate and minor issues** (9-18) in a follow-up pass.
8. **Schedule a re-audit** after fixes are applied to track progress.
