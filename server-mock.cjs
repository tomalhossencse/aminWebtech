const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = 3001;

// JWT Secret - In production, use a strong secret from environment variables
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

// Mock data
let mockServices = [
  {
    _id: "507f1f77bcf86cd799439021",
    name: "Web Development",
    description: "Custom web applications built with modern technologies and best practices.",
    icon: "code",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    features: 5,
    status: "Active",
    featured: "Yes",
    created: new Date().toLocaleDateString('en-GB'),
    slug: "web-development",
    shortDescription: "Custom web applications built with modern technologies and best practices for optimal performance and user experience.",
    detailedDescription: "We create custom web applications using cutting-edge technologies like React, Node.js, and modern frameworks. Our development process ensures scalable, maintainable, and high-performance solutions.",
    displayOrder: 1,
    category: "Web Development",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "507f1f77bcf86cd799439022",
    name: "UI/UX Design",
    description: "Beautiful and intuitive user interfaces designed for optimal user experience.",
    icon: "brush",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    features: 4,
    status: "Active",
    featured: "Yes",
    created: new Date().toLocaleDateString('en-GB'),
    slug: "ui-ux-design",
    shortDescription: "Beautiful and intuitive user interfaces designed for optimal user experience and engagement.",
    detailedDescription: "Our design team creates stunning user interfaces that not only look great but also provide exceptional user experiences. We focus on usability, accessibility, and modern design principles.",
    displayOrder: 2,
    category: "UI/UX Design",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "507f1f77bcf86cd799439023",
    name: "E-commerce Solutions",
    description: "Complete online store solutions with payment integration and inventory management.",
    icon: "shopping_cart",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    features: 6,
    status: "Active",
    featured: "No",
    created: new Date().toLocaleDateString('en-GB'),
    slug: "ecommerce-solutions",
    shortDescription: "Complete online store solutions with payment integration and inventory management systems.",
    detailedDescription: "We build comprehensive e-commerce platforms with secure payment gateways, inventory management, order tracking, and customer management systems.",
    displayOrder: 3,
    category: "E-commerce",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "507f1f77bcf86cd799439024",
    name: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    icon: "smartphone",
    iconBg: "bg-pink-100 dark:bg-pink-900/30",
    iconColor: "text-pink-600 dark:text-pink-400",
    features: 4,
    status: "Active",
    featured: "Yes",
    created: new Date().toLocaleDateString('en-GB'),
    slug: "mobile-app-development",
    shortDescription: "Native and cross-platform mobile applications for iOS and Android platforms.",
    detailedDescription: "Our mobile development team creates high-performance native and cross-platform applications using React Native, Flutter, and native technologies.",
    displayOrder: 4,
    category: "Mobile Apps",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "507f1f77bcf86cd799439025",
    name: "Digital Marketing",
    description: "Strategic marketing campaigns that boost your online presence and drive real results.",
    icon: "campaign",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    features: 6,
    status: "Active",
    featured: "No",
    created: new Date().toLocaleDateString('en-GB'),
    slug: "digital-marketing",
    shortDescription: "Strategic marketing campaigns that boost your online presence and drive real results.",
    detailedDescription: "Our digital marketing experts create comprehensive strategies including SEO, social media marketing, content marketing, and paid advertising to grow your business online.",
    displayOrder: 5,
    category: "Digital Marketing",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "507f1f77bcf86cd799439026",
    name: "Cloud Solutions",
    description: "Scalable cloud infrastructure and deployment solutions for modern applications.",
    icon: "cloud",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    features: 5,
    status: "Active",
    featured: "No",
    created: new Date().toLocaleDateString('en-GB'),
    slug: "cloud-solutions",
    shortDescription: "Scalable cloud infrastructure and deployment solutions for modern applications.",
    detailedDescription: "We provide comprehensive cloud solutions including AWS, Azure, and Google Cloud deployments, containerization, and DevOps automation for scalable applications.",
    displayOrder: 6,
    category: "Cloud Solutions",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let mockProjects = [
  {
    _id: "507f1f77bcf86cd799439011",
    title: "Ahbab Art Store",
    slug: "ahbab-art-store",
    description: "Ahbab.com.bd is a vibrant online shop for art supplies, crafted to help artists, students, and enthusiasts find their tools easily.",
    clientName: "Ahbab Art Store",
    category: "E-Commerce",
    isActive: true,
    projectUrl: "https://ahbab.com.bd",
    coverImageUrl: "",
    startDate: "2024-12-01",
    endDate: "2025-01-15",
    technologies: [
      { name: "HTML5" },
      { name: "CSS3" },
      { name: "JavaScript" },
      { name: "PHP" },
      { name: "StoreX CMS" }
    ],
    keyFeatures: [
      { name: "Online Art Supply Store" },
      { name: "Product Catalog" },
      { name: "Shopping Cart" },
      { name: "Payment Integration" }
    ],
    galleryImages: [],
    displayOrder: 1,
    isFeatured: true,
    challenge: "Creating an intuitive online platform for art supplies with easy navigation and product discovery.",
    solution: "Developed a user-friendly e-commerce platform with categorized products and search functionality.",
    result: "Successfully launched online store helping artists find their tools easily with improved user experience.",
    gradient: "from-blue-500 to-indigo-600",
    letter: "A",
    year: "2025",
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-01")
  },
  {
    _id: "507f1f77bcf86cd799439012",
    title: "Healthcare App",
    slug: "healthcare-app",
    description: "Patient management and appointment scheduling application designed for streamlined hospital operations and patient care.",
    clientName: "MediCare Solutions",
    category: "Mobile App",
    isActive: true,
    projectUrl: null,
    coverImageUrl: "",
    startDate: "2024-10-01",
    endDate: "2025-02-28",
    technologies: [
      { name: "React Native" },
      { name: "Firebase" },
      { name: "Redux" },
      { name: "Node.js" }
    ],
    keyFeatures: [
      { name: "Patient Management" },
      { name: "Appointment Scheduling" },
      { name: "Medical Records" },
      { name: "Real-time Notifications" }
    ],
    galleryImages: [],
    displayOrder: 2,
    isFeatured: true,
    challenge: "Streamlining hospital operations and improving patient care through digital solutions.",
    solution: "Built a comprehensive mobile app for patient management and appointment scheduling.",
    result: "Improved hospital efficiency and patient satisfaction with streamlined digital processes.",
    gradient: "from-indigo-500 to-purple-600",
    letter: "H",
    year: "2025",
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01")
  },
  {
    _id: "507f1f77bcf86cd799439013",
    title: "Corporate Website",
    slug: "corporate-website",
    description: "Modern corporate website with advanced animations and responsive design for a leading technology company.",
    clientName: "TechCorp Inc.",
    category: "Web Development",
    isActive: true,
    projectUrl: "https://techcorp-demo.com",
    coverImageUrl: "",
    startDate: "2024-08-01",
    endDate: "2024-11-30",
    technologies: [
      { name: "React" },
      { name: "Tailwind CSS" },
      { name: "Node.js" },
      { name: "Framer Motion" }
    ],
    keyFeatures: [
      { name: "Advanced Animations" },
      { name: "Responsive Design" },
      { name: "SEO Optimized" },
      { name: "Content Management" }
    ],
    galleryImages: [],
    displayOrder: 3,
    isFeatured: true,
    challenge: "Creating a modern corporate presence with engaging animations and responsive design.",
    solution: "Developed a cutting-edge website with advanced animations and mobile-first approach.",
    result: "Delivered a stunning corporate website that increased user engagement by 250%.",
    gradient: "from-green-500 to-emerald-600",
    letter: "C",
    year: "2024",
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-08-01")
  },
  {
    _id: "507f1f77bcf86cd799439014",
    title: "Brand Identity Design",
    slug: "brand-identity-design",
    description: "Complete brand identity package including logo design, color palette, and brand guidelines for a startup.",
    clientName: "StartUp Ventures",
    category: "UI/UX Design",
    isActive: true,
    projectUrl: null,
    coverImageUrl: "",
    startDate: "2024-06-01",
    endDate: "2024-09-30",
    technologies: [
      { name: "Adobe Illustrator" },
      { name: "Figma" },
      { name: "Photoshop" },
      { name: "InDesign" }
    ],
    keyFeatures: [
      { name: "Logo Design" },
      { name: "Color Palette" },
      { name: "Brand Guidelines" },
      { name: "Marketing Materials" }
    ],
    galleryImages: [],
    displayOrder: 4,
    isFeatured: false,
    challenge: "Creating a cohesive brand identity that reflects the startup's innovative spirit.",
    solution: "Designed a comprehensive brand package with modern aesthetics and clear guidelines.",
    result: "Established a strong brand presence that helped the startup secure initial funding.",
    gradient: "from-pink-500 to-rose-600",
    letter: "B",
    year: "2024",
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-06-01")
  },
  {
    _id: "507f1f77bcf86cd799439015",
    title: "Social Media Campaign",
    slug: "social-media-campaign",
    description: "Comprehensive digital marketing campaign that increased brand awareness by 300% and generated significant ROI.",
    clientName: "Fashion Brand Co.",
    category: "SaaS",
    isActive: true,
    projectUrl: null,
    coverImageUrl: "",
    startDate: "2024-05-01",
    endDate: "2024-08-31",
    technologies: [
      { name: "Google Ads" },
      { name: "Facebook Ads" },
      { name: "Analytics" },
      { name: "Hootsuite" }
    ],
    keyFeatures: [
      { name: "Social Media Strategy" },
      { name: "Content Creation" },
      { name: "Ad Campaign Management" },
      { name: "Performance Analytics" }
    ],
    galleryImages: [],
    displayOrder: 5,
    isFeatured: false,
    challenge: "Increasing brand awareness and generating ROI through digital marketing.",
    solution: "Executed a comprehensive social media campaign with targeted advertising.",
    result: "Achieved 300% increase in brand awareness and significant return on investment.",
    gradient: "from-orange-500 to-red-600",
    letter: "S",
    year: "2024",
    createdAt: new Date("2024-05-01"),
    updatedAt: new Date("2024-05-01")
  },
  {
    _id: "507f1f77bcf86cd799439016",
    title: "Online Marketplace",
    slug: "online-marketplace",
    description: "Multi-vendor e-commerce platform with advanced features like real-time chat, payment integration, and inventory management.",
    clientName: "MarketPlace Ltd.",
    category: "E-Commerce",
    isActive: true,
    projectUrl: "https://marketplace-demo.com",
    coverImageUrl: "",
    startDate: "2024-03-01",
    endDate: "2024-07-31",
    technologies: [
      { name: "Laravel" },
      { name: "Vue.js" },
      { name: "MySQL" },
      { name: "Redis" }
    ],
    keyFeatures: [
      { name: "Multi-vendor Support" },
      { name: "Real-time Chat" },
      { name: "Payment Integration" },
      { name: "Inventory Management" }
    ],
    galleryImages: [],
    displayOrder: 6,
    isFeatured: true,
    challenge: "Building a scalable multi-vendor platform with complex features and integrations.",
    solution: "Developed a robust marketplace with advanced features and seamless user experience.",
    result: "Launched successful marketplace platform serving multiple vendors and thousands of customers.",
    gradient: "from-purple-500 to-indigo-600",
    letter: "O",
    year: "2024",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01")
  }
];

// ----------------Services Related API -----------------
// GET services
app.get("/services", async (req, res) => {
  try {
    console.log("📋 GET /services - Request received");
    res.send(mockServices);
    console.log(`✅ GET /services - Returned ${mockServices.length} services`);
  } catch (error) {
    console.error("❌ GET /services error:", error);
    res.status(500).send({ error: "Failed to fetch services" });
  }
});

// GET single service by ID
app.get("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📋 GET /services/${id} - Request received`);
    
    const service = mockServices.find(s => s._id === id);
    
    if (!service) {
      console.log(`❌ Service not found for ID: ${id}`);
      return res.status(404).send({ error: "Service not found" });
    }
    
    console.log(`✅ GET /services/${id} - Service found: ${service.name}`);
    res.send(service);
  } catch (error) {
    console.error("❌ GET /services/:id error:", error);
    res.status(500).send({ error: "Failed to fetch service" });
  }
});

// POST create new service (Admin only)
app.post("/services", verifyAdmin, async (req, res) => {
  try {
    console.log("📋 POST /services - Create request received");
    console.log("Request body:", req.body);
    
    const newService = {
      _id: `507f1f77bcf86cd79943902${mockServices.length + 5}`,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockServices.unshift(newService); // Add to beginning of array
    console.log(`✅ POST /services - Created: ${newService.name}`);
    res.send({ insertedId: newService._id, acknowledged: true });
  } catch (error) {
    console.error("❌ POST /services error:", error);
    res.status(500).send({ error: "Failed to create service" });
  }
});

// PUT update service (Admin only)
app.put("/services/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📋 PUT /services/${id} - Update request received`);
    console.log("Request body:", req.body);
    console.log("Current services count:", mockServices.length);
    console.log("Available service IDs:", mockServices.map(s => s._id));
    
    const serviceIndex = mockServices.findIndex(s => s._id === id);
    
    if (serviceIndex === -1) {
      console.log(`❌ Service not found for ID: ${id}`);
      console.log("Available services:", mockServices.map(s => ({ id: s._id, name: s.name })));
      return res.status(404).send({ error: "Service not found" });
    }
    
    // Update the service
    const originalService = mockServices[serviceIndex];
    mockServices[serviceIndex] = {
      ...originalService,
      ...req.body,
      _id: originalService._id, // Preserve the original ID
      updatedAt: new Date()
    };
    
    console.log(`✅ PUT /services/${id} - Updated: ${mockServices[serviceIndex].name}`);
    
    // Return the updated service instead of just status
    res.send({
      matchedCount: 1,
      modifiedCount: 1,
      acknowledged: true,
      updatedService: mockServices[serviceIndex]
    });
  } catch (error) {
    console.error("❌ PUT /services/:id error:", error);
    res.status(500).send({ error: "Failed to update service" });
  }
});

// DELETE service (Admin only)
app.delete("/services/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📋 DELETE /services/${id} - Delete request received`);
    
    const serviceIndex = mockServices.findIndex(s => s._id === id);
    
    if (serviceIndex === -1) {
      console.log(`❌ Service not found for ID: ${id}`);
      return res.status(404).send({ error: "Service not found" });
    }
    
    const deletedService = mockServices.splice(serviceIndex, 1)[0];
    console.log(`✅ DELETE /services/${id} - Deleted: ${deletedService.name}`);
    res.send({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE /services/:id error:", error);
    res.status(500).send({ error: "Failed to delete service" });
  }
});

// ----------------Projects Related API -----------------
// GET projects with pagination and filters
app.get("/projects", async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = "", 
      status = "", 
      category = "" 
    } = req.query;
    
    let filteredProjects = [...mockProjects];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = filteredProjects.filter(project => 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.clientName.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (status && status !== "All Status") {
      if (status === "Active") {
        filteredProjects = filteredProjects.filter(project => project.isActive);
      } else if (status === "Inactive") {
        filteredProjects = filteredProjects.filter(project => !project.isActive);
      }
    }
    
    // Apply category filter
    if (category && category !== "All Categories") {
      filteredProjects = filteredProjects.filter(project => project.category === category);
    }
    
    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedProjects = filteredProjects.slice(skip, skip + parseInt(limit));
    
    res.send({
      projects: paginatedProjects,
      total: filteredProjects.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredProjects.length / parseInt(limit))
    });
    
    console.log(`📋 GET /projects - Returned ${paginatedProjects.length} projects (page ${page})`);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).send({ error: "Failed to fetch projects" });
  }
});

// GET single project by ID
app.get("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = mockProjects.find(p => p._id === id);
    
    if (!project) {
      return res.status(404).send({ error: "Project not found" });
    }
    
    res.send(project);
    console.log(`📋 GET /projects/${id} - Project found: ${project.title}`);
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).send({ error: "Failed to fetch project" });
  }
});

// POST create new project (Admin only)
app.post("/projects", verifyAdmin, async (req, res) => {
  try {
    const newProject = {
      _id: `507f1f77bcf86cd79943901${mockProjects.length + 6}`,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockProjects.unshift(newProject); // Add to beginning of array
    res.send({ insertedId: newProject._id, acknowledged: true });
    console.log(`✅ POST /projects - Created: ${newProject.title}`);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).send({ error: "Failed to create project" });
  }
});

// PUT update project (Admin only)
app.put("/projects/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const projectIndex = mockProjects.findIndex(p => p._id === id);
    
    if (projectIndex === -1) {
      return res.status(404).send({ error: "Project not found" });
    }
    
    // Update the project
    mockProjects[projectIndex] = {
      ...mockProjects[projectIndex],
      ...req.body,
      updatedAt: new Date()
    };
    
    res.send({ matchedCount: 1, modifiedCount: 1, acknowledged: true });
    console.log(`✅ PUT /projects/${id} - Updated: ${mockProjects[projectIndex].title}`);
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).send({ error: "Failed to update project" });
  }
});

// DELETE project (Admin only)
app.delete("/projects/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const projectIndex = mockProjects.findIndex(p => p._id === id);
    
    if (projectIndex === -1) {
      return res.status(404).send({ error: "Project not found" });
    }
    
    const deletedProject = mockProjects.splice(projectIndex, 1)[0];
    res.send({ message: "Project deleted successfully" });
    console.log(`🗑️ DELETE /projects/${id} - Deleted: ${deletedProject.title}`);
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).send({ error: "Failed to delete project" });
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
  res.send("Mock Projects Server is running! 🚀");
});

// ----------------Media Management API -----------------
// Mock media data
let mockMedia = [
  {
    _id: "media-1",
    name: "Hero Background",
    originalName: "hero-bg.jpg",
    type: "Image",
    size: 1024000,
    url: "https://i.ibb.co/sample1/hero-bg.jpg",
    display_url: "https://i.ibb.co/sample1/hero-bg.jpg",
    thumb_url: "https://i.ibb.co/sample1/hero-bg-thumb.jpg",
    medium_url: "https://i.ibb.co/sample1/hero-bg-medium.jpg",
    alt: "Hero background image",
    mimeType: "image/jpeg",
    width: 1920,
    height: 1080,
    imgbb_id: "sample1",
    imgbb_filename: "hero-bg.jpg",
    storage_provider: "imgbb",
    createdAt: new Date('2024-12-29'),
    updatedAt: new Date('2024-12-29')
  },
  {
    _id: "media-2",
    name: "Project Thumbnail",
    originalName: "project-thumb.png",
    type: "Image",
    size: 512000,
    url: "https://i.ibb.co/sample2/project-thumb.png",
    display_url: "https://i.ibb.co/sample2/project-thumb.png",
    thumb_url: "https://i.ibb.co/sample2/project-thumb-thumb.png",
    medium_url: "https://i.ibb.co/sample2/project-thumb-medium.png",
    alt: "Project thumbnail",
    mimeType: "image/png",
    width: 800,
    height: 600,
    imgbb_id: "sample2",
    imgbb_filename: "project-thumb.png",
    storage_provider: "imgbb",
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2024-12-28')
  }
];

// GET all media files (Admin only)
app.get("/api/media", verifyAdmin, async (req, res) => {
  try {
    console.log("📁 GET /api/media - Request received");
    
    const { 
      page = 1, 
      limit = 20, 
      search = "", 
      type = "",
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;
    
    let filteredMedia = [...mockMedia];
    
    // Apply search filter
    if (search) {
      filteredMedia = filteredMedia.filter(media => 
        media.name.toLowerCase().includes(search.toLowerCase()) ||
        media.originalName.toLowerCase().includes(search.toLowerCase()) ||
        media.alt.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply type filter
    if (type && type !== "All Types") {
      filteredMedia = filteredMedia.filter(media => media.type === type);
    }
    
    // Apply sorting
    filteredMedia.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === "desc") {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
    
    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedMedia = filteredMedia.slice(skip, skip + parseInt(limit));
    
    // Calculate stats
    const stats = {
      total: filteredMedia.length,
      images: filteredMedia.filter(m => m.type === 'Image').length,
      documents: filteredMedia.filter(m => m.type === 'Document').length,
      videos: filteredMedia.filter(m => m.type === 'Video').length,
      audio: filteredMedia.filter(m => m.type === 'Audio').length,
      totalSize: filteredMedia.reduce((sum, m) => sum + m.size, 0)
    };
    
    res.send({
      media: paginatedMedia,
      stats,
      total: filteredMedia.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredMedia.length / parseInt(limit))
    });
    
    console.log(`✅ GET /api/media - Returned ${paginatedMedia.length} media files`);
  } catch (error) {
    console.error("❌ GET /api/media error:", error);
    res.status(500).send({ error: "Failed to fetch media files" });
  }
});

// POST upload media file (Admin only)
app.post("/api/media", verifyAdmin, async (req, res) => {
  try {
    console.log("📤 POST /api/media - Upload request received");
    
    const { 
      name,
      originalName,
      type,
      size,
      url,
      display_url,
      thumb_url,
      medium_url,
      delete_url,
      alt,
      mimeType,
      width,
      height,
      imgbb_id,
      imgbb_filename,
      storage_provider
    } = req.body;
    
    // Validate required fields
    if (!name || !type || !size) {
      return res.status(400).send({ 
        error: "Missing required fields: name, type, size" 
      });
    }
    
    const newMedia = {
      _id: `media-${Date.now()}`,
      name: name.trim(),
      originalName: originalName || name,
      type,
      size: parseInt(size),
      url: url || null,
      display_url: display_url || url || null,
      thumb_url: thumb_url || null,
      medium_url: medium_url || null,
      delete_url: delete_url || null,
      alt: alt || "",
      mimeType: mimeType || "",
      width: width ? parseInt(width) : null,
      height: height ? parseInt(height) : null,
      imgbb_id: imgbb_id || null,
      imgbb_filename: imgbb_filename || null,
      storage_provider: storage_provider || 'local',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockMedia.unshift(newMedia);
    
    console.log(`✅ POST /api/media - Created: ${newMedia.name} (${storage_provider || 'local'})`);
    
    res.status(201).send({
      ...newMedia,
      message: `Media file uploaded successfully${storage_provider === 'imgbb' ? ' to ImgBB' : ''}`
    });
    
  } catch (error) {
    console.error("❌ POST /api/media error:", error);
    res.status(500).send({ error: "Failed to upload media file" });
  }
});

// DELETE single media file (Admin only)
app.delete("/api/media/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const mediaIndex = mockMedia.findIndex(media => media._id === id);
    if (mediaIndex === -1) {
      return res.status(404).send({ error: "Media file not found" });
    }
    
    const deletedMedia = mockMedia.splice(mediaIndex, 1)[0];
    
    console.log(`🗑️ DELETE /api/media/${id} - Deleted: ${deletedMedia.name}`);
    
    res.send({ message: "Media file deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE /api/media/:id error:", error);
    res.status(500).send({ error: "Failed to delete media file" });
  }
});

// DELETE multiple media files (Admin only)
app.delete("/api/media", verifyAdmin, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).send({ error: "Invalid ids array" });
    }
    
    let deletedCount = 0;
    
    ids.forEach(id => {
      const mediaIndex = mockMedia.findIndex(media => media._id === id);
      if (mediaIndex !== -1) {
        mockMedia.splice(mediaIndex, 1);
        deletedCount++;
      }
    });
    
    console.log(`🗑️ DELETE /api/media - Deleted ${deletedCount} media files`);
    
    res.send({ 
      message: `${deletedCount} media files deleted successfully`,
      deletedCount 
    });
  } catch (error) {
    console.error("❌ DELETE /api/media error:", error);
    res.status(500).send({ error: "Failed to delete media files" });
  }
});

// ----------------Activities Related API -----------------
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

// Helper functions for activities
const getTimeAgo = (date) => {
  if (!date) return "Unknown";
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now - past;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

const getActivityIcon = (type) => {
  switch (type) {
    case "login":
      return "User";
    case "create":
      return "Plus";
    case "update":
      return "Edit";
    case "delete":
      return "Trash";
    case "action":
    default:
      return "FileText";
  }
};

// GET recent activities (for dashboard)
app.get("/api/activities/recent", verifyAdmin, async (req, res) => {
  try {
    console.log("📊 GET /api/activities/recent - Request received");
    
    const { limit = 6 } = req.query;
    
    // Sort by timestamp (most recent first) and limit results
    const recentActivities = mockActivities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));
    
    // Format activities for frontend
    const formattedActivities = recentActivities.map((activity) => ({
      id: activity._id,
      user: activity.user,
      action: activity.action,
      timestamp: getTimeAgo(activity.createdAt),
      date: activity.createdAt.toLocaleString("en-GB"),
      ip: activity.metadata?.ip || "N/A",
      type: activity.type,
      icon: getActivityIcon(activity.type),
      metadata: activity.metadata,
    }));
    
    console.log(`✅ GET /api/activities/recent - Returned ${formattedActivities.length} activities`);
    res.send(formattedActivities);
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
    
    // Get stats
    const stats = {
      total: mockActivities.length,
      login: mockActivities.filter(a => a.type === "login").length,
      action: mockActivities.filter(a => a.type === "action").length,
      create: mockActivities.filter(a => a.type === "create").length,
      update: mockActivities.filter(a => a.type === "update").length,
      delete: mockActivities.filter(a => a.type === "delete").length,
    };
    
    res.send({
      activities: paginatedActivities,
      total: filteredActivities.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredActivities.length / parseInt(limit)),
      stats,
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

app.listen(port, () => {
  console.log(`🚀 Mock server running on port ${port}`);
  console.log(`📋 Mock services loaded: ${mockServices.length} services`);
  console.log(`📋 Mock projects loaded: ${mockProjects.length} projects`);
  console.log(`📁 Mock media loaded: ${mockMedia.length} media files`);
  console.log(`📊 Mock activities loaded: ${mockActivities.length} activities`);
  console.log(`🔗 Available endpoints:`);
  console.log(`   GET  /services - List all services`);
  console.log(`   GET  /services/:id - Get single service`);
  console.log(`   POST /services - Create new service (Admin)`);
  console.log(`   PUT  /services/:id - Update service (Admin)`);
  console.log(`   DELETE /services/:id - Delete service (Admin)`);
  console.log(`   GET  /projects - List projects with pagination and filters`);
  console.log(`   GET  /projects/:id - Get single project`);
  console.log(`   POST /projects - Create new project`);
  console.log(`   PUT  /projects/:id - Update project`);
  console.log(`   DELETE /projects/:id - Delete project`);
  console.log(`   GET  /api/media - List media files (Admin)`);
  console.log(`   POST /api/media - Upload media file (Admin)`);
  console.log(`   DELETE /api/media/:id - Delete media file (Admin)`);
  console.log(`   DELETE /api/media - Delete multiple media files (Admin)`);
  console.log(`   GET  /api/activities/recent - Get recent activities (Admin)`);
  console.log(`   GET  /api/activities - Get all activities (Admin)`);
  console.log(`   POST /api/activities - Create activity (Admin)`);
  console.log(`   DELETE /api/activities/clear - Clear all activities (Admin)`);
  console.log(`   POST /api/auth/login - Admin login`);
});