import fs from 'node:fs';
import path from 'node:path';
import { logUpdate } from '../updateLog.js';

const projectDir = process.cwd();
const srcDir = path.join(projectDir, 'src');

interface SyncResult {
  configFiles: {
    file: string;
    exists: boolean;
  }[];
  sourceFiles: {
    name: string;
    type: 'file' | 'directory';
    path: string;
  }[];
}

function ensureDirectoryExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logUpdate(`Created directory: ${dir}`);
  }
}

function checkConfigFiles(): { file: string; exists: boolean }[] {
  const configFiles = ['package.json', 'tsconfig.json', '.prettierrc', 'README.md'];
  return configFiles.map(file => ({
    file,
    exists: fs.existsSync(path.join(projectDir, file))
  }));
}

function scanSourceDirectory(dir: string): { name: string; type: 'file' | 'directory'; path: string }[] {
  const results: { name: string; type: 'file' | 'directory'; path: string }[] = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        results.push({
          name: entry.name,
          type: 'directory',
          path: fullPath
        });
        // Recursively scan subdirectories
        results.push(...scanSourceDirectory(fullPath));
      }
    } else {
      results.push({
        name: entry.name,
        type: 'file',
        path: fullPath
      });
    }
  }

  return results;
}

async function syncProject(): Promise<SyncResult> {
  try {
    logUpdate('Starting project sync...');

    // Ensure src directory exists
    ensureDirectoryExists(srcDir);

    // Check configuration files
    const configStatus = checkConfigFiles();
    configStatus.forEach(({ file, exists }) => {
      logUpdate(`${exists ? '✅' : '❌'} ${file}`);
    });

    // Scan source directory
    const sourceFiles = scanSourceDirectory(srcDir);
    logUpdate('\nSource files structure:');
    sourceFiles.forEach(({ name, type }) => {
      const icon = type === 'directory' ? '📁' : '📄';
      logUpdate(`${icon} ${name}`);
    });

    logUpdate('Sync check completed successfully!');

    return {
      configFiles: configStatus,
      sourceFiles
    };

  } catch (error) {
    const err = error as Error;
    logUpdate(`Sync failed: ${err.message}`);
    throw err;
  }
}

// Execute sync and handle results
syncProject()
  .then(result => {
    console.log('\nSync Results:', JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error('Sync failed:', error);
    process.exit(1);
  });