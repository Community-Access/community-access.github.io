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

- **Initial audit score:** 82/100 (18 issues)
- **Re-audit score:** 99/100 (all 18 issues resolved)
- **External review score:** 97/100 (2 additional issues found by human expert)
- **Current score:** 99/100 (all 20 issues resolved)
- **Status:** All issues fixed and deployed

This is a well-built, accessibility-conscious site. The initial audit found 18 issues across 3 pages -- primarily color contrast failures, missing table headers, live region overuse, and focus management gaps. All 18 issues were fixed in a single pass alongside a refactoring of index.html to separate concerns (external CSS and JS files).

**Honest assessment:** The initial automated audit missed 2 real issues that a human accessibility expert (Ty Littlefield) identified on review. Issue #9's original fix (changing `<div>` to `<section>`) actually *created* an unnecessary region landmark. The stats grid also lacked semantic markup, causing stat labels and values to linearize into undifferentiated text for screen readers. These findings are a reminder that automated tooling is a starting point, not a replacement for expert human review.

---

## Scorecard

### Initial Audit (2026-02-24)

| Page | Score | Grade | Critical | Serious | Moderate | Minor |
|------|-------|-------|----------|---------|----------|-------|
| index.html | 72/100 | C | 0 | 5 | 5 | 3 |
| news.html | 86/100 | B | 0 | 1 | 2 | 1 |
| docs.html | 87/100 | B | 0 | 1 | 3 | 1 |
| **Overall** | **82/100** | **B** | **0** | **6** | **8** | **4** |

### Re-Audit (2026-02-24)

| Page | Score | Grade | Critical | Serious | Moderate | Minor |
|------|-------|-------|----------|---------|----------|-------|
| index.html | 99/100 | A+ | 0 | 0 | 0 | 0 |
| news.html | 99/100 | A+ | 0 | 0 | 0 | 0 |
| docs.html | 99/100 | A+ | 0 | 0 | 0 | 0 |
| **Overall** | **99/100** | **A+** | **0** | **0** | **0** | **0** |

### External Expert Review (2026-06-22)

Ty Littlefield, an accessibility professional, identified 2 issues the automated audit missed:

| Page | Score | Grade | Critical | Serious | Moderate | Minor |
|------|-------|-------|----------|---------|----------|-------|
| index.html | 97/100 | A | 0 | 1 | 1 | 0 |
| **Overall** | **97/100** | **A** | **0** | **1** | **1** | **0** |

### Post-Expert-Fix (2026-06-22)

| Page | Score | Grade | Critical | Serious | Moderate | Minor |
|------|-------|-------|----------|---------|----------|-------|
| index.html | 99/100 | A+ | 0 | 0 | 0 | 0 |
| news.html | 99/100 | A+ | 0 | 0 | 0 | 0 |
| docs.html | 99/100 | A+ | 0 | 0 | 0 | 0 |
| **Overall** | **99/100** | **A+** | **0** | **0** | **0** | **0** |

---

## Issues Fixed

All 18 original issues have been resolved:

### Serious Issues (6) -- All Fixed

| # | Issue | Fix Applied |
|---|-------|-------------|
| 1 | `--ca-indigo-light` (#6366f1) fails contrast | Changed to #4f46e5 with dark mode override #818cf8 |
| 2 | "Read the full guide" link (#93c5fd, 1.72:1) | Changed to `var(--ca-indigo)` (#4f46e5, 5.67:1) |
| 3 | WIP banner button green-on-white (3.76:1) | Changed to #047857 (4.63:1) |
| 4 | 13 tables missing `<thead>` and `<th>` | Added `<thead><tr><th scope="col">` to all 15 tables |
| 5 | External GitHub link missing new-tab warning | Added `<span class="sr-only">(opens in new tab)</span>` |
| 6 | `aria-live="polite"` on entire `<main>` (docs.html) | Removed from main; added separate `#doc-status` live region |

### Moderate Issues (8) -- All Fixed

| # | Issue | Fix Applied |
|---|-------|-------------|
| 7 | `aria-live="polite"` on news content container | Removed from container; added separate `#news-status` live region |
| 8 | No focus management on SPA route changes | Added `tabindex="-1"` and `.focus()` on content headings in both news.html and docs.html |
| 9 | Stats bar `aria-label` on `<div>` without role | ~~Changed `<div>` to `<section>`~~ -- this fix was incorrect and created an unnecessary region landmark; see issue #19 below |
| 10 | Latest news `aria-label` on `<div>` without role | Changed `<div>` to `<section>` |
| 11 | Opacity used for text creates contrast issues | Replaced all opacity values with explicit colors (#9ca3af, #b0b8c4, #c4cad3) |
| 12 | Mobile sidebar lacks Escape key support | Added Escape key handler with focus return to toggle button |
| 13 | docs.html `<title>` not updating on navigation | Added `document.title` update in `renderDoc` function |
| 14 | `<main>` landmark excludes hero and stats bar | Moved `<main>` to wrap hero and stats sections |

### Minor Issues (4) -- All Fixed

| # | Issue | Fix Applied |
|---|-------|-------------|
| 15 | Two MCP tables missing `aria-label` | Added `aria-label` to both MCP tables |
| 16 | Copy button state not announced to screen readers | Added `#copy-status` live region with `.sr-only` class |
| 17 | `scroll-behavior: smooth` not gated by motion pref | Wrapped in `@media (prefers-reduced-motion: no-preference)` |
| 18 | `aria-current="true"` instead of `"page"` (docs sidebar) | Changed to `aria-current="page"` |

---

## Post-Fix Refinement

The re-audit identified two informational items, both addressed:

1. **Gradient backgrounds flagged for manual contrast review** -- axe-core cannot compute contrast on CSS gradients automatically. Manual verification confirms all gradient sections use white/light text on dark backgrounds (#3730a3, #7c3aed, #1e1b4b) with contrast ratios well above 4.5:1. No code change needed.

2. **Scroll spy uses `aria-current="true"` instead of `"location"`** -- Changed from `aria-current="true"` to `aria-current="location"` in the scroll spy code (main.js) for more semantic precision. The `"location"` token is the correct value for indicating the user's current position within a page.

---

## Issues Found by External Expert Review (2026-06-22)

Accessibility professional Ty Littlefield reviewed the live site and identified 2 issues the automated audit missed entirely. Both have been fixed.

### Serious (1) -- Fixed

| # | Issue | Fix Applied |
|---|-------|-------------|
| 19 | Stats grid uses flat `<div>`/`<span>` markup -- screen readers linearize "47 Specialized Agents 3 Platforms 52 Ready-to-Use Prompts WCAG 2.2 AA Compliance" into one undifferentiated line with no label-value association. Issue #9's original fix (changing to `<section>`) also created an unnecessary `region` landmark. | Replaced entire stats grid with `<dl>`/`<dt>`/`<dd>` (definition list). Each stat is now a `<div class="stat-item">` wrapping `<dt class="stat-label">` and `<dd class="stat-number">`. CSS `order: -1` on `<dd>` preserves visual layout (number above label) while DOM has label first. Changed `<section>` back to `<div>` to remove the unnecessary region landmark. |

### Moderate (1) -- Fixed

| # | Issue | Fix Applied |
|---|-------|-------------|
| 20 | `<section class="stats-bar" aria-label="Project statistics">` creates a `region` landmark for decorative/statistical content that does not warrant landmark navigation. The original issue #9 fix changed `<div>` to `<section>`, which technically satisfied the "aria-label needs a role" rule but created a worse problem -- unnecessary landmark clutter. | Changed `<section>` back to `<div>`, removing the `aria-label` entirely. The stats grid's semantic `<dl>` structure provides sufficient context without a named landmark. |

### Lessons Learned

1. **Automated audits are a starting point, not the final word.** The original automated audit scored 99/100, but 2 real issues went undetected -- one of which the audit itself partially caused (issue #9's `<div>` to `<section>` fix was technically correct for the narrow rule it addressed but created a worse accessibility problem).

2. **Semantic HTML beats ARIA workarounds.** The stats grid needed a `<dl>`/`<dt>`/`<dd>` structure all along. No amount of ARIA attributes on `<div>`/`<span>` elements would have fixed the fundamental lack of semantic association between numbers and their labels.

3. **Screen reader testing catches what automated tools miss.** The linearization problem is invisible to axe-core and similar tools because the DOM technically has all the text content -- it simply lacks the semantic structure to make that content meaningful when read sequentially.

---

## Refactoring

As part of the fix pass, index.html was refactored from a single ~2310-line file to separate concerns:

| File | Purpose | Lines |
|------|---------|-------|
| `index.html` | Semantic HTML structure only | ~850 |
| `styles.css` | All CSS (with fixes baked in) | ~900 |
| `main.js` | All JavaScript (with fixes baked in) | ~300 |

---

## What Passes

### Areas of Strength

- `<html lang="en">`, proper `<title>`, viewport meta, and `<meta name="description">` on all pages
- Skip links on all pages (docs.html has two: content and sidebar)
- Proper landmarks: `<header>`, `<nav>` (labeled), `<main>`, `<footer>`
- Clean heading hierarchy (H1 > H2 > H3, no skipped levels)
- Visible focus indicators (3px solid amber outline, 3px offset)
- Keyboard-navigable dropdown (Enter, Arrow keys, Escape)
- Full dark mode support via `prefers-color-scheme`
- Reduced motion support via `prefers-reduced-motion`
- Native `<details>`/`<summary>` for accordions and FAQs
- Search with debounced `aria-live` status region
- Proper `aria-expanded` on interactive widgets
- Copy buttons with live region announcements
- Form inputs with visible `<label>` elements
- `<noscript>` fallback on docs.html
- Error states with `role="alert"` for failed document loads
- Accessibility statement with issue reporting link on all pages
- All 15 data tables have `<thead>`, `<th scope="col">`, and `aria-label`
- Stats grid uses semantic `<dl>`/`<dt>`/`<dd>` for label-value association
- Focus management on all SPA hash-based navigation
- `document.title` updates on route changes
- Separate live regions for status announcements (not on content containers)

### WCAG 2.2 AA Criteria Status

| Criterion | Description | Level | Status |
|-----------|-------------|-------|--------|
| 1.1.1 | Non-text Content | A | Pass |
| 1.3.1 | Info and Relationships | A | Pass |
| 1.3.2 | Meaningful Sequence | A | Pass |
| 1.3.3 | Sensory Characteristics | A | Pass |
| 1.3.4 | Orientation | AA | Pass |
| 1.3.5 | Identify Input Purpose | AA | Pass |
| 1.4.1 | Use of Color | A | Pass |
| 1.4.3 | Contrast (Minimum) | AA | Pass |
| 1.4.4 | Resize Text | AA | Pass |
| 1.4.10 | Reflow | AA | Pass |
| 1.4.11 | Non-text Contrast | AA | Pass |
| 1.4.12 | Text Spacing | AA | Pass |
| 2.1.1 | Keyboard | A | Pass |
| 2.1.2 | No Keyboard Trap | A | Pass |
| 2.4.1 | Bypass Blocks | A | Pass |
| 2.4.2 | Page Titled | A | Pass |
| 2.4.3 | Focus Order | A | Pass |
| 2.4.4 | Link Purpose (In Context) | A | Pass |
| 2.4.6 | Headings and Labels | AA | Pass |
| 2.4.7 | Focus Visible | AA | Pass |
| 2.5.3 | Label in Name | A | Pass |
| 3.1.1 | Language of Page | A | Pass |
| 3.2.1 | On Focus | A | Pass |
| 3.2.3 | Consistent Navigation | AA | Pass |
| 3.3.1 | Error Identification | A | Pass |
| 4.1.2 | Name, Role, Value | A | Pass |
| 4.1.3 | Status Messages | AA | Pass |

---

## Recommended Ongoing Testing

### Automated (GitHub Actions)

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

- [ ] Tab through all interactive elements -- verify visible focus ring
- [ ] Keyboard-navigate the dropdown menu (Enter, Arrow keys, Escape)
- [ ] Navigate docs sidebar: click a doc link, verify focus moves to content
- [ ] On mobile viewport: open docs sidebar, verify Escape closes it
- [ ] On news.html: click a news article, verify screen reader announces content
- [ ] Expand/collapse all accordions and FAQs with keyboard
- [ ] Verify "Copy" button announces success to screen reader
- [ ] Zoom to 200% -- verify no content overlap or horizontal scroll
- [ ] Set viewport to 320px -- verify content reflows
- [ ] Test with VoiceOver + Safari or NVDA + Firefox
