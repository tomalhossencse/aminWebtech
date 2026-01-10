const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = 3000;

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

app.listen(port, () => {
  console.log(`🚀 Mock server running on port ${port}`);
  console.log(`📋 Mock projects loaded: ${mockProjects.length} projects`);
  console.log(`🔗 Available endpoints:`);
  console.log(`   GET  /projects - List projects with pagination and filters`);
  console.log(`   GET  /projects/:id - Get single project`);
  console.log(`   POST /projects - Create new project`);
  console.log(`   PUT  /projects/:id - Update project`);
  console.log(`   DELETE /projects/:id - Delete project`);
  console.log(`   POST /api/auth/login - Admin login`);
});