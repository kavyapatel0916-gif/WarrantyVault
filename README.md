# WarrantyVault 🛡️

**Digital Warranty & Receipt Management System** — A full-stack MERN web application for tracking product warranties, uploading receipts, running OCR, and recording repair history.

> **College Docker project submission — mid-November 2026**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 + Tailwind CSS 3 + React Router 6 |
| Backend | Node.js 24 LTS + Express 4 + Mongoose 8 + Zod |
| Database | MongoDB 7 (Docker persistent volume) |
| Auth | JWT via HttpOnly cookie + bcryptjs |
| OCR | Tesseract.js (raster image receipts) |
| Infrastructure | Docker + Docker Compose + Nginx |
| Testing | Jest (backend) + Vitest (frontend) |

---

## Quick Start

### Prerequisites
- **Docker Desktop** installed and running
- Git

### 1. Clone and Configure

```bash
git clone <your-repo-url>
cd WarrantyVault
cp .env.example .env
```

**Edit `.env` and change `JWT_SECRET` to a long random string:**
```bash
# Generate a secure secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Start with Docker Compose

```bash
docker compose up --build
```

This starts:
- **MongoDB** on internal Docker network (port 27017, internal only)
- **Backend API** on internal Docker network (port 5000, internal only)
- **Frontend + Nginx** on **http://localhost:8080** (your browser)

Wait for all services to be healthy (~30-60 seconds on first build).

### 3. Open App

Visit **http://localhost:8080** — register a new account and start adding products.

### Stop and Restart (without losing data)

```bash
# Stop containers (data is preserved in Docker volumes)
docker compose down

# Restart and rebuild
docker compose up --build
```

> ⚠️ **Never run `docker compose down -v`** — this deletes all your data volumes!

---

## Development Mode (without Docker)

### Prerequisites
- Node.js 18+ 
- MongoDB running locally on port 27017

### Backend

```bash
cd backend
npm install
# Ensure .env exists with MONGO_URI=mongodb://localhost:27017/warrantyvault
npm run dev    # Starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev    # Starts on http://localhost:5173 (proxies /api to localhost:5000)
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values:

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | **Required** | At least 32 random characters. Generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `MONGO_URI` | Required | MongoDB connection string. In Docker: `mongodb://mongo:27017/warrantyvault` |
| `NODE_ENV` | Optional | `development` or `production` |
| `PORT` | Optional | Backend port (default: 5000) |
| `COOKIE_SECURE` | Optional | `true` for HTTPS deployments |
| `MAX_FILE_SIZE` | Optional | Max upload size in bytes (default: 5242880 = 5MB) |
| `UPLOAD_DIR` | Optional | Upload directory path inside container |
| `CORS_ORIGIN` | Optional | Allowed origin for CORS (dev only) |

---

## Architecture

```
Browser
  │
  └─► Nginx (port 8080 → 80)
        ├─ Serves React static files (/ routes)
        └─ Reverse proxies /api/* → backend:5000
                                        │
                                        ├─► Express API
                                        │     ├─ JWT auth (HttpOnly cookie)
                                        │     ├─ Mongoose models
                                        │     ├─ Multer file uploads
                                        │     └─ Tesseract.js OCR
                                        │
                                        └─► MongoDB (mongo_data volume)
                                              Receipts (receipt_uploads volume)
```

---

## API Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | Yes | Logout |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/products` | Yes | List products (search/filter/sort) |
| POST | `/api/products` | Yes | Create product |
| GET | `/api/products/:id` | Yes | Get product |
| PATCH | `/api/products/:id` | Yes | Update product |
| DELETE | `/api/products/:id` | Yes | Delete product + children |
| GET | `/api/products/:id/receipts` | Yes | List receipts |
| POST | `/api/products/:id/receipts` | Yes | Upload receipt |
| GET | `/api/receipts/:id/download` | Yes | Download receipt |
| POST | `/api/receipts/:id/ocr` | Yes | Run OCR |
| DELETE | `/api/receipts/:id` | Yes | Delete receipt |
| GET | `/api/products/:id/services` | Yes | List service records |
| POST | `/api/products/:id/services` | Yes | Create service record |
| PATCH | `/api/services/:id` | Yes | Update service record |
| DELETE | `/api/services/:id` | Yes | Delete service record |
| GET | `/api/dashboard/summary` | Yes | Dashboard counts + upcoming |

---

## Running Tests

### Backend tests

```bash
cd backend
npm test
```

Expected: **44 tests pass** across 3 test suites (`warrantyService.test.js`, `ocrService.test.js`, `api.test.js`).

### Frontend tests

```bash
cd frontend
npm test
```

Expected: **22 tests pass** across 3 test suites (`format.test.js`, `components.test.jsx`, `LoginPage.test.jsx`).

---

## Docker Commands Reference

```bash
# Build and start
docker compose up --build

# View service status
docker compose ps

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Stop (preserves data volumes)
docker compose down

# DANGER: This deletes all data - only do for a clean reset
# docker compose down -v   ← DO NOT RUN DURING DEMO
```

---

## Features

### ✅ Implemented (P0 MVP)
- User registration and login with secure JWT HttpOnly cookies
- Product CRUD with all required fields
- Automatic warranty expiry date calculation (calendar months, end-of-month clamping)
- Warranty status: Active / Expiring (≤30 days) / Expired
- Search by name/brand, filter by category/status, sort by expiry
- Secure receipt upload (JPEG, PNG, WEBP, PDF - max 5 MB)
- Authenticated receipt download (files never publicly accessible)
- Tesseract.js image OCR with editable review step
- Service/repair history CRUD
- Live dashboard with real MongoDB data
- In-app reminders for 30/15/7 days before expiry
- Docker Compose deployment with persistent volumes
- Data survives container recreation

### ✅ P1 Differentiators
- OCR review UI with explicit uncertainty warnings
- Responsive mobile layout (sidebar/hamburger menu)
- Status badges, reminder banners, empty states
- Polished SaaS-style design with Tailwind CSS

### ❌ Not Implemented (P2 / Out of Scope)
- Email notifications
- OCR for scanned PDFs (PDF upload/download works; OCR on scanned PDF pages not supported)
- PDF warranty summaries
- Charts and analytics
- Multi-user admin panel

---

## Known Limitations

1. **OCR accuracy**: Tesseract.js extracts text imperfectly. The review step explicitly marks all candidates as uncertain. Always verify extracted values before saving.
2. **PDF OCR**: PDF documents can be uploaded and downloaded. Text extraction from PDFs (especially scanned ones) is not supported in this MVP.
3. **Date timezone**: All dates are stored as YYYY-MM-DD UTC strings. The UI uses the browser's local display formatting, but all comparisons are UTC-based.
4. **No email notifications**: In-app reminders only (30/15/7 day banners on dashboard and product detail).
5. **Single-user application**: No admin panel or multi-tenant support.

---

## Live Demo Walkthrough (~8 minutes)

1. `git log --oneline --max-count=10` — show commit history
2. `docker compose ps` — show running containers
3. Open http://localhost:8080
4. Register demo user → see empty dashboard
5. Add a product (e.g. "Samsung Galaxy S24" - Electronics - 12 months)
6. Show expiry date calculation on product detail
7. Search/filter products list
8. Upload `scripts/sample-receipt.png` → run OCR → review candidates → close
9. Add a service/repair record → edit it
10. Add second product with near-expiry date (set warrantyMonths=0) → show "Expiring" badge + reminder
11. Delete a product → confirm removal
12. `docker compose down` then `docker compose up --build` — show data persists
13. Show Dockerfiles, docker-compose.yml, explain architecture

---

## Data Persistence Proof

```bash
# Create data, then:
docker compose down
# Volumes are NOT removed (no -v flag)

docker compose up --build
# Data is still there
```

Named volumes used:
- `mongo_data` — all MongoDB documents
- `receipt_uploads` — uploaded receipt files

---

## Security Notes

- Passwords hashed with bcrypt (12 rounds)
- JWT in HttpOnly, SameSite=Lax cookies
- All product/receipt/service queries filter by authenticated `ownerId`
- Receipt files served through authenticated endpoint only (no public static URL)
- File type validated by MIME type + extension
- Rate limiting on auth endpoints (10 req/15 min)
- Helmet.js security headers
- Conservative CORS (credentials + specific origin)
- Never commit `.env`, uploads, or `node_modules`
