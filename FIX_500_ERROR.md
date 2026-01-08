# Fix 500 Error and Cookie Issues

## 🔧 Issues Fixed

### 1. Cookie Expiration Error ✅
**Problem**: `COOKIE_EXPIRES_IN=30d` was a string, but code expected a number
**Fix**: Updated `jwtToken.js` to parse "30d" format correctly

### 2. Missing Error Handling ✅
**Problem**: Cookie errors caused 500 crashes
**Fix**: Added try-catch and validation in `sendToken` function

---

## 🚀 What You Need to Do NOW

### Step 1: Verify Environment Variables in Vercel

Go to **Vercel Dashboard** → **Your Server Project** → **Settings** → **Environment Variables**

Make sure these are set correctly:

```
NODE_ENV=production
COOKIE_EXPIRES_IN=30
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=30d
DATABASE_URL=your-database-url
FRONTEND_URL=https://your-client.vercel.app
DASHBOARD_URL=https://your-dashboard.vercel.app
```

**⚠️ IMPORTANT**:
- `COOKIE_EXPIRES_IN` should be `30` (number) NOT `30d`
- All other variables should match your `config.env` file

### Step 2: Redeploy Server

1. **Push the code changes**:
   ```bash
   git add .
   git commit -m "Fix cookie expiration and error handling"
   git push origin main
   ```

2. **Vercel will auto-deploy**, OR manually trigger:
   - Go to Vercel → Your Server Project → Deployments
   - Click "Redeploy" on latest deployment

### Step 3: Check Server Logs

1. Go to **Vercel Dashboard** → **Your Server Project** → **Deployments**
2. Click on the latest deployment
3. Click **"View Function Logs"**
4. Look for any errors related to:
   - Cookie expiration
   - JWT_SECRET missing
   - Database connection

### Step 4: Test Again

1. **Clear browser cookies**:
   - Open DevTools (F12) → Application → Cookies
   - Delete all cookies for your domain
   - Or use Incognito mode

2. **Test login**:
   - Try logging in again
   - Check Network tab for errors
   - Check Console for error messages

---

## 🐛 Common Issues & Solutions

### Issue: Still Getting 500 Error

**Check**:
1. ✅ Is `JWT_SECRET` set in Vercel environment variables?
2. ✅ Is `COOKIE_EXPIRES_IN=30` (number, not "30d")?
3. ✅ Is `NODE_ENV=production` set?
4. ✅ Check Vercel function logs for specific error

**Solution**: Update environment variables and redeploy

---

### Issue: "option expires is invalid"

**Cause**: Cookie expiration date is invalid

**Solution**: 
- Set `COOKIE_EXPIRES_IN=30` (just the number, no "d")
- The code now handles both formats, but using number is safer

---

### Issue: 404 on Login Route

**Possible Causes**:
1. Server not deployed correctly
2. Routes not configured properly
3. Vercel routing issue

**Check**:
- Visit: `https://your-server.vercel.app/api/v1/health`
- Should return: `{"status":"ok","message":"API is healthy"}`
- If 404, check `vercel.json` configuration

---

### Issue: 401 Errors on `/auth/me`

**This is NORMAL** if you're not logged in!

**401 means**:
- ✅ Request reached server (CORS working)
- ❌ No authentication token (not logged in)

**After login**, `/auth/me` should return 200 with user data.

---

## ✅ Verification Checklist

After fixing:

- [ ] `COOKIE_EXPIRES_IN=30` set in Vercel (number, not "30d")
- [ ] `JWT_SECRET` is set
- [ ] `NODE_ENV=production` is set
- [ ] Server redeployed
- [ ] Browser cookies cleared
- [ ] Test login → Should work without 500 error
- [ ] Check Network tab → Login request returns 200
- [ ] Check Response → Should have `Set-Cookie` header
- [ ] After login → `/auth/me` should return 200

---

## 📝 Environment Variables Checklist

Copy these from your `server/config/config.env` to Vercel:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=30d
COOKIE_EXPIRES_IN=30
FRONTEND_URL=https://your-client.vercel.app
DASHBOARD_URL=https://your-dashboard.vercel.app
CLOUDINARY_CLIENT_NAME=your-cloudinary-name
CLOUDINARY_CLIENT_API=your-cloudinary-api
CLOUDINARY_CLIENT_SECRET=your-cloudinary-secret
SMTP_SERVICE=gmail
SMTP_MAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
GEMINI_API_KEY=your-gemini-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret
STRIPE_FRONTEND_KEY=your-stripe-publishable-key
```

**Note**: `COOKIE_EXPIRES_IN` should be `30` (number), not `30d`

---

## 🎯 Quick Fix Summary

1. **Update Vercel Environment Variables**:
   - Change `COOKIE_EXPIRES_IN` from `30d` to `30`
   - Verify `JWT_SECRET` is set
   - Verify `NODE_ENV=production` is set

2. **Redeploy Server**

3. **Clear Browser Cookies**

4. **Test Login**

The code changes I made will handle the cookie expiration correctly, but you MUST update the environment variable in Vercel!

