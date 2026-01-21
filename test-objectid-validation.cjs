// Test ObjectId validation and database query
const axios = require('axios');

const testObjectIdValidation = async () => {
  console.log('🔍 Testing ObjectId validation...');
  
  try {
    // 1. Login
    const loginResponse = await axios.post('https://amin-web-tech-server.vercel.app/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    const token = loginResponse.data.token;
    
    // 2. Test with invalid ObjectId format
    console.log('1. Testing with invalid ObjectId format...');
    try {
      await axios.put(
        'https://amin-web-tech-server.vercel.app/services/invalid-id',
        { name: 'Test' },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
    } catch (error) {
      console.log('   ❌ Invalid ID rejected:', error.response?.data?.error);
    }
    
    // 3. Test with valid but non-existent ObjectId
    console.log('2. Testing with valid but non-existent ObjectId...');
    try {
      await axios.put(
        'https://amin-web-tech-server.vercel.app/services/507f1f77bcf86cd799439999',
        { name: 'Test' },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
    } catch (error) {
      console.log('   ❌ Non-existent ID rejected:', error.response?.data?.error);
    }
    
    // 4. Get a service and try to update it immediately
    console.log('3. Getting fresh service data and updating...');
    const servicesResponse = await axios.get('https://amin-web-tech-server.vercel.app/services');
    const firstService = servicesResponse.data[0];
    
    console.log(`   📋 Service found: ${firstService.name} (${firstService._id})`);
    
    // Try minimal update
    try {
      const updateResponse = await axios.put(
        `https://amin-web-tech-server.vercel.app/services/${firstService._id}`,
        { 
          name: firstService.name,
          description: firstService.description || 'Default description',
          icon: firstService.icon || 'code',
          status: firstService.status || 'Active'
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log('   ✅ Update successful!', updateResponse.data);
      
    } catch (error) {
      console.log('   ❌ Update failed:', error.response?.status, error.response?.data);
      
      // Let's also check what the server is receiving
      console.log('   📤 Request details:');
      console.log('      URL:', `https://amin-web-tech-server.vercel.app/services/${firstService._id}`);
      console.log('      Method: PUT');
      console.log('      Headers: Authorization: Bearer [token]');
      console.log('      Body:', JSON.stringify({
        name: firstService.name,
        description: firstService.description || 'Default description',
        icon: firstService.icon || 'code',
        status: firstService.status || 'Active'
      }, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testObjectIdValidation();