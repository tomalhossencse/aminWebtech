// ImgBB Upload Service
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || 'your-imgbb-api-key-here';
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

class ImgBBService {
  /**
   * Upload image to ImgBB
   * @param {File} file - The image file to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result with ImgBB URLs
   */
  async uploadImage(file, options = {}) {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are supported for ImgBB upload');
      }

      // Validate file size (ImgBB has a 32MB limit)
      const maxSize = 32 * 1024 * 1024; // 32MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 32MB for ImgBB upload');
      }

      // Convert file to base64
      const base64 = await this.fileToBase64(file);
      
      // Prepare form data
      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', base64);
      
      // Optional: Set expiration (in seconds)
      if (options.expiration) {
        formData.append('expiration', options.expiration);
      }

      // Optional: Set custom name
      if (options.name) {
        formData.append('name', options.name);
      }

      console.log('📤 Uploading to ImgBB:', file.name);

      // Upload to ImgBB
      const response = await fetch(IMGBB_UPLOAD_URL, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'ImgBB upload failed');
      }

      console.log('✅ ImgBB upload successful:', result.data);

      // Return formatted result
      return {
        success: true,
        data: {
          id: result.data.id,
          title: result.data.title,
          url: result.data.url,
          display_url: result.data.display_url,
          thumb: {
            url: result.data.thumb.url,
            title: result.data.thumb.title
          },
          medium: {
            url: result.data.medium?.url || result.data.url,
            title: result.data.medium?.title || result.data.title
          },
          delete_url: result.data.delete_url,
          size: result.data.size,
          width: result.data.width,
          height: result.data.height,
          mime: result.data.image.mime,
          extension: result.data.image.extension,
          filename: result.data.image.filename
        }
      };

    } catch (error) {
      console.error('❌ ImgBB upload error:', error);
      throw error;
    }
  }

  /**
   * Upload multiple images to ImgBB
   * @param {File[]} files - Array of image files
   * @param {Object} options - Upload options
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object[]>} Array of upload results
   */
  async uploadMultipleImages(files, options = {}, onProgress = null) {
    const results = [];
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      throw new Error('No image files found to upload to ImgBB');
    }

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      
      try {
        const result = await this.uploadImage(file, {
          ...options,
          name: options.name ? `${options.name}_${i + 1}` : undefined
        });
        
        results.push({
          file: file.name,
          success: true,
          ...result
        });

        // Report progress
        if (onProgress) {
          const progress = ((i + 1) / imageFiles.length) * 100;
          onProgress(progress, i + 1, imageFiles.length);
        }

      } catch (error) {
        console.error(`❌ Failed to upload ${file.name}:`, error);
        results.push({
          file: file.name,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Convert file to base64 string
   * @param {File} file - The file to convert
   * @returns {Promise<string>} Base64 string without data URL prefix
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        // Remove data URL prefix (data:image/jpeg;base64,)
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to convert file to base64'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get image dimensions from file
   * @param {File} file - Image file
   * @returns {Promise<Object>} Width and height
   */
  getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Validate ImgBB API key
   * @returns {boolean} True if API key is configured
   */
  isConfigured() {
    return IMGBB_API_KEY && IMGBB_API_KEY !== 'your-imgbb-api-key-here';
  }

  /**
   * Get API key status
   * @returns {Object} API key configuration status
   */
  getStatus() {
    return {
      configured: this.isConfigured(),
      apiKey: IMGBB_API_KEY ? `${IMGBB_API_KEY.substring(0, 8)}...` : 'Not set'
    };
  }
}

export default new ImgBBService();