# Accessibility Agents v2.2: NVDA Addon Specialist, Citation Policy, and 57 Agents

**COMMUNITY ACCESS -- March 4, 2026**

---

Community Access is excited to announce **Accessibility Agents v2.2**, bringing the total agent count to 57 with two significant new additions: an NVDA Addon Development Specialist and a source citation policy that makes every agent response trustworthy and verifiable.

## NVDA Addon Development Specialist

The new **NVDA Addon Specialist** is the seventh member of the Developer Tools team. It is an expert in building, debugging, testing, packaging, and publishing addons for the [NVDA screen reader](https://www.nvaccess.org/) -- grounded directly in the [official NVDA source code](https://github.com/nvaccess/nvda).

The agent covers:

- **Plugin types** -- globalPlugins, appModules, synthDrivers, and brailleDisplayDrivers
- **Core APIs** -- event/script handling, NVDAObject overlays, tree interceptors, and the `@script` decorator pattern
- **Addon packaging** -- manifest format, buildVars, and Add-on Store submission workflow
- **Braille and speech** -- braille table authoring, speech dictionary files, and internationalization
- **Testing** -- real screen reader verification, scratchpad mode, addon reload workflows

The NVDA Addon Specialist integrates with the full Developer Tools team: it hands off to the wxPython Specialist for GUI components, the Desktop A11y Testing Coach for screen reader testing, and the Desktop A11y Specialist for platform accessibility API questions.

## Text Quality Reviewer

The new **Text Quality Reviewer** agent catches problems that are invisible to sighted developers but break the experience for screen reader users:

- Template variables left in alt text or aria-labels (`{0}`, `{{var}}`)
- Code syntax used as accessible names (`property.alttext`, `img.description`)
- Placeholder text used as the only label for form inputs
- Typos in short accessible names
- Whitespace-only or empty accessible names
- Duplicate control labels on the same page

This agent enforces WCAG 1.1.1 (Non-text Content), 4.1.2 (Name, Role, Value), and 2.5.3 (Label in Name).

## Source Citation Policy

Every agent now follows a formal **source citation policy** with a six-tier authority hierarchy:

| Tier | Source Type | Examples |
|------|-----------|----------|
| 1 | Normative Specs | WCAG 2.2, WAI-ARIA 1.2, HTML Living Standard |
| 2 | Informative Guidance | Understanding WCAG 2.2, ARIA Authoring Practices Guide |
| 3 | Platform Vendor Docs | MDN Web Docs, Microsoft Learn, Apple Developer |
| 4 | AT Vendor Docs | NV Access (NVDA), Freedom Scientific (JAWS), Apple VoiceOver |
| 5 | Peer-Reviewed | Deque University, WebAIM, Adrian Roselli |
| 6 | Government/Legal | Section508.gov, Access Board ICT, EN 301 549 |

Key rules:

- **No source, no claim.** If an agent cannot link to an authoritative source, it must explicitly flag the recommendation as experience-based.
- **Inline citations.** Every factual claim includes a markdown link to the source.
- **Sources section.** Substantive responses end with a full reference list.
- **Per-agent source registry.** Each agent domain has designated primary authorities in a machine-readable `SOURCE_REGISTRY.json`.
- **Automated freshness checks.** A weekly GitHub Actions workflow verifies source URLs and opens issues when documentation changes are detected.

This policy exists because AI agents that give accessibility advice must be held to a higher standard. Wrong guidance does not just fail a test -- it creates barriers for real people.

## wxPython Screen Reader Key Event Pitfalls

The wxPython Specialist now includes detailed guidance on a subtle cross-platform issue: **screen reader key event interception**. When NVDA or JAWS is running, certain keyboard events never reach the application because the screen reader intercepts them first. The agent now warns about this pattern and provides tested workarounds.

## By the Numbers

| Metric | v2.1 | v2.2 |
|--------|------|------|
| Total agents | 55 | 57 |
| Web accessibility agents | 16 | 17 |
| Developer tools agents | 6 | 7 |
| Skills | 16 | 17 |
| Prompts | 54 | 54 |
| Platforms | 5 | 5 |

## Install or Update

Existing users can update with the same one-liner that installed the agents. New agents and the citation policy are included automatically.

**macOS / Linux:**

```bash
curl -fsSL https://raw.githubusercontent.com/Community-Access/accessibility-agents/main/update.sh | bash
```

**Windows (PowerShell):**

```powershell
irm https://raw.githubusercontent.com/Community-Access/accessibility-agents/main/update.ps1 | iex
```

New to the project? See the [Getting Started Guide](https://github.com/Community-Access/accessibility-agents/blob/main/docs/getting-started.md) for full installation instructions.
