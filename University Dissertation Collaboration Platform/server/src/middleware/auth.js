// src/middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware for checking authentication
module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assumes the token is in the form 'Bearer <token>'

    if (!token) {
        return res.status(403).json({ message: 'Authorization required' });
    }

    try {
        // Replace 'your_jwt_secret' with your actual secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user information to request object
        req.user = decoded;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
