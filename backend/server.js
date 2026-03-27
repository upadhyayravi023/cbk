/* eslint-env node */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { cloudinary, upload } = require('./cloudinary');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_MOBILE = process.env.ADMIN_MOBILE || '9100000000';

// Msg91 Configuration
const msg91AuthKey = process.env.MSG91_AUTH_KEY;
const msg91TemplateId = process.env.MSG91_OTP_TEMPLATE_ID;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory OTP store (phone -> {otp, expires})
const otps = new Map();

// ── Rate Limiter: max 5 login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// ── JWT Verify Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (verifyErr) {
    return res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
  }
};

// MongoDB Models
const Admission = require('./models/Admission');
const Gallery = require('./models/Gallery');
const Program = require('./models/Program');
const Testimonial = require('./models/Testimonial');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    
    // Data Migration: Convert legacy imageUrl to images array
    const legacyItems = await Gallery.find({ imageUrl: { $exists: true }, images: { $exists: false } });
    if (legacyItems.length > 0) {
      console.log(`🧹 Migrating ${legacyItems.length} legacy gallery items...`);
      for (const item of legacyItems) {
        item.images = [item.imageUrl];
        // item.imageUrl = undefined; // Optional: delete the old field
        await item.save();
      }
      console.log('✅ Migration complete');
    }

    // Seed default programs if none exist
    const count = await Program.countDocuments();
    if (count === 0) {
      await Program.insertMany([
        { title: 'Playgroup', age: '1.5 - 2.5 Years', time: '9:00 AM - 12:00 PM', description: 'Fostering social skills and sensory exploration in a very safe space.', features: ['Sensory Play', 'Basic Social Skills', 'Free Play'], theme: 'pink', order: 1 },
        { title: 'Nursery', age: '2.5 - 3.5 Years', time: '9:00 AM - 12:30 PM', description: 'Introduction to foundational concepts through play and group activities.', features: ['Phonics', 'Pre-math concepts', 'Art Expression'], theme: 'teal', order: 2 },
        { title: 'Junior KG', age: '3.5 - 4.5 Years', time: '8:30 AM - 1:00 PM', description: 'Focuses on cognitive development, reading readiness, and simple math skills.', features: ['Reading & Writing', 'Addition', 'Environmental Science'], theme: 'yellow', order: 3 },
        { title: 'Senior KG', age: '4.5 - 5.5 Years', time: '8:30 AM - 1:30 PM', description: 'Prepares children for formal Grade 1 schooling consolidating previous learning.', features: ['Fluent Sentence Reading', 'Value Education', 'Leadership'], theme: 'blue', order: 4 }
      ]);
      console.log('Default programs seeded');
    }
    // Seed default testimonials if none exist
    const tCount = await Testimonial.countDocuments();
    if (tCount === 0) {
      await Testimonial.insertMany([
        { name: 'Priya Sharma', role: 'Mother of Aaradhya (Nursery)', content: 'The curriculum and the teachers are exceptional. My daughter absolutely loves going to school every day.', rating: 5 },
        { name: 'Rahul Verma', role: 'Father of Rohan (Jr. KG)', content: 'Charmingg Blossoms provides an environment that truly mimics a second home. The balance between play and academics is simply perfect!', rating: 5 }
      ]);
      console.log('Default testimonials seeded');
    }
  })
  .catch(mongoErr => console.error('❌ MongoDB Error:', mongoErr.message));

// ═══════════════════════════════════════
// AUTH
// ═══════════════════════════════════════
// --- Mobile OTP Auth ---
app.post('/api/auth/send-otp', loginLimiter, async (req, res) => {
  let { phone } = req.body;
  if (phone) phone = phone.trim();

  if (!phone) return res.status(400).json({ error: 'Phone number is required' });
  
  // In production, you might want to normalize the phone number
  if (phone !== ADMIN_MOBILE) {
    return res.status(403).json({ error: 'This mobile number is not authorized for admin access.' });
  }

  // Normalize phone for Msg91 (assumes Indian number if 10 digits without +)
  const formattedPhone = phone.startsWith('+') ? phone.replace('+', '') : `91${phone}`;

  // --- Real SMS via Msg91 ---
  if (msg91AuthKey && msg91TemplateId) {
    try {
      const response = await axios.post(`https://control.msg91.com/api/v5/otp?template_id=${msg91TemplateId}&mobile=${formattedPhone}&authkey=${msg91AuthKey}`);
      
      if (response.data.type === 'success') {
        console.log(`📲 [Msg91] OTP sent successfully to ${formattedPhone}`);
        return res.status(200).json({ success: true, message: 'OTP sent to your phone!' });
      } else {
        throw new Error(response.data.message || 'Msg91 API error');
      }
    } catch (smsErr) {
      console.error('❌ [Msg91] Error:', smsErr.response?.data || smsErr.message);
      // Fallback to simulation if Msg91 fails or is not configured
    }
  }

  // --- Simulation Fallback (for development or if Msg91 fails) ---
  // Generate 6-digit OTP locally for simulation
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // 5 mins
  otps.set(phone, { otp, expires });

  console.log(`\n-----------------------------------------`);
  console.log(`🔑 [AUTH-SIM] OTP for ${phone}: ${otp}`);
  console.log(`-----------------------------------------\n`);

  res.status(200).json({ success: true, message: 'OTP sent (Check server terminal for simulation)' });
});

app.post('/api/auth/verify-otp', loginLimiter, async (req, res) => {
  let { phone, otp } = req.body;
  if (phone) phone = phone.trim();
  if (otp) otp = otp.trim();

  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP are required' });

  let isVerified = false;

  // --- Try Admin Bypass/Simulation first ---
  const record = otps.get(phone);
  if (record && record.otp === otp && Date.now() <= record.expires) {
    isVerified = true;
    otps.delete(phone);
  }

  // --- Real Verification via Msg91 ---
  if (!isVerified && msg91AuthKey) {
    try {
      const formattedPhone = phone.startsWith('+') ? phone.replace('+', '') : `91${phone}`;
      const response = await axios.get(`https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${formattedPhone}&authkey=${msg91AuthKey}`);
      
      if (response.data.type === 'success') {
        isVerified = true;
        console.log(`✅ [Msg91] OTP verified for ${formattedPhone}`);
      }
    } catch (verifyErr) {
      console.error('❌ [Msg91] Verification Error:', verifyErr.response?.data || verifyErr.message);
    }
  }

  if (!isVerified) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }

  const token = jwt.sign(
    { phone, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.status(200).json({ token, expiresIn: '8h', success: true });
});

// Old login removed as per "OTP only" requirement

// Verify token endpoint (frontend can call to check if token is still valid)
app.get('/api/auth/verify', verifyToken, (req, res) => {
  res.status(200).json({ valid: true, admin: req.admin });
});

// ═══════════════════════════════════════
// IMAGE UPLOAD (Cloudinary)
// ═══════════════════════════════════════
// Accepts a single 'image' field, uploads to Cloudinary, returns URL
app.post('/api/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });
    res.status(200).json({
      success: true,
      url: req.file.path,          // Cloudinary secure_url
      publicId: req.file.filename  // Cloudinary public_id (for deletion)
    });
  } catch (uploadErr) {
    res.status(500).json({ error: 'Cloudinary upload failed: ' + uploadErr.message });
  }
});

// Delete image from Cloudinary by publicId
app.delete('/api/upload/:publicId', verifyToken, async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ success: true });
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

// ═══════════════════════════════════════
// ADMISSIONS (protected)
// ═══════════════════════════════════════
app.post('/api/admissions', async (req, res) => {
  try {
    const { parentName, phone, email, childAge, program, message } = req.body;
    if (!parentName || !phone || !email || !childAge || !program) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }
    const admission = new Admission({ parentName, phone, email, childAge, program, message });
    await admission.save();
    res.status(201).json({ success: true, message: 'Enquiry submitted successfully', data: admission });
  } catch (saveErr) {
    res.status(500).json({ error: 'Server error: ' + saveErr.message });
  }
});

app.get('/api/admissions', verifyToken, async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.status(200).json(admissions);
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

app.patch('/api/admissions/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Admission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

app.delete('/api/admissions/:id', verifyToken, async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

// ═══════════════════════════════════════
// GALLERY (URL-BASED, NO FILE UPLOAD)
// ═══════════════════════════════════════
app.get('/api/gallery', async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const items = await Gallery.find(filter).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

app.post('/api/gallery', verifyToken, async (req, res) => {
  try {
    const { title, images, category, description } = req.body;
    if (!title || !images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Title and at least one Image URL are required' });
    }
    const item = new Gallery({ title, images, category, description });
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

app.put('/api/gallery/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

app.delete('/api/gallery/:id', verifyToken, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

// ═══════════════════════════════════════
// PROGRAMS
// ═══════════════════════════════════════
app.get('/api/programs', async (req, res) => {
  try {
    const programs = await Program.find().sort({ order: 1 });
    res.status(200).json(programs);
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

app.post('/api/programs', verifyToken, async (req, res) => {
  try {
    const program = new Program(req.body);
    await program.save();
    res.status(201).json({ success: true, data: program });
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

app.put('/api/programs/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

app.delete('/api/programs/:id', verifyToken, async (req, res) => {
  try {
    await Program.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

// ═══════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════
app.get('/api/testimonials', async (req, res) => {
  try {
    const list = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

app.post('/api/testimonials', verifyToken, async (req, res) => {
  try {
    const t = new Testimonial(req.body);
    await t.save();
    res.status(201).json({ success: true, data: t });
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

app.put('/api/testimonials/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

app.delete('/api/testimonials/:id', verifyToken, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (routeErr) {
    res.status(500).json({ error: routeErr.message });
  }
});

// Root
app.get('/', (req, res) => res.send('Charmingg Blossoms CMS API - MongoDB Connected'));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
