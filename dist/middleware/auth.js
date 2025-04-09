"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expect header in "Bearer <token>" format
    if (!token)
        return res.sendStatus(401); // Unauthorized
    jsonwebtoken_1.default.verify(token, secretKey, (err, user) => {
        if (err)
            return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
}
