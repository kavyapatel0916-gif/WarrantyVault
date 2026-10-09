# WarrantyVault — Tests and Demo Checklist

I'll use this list to check that the project actually works. Antigravity should help run these tests, but I also want to understand and repeat the steps myself before submitting.

Record each result as **Passed**, **Failed** or **Not tested**. "Not tested" is not the same as "Passed".

## Main checks

| No. | What to test | Expected behavior |
|---|---|---|
| 1 | Open the project | Frontend, API and database start correctly |
| 2 | Sign up | New user can create an account |
| 3 | Try an existing email | Duplicate registration is rejected |
| 4 | Wrong password | Login fails with a useful message |
| 5 | Open products while logged out | Private API refuses access |
| 6 | Add product | Product is saved in MongoDB |
| 7 | View/search/filter | Only that user's products appear |
| 8 | Edit product | Saved details and expiry date update |
| 9 | Delete product | Product and related records/files are removed |
| 10 | Use another user's product ID | Access is denied |
| 11 | Upload JPG/PNG/PDF receipt | File can be listed and downloaded |
| 12 | Upload unsupported or oversized file | File is rejected safely |
| 13 | Try another user's receipt ID | Download/OCR is denied |
| 14 | Run image OCR | Text is extracted or a clear error is shown |
| 15 | Review OCR result | Extracted fields can be corrected before saving |
| 16 | Add/edit/delete repair | Changes are saved in MongoDB |
| 17 | Warranty: 31 Jan 2025 + 1 month | End date is 28 Feb 2025 |
| 18 | Warranty: 31 Jan 2024 + 1 month | End date is 29 Feb 2024 |
| 19 | Warranty expires today | Product is still marked expiring |
| 20 | Dashboard totals | Numbers match actual user records |
| 21 | Upcoming warranty | Correct dates and reminder labels appear |
| 22 | Restart Docker containers | Product and receipt files remain available |
| 23 | Review Git files | No `.env`, personal receipts or `node_modules` committed |
| 24 | Refresh a nested React route in Docker | Nginx serves the page correctly |
| 25 | Follow README setup on a clean machine | Project starts using documented steps |

## Automated testing to add

- Backend tests for login errors, product CRUD, access from another account, bad uploads and repair CRUD.
- Unit tests for warranty calculations around month ends and leap years.
- A small number of frontend tests for forms, private pages and the OCR review screen.
- `npm run build` for the frontend and at least one successful Docker startup check.

## Live demonstration (about 5–8 minutes)

1. Show the Git project and a few meaningful commits.
2. Run or show `docker compose ps` and open the app in a browser.
3. Register/login using a demo account.
4. Add a laptop or phone with a purchase date and warranty duration.
5. Search for the item, edit it and show that the warranty end date changes.
6. Upload a sample receipt. Run OCR, correct a field and save.
7. Add a repair record, edit it and show the timeline.
8. Open the dashboard and show an expiring warranty or test fixture.
9. Delete a test item to demonstrate deletion.
10. Restart the containers **without deleting volumes** and show that saved products and receipts are still there.
11. Explain the three Docker services and which volume stores which data.

Prepare a **fake sample receipt** with made-up item names and prices for the demo, rather than using anyone's actual invoice. Do a complete rehearsal before submission.

## Handover information I need

When Antigravity finishes, ask it to show me:

- URL/port for the site and the exact `docker compose up --build` command.
- How `.env` is created from `.env.example`.
- Commands for running tests and their real outcomes.
- Important folders and MongoDB collections.
- A short list of known bugs or features not finished.
- How to create demo users without putting passwords in the repository.
