"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logUpdate = logUpdate;
exports.getLatestUpdates = getLatestUpdates;
var node_fs_1 = require("node:fs");
var LOG_FILE = 'updates.log';
function logUpdate(message) {
    var timestamp = new Date().toLocaleString();
    var logEntry = "[".concat(timestamp, "] ").concat(message, "\n");
    try {
        node_fs_1.default.appendFileSync(LOG_FILE, logEntry);
        console.log('✅ Update logged successfully');
    }
    catch (error) {
        console.error('Error writing to log file:', error);
    }
}
function getLatestUpdates(count) {
    if (count === void 0) { count = 10; }
    try {
        if (!node_fs_1.default.existsSync(LOG_FILE)) {
            return ['No updates logged yet'];
        }
        var content = node_fs_1.default.readFileSync(LOG_FILE, 'utf-8');
        return content.split('\n')
            .filter(function (line) { return line.trim(); })
            .slice(-count);
    }
    catch (error) {
        console.error('Error reading log file:', error);
        return ['Error reading updates'];
    }
}
// Log initial creation of the log file
logUpdate('Update logging system initialized');
