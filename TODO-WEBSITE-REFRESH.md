# Website Refresh Plan — Community Access GitHub Pages

> **Goal:** Refresh community-access.github.io with all current content from the accessibility-agents repo. Keep the existing layout/structure/design system but rewrite content to be complete, accurate, approachable, and beautifully organized with accordions.

---

## Phase 1: Research & Preparation

### 1.1 Clone the accessibility-agents repo for reference
```bash
git clone https://github.com/Community-Access/accessibility-agents.git s:\code\a11y-agents-ref
```
You'll reference this throughout. Key files to read:
- `docs/getting-started.md` — install instructions, platform support
- `docs/architecture.md` — how agents, skills, hooks, and prompts fit together
- `docs/agents/README.md` — full agent index
- `docs/skills/*.md` — all 13 skill docs
- `docs/tools/*.md` — axe-core, MCP tools, VPAT generation
- `docs/prompts/README.md` — all 45 prompts organized by category
- `docs/scanning/*.md` — office, PDF, scan config, custom prompts
- `docs/advanced/*.md` — cross-platform handoff, advanced scanning, plugin packaging
- `ROADMAP.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`

### 1.2 Read these specific files to extract accurate numbers and names
- `.claude/agents/` — list all Claude Code agents
- `.github/agents/` — list all Copilot agents
- `desktop-extension/server/index.js` — confirm all 11 MCP tools and 6 prompts
- `.claude/hooks/` — confirm hook files still exist and what they do
- `.github/skills/` — list all 13 skills
- `.github/prompts/` — count and categorize all 45 prompt files

---

## Phase 2: Refresh index.html (Home Page)

The home page should be approachable, not super technical. Think product marketing page. Use accordions (`<details>`/`<summary>`) to organize dense content so the page doesn't feel overwhelming.

### 2.1 Update the Hero Section
- Keep the gradient hero layout
- Update headline and subtext to reflect current scope (39+ agents, 3 platforms, 13 skills, 45 prompts)
- Mention all three platforms by name: Claude Code, GitHub Copilot, Claude Desktop
- Keep "View on GitHub" and "Install in 30 Seconds" CTAs

### 2.2 Update the Stats Bar
Current stats are outdated. Update to reflect:
| Stat | Current (Wrong) | Correct |
|------|-----------------|---------|
| Agents | 35 | 39+ (including sub-agents) |
| Platforms | 3 | 3 (still correct) |
| Skills | (not shown) | 13 |
| Prompts | (not shown) | 45 |
| MCP Tools | (not shown) | 11 |
| WCAG | 2.2 | 2.2 (still correct) |

Pick the 4 most impactful stats. Suggestion: `39+ Agents`, `3 Platforms`, `45 Ready-to-Use Prompts`, `WCAG 2.2 AA`.

### 2.3 Rewrite "The Problem We Solve" Section
Keep approachable language. Current feature cards are mostly good but need updating:
- **Automatic Enforcement** — still accurate, keep
- **Screen Reader First** — still accurate, keep
- **One-Command Install** — still accurate, keep
- **Beyond Web Code** — update to include EPUB scanning (was just Office/PDF). Now covers Word, Excel, PowerPoint, PDF, EPUB, and Markdown
- **GitHub Workflow Agents** — update count from 10 to 11 (repo-manager was added)
- **VPAT Generation** — still accurate, keep
- **axe-core Integration** — still accurate, keep
- **ADD NEW: Markdown Documentation** — agents audit .md files across 9 domains
- **ADD NEW: Framework-Aware** — React, Vue, Angular, Svelte, Tailwind fix templates
- **ADD NEW: Cognitive & Mobile** — WCAG 2.2 cognitive criteria, React Native, iOS/Android

### 2.4 Rewrite "Meet the Agents" Section with Accordions
Replace the flat bullet lists with accordion groups. Each group is a `<details>` element with a `<summary>`.

**Structure:**
```
<details> Web Accessibility Agents (16)
  - Table or styled list: agent name + one-line plain-English description
</details>

<details> Document Accessibility Agents (9)
  - Word, Excel, PowerPoint, PDF, EPUB agents + config agents + wizard
</details>

<details> Markdown Accessibility Agents (3)
  - markdown-a11y-assistant, markdown-scanner, markdown-fixer
</details>

<details> GitHub Workflow Agents (11)
  - github-hub, daily-briefing, pr-review, issue-tracker, analytics, etc.
</details>

<details> Behind the Scenes (Hidden Sub-Agents) (4)
  - document-inventory, cross-document-analyzer, cross-page-analyzer, web-issue-fixer
  - Brief note: "These run automatically — you never invoke them directly"
</details>
```

Each agent description should be non-technical. Example:
- "**ARIA Specialist** — Makes sure interactive elements like buttons, menus, and tabs are properly announced to screen readers"
- "**Contrast Master** — Checks that text and backgrounds have enough color difference for people with low vision"
- "**Daily Briefing** — Gives you a morning summary of what happened in your repo overnight"

### 2.5 Add a NEW "How It Works Across Platforms" Accordion Section
Explain what each platform gets, in plain English:

```
<details> Claude Code (CLI)
  Agents live in .claude/agents/ as Markdown files.
  A hook fires on every prompt to check if your code involves UI — if so, the accessibility lead jumps in.
  Specialists run in parallel groups for fast audits.
</details>

<details> GitHub Copilot (VS Code)
  Agents load as .agent.md files in .github/agents/.
  Accessibility rules are injected into every Copilot chat via copilot-instructions.md.
  Same agents, same rules, same parallel execution as Claude Code.
</details>

<details> Claude Desktop (Standalone App)
  Uses MCP (Model Context Protocol) since Desktop doesn't have an agent system.
  11 tools: contrast checking, heading audits, form validation, axe-core scanning, document scanning, VPAT generation.
  6 built-in prompts for common accessibility reviews.
  Install by downloading the .mcpb extension bundle.
</details>
```

### 2.6 Add a NEW "Skills — Shared Knowledge Modules" Section
Brief, non-technical intro: "Skills are reusable knowledge packs that multiple agents draw from. They ensure consistency — every agent that checks contrast uses the same rules."

Accordion with the 13 skills grouped logically:
```
<details> Accessibility Skills (6)
  - accessibility-rules, framework-accessibility, cognitive-accessibility, mobile-accessibility, design-system, web-severity-scoring
</details>

<details> Scanning Skills (3)
  - document-scanning, web-scanning, markdown-accessibility
</details>

<details> Reporting Skills (1)
  - report-generation (severity scoring, VPAT/ACR export, scorecards)
</details>

<details> GitHub Skills (3)
  - github-workflow-standards, github-scanning, github-analytics-scoring
</details>
```

### 2.7 Add a NEW "Ready-to-Use Prompts" Section
Brief intro: "Don't know where to start? Pick a prompt. 45 pre-built commands across four categories get you results immediately."

Accordion groups:
```
<details> Web Accessibility Prompts (5)
  audit-web-page, quick-web-check, audit-web-multi-page, compare-web-audits, fix-web-issues
</details>

<details> Document Accessibility Prompts (9)
  audit-single-document, audit-document-folder, audit-changed-documents, quick-document-check, generate-vpat, generate-remediation-scripts, compare-audits, setup-document-cicd, create-accessible-template
</details>

<details> GitHub Workflow Prompts (27)
  Organized by sub-category: PRs, Issues, Briefing/CI, Releases, Analytics, Community
</details>

<details> Markdown Accessibility Prompts (4)
  audit-markdown, quick-markdown-check, fix-markdown-issues, compare-markdown-audits
</details>
```

### 2.8 Add a NEW "Tools & Integrations" Mini-Section
One-paragraph intro about axe-core and MCP tools. Non-technical.
- axe-core: "Agents can scan live web pages using axe-core, the industry-standard accessibility engine"
- MCP Tools: "Claude Desktop gets 11 dedicated tools — from contrast checking to batch document scanning"
- VPAT: "Generate compliance documentation (VPAT 2.5) directly from scan results"

### 2.9 Update the Repository Showcase Card
- Update star count, fork count, contributor count from current repo
- Update description to mention the full scope (39+ agents, 13 skills, 45 prompts)

### 2.10 Update the Install Section
- Install commands are the same (still correct)
- Add mention of `--global`, `--project`, `--copilot` flags
- Add Claude Desktop install method (.mcpb download)
- Add mention of auto-update support

### 2.11 Update the "Build With Us" / Contribute Section
- Content is mostly still accurate
- Update to mention that agents, skills, AND prompts are all plain Markdown
- Keep the 4-step process (Fork, Change, PR, Ship)

### 2.12 Keep the Disclaimer Banner
- "AI and automated tools are not perfect..." — still accurate, keep as-is

### 2.13 Update the Footer
- Keep accessibility statement
- Links are still accurate
- Keep MIT license notice

### 2.14 Accordion CSS & Accessibility
Add CSS for `<details>/<summary>` elements:
- Style summaries with the existing heading font styles
- Add expand/collapse chevron indicator
- Ensure keyboard accessible (native `<details>` handles this)
- Add `prefers-reduced-motion` respect for any animations
- Ensure high contrast mode support

---

## Phase 3: Refresh docs.html (Documentation Page)

The docs page is already well-structured with a sidebar and live-renders Markdown from GitHub. Main updates needed:

### 3.1 Update the Sidebar Navigation
Current sidebar already has most agents listed but needs:
- **Add** Markdown Prompts section (4 prompts: audit-markdown, quick-markdown-check, fix-markdown-issues, compare-markdown-audits)
- **Verify** all 39+ agent links are present (current list looks complete but double-check against repo)
- **Verify** all 13 skills are listed
- Potentially re-order prompt sections to match: Web → Documents → GitHub → Markdown

### 3.2 Update the Welcome/Landing Content
- Update intro text to mention 39+ agents, 13 skills, 45 prompts
- Quick links are still good

### 3.3 Verify Document Fetching Still Works
- The page fetches raw Markdown from GitHub and renders it with marked.js
- Test that all sidebar links resolve to valid files in the repo
- If any agents were renamed or moved, update the `data-doc` attributes

### 3.4 Add Markdown Prompts to Sidebar
```html
<div class="sidebar-section">
  <button class="sidebar-heading" aria-expanded="false" aria-controls="nav-prompts-markdown">Prompts: Markdown</button>
  <ul class="sidebar-links" id="nav-prompts-markdown">
    <li><a href="#docs/prompts/markdown/audit-markdown.md" data-doc="docs/prompts/markdown/audit-markdown.md">Audit Markdown</a></li>
    <li><a href="#docs/prompts/markdown/quick-markdown-check.md" data-doc="docs/prompts/markdown/quick-markdown-check.md">Quick Markdown Check</a></li>
    <li><a href="#docs/prompts/markdown/fix-markdown-issues.md" data-doc="docs/prompts/markdown/fix-markdown-issues.md">Fix Markdown Issues</a></li>
    <li><a href="#docs/prompts/markdown/compare-markdown-audits.md" data-doc="docs/prompts/markdown/compare-markdown-audits.md">Compare Markdown Audits</a></li>
  </ul>
</div>
```

---

## Phase 4: Accessibility & Quality Checks

### 4.1 Run the existing a11y-crawl.js script
```bash
node scripts/a11y-crawl.js
```
Fix any issues it finds.

### 4.2 Manual Accessibility Review
- Keyboard navigation through all accordions
- Screen reader testing (NVDA/JAWS) on accordion open/close
- Color contrast verification on any new elements
- Focus indicator visibility on new interactive elements
- `prefers-reduced-motion` behavior on accordion transitions
- `prefers-color-scheme: dark` rendering of new sections

### 4.3 Responsive Layout Check
- Mobile viewport (< 48rem)
- Tablet viewport (48-60rem)
- Desktop viewport (> 60rem)
- Verify accordions don't break layout at any size

### 4.4 Validate HTML
- No duplicate IDs
- All heading levels sequential (no skipping h2 → h4)
- All interactive elements keyboard accessible
- All images have alt text
- All links have distinguishable text

---

## Phase 5: Commit & Push

### 5.1 Commit with descriptive message
```bash
cd s:\code\community
git add -A
git commit -m "Refresh site content with current accessibility-agents data

- Update agent count from 35 to 39+ (added markdown, EPUB, cognitive, mobile, design-system, repo-manager agents)
- Add accordion sections for agents, platforms, skills, and prompts
- Add Skills section (13 reusable knowledge modules)
- Add Prompts section (45 ready-to-use commands)
- Add Tools & Integrations section (axe-core, MCP, VPAT)
- Add platform comparison (Claude Code, Copilot, Desktop)
- Update stats bar with current numbers
- Update docs.html sidebar with markdown prompts section
- Rewrite all content for approachability — less jargon, more clarity
- Maintain WCAG 2.2 AA compliance throughout"
```

### 5.2 Push to main
```bash
git push origin main
```
GitHub Pages will auto-deploy.

---

## Key Content Principles

1. **Home page = product marketing.** Approachable, clear, exciting. No jargon.
2. **Docs page = technical reference.** Detailed, complete, developer-friendly. The docs page renders Markdown directly from the repo so it's always current.
3. **Accordions for density.** The home page has a LOT of content now. Accordions let users scan headings and expand what interests them.
4. **Accuracy over flair.** Every number, every agent name, every tool must match the actual repo. Clone the repo and verify.
5. **Accessibility is non-negotiable.** This is an accessibility project. The site must be flawless: keyboard nav, screen reader tested, high contrast, reduced motion, semantic HTML.

---

## Reference: Full Agent List (39+ agents)

### Web Accessibility (16)
1. accessibility-lead
2. aria-specialist
3. modal-specialist
4. contrast-master
5. keyboard-navigator
6. live-region-controller
7. forms-specialist
8. alt-text-headings
9. tables-data-specialist
10. link-checker
11. web-accessibility-wizard
12. testing-coach
13. wcag-guide
14. cognitive-accessibility
15. mobile-accessibility
16. design-system-auditor

### Document Accessibility (9)
17. word-accessibility
18. excel-accessibility
19. powerpoint-accessibility
20. office-scan-config
21. pdf-accessibility
22. pdf-scan-config
23. document-accessibility-wizard
24. epub-accessibility
25. epub-scan-config

### Markdown Accessibility (3)
26. markdown-a11y-assistant
27. markdown-scanner (hidden)
28. markdown-fixer (hidden)

### GitHub Workflow (11)
29. github-hub
30. daily-briefing
31. pr-review
32. issue-tracker
33. analytics
34. insiders-a11y-tracker
35. repo-admin
36. team-manager
37. contributions-hub
38. template-builder
39. repo-manager

### Hidden Sub-Agents (4)
- document-inventory
- cross-document-analyzer
- cross-page-analyzer
- web-issue-fixer

## Reference: 13 Skills
1. accessibility-rules
2. document-scanning
3. report-generation
4. web-scanning
5. web-severity-scoring
6. framework-accessibility
7. cognitive-accessibility
8. mobile-accessibility
9. design-system
10. github-workflow-standards
11. github-scanning
12. github-analytics-scoring
13. markdown-accessibility

## Reference: 45 Prompts
- Web (5): audit-web-page, quick-web-check, audit-web-multi-page, compare-web-audits, fix-web-issues
- Documents (9): audit-single-document, audit-document-folder, audit-changed-documents, quick-document-check, generate-vpat, generate-remediation-scripts, compare-audits, setup-document-cicd, create-accessible-template
- GitHub (27): review-pr, pr-report, my-prs, pr-author-checklist, pr-comment, address-comments, manage-branches, merge-pr, explain-code, my-issues, create-issue, triage, issue-reply, manage-issue, refine-issue, project-status, react, daily-briefing, ci-status, notifications, security-dashboard, onboard-repo, draft-release, release-prep, my-stats, team-dashboard, sprint-review, a11y-update, add-collaborator, build-template, build-a11y-template
- Markdown (4): audit-markdown, quick-markdown-check, fix-markdown-issues, compare-markdown-audits

## Reference: 11 MCP Tools (Claude Desktop)
1. check_contrast
2. get_accessibility_guidelines
3. check_heading_structure
4. check_link_text
5. check_form_labels
6. generate_vpat
7. run_axe_scan
8. scan_office_document
9. scan_pdf_document
10. extract_document_metadata
11. batch_scan_documents
