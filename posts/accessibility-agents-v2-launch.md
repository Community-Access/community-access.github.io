# Blind Developers Launch Open Source AI Agent Teams to Fix Accessibility Gap in AI Coding Tools

FOR IMMEDIATE RELEASE

AUSTIN, TEXAS, February 25, 2026

## Overview

Every day, AI coding tools generate millions of lines of code. Almost none of it is accessible.

Community Access today announced the public launch of Accessibility Agents, a free and open source project that brings 47 specialized AI agents, 14 knowledge modules, and 52 pre-built prompts to three major AI coding platforms: Claude Code, GitHub Copilot, and Claude Desktop. The project catches accessibility violations automatically before code ships, addressing an urgent and growing problem. As AI-generated code scales to production at unprecedented speed, the barrier for the 1.3 billion people worldwide who live with disabilities grows with it.

Accessibility Agents is available now at https://community-access.github.io/ and installs with a single command.

## The Problem 

AI coding tools are transforming how software gets built. Developers use them to generate entire components, pages, and applications in minutes. 

They forget ARIA rules. They skip keyboard navigation. They ignore contrast ratios. They produce modals that trap screen reader users with no way out. They generate forms without labels, buttons without roles, and dynamic content that screen readers never announce. Even when developers write detailed custom instructions, accessibility context gets quietly deprioritized and dropped as conversations grow.

The result is a new generation of software shipping at unprecedented speed with accessibility failures baked in from the start. Not as edge cases. As defaults.

For the 2.2 billion people globally with vision impairments, and the millions who rely on screen readers, keyboards, and other assistive technology to navigate the web, every one of those failures is a door that does not open. A form that cannot be filled out. A button that cannot be pressed. A modal that becomes a cage.

This is not a theoretical problem. It is happening right now, at scale, in every codebase where AI writes the first draft.

## The Solution

Accessibility Agents takes a fundamentally different approach. Instead of reminding one AI model to care about accessibility, the project deploys a team of 47 specialized agents, each with a single domain it cannot ignore. An ARIA specialist cannot forget about ARIA because ARIA is its identity. A contrast master cannot skip contrast checks because that is its entire purpose.

Orchestrator agents coordinate the team. When a developer starts a task, the lead agent determines which specialists are needed and routes the work. Each agent returns structured output with confidence levels and handoff transparency so nothing gets lost between steps. The system uses multi-agent reliability engineering, meaning agents coordinate through explicit contracts rather than intercepting prompts. It works the moment it is installed.

The approach mirrors how real accessibility teams operate. You do not ask one person to remember everything about ARIA, color contrast, keyboard navigation, focus management, live regions, and document structure. You build a team where each person owns a domain. That is what these agents are.

## Built Over a Weekend by People Who Need It

The project began on Friday, February 21, when Taylor Arndt, a blind developer and accessibility specialist, published a preview of six agents for Claude Code. By Saturday morning, Jeff Bishop, also a blind accessibility specialist, had picked it up and started building. 

Within 48 hours, six agents became 47. A personal repository became a GitHub organization. A single-platform tool expanded to three platforms. Nine contributors joined the effort. Thirty pull requests were merged. Thirty-four security vulnerabilities were identified and resolved. A dedicated website went live. The entire project was rebuilt from the ground up.

"When AI generates a modal without focus trapping, I am the person who gets stuck," said Arndt. "When it skips live regions on search results, I am the person who hears nothing. When it uses a div with an onClick instead of a button, I am the person who cannot activate it with my keyboard. We did not build this because it is a cool open source project. We built it because we need it. And we are not the only ones."

"This isn't just about solving problems, it is about teaching, empowering and allowing others to contribute to their own success", said Bishop.
"When others contribute their ideas, talents and even their lived experience, they are not just helping to build a tool, they are helping to build a community. We want this project to be a place where anyone who cares about accessibility can come and make a difference."

## Why This Matters Now

According to the WebAIM Million report, 95.9 percent of the top one million websites have detectable accessibility failures. That number has barely improved in years despite growing awareness and legal requirements. AI coding tools risk making it worse by automating the same mistakes at a scale human developers never could.

Accessibility is not optional. It is a legal requirement under the ADA, Section 508, the European Accessibility Act, and accessibility laws in dozens of countries. It is also a moral imperative. When software is inaccessible, it excludes real people from participating in digital life.

Accessibility Agents exists to make sure the AI-generated future of software does not leave disabled users behind.

## Three Platforms, One Install

Accessibility Agents runs on Claude Code, GitHub Copilot, and Claude Desktop, covering the most widely used AI coding environments.

Claude Code gets markdown-based agents invoked directly for accessibility evaluation. GitHub Copilot gets agents and workspace instructions that ensure accessibility guidance is part of every conversation. Claude Desktop gets an MCP extension with 11 tools and 6 prompts for accessibility review including contrast ratio checking, heading structure analysis, form label validation, and axe-core live URL scanning.

One install command handles all three platforms.

## What the 47 Agents Cover

**Web Accessibility (16 agents):** ARIA, modals, color contrast, keyboard navigation, live regions, forms, alt text and headings, data tables, link text, cognitive accessibility, mobile accessibility, design systems, guided audits, testing guidance, and WCAG reference.

**Document Scanning (9 agents):** Microsoft Word, Excel, PowerPoint, PDF, and EPUB accessibility scanning with 46 built-in rules for Office documents and 56 for PDFs. Generates VPAT 2.5 compliance reports and exports findings to CSV with step-by-step remediation guidance.

**Markdown Documentation (3 agents):** Scans files across nine accessibility domains including links, alt text, headings, tables, emoji, diagrams, and anchors.

**GitHub Workflows (11 agents):** PR review, issue triage, daily briefings, analytics, repository management, and team coordination.

An additional 10 sub-agents handle cross-document analysis, batch operations, and reporting behind the scenes.

## By the Numbers

- 47 specialized agents across four teams
- 14 shared knowledge modules ensuring consistency
- 52 pre-built prompts for one-click workflows
- 46 built-in rules for Office document scanning
- 56 built-in rules for PDF scanning
- 9 accessibility domains for markdown scanning
- 30 pull requests merged in 3 days
- 34 security findings resolved including path traversal, injection, and ZIP bomb protection
- 9 contributors and growing
- 3 supported platforms
- 1 command to install
- 0 cost

## Installation

macOS and Linux:

```
curl -fsSL https://raw.githubusercontent.com/Community-Access/accessibility-agents/main/install.sh | bash
```

Windows PowerShell:

```
irm https://raw.githubusercontent.com/Community-Access/accessibility-agents/main/install.ps1 | iex
```

The installer is non-destructive, never overwrites existing files, and includes daily auto-updates.

## Free and Open Source

Accessibility Agents is MIT licensed. There is no account, no subscription, and no cost. The project is community-driven and welcomes contributors from all backgrounds. Developers, accessibility specialists, screen reader users, and anyone who cares about inclusive software can contribute.

## A Note on Limitations

AI and automated tools are not perfect. They miss things, make mistakes, and cannot replace testing with real screen readers and assistive technology. always verify with VoiceOver, NVDA, JAWS, and keyboard-only navigation. This tooling is a starting point, not a substitute for real accessibility testing.

Accessibility Agents is available now.

Website: https://community-access.github.io/

GitHub: https://github.com/Community-Access/accessibility-agents

Getting Started: https://github.com/Community-Access/accessibility-agents/blob/main/docs/getting-started.md

Contributing: https://github.com/Community-Access/accessibility-agents/blob/main/CONTRIBUTING.md

## About Community Access

Community Access is a GitHub organization created to house Accessibility Agents and future open source accessibility projects. It was started by Taylor Arndt and Jeff Bishop, both blind accessibility specialists who use assistive technology daily. When AI coding tools consistently failed at accessibility, they built the team they wished existed and opened it to the world.

The project is built by and for the blind and low vision community. The more perspectives, lived experiences, and domain knowledge that go into it, the better it serves the people who need it most.

Website: https://community-access.github.io/

GitHub: https://github.com/Community-Access

## Media Contact

Taylor Arndt
Email: taylor@techopolis.app
GitHub: https://github.com/taylorarndt

Jeff Bishop
Email: jeff@jeffbishop.com
Github: http://www.github.com/accesswatch
