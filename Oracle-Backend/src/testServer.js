"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var chatRoutes_js_1 = require("./routes/chatRoutes.js");
var facilitatorRoutes_js_1 = require("./routes/facilitatorRoutes.js");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 5001;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/api/chat', chatRoutes_js_1.default);
app.use('/api/facilitator', facilitatorRoutes_js_1.default);
app.get('/', function (_req, res) {
    res.send('Welcome to the Oracle Backend');
});
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 Oracle backend running on port ".concat(PORT));
});
