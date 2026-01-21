# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Set up MongoDB Atlas cluster
- [ ] Update `.env` with production MongoDB credentials
- [ ] Generate secure JWT secret (64+ characters)
- [ ] Get ImgBB API key for image uploads
- [ ] Update `VITE_API_BASE_URL` to production domain

### 2. Security
- [ ] Change default admin credentials in production
- [ ] Use HTTPS in production
- [ ] Set secure CORS origins
- [ ] Enable rate limiting
- [ ] Use environment variables for all secrets

### 3. Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user with appropriate permissions
- [ ] Network access configured (0.0.0.0/0 for cloud deployment)
- [ ] Connection string tested

### 4. File Structure for Production
```
your-project/
├── server-complete.js          # Main production server
├── package.json               # Dependencies and scripts
├── vercel.json               # Vercel deployment config
├── .env                      # Production environment variables
└── dist/                     # Built frontend files
```

## Deployment Steps

### Option 1: Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard

### Option 2: Railway Deployment
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Option 3: Manual Server Deployment
1. Upload files to server
2. Install dependencies: `npm install`
3. Set environment variables
4. Start with PM2: `pm2 start server-complete.js`

## Environment Variables for Production

```env
# MongoDB Atlas
DB_USER=your_atlas_username
DB_PASS=your_atlas_password
DB_NAME=AminWebTechDB

# Server
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your-super-secure-64-character-jwt-secret-key-here

# Services
VITE_IMGBB_API_KEY=your_imgbb_api_key

# Frontend
VITE_API_BASE_URL=https://your-api-domain.com
```

## Post-Deployment
- [ ] Test all API endpoints
- [ ] Verify database connections
- [ ] Test admin login
- [ ] Check file uploads
- [ ] Monitor server logs
- [ ] Set up domain and SSL

## Monitoring
- Use MongoDB Atlas monitoring
- Set up error logging (e.g., Sentry)
- Monitor server performance
- Set up uptime monitoring

## Backup Strategy
- MongoDB Atlas automatic backups
- Regular database exports
- Code repository backups