# RailYatra — Frontend (Client-Side)

> **Branch:** `frontend`  
> **Parent:** `main`

This branch contains **only the client-side code** for the RailYatra Smart Indian Railway Portal. All server-side logic lives in the [`backend`](https://github.com/nivetha-87676/train-portal-enchanced/tree/backend) branch.

---

## 📁 Directory Structure

```
frontend/
├── index.html          # Main HTML5 page — all sections (Home, Booking, Tracking, API, About, Auth)
├── css/
│   └── style.css       # Complete design system — 6 themes, responsive layout, animations
├── js/
│   └── script.js       # Client app logic — SPA routing, form handling, Leaflet map, API fetch calls
├── assets/             # Static images, icons, and media files
│   └── .gitkeep
├── vercel.json         # Vercel deployment configuration (headers, caching)
├── package.json        # Frontend dependencies & dev server scripts
├── .gitignore          # Excludes node_modules, dist, build artifacts, .env
└── README.md           # This file
```

---

## 🔑 Key Files

| File | Purpose |
|:---|:---|
| `index.html` | Single-page app with 6 sections: Home, Book Ticket, Live Tracking, API Data, About, Sign Up/Login |
| `css/style.css` | CSS custom properties theming system (Classic Red, Ocean Blue, Forest Green, Royal Purple, Sunset Orange, Dark Mode), responsive media queries, keyframe animations |
| `js/script.js` | Client-side JavaScript: SPA page navigation, ticket booking form with validation, Leaflet.js live train map, PNR status checker, live clock, theme switcher, auth state management via localStorage, fetch API demos |

---

## 🚀 How to Run

### Quick Start (No Install Required)
```bash
# Open index.html directly in a browser
start index.html
```

### Dev Server with Live Reload
```bash
npm run dev
# → Opens http://localhost:8080 with live reload
```

### Alternative Servers
```bash
# Python
python -m http.server 8080

# npx serve
npx serve . -l 8080
```

---

## ⚡ Deploy to Vercel

### Option 1: 1-Click Git Import (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Select your GitHub repository: **`nivetha-87676/train-portal-enchanced`**.
3. Under **Branch**, select `frontend` (or `main`).
4. Framework Preset: Leave as **Other** (Static site).
5. Click **Deploy**. Your app will be live with an SSL HTTPS link in seconds!

### Option 2: Deploy using Vercel CLI
```bash
# In the project root on the frontend branch:
npx vercel
# Follow the prompt to link or deploy, then run for production:
npx vercel --prod
```

---

## 🔗 API Integration

This frontend communicates with the backend API at `http://localhost:5000/api/`.

| Frontend Action | Backend Endpoint |
|:---|:---|
| Search trains | `GET /api/trains/search?from=NDLS&to=BCT` |
| Book ticket | `POST /api/bookings` |
| Check PNR | `GET /api/bookings/pnr/:pnr` |
| Track train | `GET /api/tracking/:trainNo` |
| Register user | `POST /api/auth/register` |
| Login user | `POST /api/auth/login` |

> The frontend currently also works standalone with simulated data (no backend required).

---

## 🔀 Branch Merge Workflow

```
main ────────────────────────────────────────→
  ├── frontend (this branch) ── PR → merge →
  └── backend ──────────────── PR → merge →
```

1. Create a **Pull Request** from `frontend` → `main`
2. Request code review from team
3. After approval, **merge** into `main`
4. Final `main` branch will contain both frontend and backend as a full-stack monorepo

---

## 👤 Author
**Nivetha** — [`nivetha-87676`](https://github.com/nivetha-87676)