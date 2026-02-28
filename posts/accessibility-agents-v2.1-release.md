# Accessibility Agents v2.1: Developer Tools Team, 5 Platforms, and 55 Agents

**COMMUNITY ACCESS -- February 28, 2026**

---

Community Access is proud to announce the release of **Accessibility Agents v2.1**, a significant expansion of the open source accessibility agent ecosystem. This release brings 8 new agents, 3 new knowledge skills, 3 structured audit rule sets, and platform support for Codex CLI and Gemini CLI -- bringing the total to 55 agents across 5 platforms.

## The Developer Tools Team

The headline feature of v2.1 is a complete **Developer Tools team** -- 6 new agents purpose-built for Python development, wxPython GUI building, desktop application accessibility, and accessibility tool construction.

**Developer Hub** leads the team as an intelligent routing agent. Describe what you need in plain language, and it connects you to the right specialist:

- **Python Specialist** -- Debugging, packaging (PyInstaller, Nuitka, cx_Freeze), testing, type checking, async patterns, and performance optimization.
- **wxPython Specialist** -- Sizer layouts, event handling, AUI framework, custom controls, threading, and cross-platform desktop GUI development.
- **Desktop Accessibility Specialist** -- Platform APIs including UI Automation, MSAA/IAccessible2, ATK/AT-SPI, and NSAccessibility. Screen reader Name/Role/Value/State implementation, focus management, and high contrast support for Windows, macOS, and Linux.
- **Desktop A11y Testing Coach** -- Hands-on testing guidance for NVDA, JAWS, Narrator, VoiceOver, and Orca. Automated UIA testing, keyboard-only testing flows, and Accessibility Insights for Windows.
- **Accessibility Tool Builder** -- Design and build scanning tools, rule engines, document parsers, report generators, severity scoring algorithms, and CI/CD integration for accessibility tooling.

The Developer Tools team can also hand off to the Web Accessibility and Document Accessibility teams when your project spans multiple domains.

## CI/CD Scanner Integration

Two new bridge agents connect your CI/CD accessibility scanning pipelines directly into the agent ecosystem:

- **Scanner Bridge** -- Ingests findings from the GitHub Accessibility Scanner, correlates them with local scans, and tracks Copilot fix status on scanner-created issues.
- **Lighthouse Bridge** -- Parses Lighthouse CI accessibility audit data, maps findings to standard severity levels, and tracks score regressions across builds.

## Structured Audit Rule Sets

Three new numbered rule sets provide repeatable, structured audit frameworks:

- **WX-A11Y-001 through WX-A11Y-012** -- wxPython accessibility audit covering 12 domains from screen reader support to platform-specific patterns.
- **DTK-A11Y-001 through DTK-A11Y-012** -- Desktop accessibility audit covering platform API implementation, accessible control patterns, and assistive technology integration.
- **TST-A11Y-001 through TST-A11Y-010** -- Accessibility testing audit covering screen reader testing procedures, keyboard testing flows, and automated testing setup.

## Five Platforms

Accessibility Agents v2.1 now supports five AI coding platforms:

1. **Claude Code** -- Markdown-based agents in `.claude/agents/`
2. **GitHub Copilot** -- Agents and workspace instructions in `.github/agents/`
3. **Claude Desktop** -- MCP extension with 11 tools and 6 prompts
4. **Codex CLI** -- Full agent support via `.codex/AGENTS.md`
5. **Gemini CLI** -- 63 accessibility skills for geminicli.com discoverability

## By the Numbers

| Metric | v2.0.0 | v2.1 |
|--------|--------|------|
| Agents | 47 | 55 |
| Platforms | 3 | 5 |
| Knowledge skills | 14 | 17 |
| Prompts | 52 | 54 |
| Audit rule sets | 0 | 3 (34 rules) |
| Agent teams | 4 | 5 |

## Additional Improvements

- **VS Code Chat Participant** -- Scaffolded `@a11y` VS Code extension for Tier 2 integration (in preview).
- **Web Agent Hardening** -- All web agent rules strengthened against authoritative WCAG source documents.
- **Security** -- Hardened MCP server path validation and locked dependency versions.
- **Installer Overhaul** -- Comprehensive install/uninstall rewrite with manifest fallback support.
- **CI/CD Workflow** -- Updated manifest workflow to use PR-based approach compatible with branch protection.

## Install or Update

**New installation:**

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/Community-Access/accessibility-agents/main/install.sh | bash
```

```powershell
# Windows
irm https://raw.githubusercontent.com/Community-Access/accessibility-agents/main/install.ps1 | iex
```

**Update existing installation:**

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/Community-Access/accessibility-agents/main/update.sh | bash
```

```powershell
# Windows
irm https://raw.githubusercontent.com/Community-Access/accessibility-agents/main/update.ps1 | iex
```

## Links

- **Release:** [v2.1 on GitHub](https://github.com/Community-Access/accessibility-agents/releases/tag/v2.1)
- **Website:** [community-access.github.io](https://community-access.github.io/)
- **Documentation:** [Documentation Hub](https://community-access.github.io/docs.html)
- **Getting Started:** [Getting Started Guide](https://github.com/Community-Access/accessibility-agents/blob/main/docs/getting-started.md)
- **Contributing:** [Contributing Guide](https://github.com/Community-Access/accessibility-agents/blob/main/CONTRIBUTING.md)

---

Free. MIT licensed. Built by and for the blind and low vision community.
