# WarrantyVault — Project Requirements

## 1. What problem does it solve?

People usually keep purchase bills in their gallery, email or paper files. Months later, it's difficult to find the receipt or remember whether the product is still under warranty. WarrantyVault gives each user a place to save those details and check them when needed.

This is a college project, so the scope should stay manageable. I want a complete working application rather than too many half-finished features.

## 2. Who will use it?

Anyone who owns electronics, appliances or other products with a warranty. Each user manages their own collection of products. There is no need for an admin panel or business accounts in the first version.

## 3. Main features

### Account

- Sign up using name, email and password.
- Log in, stay signed in while the session is valid and log out.
- Users must only see their own products, receipts and repair records.

### Products

- Add, view, edit and delete a product.
- Store product name, brand, category, purchase date, warranty period, price and optional model/serial number, seller and notes.
- Show warranty end date automatically and let the user search, filter and sort products.
- Ask for confirmation before deletion; delete linked receipts and repair records too.

### Receipts

- Upload more than one receipt per product.
- Accept JPEG, PNG, WEBP and PDF, maximum 5 MB per file.
- View/download/delete uploaded files after signing in.
- Run OCR on supported images. Show the original extracted text and, when possible, suggested values such as seller, date and total.
- Always allow manual corrections. A PDF must still be stored and downloadable even if OCR doesn't work on scanned PDF pages.

### Repair/service history

- Add a repair or service visit with date, description, cost, provider and status.
- View the history for a product, edit incorrect entries and delete entries.

### Dashboard and reminders

- Total products, active warranties, expiring soon and expired products.
- A list of upcoming expiry dates.
- Show in-app reminders at 30, 15 and 7 days before expiry, plus a general list of products expiring within 30 days. Email notifications are optional, not part of the basic release.
- Make sure the numbers come from actual MongoDB records.

## 4. How warranty dates should work

Warranty duration is stored as a number of calendar months, not 30 days per month.

For example:

- Bought on 31 January 2025 with one month of warranty → 28 February 2025.
- Bought on 31 January 2024 with one month of warranty → 29 February 2024.
- A product expiring today is still covered today.
- An expiry date before today is `expired`.
- An expiry date from today through 30 days ahead is `expiring`.
- Later dates are `active`.

Use date-only values consistently so time zones don't change the displayed date.

## 5. Technical choices

| Part | Choice |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Login | Password hashing + JWT HttpOnly cookie |
| Receipt uploads | Multer with private file storage |
| Receipt text reading | Tesseract.js for images |
| Code history | Git; GitHub once a remote is available |
| Deployment | Dockerfiles + Docker Compose |

Use JavaScript rather than TypeScript for this version, so it stays straightforward to explain in the viva.

## 6. Priorities

**Finish first:** login, full product CRUD, receipt upload/download/delete, service record CRUD, dashboard, search, date calculations, Docker with persistent storage, Git history, README and basic tests.

**Then add:** image OCR with editable results, a nicer dashboard, clearer reminders and better mobile layout.

**Only with extra time:** email reminders, PDF OCR, export to PDF, charts or other extras. Don't sacrifice the main app to build these.

## 7. Out of scope

This app won't verify warranties against manufacturer databases or submit warranty claims. It won't process payments, sell warranty plans or promise perfect receipt recognition.

## 8. When is the project complete?

I can start it using Docker, register, log in, add and edit a product, upload and retrieve a receipt, use OCR on an example image, manage repair records, check a reminder, delete a test product and show that the data survives container recreation.
