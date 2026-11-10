from pathlib import Path
import re

html = Path("index.html").read_text(encoding="utf-8")
panel = re.search(r'<div class="demo-panel demo-good">(.*?)</div>\s*</div>', html, re.S)
assert panel, "could not find .demo-good panel"
pre = re.search(r'<pre\b([^>]*)>', panel.group(1))
assert pre, "could not find pre in .demo-good panel"
attrs = pre.group(1)
assert re.search(r'\btabindex\s*=\s*["\']0["\']', attrs), f"expected tabindex='0' on .demo-good pre, got {attrs!r}"
print(".demo-good pre has tabindex='0'")
