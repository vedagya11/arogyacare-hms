const express = require('express');
const router = express.Router();
const mockDB = require('../data/mockDB');

// Basic demo login endpoint (Do NOT use this raw in production)
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Check credentials against demo users
    const user = mockDB.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Return a mock token and role info
        return res.json({
            success: true,
            message: 'Login successful',
            data: {
                role: user.role,
                username: user.username,
                token: `demo-token-${user.role}-${Date.now()}` // Mock JWT token
            }
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
    });
});

module.exports = router;
