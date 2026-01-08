import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import useAxios from './useAxios';

// Hook for tracking visitors
export const useVisitorTracking = () => {
  const axios = useAxios();
  const visitorIdRef = useRef(null);
  const pageStartTimeRef = useRef(null);
  const hasTrackedRef = useRef(false);
  
  // Mutation for tracking new visitor/page view
  const trackVisitor = useMutation({
    mutationFn: async (data) => {
      console.log('📤 Sending tracking data:', data);
      const response = await axios.post('/analytics/track-visitor', data);
      return response.data;
    },
    onSuccess: (data) => {
      visitorIdRef.current = data.visitorId;
      pageStartTimeRef.current = Date.now();
      console.log('✅ Visitor tracked successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Failed to track visitor:', error.response?.data || error.message);
    }
  });

  // Mutation for updating page time
  const updatePageTime = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put('/analytics/update-page-time', data);
      return response.data;
    },
    onError: (error) => {
      console.error('Failed to update page time:', error);
    }
  });

  // Function to generate a unique device fingerprint
  const generateDeviceFingerprint = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvasFingerprint: canvas.toDataURL(),
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      deviceMemory: navigator.deviceMemory || 'unknown',
      touchSupport: 'ontouchstart' in window,
      webglVendor: (() => {
        try {
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          return debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
        } catch {
          return 'unknown';
        }
      })()
    };
    
    // Create a hash from the fingerprint
    const fingerprintString = JSON.stringify(fingerprint);
    let hash = 0;
    for (let i = 0; i < fingerprintString.length; i++) {
      const char = fingerprintString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to positive hex string
    const deviceId = Math.abs(hash).toString(16);
    console.log('🔐 Generated device fingerprint:', deviceId);
    
    return {
      deviceId,
      fingerprint
    };
  };

  // Function to get or create persistent device ID
  const getDeviceId = () => {
    // Try to get existing device ID from localStorage
    let deviceId = localStorage.getItem('analytics_device_id');
    
    if (!deviceId) {
      // Generate new device fingerprint
      const { deviceId: newDeviceId } = generateDeviceFingerprint();
      deviceId = newDeviceId;
      
      // Store in localStorage for persistence
      localStorage.setItem('analytics_device_id', deviceId);
      console.log('💾 Stored new device ID:', deviceId);
    } else {
      console.log('🔍 Found existing device ID:', deviceId);
    }
    
    return deviceId;
  };
  // Function to get visitor info
  const getVisitorInfo = () => {
    const userAgent = navigator.userAgent;
    let device = 'Desktop';
    let browser = 'Unknown';

    // Detect device
    if (/Mobile|Android|iPhone/.test(userAgent)) {
      device = 'Mobile';
    } else if (/iPad|Tablet/.test(userAgent)) {
      device = 'Tablet';
    }

    // Detect browser
    if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) {
      browser = 'Chrome';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari';
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge';
    }

    // Get unique device ID
    const deviceId = getDeviceId();

    return {
      userAgent,
      device,
      browser,
      deviceId,
      path: window.location.pathname,
      referrer: document.referrer || ''
    };
  };

  // Function to get IP and location with multiple fallbacks
  const getLocationInfo = async () => {
    // Try multiple location services
    const services = [
      {
        name: 'ipapi.co',
        url: 'https://ipapi.co/json/',
        parser: (data) => ({
          ipAddress: data.ip || 'Unknown',
          country: data.country_name || 'Unknown',
          city: data.city || 'Unknown',
          countryCode: data.country_code || 'XX'
        })
      },
      {
        name: 'ipify + ipapi',
        url: 'https://api.ipify.org?format=json',
        parser: async (data) => {
          try {
            const locationResponse = await fetch(`https://ipapi.co/${data.ip}/json/`);
            const locationData = await locationResponse.json();
            return {
              ipAddress: data.ip || 'Unknown',
              country: locationData.country_name || 'Unknown',
              city: locationData.city || 'Unknown',
              countryCode: locationData.country_code || 'XX'
            };
          } catch {
            return {
              ipAddress: data.ip || 'Unknown',
              country: 'Unknown',
              city: 'Unknown',
              countryCode: 'XX'
            };
          }
        }
      }
    ];

    for (const service of services) {
      try {
        console.log(`🔍 Trying ${service.name} for location data...`);
        const response = await fetch(service.url, { 
          timeout: 5000,
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.reason || 'Service error');
        }
        
        const result = await service.parser(data);
        console.log(`✅ Got location from ${service.name}:`, result);
        return result;
      } catch (error) {
        console.warn(`❌ ${service.name} failed:`, error.message);
        continue;
      }
    }

    // Final fallback - generate a unique identifier based on browser fingerprint
    const fingerprint = btoa(navigator.userAgent + navigator.language + screen.width + screen.height).slice(0, 15);
    console.log('🔧 Using fallback fingerprint for tracking');
    
    return {
      ipAddress: `fp_${fingerprint}`,
      country: 'Unknown',
      city: 'Unknown',
      countryCode: 'XX'
    };
  };

  // Function to track current page
  const trackCurrentPage = async () => {
    if (hasTrackedRef.current) {
      console.log('⏭️ Already tracked this session');
      return;
    }
    
    try {
      console.log('🚀 Starting visitor tracking for:', window.location.pathname);
      const visitorInfo = getVisitorInfo();
      console.log('🖥️ Browser info:', visitorInfo);
      
      const locationInfo = await getLocationInfo();
      console.log('🌍 Location info:', locationInfo);
      
      const trackingData = {
        ...visitorInfo,
        ...locationInfo
      };
      
      console.log('📊 Final tracking data:', trackingData);
      
      await trackVisitor.mutateAsync(trackingData);
      hasTrackedRef.current = true;
    } catch (error) {
      console.error('❌ Failed to track visitor:', error);
    }
  };

  // Function to update page time when leaving
  const updateCurrentPageTime = () => {
    if (visitorIdRef.current && pageStartTimeRef.current) {
      const timeOnPage = Math.round((Date.now() - pageStartTimeRef.current) / 1000);
      
      if (timeOnPage > 0) {
        console.log(`⏱️ Updating page time: ${timeOnPage}s for ${window.location.pathname}`);
        updatePageTime.mutate({
          visitorId: visitorIdRef.current,
          path: window.location.pathname,
          timeOnPage
        });
      }
    }
  };

  // Effect to track page views and handle page unload
  useEffect(() => {
    console.log('🎯 VisitorTracker mounted for path:', window.location.pathname);
    
    // Track current page on mount
    trackCurrentPage();

    // Handle page unload
    const handleBeforeUnload = () => {
      updateCurrentPageTime();
    };

    // Handle page visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateCurrentPageTime();
      } else if (document.visibilityState === 'visible' && pageStartTimeRef.current) {
        pageStartTimeRef.current = Date.now();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      updateCurrentPageTime();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    trackCurrentPage,
    updateCurrentPageTime,
    isTracking: trackVisitor.isPending,
    trackingError: trackVisitor.error
  };
};