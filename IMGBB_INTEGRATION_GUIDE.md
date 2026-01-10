# ImgBB Integration Guide

## Overview
This guide explains how to integrate ImgBB image hosting service with your media management system. ImgBB provides free image hosting with direct URLs, making it perfect for storing and serving images.

## Features
- ✅ **Free Image Hosting**: Up to 32MB per image
- ✅ **Direct URLs**: Get permanent image URLs
- ✅ **Multiple Formats**: Support for JPG, PNG, GIF, WebP
- ✅ **Automatic Thumbnails**: ImgBB generates thumb and medium sizes
- ✅ **Fast CDN**: Global content delivery network
- ✅ **No Bandwidth Limits**: Unlimited image views

## Setup Instructions

### Step 1: Get ImgBB API Key
1. Go to [ImgBB API](https://api.imgbb.com/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key

### Step 2: Configure Environment Variables
Add your ImgBB API key to your `.env` file:

```env
VITE_IMGBB_API_KEY=your_actual_api_key_here
```

**Important**: Replace `your_actual_api_key_here` with your real API key from ImgBB.

### Step 3: Restart Development Server
After adding the API key, restart your development server:

```bash
npm run dev
```

## How It Works

### Frontend Integration
1. **File Selection**: User selects image files through the media management interface
2. **ImgBB Upload**: Images are automatically uploaded to ImgBB using their API
3. **URL Storage**: ImgBB returns permanent URLs which are stored in your database
4. **Display**: Images are displayed using ImgBB URLs for fast loading

### Backend Integration
The backend stores ImgBB metadata including:
- `url`: Main image URL
- `display_url`: Display URL (same as url)
- `thumb_url`: Thumbnail URL
- `medium_url`: Medium size URL
- `delete_url`: URL for deleting the image
- `imgbb_id`: ImgBB unique identifier
- `storage_provider`: Set to 'imgbb'

### Fallback System
- **ImgBB Available**: Images uploaded to ImgBB automatically
- **ImgBB Unavailable**: Falls back to local storage
- **Mixed Storage**: Supports both ImgBB and local files simultaneously

## API Endpoints

### Upload Media with ImgBB
```javascript
POST /api/media
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "name": "hero-image",
  "originalName": "hero-image.jpg",
  "type": "Image",
  "size": 1024000,
  "url": "https://i.ibb.co/abc123/hero-image.jpg",
  "display_url": "https://i.ibb.co/abc123/hero-image.jpg",
  "thumb_url": "https://i.ibb.co/abc123/hero-image-thumb.jpg",
  "medium_url": "https://i.ibb.co/abc123/hero-image-medium.jpg",
  "delete_url": "https://ibb.co/delete/abc123",
  "alt": "Hero background image",
  "mimeType": "image/jpeg",
  "width": 1920,
  "height": 1080,
  "imgbb_id": "abc123",
  "imgbb_filename": "hero-image.jpg",
  "storage_provider": "imgbb"
}
```

## Frontend Usage

### Basic Upload
```javascript
import useFileUpload from '../hooks/useFileUpload';

const { selectAndUploadFile, getImgBBStatus } = useFileUpload();

// Check ImgBB status
const imgbbStatus = getImgBBStatus();
console.log('ImgBB configured:', imgbbStatus.configured);

// Upload files (ImgBB automatic for images)
const handleUpload = async () => {
  const results = await selectAndUploadFile({
    multiple: true,
    accept: 'image/*',
    useImgBB: true // Enable ImgBB (default: true)
  });
};
```

### Manual ImgBB Upload
```javascript
import imgbbService from '../services/imgbbService';

// Upload single image
const uploadToImgBB = async (file) => {
  try {
    const result = await imgbbService.uploadImage(file, {
      name: 'custom-name',
      expiration: 3600 // Optional: expire in 1 hour
    });
    
    console.log('ImgBB URL:', result.data.url);
    console.log('Thumbnail:', result.data.thumb.url);
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
};

// Upload multiple images
const uploadMultiple = async (files) => {
  const results = await imgbbService.uploadMultipleImages(
    files,
    { name: 'batch-upload' },
    (progress, current, total) => {
      console.log(`Progress: ${progress}% (${current}/${total})`);
    }
  );
};
```

## Configuration Options

### ImgBB Service Options
```javascript
// Upload with custom options
const result = await imgbbService.uploadImage(file, {
  name: 'custom-filename',     // Custom filename
  expiration: 3600            // Expire in seconds (optional)
});
```

### File Upload Options
```javascript
const results = await selectAndUploadFile({
  multiple: true,              // Allow multiple files
  accept: 'image/*',          // File type filter
  maxSize: 32 * 1024 * 1024,  // 32MB max for ImgBB
  useImgBB: true,             // Enable ImgBB (default: true)
  allowedTypes: [             // Allowed MIME types
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
});
```

## Error Handling

### Common Errors
1. **API Key Not Set**: Configure `VITE_IMGBB_API_KEY` in `.env`
2. **File Too Large**: ImgBB limit is 32MB per image
3. **Invalid File Type**: Only images supported for ImgBB
4. **Network Error**: Check internet connection
5. **API Limit Reached**: ImgBB free tier has usage limits

### Error Messages
```javascript
try {
  const result = await imgbbService.uploadImage(file);
} catch (error) {
  switch (error.message) {
    case 'Only image files are supported for ImgBB upload':
      // Handle non-image files
      break;
    case 'File size must be less than 32MB for ImgBB upload':
      // Handle large files
      break;
    case 'ImgBB upload failed':
      // Handle API errors
      break;
  }
}
```

## Status Indicators

### Check Configuration
```javascript
import imgbbService from '../services/imgbbService';

// Check if ImgBB is configured
const isConfigured = imgbbService.isConfigured();

// Get detailed status
const status = imgbbService.getStatus();
console.log('Configured:', status.configured);
console.log('API Key:', status.apiKey); // Masked key
```

### UI Indicators
The media management interface shows:
- ✅ **Green indicator**: ImgBB configured and working
- ⚠️ **Yellow indicator**: ImgBB not configured (using local storage)
- 🔗 **ImgBB badge**: On images hosted on ImgBB

## Best Practices

### 1. Image Optimization
- Compress images before upload to save bandwidth
- Use appropriate dimensions (recommended: 1920×1080 for hero images)
- Choose the right format (JPG for photos, PNG for graphics)

### 2. Error Handling
- Always wrap ImgBB calls in try-catch blocks
- Provide fallback to local storage if ImgBB fails
- Show meaningful error messages to users

### 3. Performance
- Use ImgBB thumbnail URLs for previews
- Cache ImgBB URLs in your database
- Implement lazy loading for image galleries

### 4. Security
- Keep your ImgBB API key secure
- Don't expose API keys in client-side code
- Use environment variables for configuration

## Troubleshooting

### ImgBB Not Working
1. **Check API Key**: Verify `VITE_IMGBB_API_KEY` is set correctly
2. **Check File Size**: Ensure images are under 32MB
3. **Check File Type**: Only images are supported
4. **Check Network**: Verify internet connection
5. **Check Console**: Look for error messages in browser console

### Images Not Displaying
1. **Check URLs**: Verify ImgBB URLs are valid
2. **Check CORS**: ImgBB should handle CORS automatically
3. **Check Database**: Ensure URLs are saved correctly
4. **Check Network**: Verify images load in browser

### Upload Failures
1. **API Limits**: Check if you've exceeded ImgBB limits
2. **File Format**: Ensure file is a valid image
3. **Network Issues**: Check internet connection
4. **API Key**: Verify API key is valid and active

## Migration from Local Storage

If you have existing local images and want to migrate to ImgBB:

1. **Backup**: Always backup your existing images
2. **Batch Upload**: Use the multiple upload feature
3. **Update URLs**: Update database records with new ImgBB URLs
4. **Test**: Verify all images display correctly
5. **Cleanup**: Remove old local files after successful migration

## Limits and Pricing

### Free Tier
- **File Size**: Up to 32MB per image
- **Storage**: Unlimited
- **Bandwidth**: Unlimited
- **API Calls**: Rate limited (check ImgBB documentation)

### Paid Plans
ImgBB offers paid plans with higher limits and additional features. Check their website for current pricing.

## Support

For ImgBB-specific issues:
- [ImgBB API Documentation](https://api.imgbb.com/)
- [ImgBB Support](https://imgbb.com/support)

For integration issues:
- Check browser console for errors
- Verify environment variables
- Test with sample images
- Review network requests in DevTools