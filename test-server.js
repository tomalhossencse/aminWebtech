// Test script to check server connectivity
import axios from 'axios';

const baseURL = 'https://amin-web-tech-server.vercel.app';

async function testServer() {
  console.log('Testing server connectivity...');
  
  try {
    // Test basic server response
    console.log('\n1. Testing basic server response...');
    const response = await axios.get(`${baseURL}/`);
    console.log('✅ Server is running:', response.data);
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    return;
  }

  try {
    // Test analytics overview
    console.log('\n2. Testing analytics overview...');
    const overviewResponse = await axios.get(`${baseURL}/analytics/overview`);
    console.log('✅ Analytics overview:', overviewResponse.data);
  } catch (error) {
    console.log('❌ Analytics overview failed:', error.response?.data || error.message);
  }

  try {
    // Test visitor tracking
    console.log('\n3. Testing visitor tracking...');
    const trackResponse = await axios.post(`${baseURL}/analytics/track-visitor`, {
      ipAddress: '192.168.1.1',
      userAgent: 'Test User Agent',
      country: 'Bangladesh',
      city: 'Dhaka',
      countryCode: 'BD',
      device: 'Desktop',
      browser: 'Chrome',
      path: '/test',
      referrer: ''
    });
    console.log('✅ Visitor tracking:', trackResponse.data);
  } catch (error) {
    console.log('❌ Visitor tracking failed:', error.response?.data || error.message);
  }

  try {
    // Test visitor distribution
    console.log('\n4. Testing visitor distribution...');
    const distributionResponse = await axios.get(`${baseURL}/analytics/visitor-distribution`);
    console.log('✅ Visitor distribution:', distributionResponse.data);
  } catch (error) {
    console.log('❌ Visitor distribution failed:', error.response?.data || error.message);
  }

  try {
    // Test recent visitors
    console.log('\n5. Testing recent visitors...');
    const visitorsResponse = await axios.get(`${baseURL}/analytics/recent-visitors`);
    console.log('✅ Recent visitors:', visitorsResponse.data);
  } catch (error) {
    console.log('❌ Recent visitors failed:', error.response?.data || error.message);
  }
}

testServer();