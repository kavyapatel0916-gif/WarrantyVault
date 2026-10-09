---
trigger: model_decision
description: "Use when working on authentication, API routes, database models, file uploads, security or Docker."
---
# Backend notes

The backend stores private warranty and receipt details, so protect user data properly.

- Validate request inputs and handle missing/invalid IDs without server crashes.
- Check the signed-in user's ownership before reading, editing or deleting any product, receipt or service record.
- Hash passwords. Use secure HttpOnly authentication cookies and protect state-changing requests against cross-site attacks.
- Limit login attempts and avoid returning stack traces or secrets to the browser.
- Accept only supported receipt files (JPEG, PNG, WEBP and PDF, up to 5 MB). Check actual file content, not just its name or declared MIME type.
- Store uploaded files outside the publicly served frontend. Only stream them after an ownership check.
- Clean up linked files and repair records when deleting a product.
- Add a health endpoint and handle MongoDB not being ready immediately at startup.
- Use persistent volumes for both MongoDB and uploaded receipts. Do not delete volumes without approval.
- Add tests for unauthorized access, file validation, deletion and tricky warranty dates.
