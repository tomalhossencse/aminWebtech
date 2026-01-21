// Get real service IDs from production database
const axios = require('axios');

const getRealServiceIds = async () => {
  console.log('🔍 Fetching real service IDs from production database...');
  
  try {
    const response = await axios.get('https://amin-web-tech-server.vercel.app/services');
    const services = response.data;
    
    console.log(`📋 Found ${services.length} services with real database IDs:`);
    console.log('');
    
    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name}`);
      console.log(`   ID: ${service._id}`);
      console.log(`   Status: ${service.status}`);
      console.log(`   Featured: ${service.featured}`);
      console.log('');
    });
    
    console.log('💡 To update a service, use one of these real IDs instead of hardcoded ones.');
    
  } catch (error) {
    console.error('❌ Error fetching services:', error.message);
  }
};

getRealServiceIds();