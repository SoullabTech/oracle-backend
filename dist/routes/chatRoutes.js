"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/chatRoutes.ts
const express_1 = __importDefault(require("express"));
const mainOracleAgent_js_1 = require("../core/mainOracleAgent.js");
const router = express_1.default.Router();
const oracle = new mainOracleAgent_js_1.MainOracleAgent({ debug: true });
router.post('/process', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Missing query in request body.' });
        }
        const result = await oracle.processQuery(query);
        res.json(result);
    }
    catch (err) {
        console.error('Error in /process route:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
