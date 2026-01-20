const IPGenerator = require('./ip-generator.cjs');

console.log('🧪 Testing IP Generator...\n');

const ipGen = new IPGenerator();

// Test session-based IP generation
console.log('📱 Session-based IPs:');
const session1 = 'Mozilla/5.0 Chrome/91.0';
const session2 = 'Mozilla/5.0 Firefox/89.0';

console.log(`Session 1: ${ipGen.generateSessionIP(session1)}`);
console.log(`Session 1 (again): ${ipGen.generateSessionIP(session1)}`); // Should be same
console.log(`Session 2: ${ipGen.generateSessionIP(session2)}`);

// Test regional IPs
console.log('\n🌍 Regional IPs:');
console.log(`US IP: ${ipGen.generateRealisticIP('us')}`);
console.log(`EU IP: ${ipGen.generateRealisticIP('eu')}`);
console.log(`Asia IP: ${ipGen.generateRealisticIP('asia')}`);
console.log(`Random IP: ${ipGen.generateRealisticIP('random')}`);

// Test IP info
console.log('\n📍 IP Information:');
const testIP = ipGen.generateRealisticIP('us');
const ipInfo = ipGen.getIPInfo(testIP);
console.log(`IP: ${testIP}`);
console.log(`Country: ${ipInfo.country} (${ipInfo.code})`);
console.log(`City: ${ipInfo.city}`);

console.log('\n✅ IP Generator test completed!');