# community-access.github.io

This is the main website for the [Community Access](https://github.com/Community-Access) organization. It serves as the home for all projects under the org, providing an overview of what we build, links to each project, and installation instructions for getting started.

The site is published via GitHub Pages at [community-access.github.io](https://community-access.github.io).

## Landmark regression check

Run `python3 scripts/check-landmarks.py` after changing page structure. Ordinary
content sections should have headings without becoming named region landmarks.
Keep heading IDs for links, and preserve useful navigation labels, table names,
sidebar landmarks, and live announcements. Review any genuinely useful new region
and add an explicit exception to the check. This source check supplements browser
and screen-reader testing; it does not replace them.
