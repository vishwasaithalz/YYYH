# YinYangYoHackers Blogger draft automation

This manual-only workflow creates a private Blogger draft, never publishes a public post. It does not edit or delete your existing posts or theme.

## Connect securely

1. Enable the official Google Blogger API v3 and authorize OAuth scope https://www.googleapis.com/auth/blogger.
2. Save four values as encrypted GitHub Actions secrets: BLOGGER_BLOG_ID, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN.
3. Never place passwords, OAuth refresh tokens, cookies, API credentials or recovery codes in chat, GitHub commits, drafts or workflow logs.
4. Optionally configure approvals on the GitHub Actions environment blogger-drafts, if your plan supports environment reviewers.

## Preparing a draft

Create a JSON document in drafts/, with:
- title: actual editorial title
- content_html: researched article HTML with at least 400 readable words and a genuine public HTTPS cover image
- labels: array of one or more real Blogger labels

All image elements must include src, alt, width and height. Verify original image licensing, technical claims, citations, existing internal links and content quality.

## Execution

1. Open GitHub > Actions > YYH Blogger create draft (manual only).
2. Select a drafts/article.json path and leave create_draft unchecked for validation.
3. When reviewed, check create_draft to create a PRIVATE draft; this will not make the article public.
4. Review in Blogger and publish separately only after explicit approval.

This workflow cannot run authenticated Blogger actions until your own OAuth credentials are connected. Alternatively, open ChatGPT Work and sign into Blogger in its cloud browser, without sharing a password in chat.

This draft system is separate from the existing Blogger read-only daily health audit and from the YYYH React/Vite application.
