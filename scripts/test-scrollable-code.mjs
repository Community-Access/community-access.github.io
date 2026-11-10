// Adapted from jay23606's keyboard-access fix and regression test in PR #12.
// Run: node scripts/test-scrollable-code.mjs [site-directory]
// Source/renderer checks only; browser keyboard and scrolling tests remain necessary.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.argv[2] || '.';
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const focusable = markup => {
  const pres = [...markup.matchAll(/<pre\b([^>]*)>/g)];
  assert.ok(pres.length, 'expected code samples');
  for (const [, attrs] of pres) assert.match(attrs, /\btabindex="0"/, 'code sample must be keyboard-focusable');
};
focusable(read('blog.html'));

const news = read('news.html');
const mdSource = news.slice(news.indexOf('  function md(text)'), news.indexOf('  // Format date'));
const md = vm.runInNewContext(mdSource + '\nmd');
for (const code of ['short', 'a'.repeat(200)]) {
  focusable(md('# Article\n\n```js\n' + code + '\n```'));
}
assert.doesNotMatch(md('# Article\n\nText with `inline code`.'), /tabindex/);

const docs = read('docs.html');
const renderSource = docs.slice(docs.indexOf('  function renderDoc('), docs.indexOf('  // Handle clicks on doc links'));
const samples = [];
const contentEl = {
  set innerHTML(html) {
    samples.length = 0;
    for (const match of html.matchAll(/<pre\b[^>]*>/g)) {
      samples.push({ attrs: {}, setAttribute(key, value) { this.attrs[key] = value; } });
    }
  },
  querySelector: () => null,
  querySelectorAll(selector) { assert.equal(selector, '.doc-rendered pre'); return samples; },
};
const context = {
  contentEl, REPO_BLOB: 'https://example.invalid/',
  marked: { parse: () => '<pre><code>first</code></pre><pre><code>second</code></pre>' },
  sanitizeRenderedHTML: html => html, rewriteLinks() {}, closeSidebar() {},
  document: { getElementById: () => null }, window: { scrollTo() {} },
};
const render = vm.runInNewContext(renderSource + '\nrenderDoc', context);
for (let i = 0; i < 2; i++) {
  render('guide.md', '# Guide\n\n```\ncode\n```');
  assert.equal(samples.length, 2);
  for (const pre of samples) assert.equal(pre.attrs.tabindex, '0');
}
delete context.marked;
render('fallback.md', 'plain text');
assert.equal(samples.length, 1);
assert.equal(samples[0].attrs.tabindex, '0');
console.log('PASS: blog code, news renderer, repeated docs rendering and docs fallback are keyboard-focusable in markup.');
