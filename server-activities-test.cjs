const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = 3000;

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

// middleware
app.use(express.json());
app.use(cors());

// Admin verification middleware
const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: "Access denied. No token provided.",
        code: "NO_TOKEN" 
      });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        error: "Access denied. Invalid token format.",
        code: "INVALID_TOKEN_FORMAT" 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        error: "Access denied. Admin privileges required.",
        code: "INSUFFICIENT_PRIVILEGES" 
      });
    }

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: "Access denied. Invalid token.",
        code: "INVALID_TOKEN" 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: "Access denied. Token expired.",
        code: "TOKEN_EXPIRED" 
      });
    }
    
    console.error("Auth middleware error:", error);
    return res.status(500).json({ 
      error: "Internal server error during authentication.",
      code: "AUTH_ERROR" 
    });
  }
};

// Mock activities data
let mockActivities = [
  {
    _id: "activity-1",
    type: "login",
    action: "Admin logged in to dashboard",
    user: "Admin",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    metadata: {
      ip: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    _id: "activity-2",
    type: "project",
    action: "Created new project: Healthcare App",
    user: "Admin",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    metadata: {
      projectId: "507f1f77bcf86cd799439012",
      projectName: "Healthcare App"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    _id: "activity-3",
    type: "service",
    action: "Updated service: Web Development",
    user: "Admin",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    metadata: {
      serviceId: "507f1f77bcf86cd799439021",
      serviceName: "Web Development"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    _id: "activity-4",
    type: "blog",
    action: "Published new blog post: Modern Web Development Trends",
    user: "Admin",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    metadata: {
      blogId: "blog-123",
      blogTitle: "Modern Web Development Trends"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60)
  },
  {
    _id: "activity-5",
    type: "contact",
    action: "New contact message received from John Doe",
    user: "System",
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    metadata: {
      contactId: "contact-456",
      contactName: "John Doe",
      contactEmail: "john@example.com"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 90)
  },
  {
    _id: "activity-6",
    type: "team",
    action: "Added new team member: Sarah Johnson",
    user: "Admin",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    metadata: {
      teamMemberId: "team-789",
      memberName: "Sarah Johnson",
      position: "UI/UX Designer"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 120)
  }
];

// GET recent activities (for dashboard)
app.get("/api/activities/recent", verifyAdmin, async (req, res) => {
  try {
    console.log("📊 GET /api/activities/recent - Request received");
    
    const { limit = 6 } = req.query;
    
    // Sort by timestamp (most recent first) and limit results
    const recentActivities = mockActivities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));
    
    console.log(`✅ GET /api/activities/recent - Returned ${recentActivities.length} activities`);
    res.send(recentActivities);
  } catch (error) {
    console.error("❌ GET /api/activities/recent error:", error);
    res.status(500).send({ error: "Failed to fetch recent activities" });
  }
});

// GET all activities with pagination (Admin only)
app.get("/api/activities", verifyAdmin, async (req, res) => {
  try {
    console.log("📊 GET /api/activities - Request received");
    
    const { 
      page = 1, 
      limit = 10, 
      search = "", 
      type = "",
      user = ""
    } = req.query;
    
    let filteredActivities = [...mockActivities];
    
    // Apply search filter
    if (search) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.action.toLowerCase().includes(search.toLowerCase()) ||
        activity.user.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply type filter
    if (type && type !== "all") {
      filteredActivities = filteredActivities.filter(activity => activity.type === type);
    }
    
    // Apply user filter
    if (user && user !== "all") {
      filteredActivities = filteredActivities.filter(activity => activity.user === user);
    }
    
    // Sort by timestamp (most recent first)
    filteredActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedActivities = filteredActivities.slice(skip, skip + parseInt(limit));
    
    res.send({
      activities: paginatedActivities,
      total: filteredActivities.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredActivities.length / parseInt(limit))
    });
    
    console.log(`✅ GET /api/activities - Returned ${paginatedActivities.length} activities`);
  } catch (error) {
    console.error("❌ GET /api/activities error:", error);
    res.status(500).send({ error: "Failed to fetch activities" });
  }
});

// POST create activity (for manual logging)
app.post("/api/activities", verifyAdmin, async (req, res) => {
  try {
    console.log("📝 POST /api/activities - Create request received");
    
    const { type, action, user, metadata } = req.body;
    
    if (!type || !action) {
      return res.status(400).send({ 
        error: "Missing required fields: type, action" 
      });
    }
    
    const newActivity = {
      _id: `activity-${Date.now()}`,
      type,
      action,
      user: user || "Admin",
      timestamp: new Date(),
      metadata: metadata || {},
      createdAt: new Date()
    };
    
    mockActivities.unshift(newActivity); // Add to beginning of array
    
    console.log(`✅ POST /api/activities - Created: ${action}`);
    res.send({ insertedId: newActivity._id, acknowledged: true });
  } catch (error) {
    console.error("❌ POST /api/activities error:", error);
    res.status(500).send({ error: "Failed to create activity" });
  }
});

// DELETE clear all activities (Admin only)
app.delete("/api/activities/clear", verifyAdmin, async (req, res) => {
  try {
    console.log("🗑️ DELETE /api/activities/clear - Request received");
    
    const clearedCount = mockActivities.length;
    mockActivities = []; // Clear all activities
    
    console.log(`✅ DELETE /api/activities/clear - Cleared ${clearedCount} activities`);
    res.send({ 
      message: "All activities cleared successfully",
      clearedCount 
    });
  } catch (error) {
    console.error("❌ DELETE /api/activities/clear error:", error);
    res.status(500).send({ error: "Failed to clear activities" });
  }
});

// Authentication endpoint for admin login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log("🔐 Login attempt for username:", username);
    
    // Simple authentication - replace with proper authentication in production
    if (username === "admin" && password === "admin123") {
      // Generate JWT token
      const tokenPayload = {
        id: 1,
        username: username,
        role: "admin",
        iat: Math.floor(Date.now() / 1000), // Issued at
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // Expires in 24 hours
      };
      
      const token = jwt.sign(tokenPayload, JWT_SECRET);
      
      console.log("✅ Login successful for admin");
      
      res.send({
        success: true,
        token: token,
        user: { 
          id: 1, 
          username: username, 
          role: "admin" 
        },
        expiresIn: "24h"
      });
    } else {
      console.log("❌ Invalid credentials for username:", username);
      res.status(401).send({ 
        error: "Invalid credentials",
        code: "INVALID_CREDENTIALS" 
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).send({ 
      error: "Authentication failed",
      code: "AUTH_FAILED" 
    });
  }
});

app.get("/", (req, res) => {
  res.send("Activities Test Server is running! 🚀");
});

app.listen(port, () => {
  console.log(`🚀 Activities Test Server running on port ${port}`);
  console.log(`📊 Activities endpoints available:`);
  console.log(`   GET  /api/activities/recent`);
  console.log(`   GET  /api/activities`);
  console.log(`   POST /api/activities`);
  console.log(`   DELETE /api/activities/clear`);
  console.log(`   POST /api/auth/login`);
});