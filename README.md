# 🌌 The Malin Madness — Deployment Guide

A Star Wars Imperial-themed family website with photo/video archives and an interactive calendar.  
Built with **Next.js 14**, **Vercel Postgres**, and **Cloudinary**.

---

## ✅ Prerequisites

Before you start, install these on your computer:

- [Node.js 18+](https://nodejs.org/) — download the LTS version
- [Git](https://git-scm.com/downloads)
- [Vercel CLI](https://vercel.com/docs/cli) — install by running:
  ```bash
  npm install -g vercel
  ```

---

## STEP 1 — Set up Cloudinary (media storage)

1. Go to [cloudinary.com](https://cloudinary.com) and create a **free account**
2. From your **Dashboard**, copy these three values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Keep these handy — you'll need them in Step 3

---

## STEP 2 — Deploy to Vercel & add Postgres

### 2a. Push to GitHub
```bash
# Inside the malin-madness folder:
git init
git add .
git commit -m "Initial commit — The Malin Madness"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/malin-madness.git
git push -u origin main
```

### 2b. Import to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in (you can sign in with GitHub)
2. Click **"Add New Project"**
3. Import your `malin-madness` GitHub repository
4. Click **Deploy** (it will fail — that's okay, we need to add env vars next)

### 2c. Add Vercel Postgres
1. In your Vercel project dashboard, go to **Storage** tab
2. Click **"Create Database"** → choose **Postgres**
3. Name it `malin-madness-db`, click **Create**
4. Vercel will automatically inject all `POSTGRES_*` environment variables into your project

---

## STEP 3 — Add environment variables

In your Vercel project dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add these variables (for **Production**, **Preview**, and **Development**):

| Variable | Value |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Your cloud name from Step 1 |
| `CLOUDINARY_API_KEY` | Your API key from Step 1 |
| `CLOUDINARY_API_SECRET` | Your API secret from Step 1 |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same as `CLOUDINARY_CLOUD_NAME` |
| `FAMILY_PASSWORD` | The shared password your family will use to log in |

> The `POSTGRES_*` variables are added automatically when you create the database.

---

## STEP 4 — Run the database migration

This creates the `media` and `events` tables in your Postgres database.

### Option A — via Vercel CLI (easiest)
```bash
# In the malin-madness folder:
vercel login
vercel link          # links your local folder to the Vercel project
vercel env pull      # downloads env vars to .env.local
npm install
npm run db:migrate
```

### Option B — via Vercel dashboard
1. Go to your Postgres database in the **Storage** tab
2. Click **"Query"**
3. Run these two SQL statements:

```sql
CREATE TABLE IF NOT EXISTS media (
  id          SERIAL PRIMARY KEY,
  public_id   TEXT NOT NULL UNIQUE,
  url         TEXT NOT NULL,
  thumb_url   TEXT NOT NULL,
  name        TEXT NOT NULL,
  media_type  TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  width       INTEGER,
  height      INTEGER,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  event_date DATE NOT NULL,
  type       TEXT NOT NULL CHECK (type IN ('birthday', 'gathering', 'vacation')),
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## STEP 5 — Redeploy

After adding environment variables, trigger a fresh deployment:
```bash
vercel --prod
```
Or push any commit to GitHub — Vercel will auto-deploy.

---

## STEP 6 — Run locally (optional)

```bash
npm install
vercel env pull     # pulls env vars from Vercel into .env.local
npm run dev         # starts at http://localhost:3000
```

---

## 📁 Project Structure

```
malin-madness/
├── app/
│   ├── page.js              # Home / Holonet page
│   ├── gallery/page.js      # Photo & video archives
│   ├── calendar/page.js     # Interactive family calendar
│   ├── api/
│   │   ├── media/route.js         # GET all media, POST upload
│   │   ├── media/[id]/route.js    # DELETE single media item
│   │   ├── events/route.js        # GET events, POST new event
│   │   └── events/[id]/route.js   # PUT update, DELETE event
│   ├── layout.js
│   └── globals.css
├── components/
│   ├── Nav.js               # Top nav + mobile bottom tab bar
│   ├── Starfield.js         # Animated star background
│   ├── ImperialEmblem.js    # SVG Imperial logo
│   └── StatusBar.js         # Bottom status bar
├── lib/
│   ├── cloudinary.js        # Cloudinary client
│   ├── db.js                # Vercel Postgres client
│   └── migrate.js           # Database migration script
├── .env.example             # Template for environment variables
├── vercel.json
└── README.md
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | Vercel Postgres (Neon) |
| Media Storage | Cloudinary |
| Hosting | Vercel |
| Styling | CSS-in-JS (inline + style tags) |

---

## 🆘 Troubleshooting

**Build fails with missing env vars**  
→ Make sure all variables in Step 3 are added in Vercel dashboard, then redeploy.

**Uploads fail**  
→ Double-check your Cloudinary API key and secret are correct.

**Database errors**  
→ Make sure you ran the migration (Step 4) before using the site.

**`vercel env pull` not working**  
→ Run `vercel login` first, then `vercel link` inside the project folder.
