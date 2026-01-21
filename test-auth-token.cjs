// Test script to check authentication token
const axios = require('axios');

const testAuth = async () => {
  console.log('🔍 Testing authentication with production server...');
  
  // Test login first
  try {
    console.log('1. Testing login...');
    const loginResponse = await axios.post('https://amin-web-tech-server.vercel.app/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ Login successful');
    const token = loginResponse.data.token;
    console.log('🔑 Token received:', token ? 'Yes' : 'No');
    
    if (token) {
      // Test authenticated endpoint
      console.log('2. Testing authenticated service update...');
      const updateResponse = await axios.put(
        'https://amin-web-tech-server.vercel.app/services/507f1f77bcf86cd799439021',
        {
          name: 'Test Service Update',
          description: 'Testing authentication'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Service update successful:', updateResponse.status);
      console.log('📝 Response:', updateResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.status, error.response?.data || error.message);
  }
};

testAuth();