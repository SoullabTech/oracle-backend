"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
var jsonwebtoken_1 = require("jsonwebtoken");
var secretKey = process.env.JWT_SECRET || 'your_default_secret_key';
function authenticateToken(req, res, next) {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.sendStatus(401);
        return;
    }
    jsonwebtoken_1.default.verify(token, secretKey, function (err, user) {
        if (err) {
            res.sendStatus(403);
            return;
        }
        req.user = user;
        next();
    });
}
