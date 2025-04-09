"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const chatRoutes_js_1 = __importDefault(require("./routes/chatRoutes.js"));
const facilitatorRoutes_js_1 = __importDefault(require("./routes/facilitatorRoutes.js"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/chat', chatRoutes_js_1.default);
app.use('/api/facilitator', facilitatorRoutes_js_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to the Oracle Backend');
});
app.listen(PORT, () => {
    console.log(`🚀 Oracle backend running on port ${PORT}`);
});
