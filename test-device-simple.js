// Simple test for device fingerprinting without MongoDB
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// In-memory storage for testing
const visitors = [];
const pageViews = [];

// POST track visitor (for tracking new visitors)
app.post("/analytics/track-visitor", async (req, res) => {
  try {
    const {
      ipAddress,
      userAgent,
      country,
      city,
      countryCode,
      device,
      browser,
      deviceId,
      path,
      referrer
    } = req.body;

    console.log('📥 Received tracking data:', {
      ipAddress,
      device,
      browser,
      deviceId: deviceId?.substring(0, 8) + '...' // Show partial for privacy
    });

    // Create unique visitor identifier using IP + deviceId combination
    const uniqueVisitorId = `${ipAddress}_${deviceId}`;
    
    // Check if visitor exists using the unique identifier
    let visitor = visitors.find(v => v.uniqueVisitorId === uniqueVisitorId);
    
    if (!visitor) {
      // New visitor
      visitor = {
        id: visitors.length + 1,
        uniqueVisitorId,
        ipAddress,
        deviceId,
        userAgent,
        country: country || "Unknown",
        city: city || "Unknown",
        countryCode: countryCode || "XX",
        device: device || "Desktop",
        browser: browser || "Unknown",
        isNewVisitor: true,
        pageViews: 1,
        createdAt: new Date(),
        lastActivity: new Date()
      };
      
      visitors.push(visitor);
      
      console.log(`📱 ✅ NEW visitor tracked: ${device} device with ID ${deviceId?.substring(0, 8)}... from IP ${ipAddress}`);
    } else {
      // Existing visitor - update
      visitor.lastActivity = new Date();
      visitor.isNewVisitor = false;
      visitor.pageViews += 1;
      
      console.log(`🔄 ✅ EXISTING visitor updated: ${device} device with ID ${deviceId?.substring(0, 8)}... from IP ${ipAddress}`);
    }

    // Track page view
    pageViews.push({
      id: pageViews.length + 1,
      visitorId: visitor.id,
      uniqueVisitorId,
      path: path || "/",
      referrer: referrer || "",
      createdAt: new Date(),
      timeOnPage: 0
    });

    res.send({ 
      success: true, 
      visitorId: visitor.id,
      uniqueVisitorId,
      isNewDevice: visitor.isNewVisitor,
      message: visitor.isNewVisitor ? 'New device tracked' : 'Existing device updated'
    });
  } catch (error) {
    console.error('❌ Error tracking visitor:', error);
    res.status(500).send({ error: "Failed to track visitor" });
  }
});

// GET recent visitors
app.get("/analytics/recent-visitors", async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const recentVisitors = visitors
      .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
      .slice(0, parseInt(limit));

    const formattedVisitors = recentVisitors.map(visitor => ({
      id: visitor.id,
      ip: visitor.ipAddress,
      country: visitor.country,
      city: visitor.city,
      device: visitor.device,
      browser: visitor.browser,
      pages: visitor.pageViews || 1,
      lastActivity: visitor.lastActivity,
      uniqueVisitorId: visitor.uniqueVisitorId,
      deviceId: visitor.deviceId?.substring(0, 8) + '...' // Partial for privacy
    }));

    console.log(`📊 Returning ${formattedVisitors.length} recent visitors`);
    res.send(formattedVisitors);
  } catch (error) {
    console.error("Recent visitors error:", error);
    res.status(500).send({ error: "Failed to fetch recent visitors" });
  }
});

// GET analytics overview
app.get("/analytics/overview", async (req, res) => {
  try {
    const totalVisitors = visitors.length;
    const newVisitors = visitors.filter(v => v.isNewVisitor).length;
    const activeNow = Math.floor(Math.random() * 5) + 1; // Simulate active users
    
    res.send({
      totalVisitors,
      newVisitors,
      activeNow,
      bounceRate: "45%"
    });
  } catch (error) {
    console.error("Overview error:", error);
    res.status(500).send({ error: "Failed to fetch overview" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Test server running on http://localhost:${port}`);
  console.log('📱 Ready to test device fingerprinting!');
  console.log('');
  console.log('Current visitors in memory:', visitors.length);
});