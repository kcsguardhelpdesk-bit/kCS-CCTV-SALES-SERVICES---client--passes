import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module setup for path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve Static Folders
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/media', express.static(path.join(__dirname, 'media')));

// Serve PWA Files
app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, 'manifest.json')));
app.get('/sw.js', (req, res) => res.sendFile(path.join(__dirname, 'sw.js')));

// Serve Google Search Console Verification File
app.get('/google093d409f13d38307.html', (req, res) => res.sendFile(path.join(__dirname, 'google093d409f13d38307.html')));

// Mongoose Schema & Model for Products
const ProductSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    company: { type: String, required: true },
    type: { type: String, required: true },
    resolution: { type: String, default: 'N/A' },
    description: { type: String, default: '' },
    price: { type: String, required: true },
    image: { type: String, required: true }
});

const Product = mongoose.model('Product', ProductSchema);

// Mongoose Schema & Model for Inquiries
const InquirySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    requirement: { type: String, required: true },
    message: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now }
});

const Inquiry = mongoose.model('Inquiry', InquirySchema);

// Mongoose Schema & Model for Job Applications
const JobApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    skills: { type: String, required: true, trim: true },
    preferredLocation: { type: String, required: true, trim: true },
    resumeLink: { type: String, required: true, trim: true },
    details: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now }
});

const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

// Mongoose Schema & Model for Job Openings (Job Posts listed on Careers page)
const JobOpeningSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // e.g. "cctv-technician"
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    salary: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    skills: { type: [String], required: true },
    requirements: { type: [String], required: true },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const JobOpening = mongoose.model('JobOpening', JobOpeningSchema);

// Seeding Initial Job Openings if DB is empty
const seedInitialJobOpenings = async () => {
    try {
        const count = await JobOpening.countDocuments();
        if (count === 0) {
            console.log('📦 Seeding initial job openings list to MongoDB...');
            const initialJobOpenings = [
                {
                    id: "cctv-technician",
                    title: "Senior CCTV Installation Technician",
                    category: "Surveillance",
                    location: "Gudur",
                    type: "Full-Time",
                    experience: "2-4 Years",
                    salary: "₹18,000 - ₹25,000 / month",
                    description: "Looking for an expert technician capable of installing, configuring, and troubleshooting IP & Analog camera systems, NVRs, DVRs, and mobile app integration.",
                    skills: ["Hikvision", "CP Plus", "IP Cameras", "Analog CCTV", "NVR Configuration"],
                    requirements: [
                        "Experience with Hikvision, CP Plus, and Dahua systems",
                        "Knowledge of network cabling (CAT6, BNC, coaxial)",
                        "Excellent customer communication skills",
                        "Must own a two-wheeler for field transit"
                    ]
                },
                {
                    id: "networking-engineer",
                    title: "Lead Network Infrastructure Engineer",
                    category: "Networking & IT",
                    location: "Nellore",
                    type: "Full-Time",
                    experience: "3-5 Years",
                    salary: "₹25,000 - ₹35,000 / month",
                    description: "Lead the design and deployment of enterprise-grade LAN/WAN networking, fiber backbone installation, firewall routing, and smart Wi-Fi mesh systems.",
                    skills: ["Layer 3 Switches", "VLAN Setup", "Fiber Optics", "Firewall Setup", "Wi-Fi Mesh"],
                    requirements: [
                        "Proven experience in Layer 3 switch configurations and VLANs",
                        "CCNA or network certification is highly preferred",
                        "Hands-on with fiber optic cable splicing and termination",
                        "Strong troubleshooting skills for enterprise wireless networks"
                    ]
                },
                {
                    id: "node-developer",
                    title: "Full-Stack Node/JS Developer",
                    category: "Software Development",
                    location: "Venkatagiri",
                    type: "Full-Time",
                    experience: "1-3 Years",
                    salary: "₹30,000 - ₹45,000 / month",
                    description: "Join our IT solutions team to develop and maintain in-house applications, CRM tools, PWA apps, and customer-facing service catalogs.",
                    skills: ["Node.js", "Express", "MongoDB", "JavaScript", "REST APIs", "HTML5 & CSS3"],
                    requirements: [
                        "Strong proficiency in JavaScript, Node.js, Express, and MongoDB",
                        "Experience building responsive HTML5/CSS3/JS premium frontends",
                        "Familiarity with RESTful APIs and basic server-side security",
                        "Eager to write clean, secure, and highly optimized code"
                    ]
                },
                {
                    id: "biometric-specialist",
                    title: "Biometric & Access Control Specialist",
                    category: "Access Security",
                    location: "Tirupati",
                    type: "Full-Time",
                    experience: "1-3 Years",
                    salary: "₹16,000 - ₹22,000 / month",
                    description: "Responsible for setting up attendance systems, biometric fingerprint scanners, RFID readers, and electromagnetic locks for schools and commercial buildings.",
                    skills: ["Biometrics", "RFID Scanners", "EM Locks", "Access Control Software", "Wiring"],
                    requirements: [
                        "Experience in biometric software deployment and database sync",
                        "Basic electrical cabling knowledge for electromagnetic lock systems",
                        "Strong problem-solving capability on-site",
                        "Strong professionalism for client handling"
                    ]
                },
                {
                    id: "systems-administrator",
                    title: "IT Support & Systems Administrator",
                    category: "IT Services",
                    location: "Venkatagiri",
                    type: "Full-Time",
                    experience: "2-4 Years",
                    salary: "₹20,000 - ₹28,000 / month",
                    description: "Deploy Microsoft enterprise suites, perform expert Windows OS setups, handle data backup/recovery, and deliver premium IT maintenance services.",
                    skills: ["Windows Server", "Hardware Debugging", "Office 365", "Backup Systems", "OS Setup"],
                    requirements: [
                        "Expertise in Windows 10/11 pro configuration and deployment",
                        "Knowledge of Microsoft 365 licensing and cloud storage security",
                        "Hands-on computer hardware diagnosis and chip-level debugging skills",
                        "Data security awareness and virus remediation"
                    ]
                },
                {
                    id: "sales-executive",
                    title: "B2B Sales & Development Executive",
                    category: "Sales & Marketing",
                    location: "Nellore",
                    type: "Full-Time",
                    experience: "1-3 Years",
                    salary: "₹15,000 - ₹22,000 + Incentives",
                    description: "Promote KCS Guard security solutions to schools, colleges, hospitals, and commercial establishments. Generate leads and drive B2B installations.",
                    skills: ["B2B Sales", "Client Demos", "Telugu Speaking", "Lead Gen", "Negotiation"],
                    requirements: [
                        "Strong communication in Telugu and English",
                        "Passionate about sales, meeting clients, and explaining tech products",
                        "Ability to deliver client demonstrations and gather custom quotes",
                        "Must possess a valid driving license and own vehicle"
                    ]
                },
                {
                    id: "office-admin",
                    title: "Office Administrator & Customer Support",
                    category: "Administration",
                    location: "Naidupeta",
                    type: "Full-Time",
                    experience: "0-2 Years",
                    salary: "₹12,000 - ₹16,000 / month",
                    description: "Manage client incoming calls, handle doorstep technician calendars, maintain digital registers of queries, and coordinate general administrative duties.",
                    skills: ["Spreadsheets", "Client Call Handling", "Billing Control", "English & Telugu"],
                    requirements: [
                        "Basic computer proficiency (Word, Excel, Email)",
                        "Polite, helpful customer communication over phone and WhatsApp",
                        "Strong organizational skills and attention to detail",
                        "Freshers with good communication skills are welcome to apply"
                    ]
                },
                {
                    id: "repair-technician",
                    title: "Hardware Chip-Level Repair Technician",
                    category: "Hardware Diagnostics",
                    location: "Venkatagiri",
                    type: "Full-Time",
                    experience: "2-5 Years",
                    salary: "₹18,000 - ₹26,000 / month",
                    description: "Perform diagnosis and repair of cameras, DVR motherboards, power adapters, SMPS devices, and recording storage issues in our central lab.",
                    skills: ["Chip-level Repair", "Soldering", "Multimeter Use", "SMPS Repair", "Motherboards"],
                    requirements: [
                        "Hands-on soldering and electronics debugging skills",
                        "Experience utilizing multimeters, oscilloscopes, and testing kits",
                        "Sound diagnosis of power shorts and camera chip replacements",
                        "Focus on high-quality repair standards"
                    ]
                },
                {
                    id: "cable-installer",
                    title: "Cable Laying & Fiber Deployment Associate",
                    category: "Field Operations",
                    location: "Rapur",
                    type: "Contract / Full-Time",
                    experience: "0-1 Year",
                    salary: "₹12,000 - ₹15,000 / month",
                    description: "Support our installation team in laying outdoor CAT6 cables, deploying fiber routes, conduit setups, and camera mounting operations.",
                    skills: ["Cable Laying", "Fiber Splicing Support", "Conduit Setups", "Manual Tools", "Drilling"],
                    requirements: [
                        "Physically fit and comfortable working at heights on ladders",
                        "Basic manual tools operation (drilling, cutting, crimping)",
                        "Eager to learn security hardware installation on-field",
                        "Team-player mindset with a focus on safety guidelines"
                    ]
                },
                {
                    id: "inventory-coordinator",
                    title: "Store Inventory & Logistics Coordinator",
                    category: "Operations",
                    location: "Kalahasti",
                    type: "Full-Time",
                    experience: "1-2 Years",
                    salary: "₹14,000 - ₹18,000 / month",
                    description: "Coordinate parts stock levels (cameras, HDDs, cables, connectors), prepare dispatch checklists for field technicians, and update digital registers.",
                    skills: ["Inventory Management", "Logistics Control", "Excel Sheets", "Parts Checking", "Dispatches"],
                    requirements: [
                        "Familiar with basic inventory systems or spreadsheet logging",
                        "Organized sorting of hardware components",
                        "Double-check incoming stock orders from global brands",
                        "Integrity and attention to detail"
                    ]
                }
            ];
            await JobOpening.insertMany(initialJobOpenings);
            console.log('✅ Successfully seeded all 10 initial job openings into MongoDB!');
        } else {
            console.log(`ℹ️ Job Openings collection already populated with ${count} items.`);
        }
    } catch (err) {
        console.error('Error seeding job openings:', err.message);
    }
};

// Seeding Initial Products if DB is empty
const seedInitialProducts = async () => {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            console.log('📦 Seeding initial products list to MongoDB...');
            const initialProducts = [
                { id: 1, productId: "KCS-001", name: "2MP Dome Camera", category: "CCTV Cameras", company: "HIKVISION", type: "Dome Cam", resolution: "2 Megapixel", description: "Crystal clear 2MP indoor surveillance camera with night vision.", price: "₹1,500", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd" },
                { id: 2, productId: "KCS-002", name: "3MP Bullet Camera", category: "CCTV Cameras", company: "CP-PLUS", type: "Bullet Cam", resolution: "3 Megapixel", description: "Weatherproof outdoor bullet camera with HD recording.", price: "₹1,800", image: "https://images.unsplash.com/photo-1558002038-1055907df827" },
                { id: 3, productId: "KCS-003", name: "5MP Ultra HD Camera", category: "CCTV Cameras", company: "DAHUA", type: "Bullet Cam", resolution: "5 Megapixel", description: "Ultra HD surveillance with enhanced night visibility.", price: "₹2,500", image: "https://cdn.shoplightspeed.com/shops/622154/files/59430091/650x650x2/dahua-hd-cvi-5mp-full-colour-bullet-camera-with-au.jpg" },
                { id: 4, productId: "KCS-004", name: "8MP 4K Security Camera", category: "CCTV Cameras", company: "HONEYWELL", type: "Dome Cam", resolution: "8 Megapixel (4K)", description: "Premium 4K security camera for commercial monitoring.", price: "₹4,200", image: "https://tse4.mm.bing.net/th/id/OIP.hvg2dT53lYP0RhYma7HZAAHaEQ?pid=Api&P=0&h=180" },
                { id: 5, productId: "KCS-005", name: "4G WiFi Camera", category: "Wireless & Smart Cameras", company: "TRUEVIEW", type: "Smart Cam", resolution: "N/A", description: "Remote monitoring with 4G SIM and WiFi connectivity.", price: "₹3,500", image: "https://tse4.mm.bing.net/th/id/OIP.5eGp5CTykD7o16WjGTLUKwHaHa?pid=Api&P=0&h=180" },
                { id: 6, productId: "KCS-006", name: "360 Rotate Robo Camera", category: "Wireless & Smart Cameras", company: "CP-PLUS", type: "PTZ Cam", resolution: "N/A", description: "360-degree smart tracking camera with mobile control.", price: "₹2,200", image: "https://tse4.mm.bing.net/th/id/OIP.57PHmXVEMsps8eNEPPTWvgAAAA?pid=Api&P=0&h=180" },
                { id: 7, productId: "KCS-007", name: "Solar Security Camera", category: "Wireless & Smart Cameras", company: "ADS VISION", type: "Solar Cam", resolution: "N/A", description: "Eco-friendly solar powered outdoor surveillance.", price: "₹6,500", image: "https://m.media-amazon.com/images/I/71u8IG9OwSL._AC_SL1500_.jpg" },
                { id: 8, productId: "KCS-008", name: "Bulb Model Camera", category: "Wireless & Smart Cameras", company: "HI-TECH", type: "Hidden Cam", resolution: "N/A", description: "Hidden bulb-style smart security camera with WiFi.", price: "₹1,600", image: "https://m.media-amazon.com/images/I/61UPf3ujCGL._AC_SL1500_.jpg" },
                { id: 9, productId: "KCS-009", name: "4 Channel DVR", category: "Recording Devices", company: "PRAMA", type: "Digital Video Recorder", resolution: "Supports up to 5MP", description: "Supports up to 4 CCTV channels with HD playback.", price: "₹2,800", image: "https://tse3.mm.bing.net/th/id/OIP.LWJvYzk_pFD_RAQsvUJeXwHaEm?pid=Api&P=0&h=180" },
                { id: 10, productId: "KCS-010", name: "8 Channel DVR", category: "Recording Devices", company: "HIKVISION", type: "Digital Video Recorder", resolution: "Supports up to 5MP", description: "Reliable 8CH digital video recording system.", price: "₹4,200", image: "https://tse1.mm.bing.net/th/id/OIP.5J2-raC5V5Mn4NAdoU--1QHaFq?pid=Api&P=0&h=180" },
                { id: 11, productId: "KCS-011", name: "16 Channel DVR", category: "Recording Devices", company: "DAHUA", type: "High End Recorder", resolution: "Supports up to 8MP", description: "Commercial-grade 16CH DVR with remote access.", price: "₹7,500", image: "https://tse2.mm.bing.net/th/id/OIP.5-E57hRaB8HmbP5eVFvBlQHaB2?pid=Api&P=0&h=180" },
                { id: 12, productId: "KCS-012", name: "64 Channel DVR", category: "Recording Devices", company: "HONEYWELL", type: "Enterprise Recorder", resolution: "4K Support", description: "Enterprise surveillance management solution.", price: "₹28,500", image: "https://www.ntc-tech.com/cdn/shop/products/bT80Z-gbZRlH8BWgx31p34UJ1-vfOPxJ93SeFrR0doolWDzZh7O6nXgJOGLUBxo3b36C-Rdk1IdMYZ5SNygg3mezFUYjO2c_s4470_5ad488ae-c399-4690-9e91-d1d18af5a405.jpg?v=1694203836&width=1946" },
                { id: 13, productId: "KCS-013", name: "500GB Surveillance HDD", category: "Storage Devices", company: "WD", type: "Hard Disk", resolution: "N/A", description: "Reliable surveillance storage for DVR systems.", price: "₹1,200", image: "https://down-id.img.susercontent.com/file/id-11134207-7r991-llp4fp16eftt77" },
                { id: 14, productId: "KCS-014", name: "1TB Surveillance HDD", category: "Storage Devices", company: "Seagate", type: "Hard Disk", resolution: "N/A", description: "High-performance hard disk for 24/7 recording.", price: "₹2,500", image: "https://cpimg.tistatic.com/08873298/b/4/1-TB-Seagate-Surveillance-HDD.jpg" },
                { id: 15, productId: "KCS-015", name: "4TB Surveillance HDD", category: "Storage Devices", company: "WD Purple", type: "Hard Disk", resolution: "N/A", description: "Premium storage optimized for CCTV systems.", price: "₹8,500", image: "https://m.media-amazon.com/images/I/71giWLo+PFL._AC_SL1500_.jpg" },
                { id: 16, productId: "KCS-016", name: "CAT 6 Outdoor Cable", category: "Cables & Accessories", company: "KCS", type: "Networking Cable", resolution: "N/A", description: "High-speed outdoor CAT6 networking cable.", price: "₹25 / Mtr", image: "https://down-ph.img.susercontent.com/file/ph-11134207-7r98s-lukb50qconyj8d" },
                { id: 17, productId: "KCS-017", name: "HDMI Cable 20M", category: "Cables & Accessories", company: "KCS", type: "Video Cable", resolution: "N/A", description: "Long-range HDMI cable for HD video transmission.", price: "₹1,200", image: "https://tse2.mm.bing.net/th/id/OIP.xzdrQVuhunDGMH_oX2-HSwHaFj?pid=Api&P=0&h=180" },
                { id: 18, productId: "KCS-018", name: "BNC Cable", category: "Cables & Accessories", company: "KCS", type: "Connector Cable", resolution: "N/A", description: "Premium CCTV BNC connector cable.", price: "₹150", image: "https://5.imimg.com/data5/SELLER/Default/2023/9/348767474/BZ/QX/QK/3980925/bnc-connector-1000x1000.jpg" },
                { id: 19, productId: "KCS-019", name: "Video Balun", category: "Cables & Accessories", company: "KCS", type: "Transmission Device", resolution: "N/A", description: "High-quality video transmission balun.", price: "₹450 / Pair", image: "https://www.7tech.com.co/wp-content/uploads/2020/03/Video-Balun-Pasivo-HD-Esencial-para-C%C3%A1maras-de-Seguridad-1.jpg" },
                { id: 20, productId: "KCS-020", name: "4CH Power Supply", category: "Power Solutions", company: "KCS", type: "SMPS", resolution: "N/A", description: "Stable power distribution for CCTV systems.", price: "₹450", image: "https://5.imimg.com/data5/SELLER/Default/2022/12/WR/GK/QL/69759081/smps-4ch-power-supply-500x500.jpg" },
                { id: 21, productId: "KCS-021", name: "8CH Power Supply", category: "Power Solutions", company: "KCS", type: "SMPS", resolution: "N/A", description: "Heavy-duty CCTV power supply solution.", price: "₹850", image: "https://tse1.mm.bing.net/th/id/OIP.YBd4ECGq1Nrdxdtq5nRauwHaJ2?pid=Api&P=0&h=180" },
                { id: 22, productId: "KCS-022", name: "Adapter Power Cable", category: "Power Solutions", company: "KCS", type: "Power Adapter", resolution: "N/A", description: "Durable adapter cable for camera systems.", price: "₹200", image: "https://tse2.mm.bing.net/th/id/OIP.7cH71vGO3I0AIagQ5IdoRAHaHa?pid=Api&P=0&h=180" },
                { id: 23, productId: "KCS-023", name: "Microsoft Solutions", category: "IT Services", company: "Microsoft", type: "Software Service", resolution: "N/A", description: "Licensed Microsoft software and support services.", price: "Custom Quote", image: "https://keysexperts.com/wp-content/uploads/2025/07/install-office-2024-pro-plus-ltsc-odt-oct-steps.jpg" },
                { id: 24, productId: "KCS-024", name: "Windows Installation", category: "IT Services", company: "Windows", type: "OS Installation", resolution: "N/A", description: "Professional Windows OS installation and setup.", price: "₹500", image: "https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2023/02/windows-11-installation-phase.jpg" }
            ];
            await Product.insertMany(initialProducts);
            console.log('✅ Successfully seeded all 24 initial products into MongoDB!');
        } else {
            console.log(`ℹ️ Products collection already populated with ${count} items.`);
        }
    } catch (err) {
        console.error('Error seeding products:', err.message);
    }
};

// Database Connection
const mongoURI = process.env.MONGO_URI;
console.log('Connecting to MongoDB...');
mongoose.connect(mongoURI)
    .then(async () => {
        console.log('MongoDB Connected Successfully to Cluster0 [kcs_guard]!');
        await seedInitialProducts();
        await seedInitialJobOpenings();
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// Custom cookie-parsing helper
const getAdminToken = (req) => {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return null;
    const match = cookieHeader.match(/admin_token=([^;]+)/);
    return match ? match[1] : null;
};

// Protected Admin Middleware
const requireAdminAuth = (req, res, next) => {
    const token = getAdminToken(req);
    if (token === 'secure_kcs_session') {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
    }
};

const requirePageAuth = (req, res, next) => {
    const token = getAdminToken(req);
    if (token === 'secure_kcs_session') {
        next();
    } else {
        res.redirect('/login');
    }
};

// ---------------- PRODUCTS API ROUTES ----------------

// GET /api/products - Get all products and compiled categories/brands
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ id: 1 });
        
        // Compile categories and brands dynamically from the database
        const categories = [...new Set(products.map(p => p.category))];
        const brands = [...new Set(products.map(p => p.company))];

        res.json({
            success: true,
            data: {
                company: {
                    name: "KCS GUARD",
                    tagline: "Advanced Security & IT Solutions"
                },
                filters: {
                    categories,
                    brands
                },
                products
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ success: false, message: 'Failed to load products.' });
    }
});

// POST /api/products/bulk - Bulk Import products (Protected)
app.post('/api/products/bulk', requireAdminAuth, async (req, res) => {
    try {
        const payload = req.body;
        // Accept either the full productData object or a flat array of products
        const products = Array.isArray(payload) ? payload : (payload.products || []);

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid payload. Must be a JSON array of products.' });
        }
        
        let addedCount = 0;
        let updatedCount = 0;
        
        for (const prod of products) {
            const id = parseInt(prod.id);
            if (!id || !prod.name || !prod.category || !prod.company || !prod.type || !prod.price || !prod.image) {
                continue; // skip malformed elements
            }
            
            const productId = prod.productId || `KCS-${String(id).padStart(3, '0')}`;
            
            const existing = await Product.findOne({ id });
            if (existing) {
                existing.name = prod.name;
                existing.category = prod.category;
                existing.company = prod.company;
                existing.type = prod.type;
                existing.resolution = prod.resolution || 'N/A';
                existing.description = prod.description || '';
                existing.price = prod.price;
                existing.image = prod.image;
                await existing.save();
                updatedCount++;
            } else {
                const newProd = new Product({
                    id,
                    productId,
                    name: prod.name,
                    category: prod.category,
                    company: prod.company,
                    type: prod.type,
                    resolution: prod.resolution || 'N/A',
                    description: prod.description || '',
                    price: prod.price,
                    image: prod.image
                });
                await newProd.save();
                addedCount++;
            }
        }
        
        console.log(`[Database] Bulk import finished. Added: ${addedCount}, Updated: ${updatedCount}`);
        res.json({
            success: true,
            message: `Bulk import completed! Added ${addedCount} new products and updated ${updatedCount} existing products.`
        });
    } catch (error) {
        console.error('Error in bulk import API:', error.message);
        res.status(500).json({ success: false, message: 'Failed to complete bulk import operation.' });
    }
});

// POST /api/products - Add a new product (Protected)
app.post('/api/products', requireAdminAuth, async (req, res) => {
    try {
        const { name, category, company, type, resolution, description, price, image } = req.body;

        if (!name || !category || !company || !type || !price || !image) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        // Get highest ID to auto-increment safely in database
        const highestProd = await Product.findOne().sort({ id: -1 });
        const nextId = highestProd ? highestProd.id + 1 : 1;
        const productId = `KCS-${String(nextId).padStart(3, '0')}`;

        const newProduct = new Product({
            id: nextId,
            productId,
            name,
            category,
            company,
            type,
            resolution: resolution || 'N/A',
            description: description || '',
            price,
            image
        });

        await newProduct.save();
        console.log(`[Database] Added new product: ${name} (${productId})`);

        res.status(201).json({ success: true, message: 'Product added successfully!', data: newProduct });
    } catch (error) {
        console.error('Error adding product:', error.message);
        res.status(500).json({ success: false, message: 'Failed to add product.' });
    }
});

// PUT /api/products/:id - Update product (Protected)
app.put('/api/products/:id', requireAdminAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, category, company, type, resolution, description, price, image } = req.body;

        const product = await Product.findOne({ id });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        if (name) product.name = name;
        if (category) product.category = category;
        if (company) product.company = company;
        if (type) product.type = type;
        if (resolution) product.resolution = resolution;
        if (description) product.description = description;
        if (price) product.price = price;
        if (image) product.image = image;

        await product.save();
        console.log(`[Database] Updated product: ${product.name} (ID: ${id})`);

        res.json({ success: true, message: 'Product updated successfully!', data: product });
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update product.' });
    }
});

// DELETE /api/products/:id - Delete product (Protected)
app.delete('/api/products/:id', requireAdminAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await Product.deleteOne({ id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        console.log(`[Database] Deleted product ID: ${id}`);
        res.json({ success: true, message: 'Product deleted successfully!' });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete product.' });
    }
});

// ---------------- GENERAL SYSTEM ROUTING ----------------

// API Route for Inquiry Submissions
app.post('/api/inquiry', async (req, res) => {
    try {
        const { name, email, phone, requirement, message } = req.body;

        if (!name || !email || !phone || !requirement) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide name, email, phone, and requirement fields.' 
            });
        }

        const newInquiry = new Inquiry({ name, email, phone, requirement, message });
        await newInquiry.save();
        console.log(`[Success] Saved new inquiry from ${name} (${email}) to MongoDB.`);

        res.status(201).json({ success: true, message: 'Inquiry saved successfully!', data: newInquiry });
    } catch (error) {
        console.error('Error saving inquiry:', error.message);
        res.status(500).json({ success: false, message: 'Server Error. Please try again later.' });
    }
});

// GET /api/inquiries - Fetch all user inquiry submissions (Protected)
app.get('/api/inquiries', requireAdminAuth, async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json({ success: true, data: inquiries });
    } catch (error) {
        console.error('Error loading inquiries:', error.message);
        res.status(500).json({ success: false, message: 'Failed to load inquiries.' });
    }
});

// DELETE /api/inquiries/:id - Delete an inquiry submission (Protected)
app.delete('/api/inquiries/:id', requireAdminAuth, async (req, res) => {
    try {
        const result = await Inquiry.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Inquiry not found.' });
        }
        console.log(`[Database] Deleted inquiry ID: ${req.params.id}`);
        res.json({ success: true, message: 'Inquiry deleted successfully!' });
    } catch (error) {
        console.error('Error deleting inquiry:', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete inquiry.' });
    }
});

// ---------------- CAREERS API ROUTES ----------------

// POST /api/careers - Submit a new job application
app.post('/api/careers', async (req, res) => {
    try {
        const { name, email, phone, role, experience, skills, preferredLocation, resumeLink, details } = req.body;

        if (!name || !email || !phone || !role || !experience || !skills || !preferredLocation || !resumeLink) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields: name, email, phone, role, experience, skills, preferredLocation, and resumeLink.' 
            });
        }

        const newApplication = new JobApplication({ 
            name, 
            email, 
            phone, 
            role, 
            experience, 
            skills, 
            preferredLocation, 
            resumeLink, 
            details 
        });
        await newApplication.save();
        console.log(`[Success] Saved new job application from ${name} for ${role} to MongoDB.`);

        res.status(201).json({ success: true, message: 'Application saved successfully!', data: newApplication });
    } catch (error) {
        console.error('Error saving job application:', error.message);
        res.status(500).json({ success: false, message: 'Server Error. Please try again later.' });
    }
});

// GET /api/careers - Fetch all job applications (Protected)
app.get('/api/careers', requireAdminAuth, async (req, res) => {
    try {
        const applications = await JobApplication.find().sort({ createdAt: -1 });
        res.json({ success: true, data: applications });
    } catch (error) {
        console.error('Error loading job applications:', error.message);
        res.status(500).json({ success: false, message: 'Failed to load job applications.' });
    }
});

// DELETE /api/careers/:id - Delete a job application (Protected)
app.delete('/api/careers/:id', requireAdminAuth, async (req, res) => {
    try {
        const result = await JobApplication.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Job application not found.' });
        }
        console.log(`[Database] Deleted job application ID: ${req.params.id}`);
        res.json({ success: true, message: 'Application deleted successfully!' });
    } catch (error) {
        console.error('Error deleting job application:', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete job application.' });
    }
});

// PUT /api/careers/:id - Update a job application (Protected)
app.put('/api/careers/:id', requireAdminAuth, async (req, res) => {
    try {
        const { name, email, phone, role, experience, skills, preferredLocation, resumeLink, details } = req.body;

        if (!name || !email || !phone || !role || !experience || !skills || !preferredLocation || !resumeLink) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields: name, email, phone, role, experience, skills, preferredLocation, and resumeLink.' 
            });
        }

        const application = await JobApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Job application not found.' });
        }

        application.name = name;
        application.email = email;
        application.phone = phone;
        application.role = role;
        application.experience = experience;
        application.skills = skills;
        application.preferredLocation = preferredLocation;
        application.resumeLink = resumeLink;
        application.details = details;

        await application.save();
        console.log(`[Database] Updated job application ID: ${req.params.id} for ${name}`);

        res.json({ success: true, message: 'Application updated successfully!', data: application });
    } catch (error) {
        console.error('Error updating job application:', error.message);
        res.status(500).json({ success: false, message: 'Server Error. Failed to update application.' });
    }
});


// ---------------- JOB OPENINGS API ROUTES ----------------

// GET /api/job-openings - Fetch all job openings (Public)
app.get('/api/job-openings', async (req, res) => {
    try {
        const openings = await JobOpening.find().sort({ createdAt: -1 });
        res.json({ success: true, data: openings });
    } catch (error) {
        console.error('Error loading job openings:', error.message);
        res.status(500).json({ success: false, message: 'Failed to load job openings.' });
    }
});

// POST /api/job-openings - Add a new job opening (Protected)
app.post('/api/job-openings', requireAdminAuth, async (req, res) => {
    try {
        const { id, title, category, location, type, experience, salary, description, skills, requirements, active } = req.body;

        if (!title || !category || !location || !type || !experience || !salary || !description) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        // Validate and clean/generate slug-like custom ID
        let slugId = id ? id.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
        if (!slugId) {
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            slugId = `${slug}-${Date.now().toString().slice(-4)}`;
        }

        // Ensure unique Job ID
        const existingId = await JobOpening.findOne({ id: slugId });
        if (existingId) {
            return res.status(400).json({ success: false, message: `A job opening with ID '${slugId}' already exists. Please choose a different unique ID.` });
        }

        const newOpening = new JobOpening({
            id: slugId,
            title,
            category,
            location,
            type,
            experience,
            salary,
            description,
            skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
            requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n').map(r => r.trim()).filter(Boolean) : []),
            active: active !== undefined ? Boolean(active) : true
        });

        await newOpening.save();
        console.log(`[Database] Added new job opening: ${title} (${slugId})`);

        res.status(201).json({ success: true, message: 'Job opening added successfully!', data: newOpening });
    } catch (error) {
        console.error('Error adding job opening:', error.message);
        res.status(500).json({ success: false, message: 'Failed to add job opening.' });
    }
});

// PUT /api/job-openings/:id - Update job opening (Protected)
app.put('/api/job-openings/:id', requireAdminAuth, async (req, res) => {
    try {
        const { id, title, category, location, type, experience, salary, description, skills, requirements, active } = req.body;

        if (!title || !category || !location || !type || !experience || !salary || !description) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        const opening = await JobOpening.findById(req.params.id);
        if (!opening) {
            return res.status(404).json({ success: false, message: 'Job opening not found.' });
        }

        if (id) {
            const slugId = id.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            if (slugId !== opening.id) {
                const existingId = await JobOpening.findOne({ id: slugId });
                if (existingId) {
                    return res.status(400).json({ success: false, message: `A job opening with ID '${slugId}' already exists. Please choose a different unique ID.` });
                }
                opening.id = slugId;
            }
        }

        opening.title = title;
        opening.category = category;
        opening.location = location;
        opening.type = type;
        opening.experience = experience;
        opening.salary = salary;
        opening.description = description;
        opening.skills = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []);
        opening.requirements = Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n').map(r => r.trim()).filter(Boolean) : []);
        if (active !== undefined) {
            opening.active = Boolean(active);
        }

        await opening.save();
        console.log(`[Database] Updated job opening: ${title} (ID: ${req.params.id})`);

        res.json({ success: true, message: 'Job opening updated successfully!', data: opening });
    } catch (error) {
        console.error('Error updating job opening:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update job opening.' });
    }
});

// PUT /api/job-openings/:id/toggle - Toggle active status of a job opening (Protected)
app.put('/api/job-openings/:id/toggle', requireAdminAuth, async (req, res) => {
    try {
        const opening = await JobOpening.findById(req.params.id);
        if (!opening) {
            return res.status(404).json({ success: false, message: 'Job opening not found.' });
        }

        opening.active = !opening.active;
        await opening.save();

        console.log(`[Database] Toggled job opening active status to: ${opening.active} (ID: ${req.params.id})`);
        res.json({ success: true, message: `Job opening is now ${opening.active ? 'Active (ON)' : 'Inactive (OFF)'}.`, active: opening.active });
    } catch (error) {
        console.error('Error toggling job opening status:', error.message);
        res.status(500).json({ success: false, message: 'Failed to toggle job opening status.' });
    }
});

// DELETE /api/job-openings/:id - Delete job opening (Protected)
app.delete('/api/job-openings/:id', requireAdminAuth, async (req, res) => {
    try {
        const result = await JobOpening.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Job opening not found.' });
        }

        console.log(`[Database] Deleted job opening ID: ${req.params.id}`);
        res.json({ success: true, message: 'Job opening deleted successfully!' });
    } catch (error) {
        console.error('Error deleting job opening:', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete job opening.' });
    }
});


// API Route for Admin Login Authentication
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'kcsguard@2026') {
        res.setHeader('Set-Cookie', 'admin_token=secure_kcs_session; HttpOnly; Path=/; Max-Age=86400');
        return res.json({ success: true, message: 'Authentication successful!' });
    }

    res.status(401).json({ success: false, message: 'Invalid username or password.' });
});

// GET / - Serves Landing Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// GET /index.html - Redirect to clean base path
app.get('/index.html', (req, res) => {
    res.redirect('/');
});

// GET /login - Serves Login Page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// GET /admin - Serves Protected Admin Dashboard
app.get('/admin', requirePageAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// GET /admin.html - Redirect to clean dynamic path
app.get('/admin.html', (req, res) => {
    res.redirect('/admin');
});

// GET /careers - Serves Standalone Careers Page
app.get('/careers', (req, res) => {
    res.sendFile(path.join(__dirname, 'careers.html'));
});

// GET /careers.html - Redirect to clean dynamic path
app.get('/careers.html', (req, res) => {
    res.redirect('/careers');
});

// GET /logout - Clears Session Cookie & Redirects to Home
app.get('/logout', (req, res) => {
    res.setHeader('Set-Cookie', 'admin_token=; HttpOnly; Path=/; Max-Age=0');
    res.redirect('/');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open in browser: http://localhost:${PORT}`);
});
