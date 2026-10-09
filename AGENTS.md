# WarrantyVault — Notes for the coding agent

I'm building WarrantyVault for my college container technology project. The deadline for the live demo is around the middle of November 2026.

The idea is simple: instead of keeping receipts, warranty cards and repair details in different places, a user should be able to manage them from one account.

## What to build

Use React with Vite and Tailwind for the frontend, Express and Node.js for the backend, and MongoDB with Mongoose for storage. Use JavaScript throughout. Make it work locally and with Docker Compose.

The main flow should be:

1. Register or log in.
2. Add a purchased product and its warranty details.
3. Upload a receipt (image or PDF) and retrieve it later.
4. Read text from receipt images using Tesseract.js. Let the user check and correct the results.
5. Add, update and delete repair/service records.
6. Find products quickly and see which warranties are close to expiring.

The product, receipt and service records must support real CRUD operations. Dashboard numbers and reminder messages should come from the database, not from sample arrays in React.

## How I want the code written

- Keep `frontend/` and `backend/` separate. Put routes, models, controllers and middleware in sensible files.
- Prefer simple, readable code over elaborate patterns. Add comments where logic isn't obvious, especially warranty date calculations and OCR.
- Build one working feature at a time. Check that it works before starting the next feature.
- Use the existing files in this workspace. Do not recreate the project in a nested directory or replace working files unnecessarily.
- Be sensible about UI design: consistent spacing, readable labels, useful feedback, working buttons and usable mobile layouts. Avoid flashy decoration that doesn't help the app.
- When something fails, explain the cause and fix it. Don't hide errors or replace real endpoints with dummy data just to make a page look complete.

## Data and security basics

- Every product belongs to the logged-in user. Check ownership on the server for products, receipts and service history.
- Validate incoming data on the backend. Hash passwords and use JWT stored in an HttpOnly cookie, with appropriate CSRF/Origin checks and safe cookie settings.
- Receipt files must stay private. Save them outside the public frontend directory, limit their type and size, and check ownership before downloads.
- OCR results aren't guaranteed to be correct. The user must be able to edit suggested values before saving them.
- Keep MongoDB data and uploaded receipts in persistent Docker volumes. Never use `docker compose down -v` without asking me.
- Put secrets in environment variables. Commit `.env.example`, not `.env`.

## Project documents

Before implementation, read:

- `docs/PROJECT_SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/ACCEPTANCE_TESTS.md`

They contain the agreed features, routes, work order and test cases. If something is unclear, pick the simplest reasonable solution, document it, and keep moving. Ask first if an action could remove existing data or needs sensitive access.

## Working process

Start by checking the current folder and available tools. Then work through `docs/IMPLEMENTATION_PLAN.md` from top to bottom. After each phase, run the relevant checks, fix problems, mark only verified tasks as complete and make a useful Git commit when possible.

If a command cannot run here, report it as **not tested**. At the end I need a clear README, startup commands, test results, known limitations and a short demo walkthrough. A fully working basic system matters more than extra unfinished features.
