"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var jsonwebtoken_1 = require("jsonwebtoken");
var supabaseClient_js_1 = require("../supabaseClient.js"); // Assuming supabase is set up
var router = express_1.default.Router();
var secretKey = process.env.JWT_SECRET || 'your_default_secret_key';
var refreshSecretKey = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key';
// Function to generate a refresh token
var generateRefreshToken = function (userId) {
    return jsonwebtoken_1.default.sign({ userId: userId }, refreshSecretKey, { expiresIn: '7d' });
};
// Login route
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, _b, user, error, session, accessToken, refreshToken, error_1;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    res.status(400).json({ error: 'Email and password are required.' });
                    return [2 /*return*/];
                }
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, supabaseClient_js_1.supabase.auth.signInWithPassword({ email: email, password: password })];
            case 2:
                _b = _e.sent(), user = _b.user, error = _b.error, session = _b.session;
                if (error || !session || !user) {
                    res.status(401).json({ error: (error === null || error === void 0 ? void 0 : error.message) || 'Authentication failed.' });
                    return [2 /*return*/];
                }
                accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: (_d = (_c = user.user_metadata) === null || _c === void 0 ? void 0 : _c.role) !== null && _d !== void 0 ? _d : 'client' }, secretKey, { expiresIn: '1h' } // expires in 1 hour
                );
                refreshToken = generateRefreshToken(user.id);
                // Send both access token and refresh token
                res.json({ accessToken: accessToken, refreshToken: refreshToken });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _e.sent();
                res.status(500).json({ error: error_1.message || 'An unexpected error occurred' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
