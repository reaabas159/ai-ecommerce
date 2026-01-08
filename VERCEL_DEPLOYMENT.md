# Vercel Server Deployment Guide

This guide will help you deploy your Express.js server to Vercel as a serverless function.

## 📋 Prerequisites

- GitHub account with your code repository
- Vercel account (sign up at [vercel.com](https://vercel.com))
- All environment variables ready

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Commit all changes** to your repository:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify the following files exist**:
   - ✅ `server/vercel.json` - Vercel configuration
   - ✅ `server/api/index.js` - Serverless function entry point
   - ✅ `server/package.json` - Dependencies and scripts

---

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in

2. **Click "Add New Project"**

3. **Import your GitHub repository**:
   - Select your repository (`ai-ecommerce` or your repo name)
   - Click "Import"

4. **Configure Project Settings**:
   - **Framework Preset**: Other
   - **Root Directory**: `server` (IMPORTANT: Set this to `server` folder)
   - **Build Command**: Leave empty or use `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   
   Click "Environment Variables" and add ALL of these:
   
   ```
   NODE_ENV=production
   PORT=3000
   
   DATABASE_URL=your-postgresql-connection-string
   
   JWT_SECRET=your-jwt-secret-key
   JWT_EXPIRES_IN=30d
   COOKIE_EXPIRES_IN=30
   
   FRONTEND_URL=https://your-client-app.vercel.app
   DASHBOARD_URL=https://your-dashboard-app.vercel.app
   
   CLOUDINARY_CLIENT_NAME=your-cloudinary-name
   CLOUDINARY_CLIENT_API=your-cloudinary-api-key
   CLOUDINARY_CLIENT_SECRET=your-cloudinary-secret
   
   SMTP_SERVICE=gmail
   SMTP_MAIL=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   
   GEMINI_API_KEY=your-gemini-api-key
   
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   STRIPE_FRONTEND_KEY=your-stripe-publishable-key
   ```
   
   **Important Notes**:
   - Replace all placeholder values with your actual credentials
   - Use your **production Vercel URLs** for `FRONTEND_URL` and `DASHBOARD_URL`
   - Make sure to select **Production**, **Preview**, and **Development** environments for each variable

6. **Click "Deploy"**

7. **Wait for deployment** (usually 2-5 minutes)

8. **Copy your deployment URL** (e.g., `https://your-server-name.vercel.app`)

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Navigate to server directory**:
   ```bash
   cd server
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? **No** (first time) or **Yes** (subsequent deployments)
   - Project name: `your-server-name`
   - Directory: `.` (current directory)
   - Override settings? **No**

5. **Set environment variables**:
   ```bash
   vercel env add NODE_ENV
   vercel env add DATABASE_URL
   # ... add all other environment variables
   ```

6. **Deploy to production**:
   ```bash
   vercel --prod
   ```

---

### Step 3: Update Frontend Environment Variables

After deploying your server, update your **Client** and **Dashboard** projects:

1. **Go to Vercel Dashboard** → Your Client Project → Settings → Environment Variables

2. **Update `VITE_API_URL`**:
   ```
   VITE_API_URL=https://your-server-name.vercel.app/api/v1
   ```
   
   Replace `your-server-name.vercel.app` with your actual server URL

3. **Repeat for Dashboard project**:
   - Go to Dashboard Project → Settings → Environment Variables
   - Update `VITE_API_URL` to the same server URL

4. **Redeploy both projects**:
   - Go to Deployments tab
   - Click ⋯ on latest deployment → Redeploy

---

### Step 4: Configure Stripe Webhook (Important!)

Since your server is now on Vercel, update your Stripe webhook URL:

1. **Go to Stripe Dashboard** → Developers → Webhooks

2. **Find your webhook** or create a new one

3. **Update the endpoint URL** to:
   ```
   https://your-server-name.vercel.app/api/v1/payment/webhook
   ```

4. **Select events**: `payment_intent.succeeded`

5. **Copy the webhook signing secret** and update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables

---

### Step 5: Verify Deployment

1. **Test Server Health**:
   ```
   GET https://your-server-name.vercel.app/
   ```
   Should return: `{"status":"ok","message":"API is working"}`

2. **Test API Health**:
   ```
   GET https://your-server-name.vercel.app/api/v1/health
   ```
   Should return: `{"status":"ok","message":"API is healthy"}`

3. **Test from Frontend**:
   - Open your Client Vercel URL
   - Open browser DevTools → Network tab
   - Try logging in or fetching products
   - Verify requests go to your Vercel server URL
   - Check for no CORS errors

---

## 🔧 Configuration Files Explained

### `server/vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

This tells Vercel:
- Use `@vercel/node` runtime for serverless functions
- Route all requests to `api/index.js`
- Set `NODE_ENV=production` automatically

### `server/api/index.js`
```javascript
import app from "../app.js";
export default app;
```

This is the serverless function entry point that exports your Express app.

---

## 📝 Environment Variables Reference

Copy these from your `server/config/config.env` file:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Secret for JWT tokens | Random string |
| `JWT_EXPIRES_IN` | Token expiration | `30d` |
| `COOKIE_EXPIRES_IN` | Cookie expiration (days) | `30` |
| `FRONTEND_URL` | Client production URL | `https://client.vercel.app` |
| `DASHBOARD_URL` | Dashboard production URL | `https://dashboard.vercel.app` |
| `CLOUDINARY_CLIENT_NAME` | Cloudinary cloud name | Your cloud name |
| `CLOUDINARY_CLIENT_API` | Cloudinary API key | Your API key |
| `CLOUDINARY_CLIENT_SECRET` | Cloudinary secret | Your secret |
| `SMTP_MAIL` | Email address | `your@email.com` |
| `SMTP_PASSWORD` | Email app password | App password |
| `GEMINI_API_KEY` | Google Gemini API key | Your API key |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `STRIPE_FRONTEND_KEY` | Stripe publishable key | `pk_test_...` |

---

## 🐛 Troubleshooting

### Issue: Deployment Fails

**Error**: "Module not found" or "Cannot find module"

**Solution**:
1. Make sure `Root Directory` is set to `server` in Vercel project settings
2. Verify `package.json` exists in the `server` folder
3. Check that all dependencies are listed in `package.json`

---

### Issue: 404 Errors on All Routes

**Error**: All API routes return 404

**Solution**:
1. Verify `vercel.json` exists in `server` folder
2. Check that `api/index.js` exists and exports the app correctly
3. Ensure `Root Directory` is set to `server` in Vercel settings

---

### Issue: Database Connection Errors

**Error**: "Database connection failed"

**Solution**:
1. Verify `DATABASE_URL` is set correctly in Vercel environment variables
2. Check that your database allows connections from Vercel IPs
3. Ensure SSL is enabled in connection string (Supabase requires this)

---

### Issue: CORS Errors

**Error**: "Access-Control-Allow-Origin" header missing

**Solution**:
1. Verify `FRONTEND_URL` and `DASHBOARD_URL` are set in Vercel
2. Check that URLs match your actual Vercel deployment URLs
3. Ensure CORS middleware is configured in `app.js`

---

### Issue: Cookies Not Working

**Error**: 401 Unauthorized after login

**Solution**:
1. Verify `NODE_ENV=production` is set in Vercel
2. Check cookie settings in `jwtToken.js` (should use `SameSite=None` and `Secure=true` in production)
3. Ensure `withCredentials: true` is set in axios configuration

---

### Issue: Cold Start Timeout

**Error**: Function timeout on first request

**Solution**:
1. Vercel serverless functions have a 10-second timeout on Hobby plan
2. Database connection might be slow - consider using connection pooling
3. Optimize `createTables()` to run asynchronously

---

## 🔄 Updating Your Deployment

After making code changes:

1. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Vercel will auto-deploy** (if connected to GitHub)

   OR manually deploy:
   ```bash
   cd server
   vercel --prod
   ```

---

## 📊 Monitoring & Logs

1. **View Logs**:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on a deployment → View Function Logs

2. **View Metrics**:
   - Go to Analytics tab in Vercel Dashboard
   - Monitor function invocations, duration, and errors

---

## 🔐 Security Best Practices

1. **Never commit** `.env` files or `config.env` to GitHub
2. **Use Vercel Environment Variables** for all secrets
3. **Enable Vercel Protection** for preview deployments
4. **Set up rate limiting** (consider using Vercel Edge Config)
5. **Regularly rotate** API keys and secrets

---

## 📚 Additional Resources

- [Vercel Serverless Functions Docs](https://vercel.com/docs/functions)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✅ Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] `vercel.json` created in `server` folder
- [ ] `api/index.js` created
- [ ] All environment variables added to Vercel
- [ ] Root directory set to `server` in Vercel
- [ ] Server deployed successfully
- [ ] Health check endpoints working
- [ ] Frontend `VITE_API_URL` updated
- [ ] Dashboard `VITE_API_URL` updated
- [ ] Stripe webhook URL updated
- [ ] Tested login/logout flow
- [ ] Tested API endpoints
- [ ] No CORS errors
- [ ] Cookies working correctly

---

## 🎉 Success!

Once all steps are complete, your server should be:
- ✅ Running on Vercel
- ✅ Accessible at `https://your-server-name.vercel.app`
- ✅ Connected to your database
- ✅ Communicating with Client and Dashboard
- ✅ Handling authentication with cookies
- ✅ Processing Stripe webhooks

Your full stack is now deployed! 🚀

