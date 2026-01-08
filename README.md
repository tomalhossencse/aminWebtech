# AminWebTech - Full Stack Application

A modern full-stack web application built with React, Express, MongoDB, and TanStack Query.

## 🚀 Features

- **Frontend**: React 18 with Vite, TailwindCSS, DaisyUI
- **Backend**: Express.js with MongoDB
- **State Management**: TanStack Query for server state
- **Authentication**: Simple token-based auth
- **Analytics**: Real-time visitor tracking
- **Services Management**: CRUD operations for services
- **Responsive Design**: Mobile-first approach

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd aminwebtech-vite-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/aminwebtech

   # Client Configuration
   CLIENT_URL=http://localhost:5173

   # Admin Credentials (Change these in production!)
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123

   # Frontend API URL
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB installation
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

## 🚀 Running the Application

### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev:full
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 📱 Application URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔐 Admin Access

- **URL**: http://localhost:5173/admin/login
- **Username**: admin (or as set in .env)
- **Password**: admin123 (or as set in .env)

## 📊 API Endpoints

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service
- `GET /api/services/:id` - Get service by ID
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/visitor-distribution` - Get visitor distribution
- `GET /api/analytics/recent-visitors` - Get recent visitors
- `GET /api/analytics/top-pages` - Get top performing pages
- `POST /api/analytics/track-visitor` - Track visitor

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/logout` - Logout

## 🗂️ Project Structure

```
├── server/                 # Backend code
│   ├── routes/            # API routes
│   ├── config/            # Database configuration
│   ├── middleware/        # Custom middleware
│   └── server.js          # Main server file
├── src/                   # Frontend code
│   ├── api/              # API client functions
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── Pages/            # Page components
│   ├── providers/        # Context providers
│   └── main.jsx          # App entry point
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🔧 Development

### Adding New Services
1. Use the "Add New Service" button in the services section
2. Fill out the service form with title, description, features, etc.
3. Services are automatically saved to MongoDB

### Viewing Analytics
1. Navigate to `/admin/dashboard` after logging in
2. View real-time analytics including:
   - Visitor statistics
   - Country distribution
   - Recent visitors
   - Top performing pages

### Database Collections

The application creates the following MongoDB collections:
- `services` - Service offerings
- `visitors` - Visitor tracking data
- `pageViews` - Page view analytics
- `sessions` - User sessions

## 🚀 Production Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   ADMIN_USERNAME=your-secure-username
   ADMIN_PASSWORD=your-secure-password
   ```

3. **Start the production server**
   ```bash
   npm run server
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify network connectivity

2. **Port Already in Use**
   - Change the PORT in `.env`
   - Kill existing processes on the port

3. **API Requests Failing**
   - Check if backend server is running
   - Verify VITE_API_URL in `.env`
   - Check browser console for CORS errors

4. **Login Issues**
   - Verify admin credentials in `.env`
   - Check browser network tab for API responses
   - Clear browser localStorage

### Getting Help

If you encounter issues:
1. Check the console logs (both browser and server)
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check MongoDB connection and data

## 🎯 Next Steps

- [ ] Add user roles and permissions
- [ ] Implement email notifications
- [ ] Add file upload functionality
- [ ] Create API documentation with Swagger
- [ ] Add unit and integration tests
- [ ] Implement caching with Redis
- [ ] Add rate limiting
- [ ] Set up CI/CD pipeline# aminWebtech
