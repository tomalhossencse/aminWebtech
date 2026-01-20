const axios = require('axios');

const testIP = async () => {
  try {
    console.log('🧪 Testing IP Detection...\n');
    
    const response = await axios.get('http://localhost:3000/api/test/ip');
    const data = response.data;
    
    console.log('✅ IP Detection Results:');
    console.log('📍 Detected IP:', data.detectedIP);
    console.log('🌍 IP Info:', data.ipInfo);
    console.log('🔧 Is Generated:', data.isGenerated);
    console.log('📡 Express IP:', data.expressIP);
    console.log('🔌 Connection IP:', data.connectionIP);
    
    console.log('\n📊 Network Interfaces:');
    data.networkInterfaces.forEach(iface => {
      console.log(`  ${iface.interface}: ${iface.address} ${iface.internal ? '(internal)' : '(external)'}`);
    });
    
    console.log('\n🎲 Sample Generated IPs:');
    console.log('  US:', data.sampleIPs.us);
    console.log('  EU:', data.sampleIPs.eu);
    console.log('  Asia:', data.sampleIPs.asia);
    console.log('  Random:', data.sampleIPs.random);
    
    console.log('\n📋 Headers:');
    Object.entries(data.headers).forEach(([key, value]) => {
      if (value) {
        console.log(`  ${key}: ${value}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('Make sure the server is running on http://localhost:3000');
  }
};

testIP();