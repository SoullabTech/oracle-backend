<<<<<<< HEAD
// src/middleware/auth.ts
=======
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
<<<<<<< HEAD
    const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"
=======
    const token = authHeader && authHeader.split(' ')[1]; // Expect header in "Bearer <token>" format
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
    if (!token)
        return res.sendStatus(401); // Unauthorized
    jwt.verify(token, secretKey, (err, user) => {
        if (err)
            return res.sendStatus(403); // Forbidden
<<<<<<< HEAD
        req.user = user; // Now valid thanks to the extended type
=======
        req.user = user;
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
        next();
    });
}
