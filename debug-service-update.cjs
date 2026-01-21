// Debug service update issue
const axios = require('axios');

const debugServiceUpdate = async () => {
  console.log('🔍 Debugging service update issue...');
  
  try {
    // 1. Login
    const loginResponse = await axios.post('https://amin-web-tech-server.vercel.app/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // 2. Get specific service by ID to confirm it exists
    const serviceId = '507f1f77bcf86cd799439021';
    console.log(`2. Fetching service by ID: ${serviceId}`);
    
    try {
      const serviceResponse = await axios.get(`https://amin-web-tech-server.vercel.app/services/${serviceId}`);
      console.log('✅ Service found via GET /services/:id');
      console.log('📋 Service data:', {
        id: serviceResponse.data._id,
        name: serviceResponse.data.name,
        status: serviceResponse.data.status
      });
      
      // 3. Try to update this exact service
      console.log('3. Attempting to update the same service...');
      
      const updateData = {
        name: serviceResponse.data.name,
        description: serviceResponse.data.description,
        icon: serviceResponse.data.icon || 'code',
        status: serviceResponse.data.status || 'Active',
        featured: serviceResponse.data.featured || 'No'
      };
      
      console.log('📤 Update payload:', updateData);
      
      const updateResponse = await axios.put(
        `https://amin-web-tech-server.vercel.app/services/${serviceId}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Update successful!');
      console.log('📝 Update response:', updateResponse.data);
      
    } catch (getError) {
      if (getError.response?.status === 404) {
        console.log('❌ Service not found via GET /services/:id');
        console.log('   This suggests the service doesn\'t exist in the database');
      } else {
        console.log('❌ Error fetching service:', getError.response?.data || getError.message);
      }
    }
    
    // 4. Let's also try creating a new service and immediately updating it
    console.log('4. Testing create -> update flow...');
    
    const newServiceData = {
      name: 'Test Service for Update',
      description: 'This is a test service to check update functionality',
      icon: 'test',
      status: 'Active',
      featured: 'No'
    };
    
    try {
      const createResponse = await axios.post(
        'https://amin-web-tech-server.vercel.app/services',
        newServiceData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ New service created');
      const newServiceId = createResponse.data.insertedId;
      console.log('🆔 New service ID:', newServiceId);
      
      // Try to update the newly created service
      const updateNewServiceData = {
        ...newServiceData,
        name: 'Test Service for Update - UPDATED'
      };
      
      const updateNewResponse = await axios.put(
        `https://amin-web-tech-server.vercel.app/services/${newServiceId}`,
        updateNewServiceData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Newly created service updated successfully!');
      console.log('📝 Update response:', updateNewResponse.data);
      
      // Clean up - delete the test service
      await axios.delete(
        `https://amin-web-tech-server.vercel.app/services/${newServiceId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('🗑️ Test service cleaned up');
      
    } catch (createUpdateError) {
      console.log('❌ Create/Update test failed:', createUpdateError.response?.data || createUpdateError.message);
    }
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
  }
};

debugServiceUpdate();