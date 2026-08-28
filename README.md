# Fusion Forge Creation

> Official web application for **Fusion Forge Creation** — Where Ideas Fuse with Technology.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run in development mode
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 🌐 Deploying to Hostinger via GitHub

### Option 1: Hostinger Web Hosting / Cloud (Static SPA with `.htaccess`)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Fusion Forge Creation"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git
   git push -u origin main
   ```

2. **Build the Production Dist Folder**:
   ```bash
   npm run build
   ```
   This generates the optimized client assets in the `dist/` directory, including the pre-configured `.htaccess` file for Hostinger LiteSpeed/Apache routing.

3. **Upload to Hostinger**:
   - Go to your **Hostinger hPanel** > **File Manager** (or connect via FTP/Git).
   - Navigate to `public_html/`.
   - Upload and extract the contents of the `dist/` directory into `public_html/`.
   - Ensure `.htaccess` is present in `public_html/` so SPA routing handles all page refreshes seamlessly.

---

### Option 2: Hostinger Git Deployment / Auto-Deploy

1. In your **Hostinger hPanel**, navigate to **Advanced** > **GIT**.
2. Connect your GitHub repository:
   - **Repository URL**: `https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git`
   - **Branch**: `main`
   - **Install path**: `public_html`
3. If using Hostinger Node.js Application Manager:
   - Set **Node version** to `18.x` or `20.x`.
   - **Application root**: `/public_html`
   - **Application startup file**: `dist/server.cjs`
   - Run `npm install` and `npm run build`.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your email and backend credentials:
- `SMTP_HOST`: `smtp.hostinger.com`
- `SMTP_PORT`: `465`
- `SMTP_USER`: `admin@fusionforgecreation.com`
- `SMTP_PASSWORD`: `<your-hostinger-mailbox-password>`
- `OFFICIAL_EMAIL`: `admin@fusionforgecreation.com`
