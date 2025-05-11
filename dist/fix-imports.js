import fs from "fs";
import path from "path";
function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walk(filepath, filelist);
    } else if (file.endsWith(".ts")) {
      filelist.push(filepath);
    }
  });
  return filelist;
}
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  let modified = content.replace(
    /(import\s+.*?from\s+['"][^'"\n\r;]+)(?=\n|\r)/g,
    '$1";',
  );
  modified = modified.replace(
    /(export\s+\*\s+from\s+['"][^'"\n\r;]+)(?=\n|\r)/g,
    '$1";',
  );
  if (content !== modified) {
    fs.writeFileSync(filePath, modified, "utf-8");
    console.log(`🛠️ Fixed: ${filePath}`);
  }
}
const tsFiles = walk("./src");
tsFiles.forEach(fixImports);
