# Fusion Forge Creation

> Official frontend static website for **Fusion Forge Creation** — Where Ideas Fuse with Technology.

This project is a **Frontend-Only Single Page Application (SPA)** built with React, TypeScript, Vite, and Tailwind CSS. It is configured for direct static hosting on **Hostinger (`public_html`)** with Apache / LiteSpeed SPA rewrite support.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 📦 Production Build

Running the build command:

```bash
npm run build
```

generates the production-ready static files in the `dist/` directory.

The build output includes:
- `dist/index.html` (Main entry point)
- `dist/assets/` (Optimized CSS, JavaScript, and fonts)
- `dist/.htaccess` (LiteSpeed & Apache SPA rewrite rules and static asset caching)
- `dist/logo.svg`, `dist/favicon.svg`, `dist/banner.svg`

---

## 🌐 Deploying to Hostinger

### Method 1: Hostinger File Manager / FTP (Recommended & Fastest)

1. Run the production build locally:
   ```bash
   npm install
   npm run build
   ```
2. Log in to your **Hostinger hPanel**.
3. Go to **Websites** > **Manage** > **File Manager**.
4. Open the `public_html/` directory.
5. Upload all the **contents** of the generated `dist/` folder directly into `public_html/` (including `index.html`, `assets/`, `.htaccess`, and media files).
6. Verify that `.htaccess` is present in `public_html/` so that direct route navigation and page refreshes work seamlessly without 404 errors.

---

### Method 2: Hostinger Git Deployment via GitHub

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Deploy: Fusion Forge Creation Frontend"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git
   git push -u origin main
   ```
2. In **Hostinger hPanel**, navigate to **Advanced** > **GIT**.
3. Create a new repository link:
   - **Repository URL**: `https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git`
   - **Branch**: `main`
   - **Install Path**: `public_html`
4. If building directly on Hostinger with Git Auto-Deploy or Webhooks, configure the build script to run `npm install && npm run build` and move `dist/*` to `public_html/`.

---

## ⚙️ Architecture & Features

- **Frontend-Only Static SPA**: No backend server, Express, Node.js runtime, Supabase, or InsForge dependency required.
- **Client-Side Routing & Fallback**: Fully supported with LiteSpeed/Apache `.htaccess`.
- **Fast Performance**: Bundled and minified with Vite for near-instant load times.
- **GST Compliance**: Ready with HSN/SAC codes (SAC 998314 for IT & Software Development).
