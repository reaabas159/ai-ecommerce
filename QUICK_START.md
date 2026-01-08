# Quick Start - Vercel Server Deployment

## 🚀 Fastest Way to Deploy Server to Vercel

### Prerequisites
- ✅ Code pushed to GitHub
- ✅ Vercel account (free tier works)

### 5-Minute Setup

1. **Go to [vercel.com](https://vercel.com)** → Add New Project

2. **Import your GitHub repository**

3. **Configure Project**:
   - **Root Directory**: `server` ⚠️ IMPORTANT!
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

4. **Add Environment Variables** (copy from `server/config/config.env`):
   - `NODE_ENV=production`
   - `DATABASE_URL=your-database-url`
   - `JWT_SECRET=your-secret`
   - `FRONTEND_URL=https://your-client.vercel.app`
   - `DASHBOARD_URL=https://your-dashboard.vercel.app`
   - ... (add all other variables)

5. **Click Deploy** → Wait 2-5 minutes

6. **Copy your server URL** (e.g., `https://your-server.vercel.app`)

7. **Update Frontend Projects**:
   - Client: Set `VITE_API_URL=https://your-server.vercel.app/api/v1`
   - Dashboard: Set `VITE_API_URL=https://your-server.vercel.app/api/v1`
   - Redeploy both

8. **Update Stripe Webhook**:
   - Stripe Dashboard → Webhooks → Update URL to `https://your-server.vercel.app/api/v1/payment/webhook`

9. **Test**: Visit `https://your-server.vercel.app` → Should see `{"status":"ok","message":"API is working"}`

---

## 📋 Files Created for Vercel

These files were automatically created:
- ✅ `server/vercel.json` - Vercel configuration
- ✅ `server/api/index.js` - Serverless function entry point
- ✅ `server/.vercelignore` - Files to exclude

## 📚 Full Guide

For detailed instructions, troubleshooting, and best practices, see:
- **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Complete deployment guide

---

## ✅ Checklist

- [ ] Repository on GitHub
- [ ] Vercel project created with Root Directory = `server`
- [ ] All environment variables added
- [ ] Deployment successful
- [ ] Server URL copied
- [ ] Frontend `VITE_API_URL` updated
- [ ] Dashboard `VITE_API_URL` updated
- [ ] Stripe webhook updated
- [ ] Tested health endpoint

---

**That's it! Your server is now on Vercel! 🎉**

