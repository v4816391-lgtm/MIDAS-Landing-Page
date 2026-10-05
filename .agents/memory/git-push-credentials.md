---
name: Git push credentials
description: Safe use of Replit's GIT_URL secret for authenticated GitHub pushes.
---

Replit's `GIT_URL` secret must be a complete authenticated HTTPS remote URL (`https://<username>:<token>@github.com/<owner>/<repository>.git`), not a token by itself.

**Why:** `git push "$GIT_URL"` treats the value as the remote. When the value is only a token, Git may echo it in an error message.

**How to apply:** Ask for credentials only through Replit's secure secret flow. Never print or inspect the value. If a credential appears in command output, tell the user to revoke it and replace the secret before retrying.
