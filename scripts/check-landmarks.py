"""Check incidental region landmarks without third-party dependencies.

Run: python3 scripts/check-landmarks.py
This is a source regression check, not a replacement for screen-reader testing.
"""
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
# Add only reviewed, genuinely useful regions here, keyed by (file, element id).
ALLOWED_REGIONS = set()
EXPECTED_HEADINGS = {
    "index.html": {
        "hero-title", "projects-title", "whats-new-title", "how-title",
        "install-title", "faq-title", "contribute-title",
    },
    "extensions.html": {"marketplace-heading", "review-heading"},
    "github-accessibility-hackathon/index.html": {"steps-heading"},
}


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.elements = []

    def handle_starttag(self, tag, attributes):
        self.elements.append((tag, dict(attributes), self.getpos()[0]))


errors = []
pages = {}
for path in sorted(ROOT.rglob("*.html")):
    if any(part.startswith(".") or part in {"node_modules", "vendor"}
           for part in path.relative_to(ROOT).parts):
        continue
    name = path.relative_to(ROOT).as_posix()
    page = Page()
    page.feed(path.read_text())
    pages[name] = page
    for tag, attrs, line in page.elements:
        named_section = tag == "section" and (attrs.get("aria-label") or attrs.get("aria-labelledby"))
        region = "region" in attrs.get("role", "").split()
        if (named_section or region) and (name, attrs.get("id")) not in ALLOWED_REGIONS:
            errors.append(f"{name}:{line}: review unnecessary region landmark")

for name, expected in EXPECTED_HEADINGS.items():
    headings = {attrs.get("id") for tag, attrs, _ in pages[name].elements
                if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}}
    if not expected <= headings:
        errors.append(f"{name}: preserve heading anchors {sorted(expected - headings)}")

for name in ("index.html", "extensions.html"):
    elements = pages[name].elements
    for tag in ("header", "main", "footer"):
        if not any(element == tag for element, _, _ in elements):
            errors.append(f"{name}: missing {tag}")
    if not any(tag == "nav" and attrs.get("aria-label") == "Main navigation"
               for tag, attrs, _ in elements):
        errors.append(f"{name}: preserve named main navigation")
    for heading in ("footer-projects", "footer-site", "footer-community"):
        if not any(tag == "nav" and attrs.get("aria-labelledby") == heading
                   for tag, attrs, _ in elements):
            errors.append(f"{name}: preserve footer navigation {heading}")

if not any(tag == "aside" and attrs.get("id") == "extension-detail"
           and attrs.get("aria-labelledby") == "extension-detail-heading"
           and attrs.get("tabindex") == "-1"
           for tag, attrs, _ in pages["extensions.html"].elements):
    errors.append("extensions.html: preserve named, focusable extension details")

if errors:
    raise SystemExit("\n".join(errors))
print(f"Passed: {len(pages)} HTML pages; no incidental regions; heading anchors and meaningful landmarks retained.")
