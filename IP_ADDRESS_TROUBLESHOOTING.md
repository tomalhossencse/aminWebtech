# IP Address Detection Troubleshooting

## Common Issues and Solutions

### 1. **Local Development (localhost)**
When running locally, you'll typically see:
- `localhost` or `127.0.0.1` - This is normal for local development
- `::1` - IPv6 localhost (converted to `localhost` for display)

### 2. **Behind Reverse Proxy/Load Balancer**
If your app is behind nginx, Apache, or a load balancer:
- Add `app.set('trust proxy', true)` in Express
- Check for `X-Forwarded-For` header
- Check for `X-Real-IP` header

### 3. **Cloudflare**
If using Cloudflare:
- Check `CF-Connecting-IP` header (highest priority)
- Cloudflare sets this to the real client IP

### 4. **Production Deployment**
Common headers to check (in priority order):
1. `CF-Connecting-IP` (Cloudflare)
2. `X-Client-IP` (Some proxies)
3. `X-Forwarded-For` (Most common, use first IP)
4. `X-Real-IP` (nginx)
5. `req.connection.remoteAddress` (Direct connection)

## Testing IP Detection

### Test Locally:
```bash
# Start the IP test server
node test-ip-detection.js

# Test from browser
curl http://localhost:3001/test-ip

# Test with custom headers
curl -H "X-Forwarded-For: 203.0.113.1" http://localhost:3001/test-ip
```

### Test Main Server:
```bash
# Test IP detection endpoint
curl http://localhost:3000/api/test/ip

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/activities/recent
```

## Current Implementation

The server now:
1. ✅ Sets `trust proxy` for proper Express IP handling
2. ✅ Checks multiple IP headers in priority order
3. ✅ Cleans up IPv6 mapped addresses
4. ✅ Handles localhost variations
5. ✅ Logs IP detection method (in development)
6. ✅ Passes request object to activity logging

## Expected Behavior

- **Local Development**: Shows `localhost`
- **Production**: Shows real client IP
- **Behind Proxy**: Shows forwarded real IP
- **Cloudflare**: Shows CF-Connecting-IP

## Debugging Steps

1. Check the server logs for IP detection messages
2. Use `/api/test/ip` endpoint to see all IP-related data
3. Run `test-ip-detection.js` for detailed debugging
4. Check browser network tab for request headers
5. Verify proxy/CDN configuration

## Common Solutions

### For nginx:
```nginx
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

### For Apache:
```apache
ProxyPreserveHost On
ProxyPass / http://localhost:3000/
ProxyPassReverse / http://localhost:3000/
```

### For Docker:
```bash
# Run with host network
docker run --network host your-app

# Or map ports properly
docker run -p 3000:3000 your-app
```