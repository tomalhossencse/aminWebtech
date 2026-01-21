const axios = require('axios');

const BASE_URL = 'https://amin-web-tech-server.vercel.app';

async function testVisitorDetail() {
  console.log('🔍 Testing visitor detail functionality...\n');

  try {
    // Step 1: Login to get token
    console.log('1. Logging in to get authentication token...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');

    const authHeaders = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    // Step 2: Get recent visitors to get a visitor ID
    console.log('\n2. Fetching recent visitors to get a visitor ID...');
    const visitorsResponse = await axios.get(`${BASE_URL}/analytics/recent-visitors?limit=5`, authHeaders);
    
    if (visitorsResponse.data.length === 0) {
      console.log('❌ No visitors found to test with');
      return;
    }

    const firstVisitor = visitorsResponse.data[0];
    console.log('✅ Found visitor:', {
      id: firstVisitor.id,
      ip: firstVisitor.ip,
      country: firstVisitor.country,
      device: firstVisitor.device
    });

    // Step 3: Test visitor detail endpoint
    console.log('\n3. Testing visitor detail endpoint...');
    try {
      const detailResponse = await axios.get(`${BASE_URL}/analytics/visitor/${firstVisitor.id}`, authHeaders);
      
      console.log('✅ Visitor detail endpoint working!');
      console.log('📊 Visitor details:', {
        id: detailResponse.data.id,
        sessionId: detailResponse.data.sessionId,
        ip: detailResponse.data.ip,
        location: `${detailResponse.data.city}, ${detailResponse.data.country}`,
        device: detailResponse.data.device,
        browser: detailResponse.data.browser,
        pages: detailResponse.data.pages,
        duration: detailResponse.data.duration,
        pageHistoryCount: detailResponse.data.pageHistory?.length || 0
      });

    } catch (detailError) {
      if (detailError.response?.status === 404) {
        console.log('❌ Visitor detail endpoint returns 404 - endpoint might not be deployed yet');
        console.log('   This is expected if the server hasn\'t been redeployed with the new endpoint');
      } else {
        console.log('❌ Visitor detail endpoint error:', detailError.response?.status, detailError.message);
      }
    }

    // Step 4: Test with invalid visitor ID
    console.log('\n4. Testing with invalid visitor ID...');
    try {
      await axios.get(`${BASE_URL}/analytics/visitor/invalid-id`, authHeaders);
      console.log('❌ Should have returned 404 for invalid ID');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Correctly returns 404 for invalid visitor ID');
      } else if (error.response?.status === 400) {
        console.log('✅ Correctly returns 400 for invalid ObjectId format');
      } else {
        console.log('❓ Unexpected error for invalid ID:', error.response?.status);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }

  console.log('\n🏁 Visitor detail test completed!');
}

testVisitorDetail().catch(console.error);