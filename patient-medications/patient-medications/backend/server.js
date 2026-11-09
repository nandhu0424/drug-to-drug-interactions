const express = require('express');
const dns = require('dns');
// Fix Windows / ISP DNS SRV lookup failure for MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Security Middlewares (MERN Best Practices)
app.use(helmet()); // Sets secure HTTP headers
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', apiLimiter);

// General Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Restrict CORS to specific frontend
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Routes
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/drugs', require('./routes/drugRoutes'));
app.use('/api/interactions', require('./routes/interactionRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Drug Interaction API running', timestamp: new Date() });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Personalized Drug Interaction Risk Analyzer API is running',
    documentation: {
      health: '/health',
      drugs: '/api/drugs',
      interactions: '/api/interactions',
      patients: '/api/patients'
    }
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
