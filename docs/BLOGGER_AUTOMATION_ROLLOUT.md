# Blogger automation | protected rollout

This adds a read-only scheduled health check for **https://yinyangyohackers.blogspot.com/**.

**Does NOT:** publish, delete, edit or reformat posts; change the CyberForge theme; touch the separate AI Studio/Vite app; use Google passwords; or manufacture Lighthouse scores.

**Does:** verify homepage, robots.txt, sitemap.xml, sitemap-pages.xml, public post HTTP health, missing canonical/description/H1, heading skips, images, ALT text and published Privacy/Terms URLs.

## Run
Merge this PR, then use GitHub > Actions > YYH Blogger daily health audit > Run workflow. Scheduled run is about 08:50 Asia/Kolkata daily. Download the JSON and Markdown artifact from the workflow. Compare against the live site. A failed network request is explicitly reported as unavailable, not a missing Blogger article.

## Live Blogger integration still requires sign-in
To authorize publishing and full blog management, open **ChatGPT Work** and sign into Blogger in its cloud browser, keeping Google credentials out of chat. You can also connect an authorized Blogger API integration, with OAuth credentials secured outside source control.

After connection:
1. Back up the original Blogger content and live XML theme.
2. Inventory all published/draft posts, labels, pages, thumbnail sources, and existing URLs.
3. Fix the approved six-item header and social links without redesigning the site.
4. Repair missing article images, real page metadata, internal links, alt text and breadcrumbs.
5. Create and publish honest Privacy/Terms pages; verify HTTP 200.
6. Run mobile+desktop Lighthouse tests on actual rendered pages.
7. Draft new articles before any public posting. Explicit approval required to publish.
8. Recheck sitemap, robots, Search Console and AdSense compliance.

The repo's Vite routes are **not** Blogger URLs. Avoid importing them blindly or replacing the Blogger site with the AI Studio app.
