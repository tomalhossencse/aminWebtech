# Quick Deploy Guide for AminWebTech Server

## 🚀 Deploy to Vercel (5 minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login and Deploy
```bash
vercel login
vercel --prod
```

### Step 3: Set Environment Variables
Go to your Vercel dashboard → Settings → Environment Variables and add:

```
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
DB_NAME=AminWebTechDB
JWT_SECRET=generate-a-64-character-secret-key
NODE_ENV=production
```

### Step 4: MongoDB Atlas Setup
1. Go to https://www.mongodb.com/atlas
2. Create free cluster
3. Create database user
4. Network Access → Add IP → 0.0.0.0/0 (Allow all)
5. Get connection string and extract username/password

### Step 5: Test Your Deployment
After deployment, test these endpoints:
- `https://your-app.vercel.app/` - Should show "AminWebTech Analytics Server is running!"
- `https://your-app.vercel.app/services` - Should return services data
- `https://your-app.vercel.app/api/activities/recent` - Should work with admin token

## 🔧 Alternative: Update Existing Deployment

If you want to update the existing `amin-web-tech-server.vercel.app`:

1. **Find the GitHub repo** connected to that deployment
2. **Replace the server code** with your `server-complete.js`
3. **Update environment variables** in Vercel dashboard
4. **Redeploy automatically**

## 📱 Update Frontend After Deployment

Once your server is deployed at `https://your-new-server.vercel.app`:

1. **Update your frontend .env:**
```env
VITE_API_BASE_URL=https://your-new-server.vercel.app
```

2. **Rebuild frontend:**
```bash
npm run build
```

3. **Redeploy to Netlify:**
   - Drag `dist` folder to Netlify dashboard
   - Or push to GitHub if connected

## 🎯 Your Server Features

Your server includes:
✅ All API endpoints (services, projects, blogs, contacts, activities)
✅ MongoDB integration with sample data seeding
✅ JWT authentication
✅ Analytics and visitor tracking
✅ File upload support (ImgBB)
✅ Email system integration
✅ IP detection and geolocation
✅ Admin dashboard APIs

## 🔍 Troubleshooting

**MongoDB Connection Issues:**
- Check username/password in environment variables
- Ensure IP whitelist includes 0.0.0.0/0
- Verify cluster is running

**Deployment Issues:**
- Check Vercel function logs
- Ensure all environment variables are set
- Verify vercel.json configuration

**Frontend Connection Issues:**
- Update VITE_API_BASE_URL to new server URL
- Rebuild and redeploy frontend
- Check browser network tab for API calls