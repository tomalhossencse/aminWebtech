# Deploy Your Server Now

## Quick Deploy Commands

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy your server
vercel --prod
```

## Set Environment Variables in Vercel

After deployment, go to your Vercel dashboard and add these environment variables:

```
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
DB_NAME=AminWebTechDB
JWT_SECRET=a0059d0b50cd1f9704639e670c4fdfe5b4af4228ad1e558aa4cf904d22cac00b57926bbad29fc4d829677dc00d91b78441db6f7be0f4c9684314ea4991390bd7
NODE_ENV=production
```

## MongoDB Atlas Setup (Free)

1. Go to https://www.mongodb.com/atlas
2. Create free cluster
3. Create database user
4. Network Access → Add IP → 0.0.0.0/0
5. Get connection string and extract username/password

## Update Frontend

After deployment, update your frontend to use the new server URL:

```env
VITE_API_BASE_URL=https://your-new-server.vercel.app
```

Then rebuild and redeploy frontend:
```bash
npm run build
# Upload dist folder to Netlify
```