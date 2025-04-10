import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { logUpdate } from '../updateLog.js';

const execAsync = promisify(exec);

const sourceDir = process.cwd();
const targetDir = '/Users/andreanezat/oracle-backend';

async function copyDirectory(src: string, dest: string) {
  try {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
      logUpdate(`Created directory: ${dest}`);
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.git') {
          await copyDirectory(srcPath, destPath);
        }
      } else {
        fs.copyFileSync(srcPath, destPath);
        logUpdate(`Copied file: ${entry.name}`);
      }
    }
  } catch (err) {
    const error = err as Error;
    logUpdate(`Error copying directory: ${error.message}`);
    throw err;
  }
}

async function transferToLocal() {
  try {
    logUpdate('Starting local transfer...');

    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      logUpdate(`Created target directory: ${targetDir}`);
    }

    // Copy source files
    await copyDirectory(path.join(sourceDir, 'src'), path.join(targetDir, 'src'));
    logUpdate('✅ Copied src directory');

    // Copy configuration files
    const configFiles = ['package.json', 'tsconfig.json', '.prettierrc', 'README.md'];
    for (const file of configFiles) {
      if (fs.existsSync(path.join(sourceDir, file))) {
        fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
        logUpdate(`✅ Copied ${file}`);
      }
    }

    // Copy dist directory if it exists
    const distDir = path.join(sourceDir, 'dist');
    if (fs.existsSync(distDir)) {
      await copyDirectory(distDir, path.join(targetDir, 'dist'));
      logUpdate('✅ Copied dist directory');
    }

    logUpdate('Transfer completed successfully!');
    
    // Run verification
    const { stdout } = await execAsync('ts-node src/verifyTransfer.ts');
    logUpdate('Verification completed');
    console.log('\nVerification Results:');
    console.log(stdout);

  } catch (error) {
    const err = error as Error;
    logUpdate(`Transfer failed: ${err.message}`);
    console.error('Transfer failed:', err);
    process.exit(1);
  }
}

transferToLocal().catch(console.error);