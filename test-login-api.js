import axios from 'axios';

async function testLogin() {
  try {
    console.log('🔐 Testing login API...');
    
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
    if (response.data.token) {
      console.log('🔑 Token received:', response.data.token.substring(0, 20) + '...');
    }
    
  } catch (error) {
    console.error('❌ Login failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testLogin();