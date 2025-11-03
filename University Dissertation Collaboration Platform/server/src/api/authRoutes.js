// authRoutes.js
const express = require('express');
const { addStudentOAUTH } = require('../controllers/studentController');
const { addProfessorOAUTH } = require('../controllers/profesorController');
const { OAuth2Client } = require('google-auth-library');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// Add CORS headers specifically for auth routes

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Handle preflight requests (OPTIONS)
router.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.status(204).end();
});

// Rate limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later'
});

// Middleware to validate Google token
const validateGoogleToken = async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ 
            success: false,
            message: 'Token is missing' 
        });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: id, name: full_name, email, picture: profile_picture } = payload;

        req.user = { id, full_name, email, profile_picture };
        next();
    } catch (error) {
        console.error('Error verifying Google token:', error);
        return res.status(401).json({
            success: false,
            message: 'Authentication failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Student authentication route
router.post('/student/google', authLimiter, validateGoogleToken, async (req, res) => {
    try {
        await addStudentOAUTH(req, res);
    } catch (error) {
        console.error('Error in student registration:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering student',
        });
    }
});

// Professor authentication route
router.post('/professor/google', authLimiter, validateGoogleToken, async (req, res) => {
    try {
        await addProfessorOAUTH(req, res);
    } catch (error) {
        console.error('Error in professor registration:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering professor',
        });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;