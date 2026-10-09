# WarrantyVault — Structure and Database Notes

This is the folder layout I would like to follow. It can be adjusted slightly while building, but keep it easy to navigate and explain during the demo.

## Application flow

```text
Browser
  |
  v
React app (Vite development server / Nginx in Docker)
  |
  | /api requests
  v
Express API
  |---------------------|
  v                     v
MongoDB               Private receipt files
(product details)     (Docker volume)
  |
  +-- Tesseract.js runs on image receipts through the backend
```

In Docker, Nginx should serve the built React app and forward `/api` requests to Express. The database should not be exposed publicly. In development, Vite can proxy `/api` to the backend.

## Folder layout once coding starts

```text
WarrantyVault/
├── AGENTS.md
├── README_START_HERE.md
├── .agents/rules/
├── docs/
├── prompts/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

Don't create files that aren't being used. Organize components once there's a real reason to split them.

## MongoDB collections

### Users

`name`, `email` (unique, lowercase), `passwordHash`, timestamps.

Never return the password hash in an API response.

### Products

`ownerId`, `name`, `brand`, `model`, `category`, `serialNumber`, `seller`, `purchaseDate`, `warrantyMonths`, `warrantyExpiryDate`, `priceInPaise`, `currency` (`INR`), `notes`, timestamps.

Required fields: name, brand, category, purchase date, warranty months and price. The rest can be optional. Calculate expiry on the server. Store monetary values in paise to avoid floating-point rounding errors.

### Receipts

`ownerId`, `productId`, `originalName`, `storedName`, `mimeType`, `sizeBytes`, `storagePath`, `ocrRawText`, `ocrStatus`, `ocrCandidates`, timestamps.

Save the actual file in a Docker volume, not in MongoDB or the React public folder. Only the owner can download it.

### Service records

`ownerId`, `productId`, `serviceDate`, `provider`, `description`, `costInPaise`, `status`, `notes`, timestamps.

Before creating a receipt or repair, check that the parent product belongs to the signed-in user. All queries that read or change data should check ownership too.

## Suggested API routes

| Method | Route | Use |
|---|---|---|
| GET | `/api/health` | Check the API |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Get current account |
| GET | `/api/products` | List/search/filter products |
| POST | `/api/products` | Add product |
| GET | `/api/products/:id` | Product details |
| PATCH | `/api/products/:id` | Edit product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/products/:id/receipts` | List receipts |
| POST | `/api/products/:id/receipts` | Upload receipt |
| GET | `/api/receipts/:id/download` | Download/view receipt |
| POST | `/api/receipts/:id/ocr` | Read text from image |
| DELETE | `/api/receipts/:id` | Delete receipt |
| GET | `/api/products/:id/services` | List service records |
| POST | `/api/products/:id/services` | Add service record |
| PATCH | `/api/services/:id` | Update service record |
| DELETE | `/api/services/:id` | Delete service record |
| GET | `/api/dashboard/summary` | Real statistics and expiry list |

Use a consistent JSON response format. Return helpful errors and correct HTTP status codes. The exact route names can change if needed, but document any changes in `README.md`.

## Warranty logic

Create one backend utility for the warranty end date and status. Test month-end dates, leap years, expiry today and products that have already expired. The frontend should display results from the API rather than implement its own competing calculation.

## Docker plan

Use three Compose services:

1. `frontend` — build React and serve it through Nginx; expose an easy-to-remember port such as `8080`.
2. `backend` — Express listening on an internal port such as `5000`; connect to `mongo` using its Compose service name.
3. `mongo` — database available to the backend on the Compose network.

Give MongoDB and uploaded receipts their own named volumes. Add database connection retry logic, `.dockerignore` files and an `.env.example` showing the variables to configure. Don't commit actual credentials.

## Git

Use commits that describe real work, such as `Set up frontend and API`, `Add product CRUD`, `Add receipt uploads`, `Add warranty calculations`, `Add Docker Compose` and `Write demo instructions`. If no GitHub repository is connected yet, commit locally and explain how to push later. Don't push without permission.
