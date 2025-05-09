// verify-imports.ts
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
const rootDir = path.resolve("src");
const invalidImports = [];
function scanFile(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
        if (line.match(/from\s+['"][^'"]+\.js['"]/) ||
            line.match(/import\(['"][^'"]+\.js['"]\)/)) {
            invalidImports.push(filePath);
        }
    });
}
function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath);
        }
        else if (entry.isFile() && entry.name.endsWith(".ts")) {
            scanFile(fullPath);
        }
    }
}
walk(rootDir);
if (invalidImports.length > 0) {
    console.warn("⚠️  Found .js imports. Auto-fixing...");
    try {
        execSync("./fix-import-extensions.sh", { stdio: "inherit" });
        const filesToAdd = [...new Set(invalidImports)].map((file) => `"${file}"`).join(" ");
        execSync(`git add ${filesToAdd}`, { stdio: "inherit" });
        console.log("✅ Imports fixed and changes staged.");
        process.exit(0); // Allow commit to proceed
    }
    catch (e) {
        console.error("❌ Fix failed:", e);
        process.exit(1);
    }
}
else {
    console.log("✅ All imports are clean (no .js extensions found)");
}
