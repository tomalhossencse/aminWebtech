const axios = require('axios');

const BASE_URL = 'https://amin-web-tech-server.vercel.app';

async function testEndpoints() {
  console.log('🔍 Testing server endpoints...\n');

  // Test 1: Basic server connectivity
  try {
    console.log('1. Testing basic connectivity...');
    const response = await axios.get(`${BASE_URL}/api/test/ip`);
    console.log('✅ Server is reachable');
    console.log('   Response:', response.data.message);
  } catch (error) {
    console.log('❌ Server connectivity failed:', error.message);
    return;
  }

  // Test 2: Test contacts endpoint (should return 404 without auth)
  try {
    console.log('\n2. Testing contacts endpoint without auth...');
    const response = await axios.get(`${BASE_URL}/api/contacts`);
    console.log('✅ Contacts endpoint accessible');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Contacts endpoint properly protected (401 Unauthorized)');
    } else if (error.response?.status === 404) {
      console.log('❌ Contacts endpoint returns 404 - endpoint might not exist');
    } else {
      console.log('❌ Contacts endpoint error:', error.response?.status, error.message);
    }
  }

  // Test 3: Test activities endpoint (should return 404 without auth)
  try {
    console.log('\n3. Testing activities endpoint without auth...');
    const response = await axios.get(`${BASE_URL}/api/activities/recent`);
    console.log('✅ Activities endpoint accessible');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Activities endpoint properly protected (401 Unauthorized)');
    } else if (error.response?.status === 404) {
      console.log('❌ Activities endpoint returns 404 - endpoint might not exist');
    } else {
      console.log('❌ Activities endpoint error:', error.response?.status, error.message);
    }
  }

  // Test 4: Test login endpoint
  try {
    console.log('\n4. Testing login endpoint...');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    console.log('✅ Login successful');
    
    const token = response.data.token;
    console.log('   Token received:', token ? 'Yes' : 'No');

    // Test 5: Test protected endpoints with token
    if (token) {
      console.log('\n5. Testing protected endpoints with token...');
      
      const authHeaders = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      try {
        const contactsResponse = await axios.get(`${BASE_URL}/api/contacts`, authHeaders);
        console.log('✅ Contacts endpoint accessible with auth');
        console.log('   Contacts count:', contactsResponse.data.contacts?.length || 0);
      } catch (error) {
        console.log('❌ Contacts endpoint failed with auth:', error.response?.status, error.message);
      }

      try {
        const activitiesResponse = await axios.get(`${BASE_URL}/api/activities/recent?limit=6`, authHeaders);
        console.log('✅ Activities endpoint accessible with auth');
        console.log('   Activities count:', activitiesResponse.data?.length || 0);
      } catch (error) {
        console.log('❌ Activities endpoint failed with auth:', error.response?.status, error.message);
      }
    }

  } catch (error) {
    console.log('❌ Login failed:', error.response?.status, error.message);
  }

  console.log('\n🏁 Test completed!');
}

testEndpoints().catch(console.error);