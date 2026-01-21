# Deploy Backend Server to Vercel

## Quick Steps

### 1. Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get connection string
5. Note down: username, password, database name

### 2. Deploy to Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Follow prompts to create new project

### 3. Set Environment Variables in Vercel
Go to your Vercel dashboard → Project → Settings → Environment Variables

Add these variables:
```
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password  
DB_NAME=AminWebTechDB
JWT_SECRET=your-super-secure-64-character-secret-key
NODE_ENV=production
VITE_IMGBB_API_KEY=your_imgbb_api_key
```

### 4. Update Frontend
After deployment, you'll get a URL like: `https://your-project-name.vercel.app`

Update your frontend `.env`:
```
VITE_API_BASE_URL=https://your-project-name.vercel.app
```

### 5. Rebuild and Redeploy Frontend
1. Update `.env` with new API URL
2. Build: `npm run build`
3. Deploy to Netlify: drag `dist` folder to Netlify

## Alternative: Use Existing Server
If you want to use the existing server at `https://amin-web-tech-server.vercel.app`, you need to:

1. Comment out VITE_API_BASE_URL in `.env`
2. Rebuild frontend: `npm run build`
3. Redeploy to Netlify

The frontend will use the fallback URL in `useAxios.jsx`.