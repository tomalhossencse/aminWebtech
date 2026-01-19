const express = require('express');
const app = express();

// Trust proxy for proper IP detection
app.set('trust proxy', true);

// Enhanced IP detection middleware
app.use((req, res, next) => {
  console.log('\n🔍 IP Detection Debug:');
  console.log('Headers:', {
    'x-forwarded-for': req.headers['x-forwarded-for'],
    'x-real-ip': req.headers['x-real-ip'],
    'cf-connecting-ip': req.headers['cf-connecting-ip'],
    'x-client-ip': req.headers['x-client-ip'],
    'x-forwarded': req.headers['x-forwarded'],
    'forwarded-for': req.headers['forwarded-for'],
    'forwarded': req.headers['forwarded']
  });
  
  console.log('Connection Info:', {
    'req.ip': req.ip,
    'req.connection.remoteAddress': req.connection?.remoteAddress,
    'req.socket.remoteAddress': req.socket?.remoteAddress,
    'req.connection.socket.remoteAddress': req.connection?.socket?.remoteAddress
  });
  
  // Get real IP address from various headers
  const forwarded = req.headers['x-forwarded-for'];
  const realIP = req.headers['x-real-ip'];
  const cfConnectingIP = req.headers['cf-connecting-ip'];
  const clientIP = req.headers['x-client-ip'];
  
  // Priority order for IP detection
  req.clientIP = 
    cfConnectingIP ||                           // Cloudflare
    clientIP ||                                 // X-Client-IP
    (forwarded ? forwarded.split(',')[0].trim() : null) || // X-Forwarded-For (first IP)
    realIP ||                                   // X-Real-IP
    req.connection?.remoteAddress ||            // Direct connection
    req.socket?.remoteAddress ||                // Socket connection
    req.ip ||                                   // Express default
    'Unknown';
  
  // Clean up IPv6 mapped IPv4 addresses
  if (req.clientIP && req.clientIP.startsWith('::ffff:')) {
    req.clientIP = req.clientIP.substring(7);
  }
  
  // Clean up localhost variations
  if (req.clientIP === '::1' || req.clientIP === '127.0.0.1') {
    req.clientIP = 'localhost';
  }
  
  console.log('Final IP:', req.clientIP);
  console.log('---');
  
  next();
});

app.use(express.json());

// Test endpoint
app.get('/test-ip', (req, res) => {
  res.json({
    detectedIP: req.clientIP,
    allHeaders: req.headers,
    expressIP: req.ip,
    connectionIP: req.connection?.remoteAddress,
    socketIP: req.socket?.remoteAddress,
    timestamp: new Date().toISOString()
  });
});

// Start server
const port = 3001;
app.listen(port, () => {
  console.log(`🧪 IP Detection Test Server running on http://localhost:${port}`);
  console.log('Visit http://localhost:3001/test-ip to test IP detection');
  console.log('Or run: curl http://localhost:3001/test-ip');
});