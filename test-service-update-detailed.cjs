// Detailed test for service update
const axios = require('axios');

const testServiceUpdate = async () => {
  console.log('🔍 Testing service update in detail...');
  
  try {
    // 1. Login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post('https://amin-web-tech-server.vercel.app/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');
    
    // 2. Get all services to see what IDs exist
    console.log('2. Fetching all services...');
    const servicesResponse = await axios.get('https://amin-web-tech-server.vercel.app/services');
    const services = servicesResponse.data;
    
    console.log(`📋 Found ${services.length} services:`);
    services.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.name} (ID: ${service._id})`);
    });
    
    // 3. Try to update the first service
    if (services.length > 0) {
      const serviceToUpdate = services[0];
      console.log(`3. Attempting to update service: ${serviceToUpdate.name} (${serviceToUpdate._id})`);
      
      const updateData = {
        name: serviceToUpdate.name + ' - Updated',
        description: serviceToUpdate.description,
        icon: serviceToUpdate.icon,
        status: serviceToUpdate.status,
        featured: serviceToUpdate.featured
      };
      
      const updateResponse = await axios.put(
        `https://amin-web-tech-server.vercel.app/services/${serviceToUpdate._id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Service update successful!');
      console.log('📝 Updated service:', updateResponse.data);
      
      // 4. Revert the change
      console.log('4. Reverting the change...');
      const revertData = {
        name: serviceToUpdate.name, // Original name
        description: serviceToUpdate.description,
        icon: serviceToUpdate.icon,
        status: serviceToUpdate.status,
        featured: serviceToUpdate.featured
      };
      
      await axios.put(
        `https://amin-web-tech-server.vercel.app/services/${serviceToUpdate._id}`,
        revertData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Service reverted to original state');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.status, error.response?.data || error.message);
    if (error.response?.data) {
      console.error('📄 Full error response:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

testServiceUpdate();