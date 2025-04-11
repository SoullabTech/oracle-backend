"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
router.get('/', function (_req, res) {
    res.json({ message: 'Oracle Routes Works' });
});
exports.default = router;
