const axios = require('axios');

async function testCompleteServer() {
  console.log('🧪 Testing Complete Server...');
  
  const baseURL = 'http://localhost:3000'; // Your server port
  
  try {
    // Test basic endpoint
    console.log('\n🏠 Testing home endpoint...');
    const homeResponse = await axios.get(baseURL);
    console.log('✅ Home:', homeResponse.data);
    
    // Test services endpoint
    console.log('\n📋 Testing services endpoint...');
    const servicesResponse = await axios.get(`${baseURL}/services`);
    console.log('✅ Services:', servicesResponse.data.length, 'services found');
    
    // Test login
    console.log('\n🔐 Testing login...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    console.log('✅ Login successful');
    
    const token = loginResponse.data.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    // Test activities endpoint
    console.log('\n📊 Testing activities endpoint...');
    const activitiesResponse = await axios.get(`${baseURL}/api/activities/recent`, { headers });
    console.log('✅ Activities:', activitiesResponse.data.length, 'activities found');
    
    console.log('\n🎉 All tests passed! Your server is ready for deployment.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure your server is running: npm run production');
    }
  }
}

testCompleteServer();