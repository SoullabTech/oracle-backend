const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = process.cwd();
const targetDir = '/Users/andreanezat/oracle-backend';

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
    console.log(`Created directory: ${dest}`);
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        copyDirectory(srcPath, destPath);
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied file: ${entry.name}`);
    }
  }
}

async function transferToLocal() {
  try {
    console.log('Starting local transfer...');

    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(`Created target directory: ${targetDir}`);
    }

    // Copy source files
    copyDirectory(path.join(sourceDir, 'src'), path.join(targetDir, 'src'));
    console.log('✅ Copied src directory');

    // Copy configuration files
    const configFiles = ['package.json', 'tsconfig.json', '.prettierrc', 'README.md'];
    for (const file of configFiles) {
      if (fs.existsSync(path.join(sourceDir, file))) {
        fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
        console.log(`✅ Copied ${file}`);
      }
    }

    // Copy scripts directory
    if (fs.existsSync(path.join(sourceDir, 'scripts'))) {
      copyDirectory(path.join(sourceDir, 'scripts'), path.join(targetDir, 'scripts'));
      console.log('✅ Copied scripts directory');
    }

    console.log('Transfer completed successfully!');
  } catch (error) {
    console.error('Transfer failed:', error);
    process.exit(1);
  }
}

transferToLocal().catch(console.error);