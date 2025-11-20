# Deployment Guide

## 🚀 Backend Deployment (Render)

### Option 1: Automatic Deployment

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will detect `render.yaml` automatically

3. **Configure Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend-url.netlify.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://workspace-api.onrender.com`)

### Option 2: Manual Configuration

1. **New Web Service**
   - Name: `workspace-booking-api`
   - Environment: `Node`
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`

2. **Set Environment Variables** (as above)

3. **Deploy**

### Alternative: Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure**
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Environment Variables**
   ```
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.netlify.app
   ```

---

## 🌐 Frontend Deployment (Netlify)

### Option 1: Drag and Drop

1. **Build Locally**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy**
   - Go to [netlify.com](https://netlify.com)
   - Drag `frontend/dist` folder to Netlify

3. **Configure Environment Variable**
   - Go to Site Settings → Environment Variables
   - Add: `VITE_API_BASE_URL=https://your-backend-url.onrender.com/api`

4. **Redeploy** with environment variable

### Option 2: Git-based Deployment

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **New Site from Git**
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository
   - Netlify will detect `netlify.toml` automatically

3. **Configure Build Settings** (auto-detected from netlify.toml)
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add: `VITE_API_BASE_URL=https://your-backend-url.onrender.com/api`

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

### Alternative: Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
   ```

5. **Deploy**

---

## 🔄 Update CORS Configuration

After deploying frontend, update backend CORS:

### backend/.env (or Render environment variables)
```env
FRONTEND_URL=https://your-actual-frontend-url.netlify.app
```

### Redeploy Backend
- Push changes or trigger manual redeploy on Render

---

## ✅ Verification Checklist

### Backend
- [ ] API is accessible at `https://your-backend-url/health`
- [ ] Returns: `{"status": "ok", "timestamp": "...", "environment": "production"}`
- [ ] All API endpoints work (`/api/rooms`, `/api/bookings`, `/api/analytics`)
- [ ] CORS allows frontend domain

### Frontend
- [ ] Site loads at `https://your-frontend-url.netlify.app`
- [ ] All pages are accessible (Home, Rooms, Bookings, Admin)
- [ ] Can view rooms list
- [ ] Can create bookings
- [ ] Can cancel bookings
- [ ] Admin analytics loads correctly

### Integration
- [ ] Frontend successfully calls backend API
- [ ] No CORS errors in browser console
- [ ] All features work end-to-end

---

## 🐛 Troubleshooting

### Backend Issues

**Build Fails:**
```bash
# Check logs in Render dashboard
# Common issues:
- TypeScript compilation errors
- Missing dependencies
- Node version mismatch
```

**Runtime Errors:**
```bash
# Check Render logs
# Common issues:
- Environment variables not set
- Port binding issues (use process.env.PORT)
```

**CORS Errors:**
```bash
# Update FRONTEND_URL in Render environment variables
# Redeploy backend
```

### Frontend Issues

**Build Fails:**
```bash
# Check Netlify deploy logs
# Common issues:
- API base URL not set
- Build command incorrect
- Node version mismatch
```

**API Calls Fail:**
```bash
# Check browser console
# Verify VITE_API_BASE_URL is correct
# Ensure backend is deployed and running
# Check CORS configuration
```

**404 on Refresh:**
```bash
# Already handled by netlify.toml redirects
# If using Vercel, add vercel.json:
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 📊 Monitoring

### Backend
- Check Render logs for errors
- Monitor response times
- Track API usage

### Frontend
- Use Netlify Analytics
- Monitor Core Web Vitals
- Check error logs

---

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use platform-specific environment variable settings

2. **HTTPS**
   - Both Render and Netlify provide free SSL
   - Always use HTTPS in production

3. **Rate Limiting**
   - Consider adding rate limiting in production
   - Protect against DDoS

4. **Input Validation**
   - Already implemented in backend
   - Keep validations strict

---

## 💰 Cost Considerations

### Free Tiers

**Render:**
- Free tier: 750 hours/month
- Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds

**Netlify:**
- Free tier: 100GB bandwidth/month
- Unlimited sites
- Automatic SSL

**Railway:**
- Free tier: $5 credit/month
- Always-on (no spin-down)

**Vercel:**
- Free tier: 100GB bandwidth/month
- Serverless functions included

### Recommendations
- Start with free tiers
- Monitor usage
- Upgrade if needed based on traffic

---

## 🚀 Quick Start Commands

### Deploy Backend to Render
```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Then follow Render setup steps
```

### Deploy Frontend to Netlify
```bash
# Build locally (optional)
cd frontend
npm run build

# Or push to GitHub and use Git-based deployment
git push origin main
```

---

## 📝 Post-Deployment

1. **Update README.md** with live URLs
2. **Test all features** in production
3. **Share links** in submission form
4. **Monitor logs** for any errors
5. **Set up notifications** for deployments

---

## 🎉 Success!

Your application is now live and accessible to the world! 🌍

- **Frontend:** https://your-app.netlify.app
- **Backend API:** https://your-api.onrender.com