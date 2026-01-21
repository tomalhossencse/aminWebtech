// Test various server endpoints to diagnose the issue
const axios = require('axios');

const testServerEndpoints = async () => {
  console.log('🔍 Testing server endpoints to diagnose the issue...');
  
  const baseURL = 'https://amin-web-tech-server.vercel.app';
  
  const endpoints = [
    { path: '/', method: 'GET', description: 'Root endpoint' },
    { path: '/services', method: 'GET', description: 'Services list' },
    { path: '/projects', method: 'GET', description: 'Projects list' },
    { path: '/blogs', method: 'GET', description: 'Blogs list' },
    { path: '/team-members', method: 'GET', description: 'Team members' },
    { path: '/testimonials', method: 'GET', description: 'Testimonials' },
    { path: '/api/auth/login', method: 'POST', description: 'Login endpoint', data: { username: 'test', password: 'test' } }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing ${endpoint.method} ${endpoint.path} - ${endpoint.description}`);
      
      let response;
      if (endpoint.method === 'POST') {
        response = await axios.post(`${baseURL}${endpoint.path}`, endpoint.data || {});
      } else {
        response = await axios.get(`${baseURL}${endpoint.path}`);
      }
      
      console.log(`   ✅ Status: ${response.status}`);
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          console.log(`   📊 Response: Array with ${response.data.length} items`);
          if (response.data.length > 0) {
            console.log(`   📋 First item keys: ${Object.keys(response.data[0]).join(', ')}`);
          }
        } else if (typeof response.data === 'object') {
          console.log(`   📋 Response keys: ${Object.keys(response.data).join(', ')}`);
        } else {
          console.log(`   📄 Response: ${String(response.data).substring(0, 100)}...`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Status: ${error.response?.status || 'Network Error'}`);
      console.log(`   📄 Error: ${error.response?.data?.error || error.message}`);
      
      if (error.response?.status === 404) {
        console.log(`   🔍 This endpoint is not found - might be a routing issue`);
      } else if (error.response?.status === 500) {
        console.log(`   💥 Server error - likely database or code issue`);
      }
    }
  }
  
  console.log('\n🎯 Summary:');
  console.log('If most endpoints work but /services fails, it\'s likely a database connection issue.');
  console.log('If all endpoints fail, it\'s a deployment issue.');
  console.log('If only some endpoints fail, it\'s likely a routing or code issue.');
};

testServerEndpoints();