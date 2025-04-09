"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/facilitatorRoutes.ts
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Dummy client session data for demonstration
const sessions = [
    { clientId: 'client1', sessionStart: new Date().toISOString(), status: 'active' },
    { clientId: 'client2', sessionStart: new Date().toISOString(), status: 'completed' },
];
// GET /api/facilitator/sessions
router.get('/sessions', (req, res) => {
    res.json({ sessions });
});
exports.default = router;
