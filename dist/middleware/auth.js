// src/middleware/auth.ts
import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"
    if (!token)
        return res.sendStatus(401); // Unauthorized
    jwt.verify(token, secretKey, (err, user) => {
        if (err)
            return res.sendStatus(403); // Forbidden
        req.user = user; // Now valid thanks to the extended type
        next();
    });
}
