const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;
const JWT_SECRET = "quick-fix-secret-key";

// Middleware
app.use(express.json());
app.use(cors());

// Mock data
const mockProjects = [
  {
    _id: "1",
    title: "E-Commerce Platform",
    slug: "e-commerce-platform",
    clientName: "Tech Corp",
    description: "Modern e-commerce solution",
    category: "E-Commerce",
    projectUrl: "https://example.com",
    coverImageUrl: "https://via.placeholder.com/400x300",
    technologies: [{ name: "React" }, { name: "Node.js" }],
    keyFeatures: [{ name: "Responsive Design" }, { name: "Payment Integration" }],
    isFeatured: true,
    isActive: true,
    displayOrder: 1
  },
  {
    _id: "2", 
    title: "Mobile App",
    slug: "mobile-app",
    clientName: "Startup Inc",
    description: "Cross-platform mobile application",
    category: "Mobile App",
    projectUrl: "https://example.com",
    coverImageUrl: "https://via.placeholder.com/400x300",
    technologies: [{ name: "React Native" }, { name: "Firebase" }],
    keyFeatures: [{ name: "Push Notifications" }, { name: "Offline Support" }],
    isFeatured: false,
    isActive: true,
    displayOrder: 2
  }
];

const mockServices = [
  {
    _id: "1",
    title: "Web Development",
    slug: "web-development", 
    shortDescription: "Custom web applications",
    detailedDescription: "We build modern, responsive web applications",
    selectedIcon: "code",
    features: [
      { title: "Responsive Design", description: "Mobile-first approach", iconClass: "smartphone" },
      { title: "Fast Performance", description: "Optimized for speed", iconClass: "speed" }
    ],
    isFeatured: true,
    isActive: true,
    displayOrder: 1
  },
  {
    _id: "2",
    title: "Mobile Development", 
    slug: "mobile-development",
    shortDescription: "Native and cross-platform apps",
    detailedDescription: "iOS and Android app development",
    selectedIcon: "smartphone",
    features: [
      { title: "Cross Platform", description: "iOS and Android", iconClass: "devices" },
      { title: "Native Performance", description: "Optimized code", iconClass: "speed" }
    ],
    isFeatured: true,
    isActive: true,
    displayOrder: 2
  }
];

const mockContacts = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    subject: "Project Inquiry",
    message: "I need a website for my business",
    status: "new",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "2", 
    name: "Jane Smith",
    email: "jane@example.com",
    subject: "Mobile App Development",
    message: "Looking for mobile app development services",
    status: "read",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Auth middleware
const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: "Admin privileges required" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Routes
app.get("/", (req, res) => {
  res.send("Mock Server is running!");
});

// Auth
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign(
      { id: 1, username, role: "admin" },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({
      success: true,
      token,
      user: { id: 1, username, role: "admin" },
      expiresIn: "24h"
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Public endpoints
app.get("/projects", (req, res) => {
  res.json(mockProjects);
});

app.get("/services", (req, res) => {
  res.json(mockServices);
});

// Protected endpoints
app.get("/api/contacts", verifyAdmin, (req, res) => {
  const stats = {
    total: mockContacts.length,
    new: mockContacts.filter(c => c.status === 'new').length,
    read: mockContacts.filter(c => c.status === 'read').length,
    replied: 0,
    spam: 0
  };
  
  res.json({
    contacts: mockContacts,
    total: mockContacts.length,
    page: 1,
    limit: 10,
    totalPages: 1,
    stats
  });
});

app.get("/analytics/overview", verifyAdmin, (req, res) => {
  res.json({
    totalVisitors: 1250,
    newVisitors: 890,
    activeNow: 12,
    bounceRate: "35.2%"
  });
});

app.get("/analytics/visitor-distribution", verifyAdmin, (req, res) => {
  res.json([
    { name: "Bangladesh", value: 45, color: "#3B82F6", flag: "🇧🇩", percentage: 45 },
    { name: "United States", value: 25, color: "#10B981", flag: "🇺🇸", percentage: 25 },
    { name: "India", value: 20, color: "#FBBF24", flag: "🇮🇳", percentage: 20 },
    { name: "Others", value: 10, color: "#EF4444", flag: "🌍", percentage: 10 }
  ]);
});

app.get("/analytics/recent-visitors", verifyAdmin, (req, res) => {
  res.json([
    {
      id: "1",
      ip: "192.168.1.1",
      country: "Bangladesh",
      city: "Dhaka", 
      device: "Desktop",
      browser: "Chrome",
      pages: 3,
      lastActivity: new Date()
    }
  ]);
});

app.get("/analytics/top-pages", verifyAdmin, (req, res) => {
  res.json([
    {
      id: 1,
      url: "/",
      path: "/",
      views: 450,
      visitors: 320,
      avgTime: "2m 30s",
      bounceRate: "25%",
      color: "bg-yellow-400"
    },
    {
      id: 2,
      url: "/projects",
      path: "/projects", 
      views: 280,
      visitors: 210,
      avgTime: "3m 15s",
      bounceRate: "30%",
      color: "bg-blue-400"
    }
  ]);
});

// Additional endpoints for dashboard
app.get("/api/media", verifyAdmin, (req, res) => {
  const mockMedia = [
    {
      _id: "media1",
      name: "hero-image.jpg",
      originalName: "hero-image.jpg",
      type: "Image",
      size: 1024000,
      url: "https://via.placeholder.com/400x300",
      display_url: "https://via.placeholder.com/400x300",
      alt: "Hero image",
      mimeType: "image/jpeg",
      width: 400,
      height: 300,
      storage_provider: "local",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: "media2", 
      name: "logo.png",
      originalName: "logo.png",
      type: "Image",
      size: 512000,
      url: "https://via.placeholder.com/200x200",
      display_url: "https://via.placeholder.com/200x200",
      alt: "Company logo",
      mimeType: "image/png",
      width: 200,
      height: 200,
      storage_provider: "imgbb",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  res.json({
    media: mockMedia,
    stats: { 
      total: mockMedia.length, 
      images: mockMedia.length, 
      documents: 0, 
      videos: 0, 
      audio: 0, 
      totalSize: mockMedia.reduce((sum, file) => sum + file.size, 0)
    },
    total: mockMedia.length,
    page: 1,
    limit: 20,
    totalPages: 1
  });
});

app.get("/blogs", (req, res) => {
  res.json([]);
});

app.get("/api/testimonials", verifyAdmin, (req, res) => {
  res.json({
    testimonials: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
});

app.get("/testimonials", (req, res) => {
  res.json([]);
});

app.listen(port, () => {
  console.log(`🚀 Mock Server running on port ${port}`);
  console.log(`📍 Server URL: http://localhost:${port}`);
  console.log(`✅ Ready to handle requests!`);
});