/**
 * a11y-crawl.js — Accessibility audit crawler for Start Testing
 *
 * Crawls all internal pages starting from the homepage, runs axe-core
 * WCAG 2.1 AA checks on each page, captures screenshots of violations,
 * and outputs a JSON report.
 *
 * Usage:
 *   node scripts/a11y-crawl.js [baseUrl] [screenshotDir]
 *
 * Environment:
 *   A11Y_SESSION_COOKIE — value of the __session cookie (Firebase ID token)
 *                          to authenticate as a logged-in user.
 *
 * Defaults:
 *   baseUrl       = https://starttesting.net
 *   screenshotDir = ./screenshots
 *
 * Output:
 *   - Screenshots saved to screenshotDir/
 *   - JSON report printed to stdout
 *
 * Sample issue body format (used by the workflow):
 *
 *   ### Accessibility Violation: `color-contrast`
 *
 *   **Impact:** serious
 *   **Page:** /about
 *   **Description:** Ensures the contrast between foreground and background
 *   colors meets WCAG 2 AA contrast ratio thresholds
 *
 *   **Affected element:**
 *   ```html
 *   <p class="text-gray-400">Some low-contrast text</p>
 *   ```
 *
 *   **CSS selector:** `.text-gray-400`
 *
 *   Screenshots and full report available in the
 *   [workflow run artifacts](link-to-run).
 */

const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const BASE_URL = process.argv[2] || "https://starttesting.net";
const SCREENSHOT_DIR = process.argv[3] || "./screenshots";

const visited = new Set();
const queue = ["/"];
const allViolations = [];

function normalizeUrl(href) {
  try {
    const url = new URL(href, BASE_URL);
    // Only follow internal links
    if (url.origin !== new URL(BASE_URL).origin) return null;
    // Strip hash and query
    url.hash = "";
    url.search = "";
    // Skip API routes, auth callbacks, OAuth endpoints, well-known
    const skip = ["/api/", "/oauth/", "/.well-known/", "/_next/"];
    if (skip.some((prefix) => url.pathname.startsWith(prefix))) return null;
    // Skip file extensions
    if (/\.\w{2,4}$/.test(url.pathname)) return null;
    return url.pathname;
  } catch {
    return null;
  }
}

function sanitizeFilename(str) {
  return str.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_");
}

async function crawlAndAudit() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const baseOrigin = new URL(BASE_URL);
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  // Inject session cookie if provided via environment variable
  const sessionCookie = process.env.A11Y_SESSION_COOKIE;
  if (sessionCookie) {
    await context.addCookies([
      {
        name: "__session",
        value: sessionCookie,
        domain: baseOrigin.hostname,
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
      },
    ]);
    console.error("Session cookie injected — crawling as authenticated user");
  } else {
    console.error("No A11Y_SESSION_COOKIE set — crawling public pages only");
  }

  while (queue.length > 0) {
    const pagePath = queue.shift();
    if (visited.has(pagePath)) continue;
    visited.add(pagePath);

    const fullUrl = `${BASE_URL}${pagePath}`;
    console.error(`Auditing: ${fullUrl}`);

    const page = await context.newPage();

    try {
      const response = await page.goto(fullUrl, {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // Skip pages that redirect to auth or return errors
      if (!response || response.status() >= 400) {
        console.error(`  Skipped (status ${response?.status() || "no response"})`);
        await page.close();
        continue;
      }

      // Check if we got redirected to a login page
      const currentUrl = new URL(page.url());
      if (currentUrl.pathname.includes("/login") || currentUrl.pathname.includes("/signin")) {
        console.error(`  Skipped (redirected to auth)`);
        await page.close();
        continue;
      }

      // Discover links on this page
      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll("a[href]")).map((a) => a.getAttribute("href"))
      );

      for (const href of links) {
        const normalized = normalizeUrl(href);
        if (normalized && !visited.has(normalized)) {
          queue.push(normalized);
        }
      }

      // Take full-page screenshot
      const pageScreenshotName = `page${sanitizeFilename(pagePath || "_root")}.png`;
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, pageScreenshotName),
        fullPage: true,
      });

      // Run axe-core WCAG 2.1 AA audit
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      if (results.violations.length > 0) {
        console.error(`  Found ${results.violations.length} violation(s)`);
      }

      for (const violation of results.violations) {
        for (const node of violation.nodes) {
          const selector = node.target[0];
          let screenshotFile = null;

          // Try element-level screenshot
          try {
            const element = await page.locator(selector).first();
            if (await element.isVisible()) {
              screenshotFile = `violation_${sanitizeFilename(pagePath || "_root")}_${sanitizeFilename(violation.id)}_${sanitizeFilename(selector)}.png`;
              // Truncate filename if too long
              if (screenshotFile.length > 200) {
                screenshotFile = screenshotFile.substring(0, 196) + ".png";
              }
              await element.screenshot({
                path: path.join(SCREENSHOT_DIR, screenshotFile),
              });
            }
          } catch {
            // Fall back to full-page screenshot reference
            screenshotFile = `fallback_${pageScreenshotName}`;
          }

          allViolations.push({
            ruleId: violation.id,
            description: violation.description,
            help: violation.help,
            helpUrl: violation.helpUrl,
            impact: violation.impact,
            page: pagePath,
            pageUrl: fullUrl,
            selector: selector,
            html: node.html,
            screenshotFile: screenshotFile,
          });
        }
      }
    } catch (err) {
      console.error(`  Error on ${fullUrl}: ${err.message}`);
    }

    await page.close();
  }

  await browser.close();

  // Output JSON report to stdout
  const report = {
    auditDate: new Date().toISOString(),
    baseUrl: BASE_URL,
    pagesAudited: Array.from(visited),
    totalViolations: allViolations.length,
    violations: allViolations,
  };

  process.stdout.write(JSON.stringify(report, null, 2));
}

crawlAndAudit().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
