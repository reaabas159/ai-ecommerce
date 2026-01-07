# AIECOMM Setup Guide

## Project Structure
```
aiecomm/
├── server/     (Node.js/Express Backend - Port 4000)
├── client/     (React Frontend - Port 5173)
└── dashboard/  (React Admin Dashboard - Port 5174)
```

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Setup Instructions

### 1. Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# The server already has config.env file with all required environment variables
# No need to create .env - it uses config/config.env

# Start the server (development mode)
npm run dev

# Or start in production mode
npm start
```

**Server runs on:** `http://localhost:4000`

### 2. Client Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Client runs on:** `http://localhost:5173`

**Note:** No .env file needed - API URL is configured in `src/lib/axios.js`

### 3. Dashboard Setup

```bash
# Navigate to dashboard directory
cd dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Dashboard runs on:** `http://localhost:5174`

**Note:** No .env file needed - API URL is configured in `src/lib/axios.js`

## Running All Services Together

### Option 1: Three Separate Terminals

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

**Terminal 3 - Dashboard:**
```bash
cd dashboard
npm run dev
```

### Option 2: Using npm-run-all (Recommended)

Install globally:
```bash
npm install -g npm-run-all
```

Create a script in root `package.json` (if you want):
```json
{
  "scripts": {
    "dev": "npm-run-all --parallel dev:server dev:client dev:dashboard",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "dev:dashboard": "cd dashboard && npm run dev"
  }
}
```

Then run:
```bash
npm run dev
```

### Option 3: Using Concurrently

Install in root:
```bash
npm install concurrently --save-dev
```

Create root `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\" \"npm run dev:dashboard\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "dev:dashboard": "cd dashboard && npm run dev"
  }
}
```

## Environment Variables

### Server (`server/config/config.env`)
Already configured with:
- `PORT=4000`
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET`
- `FRONTEND_URL=http://localhost:5173`
- `DASHBOARD_URL=http://localhost:5174`
- Cloudinary, Stripe, SMTP, and Gemini API keys

### Client & Dashboard
No .env files needed - they use hardcoded API URLs:
- Development: `http://localhost:4000/api/v1`
- Production: `/api/v1` (relative URL)

## Access URLs

- **Client (Frontend):** http://localhost:5173
- **Dashboard (Admin):** http://localhost:5174
- **Server API:** http://localhost:4000/api/v1

## Price Conversion Fix

✅ **Fixed:** Prices are now in dollars directly (no conversion)
- If price is 1 → $1.00
- If price is 1000 → $1000.00
- Removed `/283` division from server controllers
- Removed `*283` multiplication from dashboard update modal

## Troubleshooting

1. **Port already in use:**
   - Change ports in `vite.config.js` or kill the process using the port

2. **CORS errors:**
   - Ensure server `config.env` has correct `FRONTEND_URL` and `DASHBOARD_URL`

3. **Database connection errors:**
   - Check `DATABASE_URL` in `server/config/config.env`

4. **API not responding:**
   - Ensure server is running first
   - Check server logs for errors

