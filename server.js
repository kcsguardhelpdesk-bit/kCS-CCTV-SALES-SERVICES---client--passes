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
