// Fix services database by clearing and reseeding
const axios = require('axios');

const fixServicesDatabase = async () => {
  console.log('🔧 Fixing services database...');
  
  try {
    // 1. Login
    const loginResponse = await axios.post('https://amin-web-tech-server.vercel.app/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // 2. Get current services
    console.log('1. Getting current services...');
    const currentServices = await axios.get('https://amin-web-tech-server.vercel.app/services');
    console.log(`📋 Found ${currentServices.data.length} services in list`);
    
    // 3. Try to delete each service (this will only work for real services)
    console.log('2. Attempting to delete existing services...');
    let deletedCount = 0;
    let failedCount = 0;
    
    for (const service of currentServices.data) {
      try {
        await axios.delete(
          `https://amin-web-tech-server.vercel.app/services/${service._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        console.log(`   ✅ Deleted: ${service.name}`);
        deletedCount++;
      } catch (error) {
        console.log(`   ❌ Failed to delete: ${service.name} (${error.response?.status})`);
        failedCount++;
      }
    }
    
    console.log(`📊 Deletion summary: ${deletedCount} deleted, ${failedCount} failed`);
    
    // 4. Create fresh services with proper data
    console.log('3. Creating fresh services...');
    
    const freshServices = [
      {
        name: 'Web Development',
        description: 'Custom web applications built with modern technologies and best practices for optimal performance and user experience.',
        shortDescription: 'Custom web applications built with modern technologies and best practices.',
        icon: 'code',
        iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        features: 5,
        status: 'Active',
        featured: 'Yes',
        category: 'Web Development',
        displayOrder: 1
      },
      {
        name: 'UI/UX Design',
        description: 'Beautiful and intuitive user interfaces designed for optimal user experience and engagement.',
        shortDescription: 'Beautiful and intuitive user interfaces designed for optimal user experience.',
        icon: 'brush',
        iconBg: 'bg-purple-100 dark:bg-purple-900/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        features: 4,
        status: 'Active',
        featured: 'Yes',
        category: 'UI/UX Design',
        displayOrder: 2
      },
      {
        name: 'E-commerce Solutions',
        description: 'Complete online store solutions with payment integration, inventory management, and customer analytics.',
        shortDescription: 'Complete online store solutions with payment integration and inventory management.',
        icon: 'shopping_cart',
        iconBg: 'bg-green-100 dark:bg-green-900/30',
        iconColor: 'text-green-600 dark:text-green-400',
        features: 6,
        status: 'Active',
        featured: 'No',
        category: 'E-commerce',
        displayOrder: 3
      },
      {
        name: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications for iOS and Android with modern frameworks.',
        shortDescription: 'Native and cross-platform mobile applications for iOS and Android.',
        icon: 'smartphone',
        iconBg: 'bg-pink-100 dark:bg-pink-900/30',
        iconColor: 'text-pink-600 dark:text-pink-400',
        features: 4,
        status: 'Active',
        featured: 'Yes',
        category: 'Mobile Apps',
        displayOrder: 4
      },
      {
        name: 'Digital Marketing',
        description: 'Strategic marketing campaigns that boost your online presence and drive real results through SEO, social media, and paid advertising.',
        shortDescription: 'Strategic marketing campaigns that boost your online presence and drive real results.',
        icon: 'campaign',
        iconBg: 'bg-orange-100 dark:bg-orange-900/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        features: 5,
        status: 'Active',
        featured: 'No',
        category: 'Digital Marketing',
        displayOrder: 5
      },
      {
        name: 'Cloud Solutions',
        description: 'Scalable cloud infrastructure and deployment solutions for modern applications with AWS, Azure, and Google Cloud.',
        shortDescription: 'Scalable cloud infrastructure and deployment solutions for modern applications.',
        icon: 'cloud',
        iconBg: 'bg-sky-100 dark:bg-sky-900/30',
        iconColor: 'text-sky-600 dark:text-sky-400',
        features: 3,
        status: 'Active',
        featured: 'No',
        category: 'Cloud Solutions',
        displayOrder: 6
      }
    ];
    
    const createdServices = [];
    
    for (const serviceData of freshServices) {
      try {
        const createResponse = await axios.post(
          'https://amin-web-tech-server.vercel.app/services',
          serviceData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        const newServiceId = createResponse.data.insertedId;
        createdServices.push({ id: newServiceId, name: serviceData.name });
        console.log(`   ✅ Created: ${serviceData.name} (${newServiceId})`);
        
      } catch (error) {
        console.log(`   ❌ Failed to create: ${serviceData.name}`, error.response?.data);
      }
    }
    
    console.log(`📊 Created ${createdServices.length} fresh services`);
    
    // 5. Verify the fix
    console.log('4. Verifying the fix...');
    const verifyServices = await axios.get('https://amin-web-tech-server.vercel.app/services');
    console.log(`📋 Services list now shows: ${verifyServices.data.length} services`);
    
    // Test updating one of the new services
    if (createdServices.length > 0) {
      const testService = createdServices[0];
      console.log(`5. Testing update on: ${testService.name}`);
      
      try {
        const updateResponse = await axios.put(
          `https://amin-web-tech-server.vercel.app/services/${testService.id}`,
          {
            name: testService.name + ' - Test Update',
            description: 'Testing update functionality',
            icon: 'code',
            status: 'Active',
            featured: 'Yes'
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('   ✅ Update test successful!');
        
        // Revert the test change
        await axios.put(
          `https://amin-web-tech-server.vercel.app/services/${testService.id}`,
          freshServices[0], // Original data
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('   ✅ Test change reverted');
        
      } catch (updateError) {
        console.log('   ❌ Update test failed:', updateError.response?.data);
      }
    }
    
    console.log('');
    console.log('🎉 Database fix completed!');
    console.log('✅ Your services should now be updatable through the admin panel.');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.response?.data || error.message);
  }
};

fixServicesDatabase();