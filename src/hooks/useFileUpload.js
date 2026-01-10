import { useState } from 'react';
import { useToast } from '../Context/ToastContext';
import useMediaAPI from './useMediaAPI';
import imgbbService from '../services/imgbbService';

const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { success, error: showError } = useToast();
  const { uploadMedia } = useMediaAPI();

  const uploadFile = async (file, options = {}) => {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4'],
      onProgress = null,
      useImgBB = true // Enable ImgBB by default for images
    } = options;

    // Validate file size
    if (file.size > maxSize) {
      showError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
      return null;
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      showError('File type not supported');
      return null;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let uploadResult = null;
      let mediaData = null;

      // Check if it's an image and ImgBB is enabled and configured
      const isImage = file.type.startsWith('image/');
      const shouldUseImgBB = isImage && useImgBB && imgbbService.isConfigured();

      if (shouldUseImgBB) {
        console.log('📤 Uploading image to ImgBB:', file.name);
        
        // Upload to ImgBB
        setUploadProgress(20);
        if (onProgress) onProgress(20);

        const imgbbResult = await imgbbService.uploadImage(file, {
          name: file.name.replace(/\.[^/.]+$/, "")
        });

        setUploadProgress(60);
        if (onProgress) onProgress(60);

        // Prepare media data with ImgBB URLs
        mediaData = {
          name: file.name.replace(/\.[^/.]+$/, ""),
          originalName: file.name,
          type: getFileTypeFromMime(file.type),
          size: file.size,
          url: imgbbResult.data.url,
          display_url: imgbbResult.data.display_url,
          thumb_url: imgbbResult.data.thumb.url,
          medium_url: imgbbResult.data.medium.url,
          delete_url: imgbbResult.data.delete_url,
          alt: file.name,
          mimeType: file.type,
          width: imgbbResult.data.width,
          height: imgbbResult.data.height,
          imgbb_id: imgbbResult.data.id,
          imgbb_filename: imgbbResult.data.filename,
          storage_provider: 'imgbb'
        };

        console.log('✅ ImgBB upload successful, saving to database...');

      } else {
        // For non-images or when ImgBB is not configured, use local/traditional upload
        console.log('📤 Using traditional upload for:', file.name);
        
        setUploadProgress(30);
        if (onProgress) onProgress(30);

        // Get image dimensions if it's an image
        let width = null;
        let height = null;
        
        if (isImage) {
          try {
            const dimensions = await getImageDimensions(file);
            width = dimensions.width;
            height = dimensions.height;
          } catch (error) {
            console.log('Could not get image dimensions:', error);
          }
        }

        setUploadProgress(50);
        if (onProgress) onProgress(50);

        // Prepare media data for traditional upload
        mediaData = {
          name: file.name.replace(/\.[^/.]+$/, ""),
          originalName: file.name,
          type: getFileTypeFromMime(file.type),
          size: file.size,
          url: URL.createObjectURL(file), // Temporary URL for preview
          alt: file.name,
          mimeType: file.type,
          width,
          height,
          storage_provider: 'local'
        };
      }

      setUploadProgress(80);
      if (onProgress) onProgress(80);

      // Save to backend database
      const result = await uploadMedia(mediaData);
      
      setUploadProgress(100);
      if (onProgress) onProgress(100);

      success(`File "${file.name}" uploaded successfully${shouldUseImgBB ? ' to ImgBB' : ''}`);
      
      return {
        success: true,
        ...result,
        tempUrl: shouldUseImgBB ? mediaData.url : mediaData.url, // Use ImgBB URL or temp URL
        imgbbData: shouldUseImgBB ? mediaData : null
      };

    } catch (error) {
      console.error('Upload error:', error);
      
      // Show specific error messages
      if (error.message.includes('ImgBB')) {
        showError(`ImgBB upload failed: ${error.message}`);
      } else {
        showError('Failed to upload file');
      }
      
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const uploadMultipleFiles = async (files, options = {}) => {
    const results = [];
    const totalFiles = files.length;
    
    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const result = await uploadFile(file, {
        ...options,
        onProgress: (progress) => {
          const totalProgress = ((i / totalFiles) * 100) + (progress / totalFiles);
          setUploadProgress(totalProgress);
          if (options.onProgress) {
            options.onProgress(totalProgress);
          }
        }
      });
      
      if (result) {
        results.push(result);
      }
    }
    
    return results;
  };

  const selectAndUploadFile = (options = {}) => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = options.multiple || false;
      
      if (options.accept) {
        input.accept = options.accept;
      }
      
      input.onchange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) {
          resolve(null);
          return;
        }
        
        if (options.multiple) {
          const results = await uploadMultipleFiles(files, options);
          resolve(results);
        } else {
          const result = await uploadFile(files[0], options);
          resolve(result);
        }
      };
      
      input.click();
    });
  };

  // Helper function to get image dimensions
  const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  // Helper function to get file type from mime type
  const getFileTypeFromMime = (mimeType) => {
    if (!mimeType) return 'Document';
    
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    return 'Document';
  };

  // Get ImgBB service status
  const getImgBBStatus = () => {
    return imgbbService.getStatus();
  };

  return {
    uploading,
    uploadProgress,
    uploadFile,
    uploadMultipleFiles,
    selectAndUploadFile,
    getImgBBStatus,
    imgbbService
  };
};

export default useFileUpload;