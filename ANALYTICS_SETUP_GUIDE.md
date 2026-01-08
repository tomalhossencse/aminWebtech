# Analytics Dashboard Setup Guide

## Backend Setup

### 1. Replace your existing server.js with the complete server file
Copy the contents from `server-complete.js` to your existing server file, or use it as your new server file.

### 2. Environment Variables
Make sure you have these environment variables in your `.env` file:
```
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
PORT=3000
```

### 3. MongoDB Collections
The analytics system will automatically create these collections:
- `visitors` - Stores visitor information
- `pageViews` - Tracks individual page visits
- `analytics` - General analytics data

### 4. Start the Server
```bash
npm run server
# or
npm run dev:server
```

## Frontend Setup

### 1. Analytics Hooks
The following hooks are now available:
- `useAnalyticsOverview(timeRange)` - Get overview stats
- `useVisitorDistribution(timeRange)` - Get visitor country distribution
- `useRecentVisitors(limit)` - Get recent visitors list
- `useTopPages(timeRange, limit)` - Get top performing pages

### 2. Visitor Tracking
The `VisitorTracker` component is automatically added to `MainLayout.jsx` and will:
- Track new visitors automatically
- Record page views
- Track time spent on pages
- Detect device type and browser
- Get location data (requires internet connection)

### 3. Updated Analytics Dashboard
The `AnalyticsDashboard.jsx` now uses real data from your MongoDB database.

## Features

### Real-time Analytics
- **Total Visitors**: Count of unique visitors in selected time range
- **New Visitors**: First-time visitors
- **Active Now**: Visitors active in last 5 minutes
- **Bounce Rate**: Percentage of single-page sessions

### Visitor Distribution
- Interactive pie chart showing visitors by country
- Country flags and percentages
- Real-time updates

### Recent Visitors Table
- IP addresses (anonymized for privacy)
- Location (country/city)
- Device type (Desktop/Mobile/Tablet)
- Browser information
- Page views count

### Top Pages
- Most visited pages
- View counts and unique visitors
- Average time spent on page

## API Endpoints

### Analytics Endpoints
- `GET /analytics/overview?timeRange=7d` - Overview statistics
- `GET /analytics/visitor-distribution?timeRange=7d` - Country distribution
- `GET /analytics/recent-visitors?limit=10` - Recent visitors
- `GET /analytics/top-pages?timeRange=7d&limit=10` - Top pages

### Tracking Endpoints
- `POST /analytics/track-visitor` - Track new visitor/page view
- `PUT /analytics/update-page-time` - Update time spent on page

### Authentication
- `POST /api/auth/login` - Admin login (username: admin, password: admin123)

## Time Range Options
- `1d` - Last 24 hours
- `7d` - Last 7 days (default)
- `30d` - Last 30 days

## Privacy & GDPR Compliance

### Data Collection
The system collects:
- IP addresses (for unique visitor counting)
- Location data (country/city level only)
- Device and browser information
- Page visit timestamps
- Time spent on pages

### Privacy Considerations
- Consider implementing IP anonymization
- Add cookie consent banners
- Provide data deletion options
- Review local privacy laws

## Customization

### Adding More Metrics
You can extend the analytics by:
1. Adding new fields to the visitor tracking
2. Creating new aggregation queries
3. Adding new API endpoints
4. Updating the frontend hooks

### Styling
The dashboard uses Tailwind CSS and supports dark mode automatically.

## Troubleshooting

### Common Issues
1. **No data showing**: Check if the server is running and MongoDB is connected
2. **CORS errors**: Ensure CORS is properly configured in your server
3. **Location not working**: The system uses ipapi.co for location data - requires internet connection

### Debug Mode
Add console logs in the hooks to debug API calls:
```javascript
console.log('Analytics data:', data);
```

## Production Deployment

### Security
- Replace the simple authentication with proper JWT tokens
- Add rate limiting to prevent abuse
- Implement proper error handling
- Add input validation and sanitization

### Performance
- Add database indexes for better query performance
- Implement caching for frequently accessed data
- Consider using Redis for real-time data

### Monitoring
- Add server monitoring
- Set up alerts for high traffic
- Monitor database performance

## Next Steps

1. Test the analytics dashboard with real traffic
2. Add more detailed visitor tracking if needed
3. Implement proper authentication
4. Add data export functionality
5. Create automated reports
6. Add more visualization charts

The analytics system is now ready to track real visitor data and provide insights into your website's performance!