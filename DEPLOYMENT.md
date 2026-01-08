# Production Deployment Guide

This guide will help you configure your deployed applications to communicate properly.

## Current Deployment Setup
- **Client**: Deployed on Vercel
- **Dashboard**: Deployed on Vercel (separate project)
- **Server**: Deployed on Railway (webservice) **OR** Vercel (serverless)

> **📌 Note**: For deploying the server to **Vercel**, see **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** for complete instructions.
> 
> This guide covers **Railway** deployment. Both platforms work, but Vercel offers better integration if your frontends are already on Vercel.

## Issues Identified

1. **CORS Configuration**: Server only allows localhost URLs
2. **API URL Configuration**: Frontend apps use relative URLs in production
3. **Missing Environment Variables**: Production URLs not configured

---

## Step-by-Step Fix Instructions

### Step 1: Get Your Deployment URLs

First, collect these URLs:
- **Client Vercel URL**: `https://your-client-app.vercel.app`
- **Dashboard Vercel URL**: `https://your-dashboard-app.vercel.app`
- **Server Railway URL**: `https://your-server-app.railway.app` (or `https://your-app.up.railway.app`)

---

### Step 2: Configure Railway (Server)

1. Go to your Railway project dashboard
2. Click on your webservice
3. Go to the **Variables** tab
4. Add/Update the following environment variables:

```
FRONTEND_URL=https://your-client-app.vercel.app
DASHBOARD_URL=https://your-dashboard-app.vercel.app
```

**Important Notes:**
- Use `https://` (not `http://`)
- No trailing slashes
- Replace `your-client-app.vercel.app` and `your-dashboard-app.vercel.app` with your actual Vercel URLs
- Keep all other existing environment variables (DATABASE_URL, JWT_SECRET, etc.)

5. After adding/updating variables, Railway will automatically redeploy your service

---

### Step 3: Configure Vercel - Client Project

1. Go to your Vercel dashboard
2. Select your **Client** project
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variable:

```
VITE_API_URL=https://your-server-app.railway.app/api/v1
```

**Important Notes:**
- Replace `your-server-app.railway.app` with your actual Railway URL
- Include `/api/v1` at the end
- Use `https://` (not `http://`)
- Make sure to select **Production**, **Preview**, and **Development** environments (or at least Production)

5. After adding the variable, you need to **redeploy** your project:
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on the latest deployment
   - Click **Redeploy**

---

### Step 4: Configure Vercel - Dashboard Project

1. Go to your Vercel dashboard
2. Select your **Dashboard** project
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variable:

```
VITE_API_URL=https://your-server-app.railway.app/api/v1
```

**Important Notes:**
- Use the same Railway server URL as the Client
- Include `/api/v1` at the end
- Use `https://` (not `http://`)
- Make sure to select **Production**, **Preview**, and **Development** environments

5. After adding the variable, **redeploy** your Dashboard project:
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on the latest deployment
   - Click **Redeploy**

---

### Step 5: Verify CORS Configuration

The server's CORS is configured in `server/app.js` to accept requests from:
- `process.env.FRONTEND_URL`
- `process.env.DASHBOARD_URL`

Make sure these are set correctly in Railway (Step 2).

---

### Step 6: Test the Connection

After redeploying all services:

1. **Test Client → Server:**
   - Open your Client Vercel URL in a browser
   - Open browser DevTools (F12) → Network tab
   - Try to make an API request (login, fetch products, etc.)
   - Check if requests are going to your Railway URL
   - Check for CORS errors in the Console tab

2. **Test Dashboard → Server:**
   - Open your Dashboard Vercel URL in a browser
   - Open browser DevTools (F12) → Network tab
   - Try to login or fetch data
   - Check if requests are going to your Railway URL
   - Check for CORS errors in the Console tab

---

## Common Issues & Solutions

### Issue 1: CORS Error
**Error Message:** `Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS policy`

**Solution:**
- Verify `FRONTEND_URL` and `DASHBOARD_URL` in Railway match your exact Vercel URLs (including `https://`)
- Make sure there are no trailing slashes
- Redeploy Railway service after updating variables

### Issue 2: 404 Not Found
**Error Message:** `404 Not Found` or `Cannot GET /api/v1/...`

**Solution:**
- Verify `VITE_API_URL` in Vercel includes `/api/v1` at the end
- Check Railway logs to see if the server is running
- Verify the Railway URL is correct

### Issue 3: Network Error / Connection Refused
**Error Message:** `Network Error` or `ERR_CONNECTION_REFUSED`

**Solution:**
- Check if Railway service is running and healthy
- Verify Railway URL is accessible (try opening it in browser)
- Check Railway logs for errors
- Make sure Railway service is set to "Public" if needed

### Issue 4: Environment Variables Not Working
**Symptoms:** Still using localhost URLs or relative paths

**Solution:**
- Make sure you redeployed after adding environment variables
- In Vercel, check that variables are set for the correct environment (Production)
- Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check Vercel build logs to see if variables are being injected

### Issue 5: Cookies Not Working
**Symptoms:** Login works but session doesn't persist

**Solution:**
- Verify `withCredentials: true` is set in axios (already configured)
- Check CORS configuration includes `credentials: true` (already configured)
- Make sure Railway URL uses `https://` (cookies require secure connection)

---

## Verification Checklist

- [ ] Railway: `FRONTEND_URL` set to Client Vercel URL
- [ ] Railway: `DASHBOARD_URL` set to Dashboard Vercel URL
- [ ] Railway: All other environment variables present (DATABASE_URL, JWT_SECRET, etc.)
- [ ] Vercel Client: `VITE_API_URL` set to Railway URL + `/api/v1`
- [ ] Vercel Dashboard: `VITE_API_URL` set to Railway URL + `/api/v1`
- [ ] All services redeployed after environment variable changes
- [ ] Railway service is running and healthy
- [ ] Tested Client → Server connection
- [ ] Tested Dashboard → Server connection
- [ ] No CORS errors in browser console
- [ ] No 404 errors for API endpoints

---

## Quick Reference: Environment Variables

### Railway (Server)
```
FRONTEND_URL=https://your-client-app.vercel.app
DASHBOARD_URL=https://your-dashboard-app.vercel.app
PORT=4000
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
# ... other variables
```

### Vercel (Client & Dashboard)
```
VITE_API_URL=https://your-server-app.railway.app/api/v1
```

---

## Need Help?

If you're still experiencing issues:

1. Check Railway logs: Railway Dashboard → Your Service → Logs
2. Check Vercel logs: Vercel Dashboard → Your Project → Deployments → Click on deployment → View Function Logs
3. Check browser console: F12 → Console tab for errors
4. Check browser network tab: F12 → Network tab to see actual API calls

