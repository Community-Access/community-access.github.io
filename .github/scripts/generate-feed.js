const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://community-access.org';
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../../posts/posts.json'), 'utf8'));

// Sort newest first
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

function toRFC2822(dateStr) {
  return new Date(dateStr + 'T00:00:00Z').toUTCString();
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const items = posts.map(post => {
  const link = `${SITE_URL}/news.html#post/${post.slug}`;
  const category = post.type ? `\n      <category>${escapeXml(post.type)}</category>` : '';
  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${toRFC2822(post.date)}</pubDate>
      <description>${escapeXml(post.summary)}</description>${category}
    </item>`;
}).join('\n');

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Community Access</title>
    <link>${SITE_URL}</link>
    <description>News and press releases from Community Access -- making software accessible by default with AI-powered accessibility agents.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(__dirname, '../../feed.xml'), feed);
console.log(`Generated feed.xml with ${posts.length} item(s)`);
