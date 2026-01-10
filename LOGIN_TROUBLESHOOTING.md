# Admin Login Troubleshooting Guide

## Current Status
✅ **Backend Server**: Running on http://localhost:3000  
✅ **Frontend Server**: Running on http://localhost:5174  
✅ **Login API**: Working correctly (tested with curl)  
✅ **Authentication Logic**: Properly implemented  

## Test Steps

### 1. Access the Login Page
- Open your browser and go to: `http://localhost:5174/admin`
- You should see the admin login form

### 2. Test Login Credentials
- **Username**: `admin`
- **Password**: `admin123`

### 3. Check Browser Console
- Open Developer Tools (F12)
- Go to Console tab
- Look for debug messages starting with 🔐, ✅, ❌, 🚀, 📤

### 4. Check Network Tab
- In Developer Tools, go to Network tab
- Try to login and look for the POST request to `/api/auth/login`
- Check if the request is successful (status 200)

## Common Issues & Solutions

### Issue 1: "Network Error" or "Connection Refused"
**Cause**: Backend server not running  
**Solution**: Make sure the mock server is running:
```bash
node server-mock.cjs
```

### Issue 2: "Invalid Credentials" Error
**Cause**: Wrong username/password  
**Solution**: Use exact credentials:
- Username: `admin` (lowercase)
- Password: `admin123`

### Issue 3: Login Success but No Redirect
**Cause**: Navigation issue  
**Solution**: Check browser console for navigation logs

### Issue 4: CORS Error
**Cause**: Cross-origin request blocked  
**Solution**: The mock server already has CORS enabled

## Debug Information

### Expected Console Output on Successful Login:
```
🚀 Form submitted with: {username: "admin", password: "***"}
📤 Calling login mutation...
🔐 Attempting login with: {username: "admin"}
✅ Login response: {success: true, token: "jwt-token-here", user: {...}}
🎉 Login successful, data: {success: true, token: "jwt-token-here", user: {...}}
🔑 Token stored, navigating to dashboard...
✅ Login mutation completed successfully
```

### Expected Network Request:
- **URL**: `http://localhost:3000/api/auth/login`
- **Method**: POST
- **Status**: 200 OK
- **Response**: `{"success":true,"token":"jwt-token-here","user":{"id":1,"username":"admin","role":"admin"}}`

## Manual Test Commands

### Test Backend Directly:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Check if Servers are Running:
```bash
# Check if port 3000 is in use (backend)
netstat -an | findstr :3000

# Check if port 5174 is in use (frontend)  
netstat -an | findstr :5174
```

## Next Steps if Still Not Working

1. **Clear Browser Cache**: Hard refresh (Ctrl+F5) or clear localStorage
2. **Check Browser Console**: Look for any JavaScript errors
3. **Verify Server Status**: Ensure both servers are running without errors
4. **Test Different Browser**: Try in incognito mode or different browser

## Contact Information
If the issue persists, provide:
- Browser console logs
- Network tab screenshots
- Any error messages
- Steps you followed