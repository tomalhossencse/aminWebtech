// Test database connection and consistency
const axios = require('axios');

const testDatabaseConnection = async () => {
  console.log('🔍 Testing database connection and consistency...');
  
  try {
    // 1. Login
    const loginResponse = await axios.post('https://amin-web-tech-server.vercel.app/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    const token = loginResponse.data.token;
    
    // 2. Create a test service
    console.log('1. Creating a test service...');
    const testServiceData = {
      name: 'Database Test Service',
      description: 'Testing database connection',
      icon: 'test',
      status: 'Active',
      featured: 'No'
    };
    
    const createResponse = await axios.post(
      'https://amin-web-tech-server.vercel.app/services',
      testServiceData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const newServiceId = createResponse.data.insertedId;
    console.log('✅ Service created with ID:', newServiceId);
    
    // 3. Immediately try to fetch it by ID
    console.log('2. Fetching the service by ID...');
    try {
      const fetchResponse = await axios.get(`https://amin-web-tech-server.vercel.app/services/${newServiceId}`);
      console.log('✅ Service found by ID:', fetchResponse.data.name);
      
      // 4. Try to update it
      console.log('3. Updating the service...');
      const updateData = {
        ...testServiceData,
        name: 'Database Test Service - UPDATED'
      };
      
      const updateResponse = await axios.put(
        `https://amin-web-tech-server.vercel.app/services/${newServiceId}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Service updated successfully!');
      console.log('📝 Update result:', updateResponse.data);
      
      // 5. Verify the update
      console.log('4. Verifying the update...');
      const verifyResponse = await axios.get(`https://amin-web-tech-server.vercel.app/services/${newServiceId}`);
      console.log('✅ Updated service name:', verifyResponse.data.name);
      
    } catch (fetchError) {
      console.log('❌ Could not fetch service by ID:', fetchError.response?.data);
    }
    
    // 6. Check if it appears in the services list
    console.log('5. Checking if service appears in list...');
    const listResponse = await axios.get('https://amin-web-tech-server.vercel.app/services');
    const foundInList = listResponse.data.find(s => s._id === newServiceId);
    
    if (foundInList) {
      console.log('✅ Service found in list:', foundInList.name);
    } else {
      console.log('❌ Service NOT found in list');
      console.log('📋 Services in list:', listResponse.data.map(s => ({ id: s._id, name: s.name })));
    }
    
    // 7. Clean up
    console.log('6. Cleaning up test service...');
    try {
      await axios.delete(
        `https://amin-web-tech-server.vercel.app/services/${newServiceId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('✅ Test service deleted');
    } catch (deleteError) {
      console.log('❌ Could not delete test service:', deleteError.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testDatabaseConnection();