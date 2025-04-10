const fs = require('fs');
const path = require('path');

const projectDir = '/home/project';
const srcDir = path.join(projectDir, 'src');
const configFiles = ['package.json', 'tsconfig.json', '.prettierrc', 'README.md'];

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

function syncFiles() {
  try {
    console.log('Starting project sync...');

    // Ensure src directory exists
    ensureDirectoryExists(srcDir);

    // Sync configuration files
    configFiles.forEach(file => {
      const filePath = path.join(projectDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ Found ${file}`);
      } else {
        console.log(`❌ Missing ${file}`);
      }
    });

    // Check src directory structure
    if (fs.existsSync(srcDir)) {
      const files = fs.readdirSync(srcDir);
      console.log('\nSource files found:');
      files.forEach(file => {
        const stats = fs.statSync(path.join(srcDir, file));
        const type = stats.isDirectory() ? '📁' : '📄';
        console.log(`${type} ${file}`);
      });
    }

    console.log('\nSync check completed!');
  } catch (error) {
    console.error('Sync check failed:', error);
    process.exit(1);
  }
}

syncFiles();