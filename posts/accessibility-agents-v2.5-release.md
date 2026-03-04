# Accessibility Agents v2.5: By the Community, For the Community

**COMMUNITY ACCESS -- March 4, 2026**

---

This one is special.

Every feature in **Accessibility Agents v2.5** exists because someone in the community asked for it, argued for it, or built it. This is not a routine point release. It is the moment this project stopped being "two developers and a dream" and became something the community owns. 57 agents. 17 skills. 60 prompts. Five platforms. And every single recommendation now comes with a citation you can verify.

We are calling v2.5 our **Community Milestone Release** because it reflects what happens when blind and low vision developers, accessibility engineers, assistive technology users, and open source contributors come together around one idea: AI coding tools should ship accessible code by default.

Here is what landed.

---

## NVDA Addon Development Specialist

The most-requested agent of the year. The community told us loud and clear: "We need help building NVDA addons, not just using NVDA." So we built the **NVDA Addon Specialist** -- the seventh member of the Developer Tools team, and the first AI agent anywhere purpose-built for NVDA addon development.

It is grounded directly in the [official NVDA source code](https://github.com/nvaccess/nvda), not paraphrased blog posts. It knows:

- **Every plugin type** -- globalPlugins, appModules, synthDrivers, brailleDisplayDrivers
- **The real APIs** -- event/script handling, NVDAObject overlays, tree interceptors, the `@script` decorator pattern
- **Packaging and publishing** -- manifest format, buildVars, SCons builds, and the full Add-on Store submission workflow
- **Braille and speech** -- braille table authoring, speech dictionary files, and full internationalization
- **How to actually test** -- scratchpad mode, addon reload workflows, real screen reader verification

The NVDA Addon Specialist does not work in isolation. It hands off to wxPython Specialist for GUI dialogs, Desktop A11y Testing Coach for screen reader testing plans, and Desktop A11y Specialist for platform API questions. The whole Developer Tools team works as one.

This agent exists because someone in a GitHub discussion said: "I wish there was an AI that actually understood NVDA's internals." Now there is.

## Text Quality Reviewer

A community contributor pointed out something we had missed entirely: screen reader users encounter garbage text that sighted developers never see. Templates left in alt text. Code syntax used as accessible names. Placeholder text as the only label. So we built an agent for it.

The **Text Quality Reviewer** catches the invisible-to-sighted problems:

- Template variables left in alt text or aria-labels (`{0}`, `{{var}}`)
- Code syntax used as accessible names (`property.alttext`, `img.description`)
- Placeholder text masquerading as actual input labels
- Typos in short accessible names that screen readers speak aloud
- Whitespace-only or empty accessible names
- Duplicate control labels that make page navigation impossible

This agent enforces WCAG 1.1.1 (Non-text Content), 4.1.2 (Name, Role, Value), and 2.5.3 (Label in Name). It was built because our community knows what it feels like to land on a button labeled `btn_submit_02` and have no idea what it does.

## Source Citation Policy: No Source, No Claim

This was the most debated, most discussed, and ultimately most important change in v2.5. The community demanded trust -- and trust requires evidence.

Every agent now follows a formal **source citation policy** with a six-tier authority hierarchy:

| Tier | Source Type | Examples |
|------|-----------|----------|
| 1 | Normative Specs | WCAG 2.2, WAI-ARIA 1.2, HTML Living Standard |
| 2 | Informative Guidance | Understanding WCAG 2.2, ARIA Authoring Practices Guide |
| 3 | Platform Vendor Docs | MDN Web Docs, Microsoft Learn, Apple Developer |
| 4 | AT Vendor Docs | NV Access (NVDA), Freedom Scientific (JAWS), Apple VoiceOver |
| 5 | Peer-Reviewed | Deque University, WebAIM, Adrian Roselli |
| 6 | Government/Legal | Section508.gov, Access Board ICT, EN 301 549 |

The rules are simple and non-negotiable:

- **No source, no claim.** If an agent cannot link to an authoritative source, it says so explicitly. No more hallucinated accessibility advice.
- **Inline citations.** Every factual claim includes a working link to the source.
- **Full reference list.** Substantive responses end with a sources section.
- **Machine-readable registry.** Each agent domain has designated primary authorities in `SOURCE_REGISTRY.json`.
- **Automated freshness checks.** A weekly GitHub Actions workflow verifies source URLs and opens issues when documentation drifts.

This policy exists because AI giving wrong accessibility advice doesn't just fail a test -- it creates real barriers for real people. The community was right to demand better. Now every recommendation is verifiable.

## wxPython Screen Reader Key Event Pitfalls

A community member building a wxPython desktop app discovered a nasty cross-platform issue: when NVDA or JAWS is running, certain keyboard events never reach the application because the screen reader intercepts them first. The wxPython Specialist now documents this gotcha in detail and provides tested workarounds. This is the kind of tribal knowledge that only surfaces when the people who actually use screen readers are building the tools.

## By the Numbers

| Metric | v2.1 | v2.5 | Change |
|--------|------|------|--------|
| Total agents | 55 | 57 | +2 |
| Web accessibility agents | 16 | 17 | +1 |
| Developer tools agents | 6 | 7 | +1 |
| Skills | 16 | 17 | +1 |
| Prompts | 54 | 60 | +6 |
| Platforms | 5 | 5 | -- |
| Source citations enforced | No | Yes | New |
| Automated freshness checks | No | Yes | New |

## What Makes v2.5 Different

Previous releases added agents, skills, and platforms. v2.5 adds **accountability**. Every recommendation can be traced to a real source. Every agent knows its limits and says so. The citation policy and source registry are not features -- they are a promise.

And every major feature in this release -- the NVDA Addon Specialist, the Text Quality Reviewer, the citation policy, the wxPython screen reader documentation, the six new Developer Tools prompts (scaffold-nvda-addon, audit-desktop-a11y, test-desktop-a11y, review-text-quality, scaffold-wxpython-app, package-python-app) -- started as a community conversation. Not a roadmap item. Not a sprint goal. A real person saying "this is what I need." That is how accessibility tooling should be built.

## Install or Update

Existing users can update with the same one-liner that installed the agents. Everything in v2.5 is included automatically.

**macOS / Linux:**

```bash
curl -fsSL https://raw.githubusercontent.com/Community-Access/accessibility-agents/main/update.sh | bash
```

**Windows (PowerShell):**

```powershell
irm https://raw.githubusercontent.com/Community-Access/accessibility-agents/main/update.ps1 | iex
```

New to the project? See the [Getting Started Guide](https://github.com/Community-Access/accessibility-agents/blob/main/docs/getting-started.md) for full installation instructions.

## Thank You

To every person who opened an issue, started a discussion, submitted a pull request, asked a question, or shared their experience as a screen reader user -- v2.5 is yours. This project works because you showed up.

We are just getting started.
