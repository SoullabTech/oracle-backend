"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var targetDir = '/Users/andreanezat/oracle-backend';
var srcDir = node_path_1.default.join(targetDir, 'src');
function verifyTransfer() {
    try {
        // Check if directories exist
        var mainStats = node_fs_1.default.statSync(targetDir);
        var srcStats = node_fs_1.default.statSync(srcDir);
        var lastModified = srcStats.mtime;
        var now = new Date();
        var diffMinutes = (now.getTime() - lastModified.getTime()) / 1000 / 60;
        // Check for specific files
        var criticalFiles = ['package.json', 'tsconfig.json', '.prettierrc', 'README.md'];
        var filesStatus = criticalFiles.map(function (file) { return ({
            file: file,
            exists: node_fs_1.default.existsSync(node_path_1.default.join(targetDir, file))
        }); });
        // Check src directory contents
        var srcFiles = node_fs_1.default.readdirSync(srcDir);
        var srcDirs = srcFiles.filter(function (file) {
            return node_fs_1.default.statSync(node_path_1.default.join(srcDir, file)).isDirectory();
        });
        var srcFilesList = srcFiles.filter(function (file) {
            return node_fs_1.default.statSync(node_path_1.default.join(srcDir, file)).isFile();
        });
        console.log('\n=== Transfer Verification Results ===');
        console.log("Target Directory: ".concat(targetDir));
        console.log("Last Modified: ".concat(lastModified.toLocaleString()));
        console.log("Minutes Since Last Modification: ".concat(diffMinutes.toFixed(2)));
        console.log('\nRoot File Status:');
        filesStatus.forEach(function (_a) {
            var file = _a.file, exists = _a.exists;
            console.log("".concat(exists ? '✅' : '❌', " ").concat(file));
        });
        console.log('\nSource Directories:');
        srcDirs.forEach(function (dir) {
            console.log("\uD83D\uDCC1 ".concat(dir));
        });
        console.log('\nSource Files:');
        srcFilesList.forEach(function (file) {
            console.log("\uD83D\uDCC4 ".concat(file));
        });
        return {
            exists: true,
            lastModified: lastModified,
            recentlyModified: diffMinutes < 5,
            filesStatus: filesStatus,
            srcContents: {
                directories: srcDirs,
                files: srcFilesList
            }
        };
    }
    catch (err) {
        console.log('\n❌ Transfer Verification Failed');
        console.log("Error: ".concat(err.message));
        return {
            exists: false,
            error: err.message
        };
    }
}
var result = verifyTransfer();
console.log('\nDetailed Results:', JSON.stringify(result, null, 2));
