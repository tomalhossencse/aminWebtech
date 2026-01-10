# API Security Implementation

## Overview
All dashboard-related APIs have been secured with JWT-based authentication using the `verifyAdmin` middleware. This ensures that only authenticated admin users can access sensitive operations.

## Authentication System

### JWT Token Generation
- **Endpoint**: `POST /api/auth/login`
- **Credentials**: username: `admin`, password: `admin123`
- **Token Expiry**: 24 hours
- **Secret**: Configurable via `JWT_SECRET` environment variable

### Middleware: `verifyAdmin`
The middleware performs the following checks:
1. **Token Presence**: Verifies `Authorization: Bearer <token>` header exists
2. **Token Validity**: Validates JWT signature and expiration
3. **Role Verification**: Ensures user has `admin` role
4. **Error Handling**: Returns appropriate error codes for different failure scenarios

## Secured API Endpoints

### 🔒 Services Management
- `POST /services` - Create service (Admin only)

### 🔒 Projects Management
- `GET /api/admin/projects` - Get projects for admin dashboard (Admin only)
- `POST /projects` - Create project (Admin only)
- `PUT /projects/:id` - Update project (Admin only)
- `DELETE /projects/:id` - Delete project (Admin only)

### 🔒 Blog Management
- `POST /blogs` - Create blog post (Admin only)
- `PUT /blogs/:id` - Update blog post (Admin only)
- `DELETE /blogs/:id` - Delete blog post (Admin only)

### 🔒 Team Management
- `POST /team-members` - Create team member (Admin only)
- `PUT /team-members/:id` - Update team member (Admin only)
- `DELETE /team-members/:id` - Delete team member (Admin only)

### 🔒 Testimonials Management
- `GET /api/testimonials` - Get testimonials for admin (Admin only)
- `GET /api/testimonials/:id` - Get single testimonial (Admin only)
- `POST /api/testimonials` - Create testimonial (Admin only)
- `PUT /api/testimonials/:id` - Update testimonial (Admin only)
- `DELETE /api/testimonials/:id` - Delete testimonial (Admin only)
- `PUT /api/testimonials/:id/featured` - Toggle featured status (Admin only)
- `PUT /api/testimonials/:id/active` - Toggle active status (Admin only)

### 🔒 Contacts Management
- `GET /api/contacts` - Get contacts list (Admin only)
- `GET /api/contacts/:id` - Get single contact (Admin only)
- `PUT /api/contacts/:id/status` - Update contact status (Admin only)
- `DELETE /api/contacts/:id` - Delete contact (Admin only)
- `GET /api/contacts/stats` - Get contact statistics (Admin only)
- `POST /api/contacts/:id/reply` - Reply to contact (Admin only)
- `GET /api/contacts/:id/replies` - Get contact replies (Admin only)

### 🔒 Analytics Dashboard
- `GET /analytics/overview` - Get analytics overview (Admin only)
- `GET /analytics/visitor-distribution` - Get visitor distribution (Admin only)
- `GET /analytics/recent-visitors` - Get recent visitors (Admin only)
- `GET /analytics/top-pages` - Get top performing pages (Admin only)

### 🔒 Media Management
- `GET /api/media` - Get media files (Admin only)
- `POST /api/media` - Upload media file (Admin only)
- `PUT /api/media/:id` - Update media file (Admin only)
- `DELETE /api/media/:id` - Delete single media file (Admin only)
- `DELETE /api/media` - Delete multiple media files (Admin only)
- `GET /api/media/:id` - Get media file by ID (Admin only)

## Public Endpoints (No Authentication Required)

### 🌐 Public Content Access
- `GET /projects` - Get projects for public display
- `GET /projects/:id` - Get single project details
- `GET /blogs` - Get blog posts for public display
- `GET /blogs/:id` - Get single blog post
- `GET /blogs/:id/views` - Increment blog views
- `GET /team-members` - Get team members for public display
- `GET /team-members/:id` - Get single team member
- `GET /testimonials` - Get testimonials for public display
- `GET /services` - Get services for public display
- `GET /users` - Get users (if needed for public features)
- `POST /users` - Create user (for registration)

### 🌐 Contact Form
- `POST /api/contacts` - Submit contact form (Public)

### 🌐 Analytics Tracking
- `POST /analytics/track-visitor` - Track visitor (Public)
- `PUT /analytics/update-page-time` - Update page time (Public)

### 🌐 Email Webhooks
- `POST /api/contacts/email-webhook` - Email webhook (Public)

## Error Codes

### Authentication Errors
- `NO_TOKEN` (401) - No authorization header provided
- `INVALID_TOKEN_FORMAT` (401) - Invalid Bearer token format
- `INVALID_TOKEN` (401) - Invalid JWT token
- `TOKEN_EXPIRED` (401) - JWT token has expired
- `INSUFFICIENT_PRIVILEGES` (403) - User is not an admin
- `AUTH_ERROR` (500) - Internal authentication error

### Login Errors
- `INVALID_CREDENTIALS` (401) - Wrong username/password
- `AUTH_FAILED` (500) - Authentication system error

## Frontend Integration

### Token Storage
- Tokens are stored in `localStorage` with key `admin_token`
- Automatically attached to requests via axios interceptor
- Automatic logout on 401/403 responses

### Request Headers
```javascript
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Error Handling
The frontend should handle these authentication scenarios:
1. **No Token**: Redirect to login page
2. **Invalid/Expired Token**: Clear storage and redirect to login
3. **Insufficient Privileges**: Show access denied message

## Security Best Practices Implemented

1. **JWT Expiration**: Tokens expire after 24 hours
2. **Role-Based Access**: Only admin role can access protected endpoints
3. **Secure Headers**: Proper authorization header validation
4. **Error Handling**: Detailed error codes without exposing sensitive info
5. **Separation of Concerns**: Public vs Admin endpoints clearly separated
6. **Middleware Reusability**: Single `verifyAdmin` middleware for all protected routes

## Environment Variables

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

**⚠️ Important**: Change the JWT secret in production to a strong, randomly generated key.

## Testing Authentication

### Valid Login Test
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Protected Endpoint Test
```bash
curl -X GET http://localhost:3000/api/testimonials \
  -H "Authorization: Bearer <your_jwt_token>"
```

### Invalid Token Test
```bash
curl -X GET http://localhost:3000/api/testimonials \
  -H "Authorization: Bearer invalid_token"
```

## Migration Notes

If you're updating existing frontend code:
1. Ensure all admin API calls include the JWT token
2. Update API endpoints that changed (e.g., admin projects endpoint)
3. Handle new error codes appropriately
4. Test all dashboard functionality after implementation

## Security Checklist

- ✅ JWT authentication implemented
- ✅ Admin role verification
- ✅ Token expiration handling
- ✅ Secure error messages
- ✅ Public endpoints remain accessible
- ✅ Protected endpoints secured
- ✅ Frontend integration ready
- ✅ Comprehensive error handling
- ⚠️ Change JWT secret in production
- ⚠️ Consider implementing refresh tokens for production
- ⚠️ Add rate limiting for login attempts
- ⚠️ Implement proper password hashing for production