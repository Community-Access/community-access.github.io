# Building an Accessible Calendar with AI -- and Letting the Agents Review Their Own Work

It is Friday. I just shipped a community calendar for the Community Access website. The whole thing was built with Claude Code in one session. But the interesting part is not that AI wrote the code. The interesting part is what happened after.

I let our own accessibility agents review the calendar. And they found problems.

That is the point.

## How It Started

I needed a calendar on the site. Upcoming workshops, community meetings, live coding streams. The kind of thing every open source project has. Nothing fancy.

I opened Claude Code and described what I wanted. An interactive calendar grid. Month navigation. Event details when you click a day. iCal export for Apple Calendar and Outlook. The full accessible treatment -- keyboard navigation, ARIA grid pattern, screen reader announcements, the works.

Claude planned the whole thing. Four files. Events data in JSON. HTML section with a proper grid table. CSS for layout and dark mode. JavaScript for fetching events, rendering the grid, handling arrow key navigation, and generating ICS files.

Within minutes I had a working calendar. Grid pattern with roving tabindex. Arrow keys moving between days. PageUp and PageDown for month navigation. Event dots on days that had events. Enter to select a day and see what is happening.

It worked. A screen reader could navigate it. The keyboard navigation followed the WAI-ARIA Authoring Practices Guide grid pattern. Focus management was solid.

Then I ran the accessibility agents.

## What the Agents Found

The accessibility lead agent coordinated the review. It pulled in the ARIA specialist and the keyboard navigation specialist to evaluate the calendar implementation.

They came back with 0 critical, 4 major, and 7 minor findings.

Zero critical sounds good until you read the major findings.

The events panel heading had no tabindex. That meant when JavaScript called `.focus()` on it after selecting a day, the focus call silently failed. Screen reader users would select a day and hear nothing. The events were there in the DOM but focus never moved to them. That is the kind of bug that passes every automated test and fails every real user.

The outside-month days were rendered as disabled buttons. Screen readers still announce disabled buttons. So a VoiceOver user navigating the grid would hear "28, dimmed" and "29, dimmed" for the previous month's trailing days. Noise. The agents said to use `<span aria-hidden="true">` instead. Remove them from the accessibility tree entirely.

The calendar used `aria-pressed` on day buttons. Wrong attribute. The WAI-ARIA date picker pattern uses `aria-selected`. Same visual result. Different semantics. Screen readers interpret them differently.

Event links had no visible underline by default. They only showed an underline on hover. That fails WCAG 1.4.1 because links must be distinguishable from surrounding text by more than color alone.

The workshop event type badge used `--ca-emerald` which is a bright green. On a white background, that is roughly a 3:1 contrast ratio. WCAG requires 4.5:1 for text. The agents caught it and recommended darkening to `#047857`.

Every one of these was a real accessibility barrier. Every one of them was in code that an AI wrote while being specifically asked to be accessible.

## The Rebuild

I fixed all the findings. But then I sat with the calendar for a minute and realized something.

I do not use calendar grids.

I am blind. I use a screen reader. When I want to know what is coming up, I do not want to arrow through 30 empty days to find the two that have events. I want a list. Headings for the days that matter. Events listed underneath each one. That is it.

So I told Claude to throw out the grid entirely. No table. No day buttons. No arrow key navigation. Just an agenda list. Days with events get an h3 heading. Events underneath get h4 headings with the details. If a month has nothing scheduled, it says so.

Simpler. Faster. More accessible. And honestly, more useful for everyone, not just screen reader users. Sighted users do not need to hunt through a grid either.

Claude rebuilt it. Then I ran the agents again.

## Round Two

The second review found more things.

The agenda container had `aria-live="polite"` on it. That meant every time you navigated to a new month, the entire month of events got dumped into the screen reader's announcement queue. Every heading. Every event title. Every time description. All at once. That is not helpful. That is a wall of noise.

The agents recommended removing `aria-live` from the container entirely and instead using a small screen-reader-only div with `aria-live` that just announces the month name. "March 2026." That is all a screen reader user needs to hear when they press the Next button. They can then navigate the content at their own pace.

The month label was an h3. But the day headings were also h3. That breaks heading hierarchy. The agents said to change the month label to a `<p>` element so the day headings are the only h3s under the section's h2.

The navigation buttons said "Previous" and "Next" visually but had `aria-label="Previous month"` and `aria-label="Next month"`. The visible text and accessible name did not match. That causes problems for voice control users who say "click Previous" and the system cannot match it because the accessible name is different.

Event cards had the type badge and time before the title. So a screen reader would announce "workshop, 2:00 PM to 4:00 PM, GIT Going with GitHub: Day 1." The agents said to put the title first. The most important information should come first in the DOM order. "GIT Going with GitHub: Day 1, workshop, 2:00 PM to 4:00 PM."

The button borders used a light gray that had roughly 1.2:1 contrast against the white background. Buttons need visible boundaries. The agents recommended `#6b7280` for roughly 4.6:1.

Fixed all of it. Then I tested the whole thing with VoiceOver myself. That is not optional. The agents catch code-level issues but they do not replace actually using a screen reader. I navigated the months, read through the event headings, downloaded the ICS files, and confirmed that everything worked the way a real screen reader user would expect.

Then I shipped it.

## What This Actually Demonstrates

This is exactly the use case we built these agents for.

AI coding tools are good at generating code. They are getting better every month. But they consistently miss accessibility details even when you explicitly ask for accessible output. Not because the model does not know what ARIA is. It does. But because accessibility is dozens of overlapping concerns and a single model cannot hold all of them in priority at once.

The agents work because each one has a single domain it cannot ignore. The ARIA specialist does not care about color contrast. The contrast specialist does not care about focus management. Each agent looks at one thing and looks at it thoroughly.

And the agenda list redesign demonstrates something else. The best accessibility insights often come from lived experience, not from automated rules. No rule told me the grid was a bad pattern. I knew because I am the user. The agents caught the implementation bugs. I caught the design problem.

That is how it should work. AI handles the tedious, detail-oriented review. Humans make the design decisions informed by real experience. Neither one replaces the other.

## Try It Yourself

The calendar is live now at [community-access.org](https://community-access.org/#calendar). Navigate to March 2026 to see the GIT Going with GitHub workshop days.

The accessibility agents that reviewed this calendar are free and open source. Install them with one command and they will review your code the same way they reviewed ours.

[Install Accessibility Agents](https://github.com/Community-Access/accessibility-agents)

If you build something with them and they catch things you missed, that is not a failure. That is the system working exactly as intended.
