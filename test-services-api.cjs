const axios = require('axios');

const baseURL = 'http://localhost:3000';

async function testServicesAPI() {
  console.log('🧪 Starting Services API Test...');
  console.log('Make sure the server is running on', baseURL);

  try {
    // Test login first
    console.log('\n🔐 Testing login...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    console.log('✅ Login successful, token received');

    // Test GET services
    console.log('\n📋 Testing GET services...');
    const servicesResponse = await axios.get(`${baseURL}/services`);
    console.log('✅ Services fetched:', servicesResponse.data.length, 'services');
    
    if (servicesResponse.data.length > 0) {
      const firstService = servicesResponse.data[0];
      console.log('Sample service:', {
        id: firstService._id,
        name: firstService.name,
        status: firstService.status
      });

      // Test PUT update service
      console.log('\n📝 Testing PUT update service...');
      const updateData = {
        name: firstService.name + ' (Updated)',
        description: firstService.description + ' - Updated via API test',
        status: 'Active',
        updatedAt: new Date()
      };
      
      try {
        const updateResponse = await axios.put(`${baseURL}/services/${firstService._id}`, updateData, { headers });
        console.log('✅ Service updated successfully:', updateResponse.data);
        
        // Verify the update
        console.log('\n🔍 Verifying update...');
        const verifyResponse = await axios.get(`${baseURL}/services/${firstService._id}`);
        console.log('✅ Updated service verified:', {
          id: verifyResponse.data._id,
          name: verifyResponse.data.name,
          description: verifyResponse.data.description.substring(0, 50) + '...'
        });
        
      } catch (updateError) {
        console.error('❌ Update failed:', updateError.response?.data || updateError.message);
        console.error('Status:', updateError.response?.status);
        console.error('Headers sent:', headers);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }

  console.log('\n✅ Test completed!');
}

testServicesAPI();