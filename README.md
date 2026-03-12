# StudyMind 🎓
University AI Study Assistant — React + Node.js + Supabase

## Project Structure
```
studymind/
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── main.jsx          # Entry point
│   │   ├── App.jsx           # Router
│   │   ├── index.css         # Tailwind + global styles
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   └── components/
│   │       ├── Sidebar.jsx
│   │       ├── ChatMessage.jsx
│   │       └── TabImportModal.jsx
│   ├── index.html            # Vite HTML shell (not a page)
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                  # Node.js + Express
│   ├── server.js             # Entry point
│   ├── lib/
│   │   └── supabase.js
│   ├── middleware/
│   │   └── auth.js           # JWT guard
│   ├── routes/
│   │   ├── auth.js           # POST /api/auth/login|register
│   │   ├── chat.js           # POST /api/chat/ask
│   │   └── history.js        # GET/DELETE /api/history
│   ├── .env.example
│   └── package.json
│
└── supabase_schema.sql       # Run in Supabase SQL Editor
```

---

## Setup

### 1 — Supabase
1. Create project at https://supabase.com
2. SQL Editor → paste `supabase_schema.sql` → Run
3. Settings → API → copy **Project URL** + **service_role key**

### 2 — Backend
```bash
cd backend
cp .env.example .env       # fill in all values
npm install
npm run dev                # http://localhost:5000
```

`.env` values:
| Key | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | https://console.anthropic.com |
| `SUPABASE_URL` | Supabase → Settings → API |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API (service_role) |
| `JWT_SECRET` | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

### 3 — Frontend
```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

### 4 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USER/studymind.git
git push -u origin main
```

### 5 — Deploy to Vercel
- **Backend**: `cd backend && npx vercel` → add env vars in Vercel dashboard
- **Frontend**: `cd frontend && npx vercel` → set `VITE_API_URL` to your backend URL
