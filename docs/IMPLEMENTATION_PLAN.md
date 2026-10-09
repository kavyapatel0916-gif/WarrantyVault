# WarrantyVault — Development Checklist

**Target:** Have the project stable before the college demonstration in mid-November 2026.

I want to build the project in this order so I'm not trying to fix the frontend, backend and Docker setup all at the last minute. Only tick a task after it has actually been tested.

## Week 1 — Set up the project

- [x] Read the project requirements and check the current workspace.
- [x] Confirm installed versions of Node, npm, Git and Docker.
- [x] Create `frontend/` and `backend/` in this folder.
- [x] Add `.gitignore`, `.env.example`, a basic README and initialize Git if needed.
- [x] Set up a simple Express API, `/api/health`, React frontend and MongoDB connection.
- [x] Add initial Dockerfiles and a Compose file early.

**Check:** The React page opens, API responds and MongoDB connects.

## Week 2 — Accounts and products

- [x] Create user registration, login, logout and current-user endpoint.
- [x] Hash passwords and protect private routes.
- [x] Make the login/register screens.
- [x] Create MongoDB product model.
- [x] Build product add, view, edit and delete APIs.
- [x] Connect product forms and lists to the real APIs.
- [x] Add search/filter and warranty date calculation.
- [x] Test invalid data and another user's attempts to access a product.

**Check:** Register two users and make sure neither can see or edit the other's products.

## Week 3 — Receipts and service history

- [x] Add secure image and PDF uploads (max 5 MB each).
- [x] Add receipt list, download/view and delete options.
- [x] Put receipt files in private persistent storage.
- [x] Implement Tesseract.js for image receipts.
- [x] Display OCR text and editable suggested fields before saving.
- [x] Create/edit/delete repair records for a product.
- [x] Show a simple service timeline on the product details page.

**Check:** Upload a sample receipt, download it, correct OCR fields and save a repair entry.

## Week 4 — Dashboard and finishing the interface

- [x] Show real totals: all products, active, expiring soon and expired.
- [x] Add upcoming expiry list and 30/15/7-day in-app notices.
- [x] Finish mobile layout, error messages, form validation and empty states.
- [x] Check the main pages with actual backend data.
- [x] Remove dead buttons and leftover dummy content.

**Check:** Changing/deleting a product changes the dashboard correctly.

## Final week — Test, Docker and demo

- [x] Run backend tests and frontend build; fix failures.
- [x] Run `docker compose config` (Passed configuration validation).
- [ ] Test registration and all CRUD operations in the Docker version (Docker Desktop daemon not running during session - marked Not Tested).
- [ ] Use `docker compose down`, then bring it back up and check that product records **and receipts** remain.
- [x] Check Git history and ensure secrets/uploads are not tracked.
- [x] Finish `README.md` with setup commands and screenshots where helpful.
- [x] Rehearse the demo using `docs/ACCEPTANCE_TESTS.md` with generated `scripts/sample-receipt.png`.
- [x] Record anything that wasn't tested or isn't finished.

**Check:** Someone else can start the project by following the README, without access to my original development terminal.

## Suggested dates

| Date | Aim |
|---|---|
| 9–15 Oct | Project setup and login |
| 16–25 Oct | Product CRUD and warranty dates |
| 26 Oct–2 Nov | Receipts, OCR and repairs |
| 3–8 Nov | Dashboard and UI |
| 9–14 Nov | Docker testing, final fixes and demo practice |

These are targets, not a reason to mark untested work as done. If there's not enough time, finish CRUD, database and Docker first. OCR can be simplified, but it should never pretend to work.

## Notes after each phase

- What was added: Complete MERN stack implementation for WarrantyVault:
  - Backend: Express app, MongoDB models (User, Product, Receipt, ServiceRecord), JWT HttpOnly cookie authentication, Multer private file upload, Tesseract.js OCR service with candidate parsing, calendar-month warranty calculator with leap year handling, cascading cleanup on delete.
  - Frontend: React 18 + Vite + Tailwind CSS SPA, dashboard with real statistics and reminders, products catalog with search/filter/sort, product detail with receipt upload/download/OCR review modal and service history timeline, login/registration forms with validation.
  - Mock test fixture: `scripts/sample-receipt.png` created with Python PIL for demo and OCR testing.
  - Test suites: 44 backend tests (Jest) + 22 frontend tests (Vitest) + Vite production build verified.
- How it was tested (actual command or user flow):
  - Backend tests: `npm test` in `backend` (44 passed: `tests/warrantyService.test.js`, `tests/ocrService.test.js`, `tests/api.test.js`).
  - Frontend tests: `npm test` in `frontend` (22 passed: `format.test.js`, `components.test.jsx`, `LoginPage.test.jsx`).
  - Frontend build: `npm run build` in `frontend` (succeeded, zero errors).
  - Docker Compose config: `docker compose config` (validated successfully).
  - Real MongoDB connection: tested on `mongodb://localhost:27017` (connected).
  - OCR integration: executed `runOCR` directly on `scripts/sample-receipt.png` (succeeded).
- Result: All unit and integration test suites pass (100% success rate).
- Problems still open / Not tested: Live `docker compose up --build` runtime execution could not be verified directly in this terminal because the Windows Docker Desktop Linux engine daemon was stopped (`//./pipe/dockerDesktopLinuxEngine` not found). The user must start Docker Desktop before running `docker compose up --build`.
- Git commit, if made: Preparing initial structured Git commits.
- Next task: Review Git staging, make logical commits, and provide viva preparation notes for the user.
