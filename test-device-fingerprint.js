// Test script to verify device fingerprinting works correctly
import axios from 'axios';

const baseURL = 'http://localhost:3001';

// Simulate different devices with same IP
const testDevices = [
  {
    name: 'Mobile Device',
    data: {
      ipAddress: '122.152.51.52',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      country: 'Bangladesh',
      city: 'Dhaka',
      countryCode: 'BD',
      device: 'Mobile',
      browser: 'Safari',
      deviceId: 'mobile_abc123',
      path: '/',
      referrer: ''
    }
  },
  {
    name: 'Laptop Device',
    data: {
      ipAddress: '122.152.51.52', // Same IP
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      country: 'Bangladesh',
      city: 'Dhaka',
      countryCode: 'BD',
      device: 'Desktop',
      browser: 'Chrome',
      deviceId: 'laptop_xyz789', // Different device ID
      path: '/',
      referrer: ''
    }
  }
];

async function testDeviceTracking() {
  console.log('🧪 Testing Device Fingerprinting...\n');

  for (const device of testDevices) {
    try {
      console.log(`📱 Testing ${device.name}...`);
      
      const response = await axios.post(`${baseURL}/analytics/track-visitor`, device.data);
      
      console.log(`✅ ${device.name} Response:`, {
        success: response.data.success,
        visitorId: response.data.visitorId,
        uniqueVisitorId: response.data.uniqueVisitorId,
        isNewDevice: response.data.isNewDevice
      });
      
      console.log('---');
    } catch (error) {
      console.error(`❌ ${device.name} Error:`, error.response?.data || error.message);
    }
  }

  // Test fetching recent visitors to see if they're tracked separately
  try {
    console.log('\n📊 Fetching recent visitors...');
    const visitorsResponse = await axios.get(`${baseURL}/analytics/recent-visitors?limit=5`);
    
    console.log('Recent visitors:');
    visitorsResponse.data.forEach((visitor, index) => {
      console.log(`${index + 1}. IP: ${visitor.ip}, Device: ${visitor.device}, Browser: ${visitor.browser}, ID: ${visitor.uniqueVisitorId || 'legacy'}`);
    });
    
  } catch (error) {
    console.error('❌ Error fetching visitors:', error.response?.data || error.message);
  }
}

// Run the test
testDeviceTracking();