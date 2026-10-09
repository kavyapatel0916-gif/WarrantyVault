# First prompt for Antigravity

I'm working on a college project called **WarrantyVault**, a digital warranty and receipt manager. I need you to help me build the complete application in the folder I have opened. The demonstration is in mid-November 2026, and the main requirement is to show working CRUD operations with a database, Git version history and an application running in Docker.

I've already added my project notes to this folder. Before coding, please read `AGENTS.md` and the files in `docs/`. Use them as the requirements instead of starting with a different project idea. Don't create another project folder inside this one.

Here's what I want to build:

- A React + Vite frontend with Tailwind CSS. Keep the interface clean, practical and mobile-friendly.
- A Node.js/Express backend with MongoDB and Mongoose.
- User registration, login and logout. Each user should only be able to access their own data.
- Product management with full add, view, update and delete options. Store purchase information, warranty duration and expiry date.
- Receipt upload for images and PDFs, with secure download and deletion.
- Receipt scanning using Tesseract.js for images. Show the extracted text and let the user correct the suggested details before using them.
- Repair/service history for each product, with CRUD options.
- A dashboard that shows real product counts, active and expired warranties, and reminders for upcoming expiry dates.
- Search/filter options so the products are easy to find.
- Git commits, Dockerfiles for frontend/backend and a Docker Compose setup for frontend, backend and MongoDB. MongoDB data and uploaded receipts must stay saved if the containers are recreated.

Please build this in stages rather than generating everything at once without checking it. Start by looking at the workspace and available tools. Then:

1. Set up the folders, packages, Git and environment example files.
2. Make sure the React app, Express API and MongoDB can communicate.
3. Add authentication and connect the pages to real endpoints.
4. Build product CRUD and test the warranty date logic.
5. Add secure receipt uploads, image OCR and the correction screen.
6. Add repair records, dashboard statistics, expiry reminders and search.
7. Finish Docker, automated tests, README documentation and a short live-demo guide.

Use the folder structure and suggested API routes in `docs/ARCHITECTURE.md`. Keep the code readable and reasonably organized so I can study it and explain it during my viva. Please don't add unnecessary frameworks, services or features.

A few things matter to me:

- Don't use hardcoded example values in place of a database connection.
- Don't leave buttons that look functional but do nothing.
- Don't make uploaded receipts publicly accessible or allow one user to see another user's records.
- Don't store secrets in Git. Use `.env.example` for setup instructions.
- Don't assume OCR always gets the details right; give the user a chance to review them.
- Don't delete MongoDB or receipt volumes while testing.
- Don't say something is working unless you've actually run the build or test. If Docker or another tool isn't available, tell me what you couldn't verify and give me the exact command to try myself.

After each stage, update the checklist in `docs/IMPLEMENTATION_PLAN.md`, tell me briefly what you completed and tested, and make a meaningful Git commit if possible. Continue with the next stage unless you need my approval for something risky or you're blocked by the environment.

Please start by checking the current workspace, reading the project files and setting up the working application. I want the final result to be a project I can run, demonstrate and understand, not just a design or a report.
