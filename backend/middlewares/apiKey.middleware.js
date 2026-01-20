import crypto from 'crypto';
import ENV from '../models/env.configs.js';

const checkApiKey = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    // Allow Google OAuth flow to bypass API Key check (handled by browser redirect)
    if (req.originalUrl && (req.originalUrl.includes('/api/user/login/google') || req.originalUrl.includes('/api-docs') || req.originalUrl.includes('favicon.ico'))) {
        return next();
    }
    
    console.log("Checking API Key for URL:", req.originalUrl); // DEBUG: Check what URL is hitting this
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: 'Missing API Key' });
    }

    try {
        // Hash the incoming key
        const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');

        // Compare with stored hash
        // ENV.X_API_KEY should be the HASHED value as per user description
        if (hashedKey === ENV.X_API_KEY) {
            console.log("ok")
            next();
        } else {
            return res.status(403).json({ error: 'Invalid API Key' });
        }
    } catch (error) {
        console.error("API Key validation error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default checkApiKey;
