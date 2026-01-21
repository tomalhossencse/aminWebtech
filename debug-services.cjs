const axios = require('axios');

async function debugServices() {
  try {
    console.log('🔍 Debugging services...');
    
    // Get services without auth (public endpoint)
    const response = await axios.get('http://localhost:3000/services');
    console.log('📋 Current services in server:');
    
    response.data.forEach((service, index) => {
      console.log(`${index + 1}. ID: ${service._id}`);
      console.log(`   Name: ${service.name}`);
      console.log(`   Status: ${service.status}`);
      console.log('');
    });
    
    // Test login
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    // Try to update the first service
    if (response.data.length > 0) {
      const firstService = response.data[0];
      console.log(`🔧 Attempting to update service: ${firstService._id}`);
      
      try {
        const updateResponse = await axios.put(
          `http://localhost:3000/services/${firstService._id}`,
          { name: firstService.name + ' (Test Update)' },
          { headers }
        );
        console.log('✅ Update successful:', updateResponse.data);
      } catch (error) {
        console.log('❌ Update failed:', error.response?.data);
        console.log('Status:', error.response?.status);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugServices();