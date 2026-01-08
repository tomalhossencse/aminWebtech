const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vybtxro.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const sampleProjects = [
  {
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

async function seedProjects() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db("AminWebTechDB");
    const projectsCollection = db.collection("projects");
    
    // Clear existing projects (optional)
    await projectsCollection.deleteMany({});
    console.log("Cleared existing projects");
    
    // Insert sample projects
    const result = await projectsCollection.insertMany(sampleProjects);
    console.log(`✅ Inserted ${result.insertedCount} sample projects`);
    
    // Display inserted projects
    const projects = await projectsCollection.find({}).toArray();
    console.log("\n📋 Sample Projects:");
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.category}) - ${project.isActive ? 'Active' : 'Inactive'}`);
    });
    
  } catch (error) {
    console.error("❌ Error seeding projects:", error);
  } finally {
    await client.close();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

seedProjects();