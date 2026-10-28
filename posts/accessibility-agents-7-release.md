# Accessibility Agents 7: One Package, Every Agent, Accessible by Default

**COMMUNITY ACCESS -- October 28, 2026**

---

Accessibility Agents has been rebuilt from the ground up.

Version 7 replaces six hand-maintained copies of the project, one per AI coding tool, with a single package built on the open agent standards. The same skills now run natively in Claude Code, GitHub Copilot (CLI and VS Code), Codex, Gemini CLI and Antigravity. Version 7.1, released today, finishes the job: every client now gets the skills, the edit gate and the scanners from one install, and the MCP server is on npm and in the official MCP Registry.

The short version: it is faster, it costs a fraction of what it used to, it is harder for a model to skip accessibility, and it is easier than ever to install.

---

## Why we rebuilt it

AI coding tools forget accessibility. They forget it most when they are busy, and the old design made them busy. Every session loaded thousands of tokens of instructions before you had typed a word. Every time a specialist was called, its whole body was read and then pasted again. Reports were typed out by the model from a long template.

That cost money, it cost context, and it cost accuracy. So we measured it, and then we took it apart.

## The numbers

Always-on cost is what the package charges before you have said anything. Measured on September 21, 2026:

| Client | Before 7.0 | After 7.0 | Reduction |
|---|---|---|---|
| Claude Code | 15,924 tokens | 1,136 tokens | 93% |
| GitHub Copilot | 17,347 tokens | 1,136 tokens | 93% |
| Gemini CLI and Antigravity | 12,848 tokens | 1,136 tokens | 91% |
| Codex | 15,074 tokens | 2,417 tokens | 84% |

And three more:

- **Calling a specialist** went from 26,929 tokens to about 100. A router now sends the skill's name instead of pasting its instructions.
- **The accessibility reminder** went from roughly 570 tokens on every prompt to 87 tokens once per session.
- **Writing a report** went from roughly 15,000 output tokens to zero. A script renders it from structured findings.

A ten-specialist audit that used to spend around 320,000 tokens on coordination now spends under 5,000.

## Six front doors, 61 specialists behind them

You no longer pick from a list of agents. You describe the problem, and one of six entry points routes the work:

- **accessibility-lead** for HTML, JSX, Vue, Svelte, CSS and server templates
- **web-accessibility-wizard** for a full site or app audit
- **document-accessibility-wizard** for Word, Excel, PowerPoint, PDF and ePub
- **markdown-a11y-assistant** for documentation
- **developer-hub** for Python, wxPython, desktop apps and NVDA add-ons
- **github-hub** for issues, pull requests, releases, projects and the rest of GitHub

Behind them are 107 more skills: 61 specialists, 16 helpers and 30 reference skills. The specialists cover ARIA, keyboard, focus, forms, contrast, modals, live regions, tables, cognitive load, mobile, email, data visualisation, Office, PDF/UA, ePub and more. They cost nothing until a router names one.

## Harder to skip

- **The edit gate.** A hook refuses a write to a user-facing file until the accessibility lead has finished its review. In 7.1 it ships for Claude Code, Codex, Copilot CLI, VS Code, Gemini CLI and Antigravity, it fails closed rather than open, and it has been tested live on Claude Code and Codex.
- **Evidence, not memory.** Every scanning skill returns findings as structured JSON against one schema. Every finding is checked against the real WCAG 2.2 criterion list, so an audit cannot cite a criterion that does not exist, or the retired 4.1.1 Parsing.
- **Reports with a memory.** The renderer computes the score, shows what moved since the last run, and merges duplicate findings from different specialists into one.

## New in 7.1

- **One install on every client.** Plugin installs now load the hooks and the MCP server, not just the skills. The MCP server ships as a single bundle, so it starts with no npm install.
- **On npm and the MCP Registry.** Any MCP client can run the 39 scanning tools with `npx -y @community-access/accessibility-agents-mcp`. Releases are published with provenance and approved with two-factor authentication.
- **A Gemini CLI extension**, attached to every release.
- **A Codex plugin route**, alongside the Claude Code and Copilot marketplaces.
- **The Open Source Accessibility Framework.** Four new skills help any repository adopt GitHub's framework, all 24 actions or one at a time, and this project now follows it itself. Our progress is tracked in public.
- **Our own accessibility commitment**: an `ACCESSIBILITY.md` with priorities, how to report a barrier, and response targets.
- **A full audit of all 108 original skills** against current standards: ADA Title II and HHS Section 504 dates, EN 301 549, ISO/IEC 40500:2025, VPAT 2.5Rev, PDF/UA-2, ARIA and the APG patterns.
- **New guidance from the community**: where a Qt widget's accessible name really comes from, and how flex and grid layouts can split one phrase into several screen reader stops, or glue two words together ("Ada6:37 PM").

## Install

Claude Code:

```
/plugin marketplace add Community-Access/accessibility-agents
/plugin install accessibility-agents@community-access
```

GitHub Copilot CLI:

```
copilot plugin marketplace add Community-Access/accessibility-agents
copilot plugin install accessibility-agents@community-access
```

Gemini CLI:

```
gemini extensions install https://github.com/Community-Access/accessibility-agents
```

Codex, VS Code, Antigravity and the stand-alone MCP server are covered in the [README](https://github.com/Community-Access/accessibility-agents#install).

## Your data stays yours

Scanning runs on your machine. There is no telemetry, no account and no key, and nothing is sent to the project. The only outbound traffic is what you ask for: the pages you tell the web scanners to load, and the five optional GLOW tools, which send the file you name to the separate GLOW service.

## Thank you

This release carries work from contributors who found real problems and sent real fixes: [@w9fyi](https://github.com/w9fyi), [@AdamMagued](https://github.com/AdamMagued), [@chrisnestrud](https://github.com/chrisnestrud) and [@Orinks](https://github.com/Orinks). Every one of their pull requests is credited in the [changelog](https://github.com/Community-Access/accessibility-agents/blob/main/CHANGELOG.md).

## One honest note

AI and automated tools are not perfect. They miss things, and they cannot replace testing with real screen readers and real people. Accessibility Agents is a strong first pass that keeps accessibility in the loop while code is being written. Test with NVDA, JAWS, VoiceOver, TalkBack and a keyboard before you ship.

---

- [Accessibility Agents on GitHub](https://github.com/Community-Access/accessibility-agents)
- [Release notes for 7.1.0](https://github.com/Community-Access/accessibility-agents/releases/tag/v7.1.0)
- [Full changelog](https://github.com/Community-Access/accessibility-agents/blob/main/CHANGELOG.md)
- [How 7.0 was planned and measured](https://github.com/Community-Access/accessibility-agents/blob/main/docs/history/2026-09-modernization.md)
- [Report a bug or a barrier](https://github.com/Community-Access/accessibility-agents/issues)
