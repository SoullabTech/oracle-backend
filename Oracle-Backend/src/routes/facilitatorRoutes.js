"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.default.Router();
var sessions = [
    { clientId: 'client1', sessionStart: new Date().toISOString(), status: 'active' },
    { clientId: 'client2', sessionStart: new Date().toISOString(), status: 'completed' },
];
router.get('/sessions', function (_req, res) {
    res.json({ sessions: sessions });
});
exports.default = router;
