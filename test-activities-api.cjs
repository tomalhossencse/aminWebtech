const axios = require('axios');

// Test the activities API endpoints
const testActivitiesAPI = async () => {
  const baseURL = 'http://localhost:3000';
  
  // Test IP detection first
  console.log('🌐 Testing IP detection...');
  try {
    const ipResponse = await axios.get(`${baseURL}/api/test/ip`);
    console.log('✅ IP Detection result:', ipResponse.data);
  } catch (error) {
    console.log('❌ IP detection error:', error.response?.data || error.message);
  }
  
  // Test login to get token
  console.log('\n🔐 Testing login...');
  try {
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');
    
    // Set up headers for authenticated requests
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Test getting recent activities
    console.log('\n📊 Testing recent activities...');
    try {
      const activitiesResponse = await axios.get(`${baseURL}/api/activities/recent`, { headers });
      console.log('✅ Recent activities fetched:', activitiesResponse.data.length, 'activities');
      if (activitiesResponse.data.length > 0) {
        console.log('Sample activity:', {
          user: activitiesResponse.data[0].user,
          action: activitiesResponse.data[0].action,
          ip: activitiesResponse.data[0].ip,
          timestamp: activitiesResponse.data[0].timestamp
        });
      }
    } catch (error) {
      console.log('❌ Recent activities error:', error.response?.data || error.message);
    }
    
    // Test creating a manual activity
    console.log('\n📝 Testing create activity...');
    try {
      const createResponse = await axios.post(`${baseURL}/api/activities`, {
        type: 'action',
        action: 'Test activity created via API',
        user: 'Test User',
        metadata: { test: true }
      }, { headers });
      console.log('✅ Activity created:', createResponse.data);
    } catch (error) {
      console.log('❌ Create activity error:', error.response?.data || error.message);
    }
    
    // Test getting activities again to see the new one
    console.log('\n📊 Testing recent activities after creation...');
    try {
      const activitiesResponse2 = await axios.get(`${baseURL}/api/activities/recent`, { headers });
      console.log('✅ Recent activities fetched:', activitiesResponse2.data.length, 'activities');
      if (activitiesResponse2.data.length > 0) {
        console.log('Latest activity:', {
          user: activitiesResponse2.data[0].user,
          action: activitiesResponse2.data[0].action,
          ip: activitiesResponse2.data[0].ip,
          timestamp: activitiesResponse2.data[0].timestamp
        });
      }
    } catch (error) {
      console.log('❌ Recent activities error:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data || error.message);
  }
};

// Run the test
console.log('🧪 Starting Activities API Test...');
console.log('Make sure the server is running on http://localhost:3000\n');

testActivitiesAPI().then(() => {
  console.log('\n✅ Test completed!');
}).catch((error) => {
  console.error('❌ Test failed:', error);
});