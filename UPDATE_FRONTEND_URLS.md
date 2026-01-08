# Update Frontend Projects to New Vercel Server

## 🎯 Quick Steps to Update API URLs

### Step 1: Get Your New Vercel Server URL

1. Go to [vercel.com](https://vercel.com) → Your Server Project
2. Go to **Deployments** tab
3. Click on the latest deployment
4. Copy the **URL** (e.g., `https://your-server-name.vercel.app`)
5. Your API base URL will be: `https://your-server-name.vercel.app/api/v1`

---

### Step 2: Update Client Project

1. **Go to Vercel Dashboard** → Select your **Client** project

2. **Go to Settings** → **Environment Variables**

3. **Find `VITE_API_URL`**:
   - If it exists: Click **Edit** → Update the value
   - If it doesn't exist: Click **Add New** → Name: `VITE_API_URL`

4. **Set the value**:
   ```
   https://your-server-name.vercel.app/api/v1
   ```
   ⚠️ Replace `your-server-name.vercel.app` with your actual server URL

5. **Select environments**: Check **Production**, **Preview**, and **Development** (or at least Production)

6. **Save**

7. **Redeploy**:
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on the latest deployment
   - Click **Redeploy**
   - Wait for deployment to complete

---

### Step 3: Update Dashboard Project

1. **Go to Vercel Dashboard** → Select your **Dashboard** project

2. **Go to Settings** → **Environment Variables**

3. **Find `VITE_API_URL`**:
   - If it exists: Click **Edit** → Update the value
   - If it doesn't exist: Click **Add New** → Name: `VITE_API_URL`

4. **Set the value**:
   ```
   https://your-server-name.vercel.app/api/v1
   ```
   ⚠️ Use the **same server URL** as the Client

5. **Select environments**: Check **Production**, **Preview**, and **Development** (or at least Production)

6. **Save**

7. **Redeploy**:
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on the latest deployment
   - Click **Redeploy**
   - Wait for deployment to complete

---

### Step 4: Verify It's Working

1. **Open your Client Vercel URL** in a browser

2. **Open Browser DevTools** (F12) → **Network** tab

3. **Try an action** (login, fetch products, etc.)

4. **Check the Network requests**:
   - Requests should go to: `https://your-server-name.vercel.app/api/v1/...`
   - Should **NOT** go to Railway URL anymore
   - Should see **200 OK** responses (not 401 or CORS errors)

5. **Repeat for Dashboard**:
   - Open Dashboard URL
   - Try logging in
   - Verify requests go to Vercel server

---

## ✅ Checklist

- [ ] Got new Vercel server URL
- [ ] Updated `VITE_API_URL` in Client project
- [ ] Redeployed Client project
- [ ] Updated `VITE_API_URL` in Dashboard project
- [ ] Redeployed Dashboard project
- [ ] Tested Client → API requests work
- [ ] Tested Dashboard → API requests work
- [ ] No Railway URLs in Network tab
- [ ] No CORS errors
- [ ] Login/logout works

---

## 🐛 Troubleshooting

### Issue: Still seeing Railway URLs

**Solution**:
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Verify environment variable is saved correctly
3. Check that you redeployed after updating
4. Check Vercel deployment logs to confirm env var is injected

### Issue: 404 Errors

**Solution**:
1. Verify server URL is correct (no typos)
2. Make sure `/api/v1` is included at the end
3. Check server is deployed and accessible: `https://your-server.vercel.app/`

### Issue: CORS Errors

**Solution**:
1. Verify `FRONTEND_URL` and `DASHBOARD_URL` are set in Server's Vercel environment variables
2. Use your **production** Vercel URLs (not preview URLs)
3. Redeploy server after updating CORS URLs

### Issue: Environment Variable Not Updating

**Solution**:
1. Make sure you saved the variable
2. Redeploy the project (env vars are injected at build time)
3. Check deployment logs to see if variable is present

---

## 📝 Example URLs

**Server**: `https://ai-ecommerce-server.vercel.app`
**API Base**: `https://ai-ecommerce-server.vercel.app/api/v1`

**Client `VITE_API_URL`**: `https://ai-ecommerce-server.vercel.app/api/v1`
**Dashboard `VITE_API_URL`**: `https://ai-ecommerce-server.vercel.app/api/v1`

---

## 🎉 Done!

Once both projects are updated and redeployed, they'll be using your new Vercel server! All three projects (Client, Dashboard, Server) will now be on Vercel, making everything faster and easier to manage.

