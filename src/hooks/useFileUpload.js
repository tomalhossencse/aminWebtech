import { useState } from 'react';
import { useToast } from '../Context/ToastContext';
import useMediaAPI from './useMediaAPI';

const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { success, error: showError } = useToast();
  const { uploadMedia } = useMediaAPI();

  const uploadFile = async (file, options = {}) => {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4'],
      onProgress = null
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
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          if (onProgress) {
            onProgress(Math.min(newProgress, 90));
          }
          return Math.min(newProgress, 90);
        });
      }, 200);

      // Get image dimensions if it's an image
      let width = null;
      let height = null;
      
      if (file.type.startsWith('image/')) {
        try {
          const dimensions = await getImageDimensions(file);
          width = dimensions.width;
          height = dimensions.height;
        } catch (error) {
          console.log('Could not get image dimensions:', error);
        }
      }

      // Prepare media data for backend
      const mediaData = {
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        originalName: file.name,
        type: getFileTypeFromMime(file.type),
        size: file.size,
        url: URL.createObjectURL(file), // Temporary URL for preview
        alt: file.name,
        mimeType: file.type,
        width,
        height
      };

      // Upload to backend
      const result = await uploadMedia(mediaData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (onProgress) {
        onProgress(100);
      }

      success(`File "${file.name}" uploaded successfully`);
      
      return {
        success: true,
        ...result,
        tempUrl: mediaData.url // Keep temp URL for immediate preview
      };

    } catch (error) {
      console.error('Upload error:', error);
      showError('Failed to upload file');
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const uploadMultipleFiles = async (files, options = {}) => {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await uploadFile(file, {
        ...options,
        onProgress: (progress) => {
          const totalProgress = ((i / files.length) * 100) + (progress / files.length);
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

  return {
    uploading,
    uploadProgress,
    uploadFile,
    uploadMultipleFiles,
    selectAndUploadFile
  };
};

export default useFileUpload;