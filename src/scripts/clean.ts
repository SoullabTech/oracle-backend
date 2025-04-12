import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cleanProject() {
  try {
    console.log('🧹 Cleaning project...');

    // Directories to clean
    const cleanDirs = [
      'dist',
      'build',
      '.cache',
      'node_modules/.cache'
    ];

    cleanDirs.forEach(dir => {
      const fullPath = path.join(process.cwd(), dir);
      if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✅ Cleaned: ${dir}`);
      }
    });

    console.log('✨ Project cleaned successfully!');
  } catch (error) {
    console.error('❌ Clean failed:', error);
    process.exit(1);
  }
}

cleanProject().catch(console.error);