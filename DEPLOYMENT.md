# Frontend Deployment Guide

## Issue Fixed ✅

The prerender error on `/auth/callback` has been resolved by adding `export const dynamic = 'force-dynamic'` to pages that use runtime request data (searchParams, dynamic params).

## Deploy to Vercel (Recommended for Next.js)

### Step 1: Push to Git
```bash
git add .
git commit -m "Fix prerender issues and prepare for deployment"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [Vercel](https://vercel.com/)
2. Sign in with GitHub/GitLab
3. Click **"Add New..."** → **"Project"**
4. Import your repository
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend` (if frontend is in a subdirectory)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### Step 3: Add Environment Variables
Add the following environment variable in Vercel:

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Your backend API URL | `https://indeed-job-scraper.onrender.com` |

**Important:** Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

### Step 5: Update Backend CORS
After deployment, update your backend's `FRONTEND_URL` environment variable in Render to match your Vercel URL:
```
FRONTEND_URL=https://your-project.vercel.app
```

Also update your `GOOGLE_CALLBACK_URL` if using OAuth:
```
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/auth/google/callback
```

## Deploy to Netlify (Alternative)

### Step 1: Create netlify.toml
Create a `netlify.toml` file in your frontend directory:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy
1. Go to [Netlify](https://www.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your Git repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Add environment variable: `NEXT_PUBLIC_API_URL`
6. Deploy

## Deploy to Render (Alternative)

### Step 1: Create render.yaml in frontend folder
Create a `render.yaml` in the `frontend` directory:

```yaml
services:
  - type: web
    name: indeed-job-scraper-frontend
    runtime: node
    region: ohio
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_API_URL
        sync: false
```

### Step 2: Deploy
1. Go to Render Dashboard
2. Click **"New +"** → **"Blueprint"**
3. Connect your repository
4. Select the `frontend` directory if using monorepo detection
5. Add `NEXT_PUBLIC_API_URL` environment variable
6. Deploy

## Environment Variables Reference

### Frontend Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL (e.g., `https://your-backend.onrender.com`) |

### Backend Environment Variables (for OAuth callback)
After deploying frontend, update these in your backend:

| Variable | Value After Frontend Deploy |
|----------|------------------------------|
| `FRONTEND_URL` | `https://your-frontend-url.vercel.app` |
| `GOOGLE_CALLBACK_URL` | `https://your-backend.onrender.com/auth/google/callback` |

## Common Issues & Solutions

### 1. Build Fails with Prerender Error
**Solution:** Already fixed! Pages using `useSearchParams()` or `useParams()` now have `export const dynamic = 'force-dynamic'`.

### 2. API Calls Fail in Production
**Symptoms:** Network errors, CORS issues

**Solutions:**
- ✅ Verify `NEXT_PUBLIC_API_URL` is set correctly
- ✅ Ensure backend CORS allows your frontend URL
- ✅ Check that backend is deployed and accessible
- ✅ Open browser DevTools → Network tab to see actual errors

### 3. OAuth Not Working
**Solutions:**
- ✅ Update `GOOGLE_CALLBACK_URL` in backend to production URL
- ✅ Add production frontend URL to Google OAuth allowed origins
- ✅ Update `FRONTEND_URL` in backend environment variables

### 4. Images Not Loading
**Solutions:**
- ✅ Put images in `public` folder
- ✅ Reference with absolute path: `/logo.png` not `./logo.png`
- ✅ For external images, add domains to `next.config.ts`:
```typescript
const nextConfig = {
  images: {
    domains: ['example.com'],
  },
};
```

### 5. Environment Variables Not Working
**Solutions:**
- ✅ Prefix browser-accessible variables with `NEXT_PUBLIC_`
- ✅ Rebuild after adding new environment variables
- ✅ Server-side variables don't need prefix but only work in server components

## Testing Your Deployment

### Before Going Live
- [ ] Test login/register flows
- [ ] Test OAuth (Google sign-in)
- [ ] Test password reset flow
- [ ] Verify all API endpoints work
- [ ] Check responsive design on mobile
- [ ] Test in different browsers (Chrome, Firefox, Safari)
- [ ] Check console for errors
- [ ] Verify all images load correctly
- [ ] Test navigation between pages

### Performance Checks
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Verify images are optimized
- [ ] Check bundle size

## Production Checklist

- [ ] Frontend deployed successfully
- [ ] Backend deployed and running
- [ ] Database migrations completed
- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] OAuth callbacks updated
- [ ] SSL/HTTPS enabled (automatic on Vercel/Netlify/Render)
- [ ] Custom domain configured (optional)
- [ ] Analytics set up (optional)
- [ ] Error tracking configured (optional)

## Useful Commands

### Local Development
```bash
cd frontend
npm run dev
```

### Production Build Test
```bash
npm run build
npm start
```

### Type Checking
```bash
npx tsc --noEmit
```

## Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Next.js Documentation](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
