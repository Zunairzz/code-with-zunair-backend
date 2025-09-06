const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const {BASE_URLS} = require('./utils/UrlContants');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'prod'
        ? ['https://your-frontend-domain.vercel.app'] // Replace with your Vite app domain
        : ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite default ports
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

// Connect to database
connectDB();

// Import routes
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');

// Routes
app.use(BASE_URLS.USER, userRoutes);
app.use(BASE_URLS.ITEMS, itemRoutes);

// Root route with API documentation
app.get('/', (req, res) => {
    res.json({
        message: 'Express MongoDB API for React Vite Frontend',
        version: '1.0.0',
        documentation: {
            baseUrl: req.protocol + '://' + req.get('host'),
            endpoints: {
                users: '/api/users',
                items: '/api/items',
                health: '/api/health'
            },
            methods: {
                'GET /api/users': 'Get all users (supports ?page=1&limit=10&active=true)',
                'POST /api/users': 'Create user {name, email, age}',
                'GET /api/items': 'Get all items (supports filtering, search, pagination)',
                'POST /api/items': 'Create item {title, description, price, category, createdBy}'
            }
        },
        frontend: {
            recommendedViteConfig: 'Configure proxy in vite.config.js for development'
        }
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `The route ${req.originalUrl} does not exist`
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
    });
});

const PORT = process.env.PORT || 3000;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel
module.exports = app;