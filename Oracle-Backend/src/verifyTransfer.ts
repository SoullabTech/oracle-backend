import fs from 'node:fs';
import path from 'node:path';

const targetDir = '/Users/andreanezat/oracle-backend';
const srcDir = path.join(targetDir, 'src');

function verifyTransfer() {
  try {
    // Check if directories exist
    const mainStats = fs.statSync(targetDir);
    const srcStats = fs.statSync(srcDir);
    const lastModified = srcStats.mtime;
    const now = new Date();
    const diffMinutes = (now.getTime() - lastModified.getTime()) / 1000 / 60;
    
    // Check for specific files
    const criticalFiles = ['package.json', 'tsconfig.json', '.prettierrc', 'README.md'];
    const filesStatus = criticalFiles.map(file => ({
      file,
      exists: fs.existsSync(path.join(targetDir, file))
    }));

    // Check src directory contents
    const srcFiles = fs.readdirSync(srcDir);
    const srcDirs = srcFiles.filter(file => 
      fs.statSync(path.join(srcDir, file)).isDirectory()
    );
    const srcFilesList = srcFiles.filter(file => 
      fs.statSync(path.join(srcDir, file)).isFile()
    );
    
    console.log('\n=== Transfer Verification Results ===');
    console.log(`Target Directory: ${targetDir}`);
    console.log(`Last Modified: ${lastModified.toLocaleString()}`);
    console.log(`Minutes Since Last Modification: ${diffMinutes.toFixed(2)}`);
    
    console.log('\nRoot File Status:');
    filesStatus.forEach(({file, exists}) => {
      console.log(`${exists ? '✅' : '❌'} ${file}`);
    });
    
    console.log('\nSource Directories:');
    srcDirs.forEach(dir => {
      console.log(`📁 ${dir}`);
    });
    
    console.log('\nSource Files:');
    srcFilesList.forEach(file => {
      console.log(`📄 ${file}`);
    });
    
    return {
      exists: true,
      lastModified,
      recentlyModified: diffMinutes < 5,
      filesStatus,
      srcContents: {
        directories: srcDirs,
        files: srcFilesList
      }
    };
  } catch (err) {
    console.log('\n❌ Transfer Verification Failed');
    console.log(`Error: ${(err as Error).message}`);
    return {
      exists: false,
      error: (err as Error).message
    };
  }
}

const result = verifyTransfer();
console.log('\nDetailed Results:', JSON.stringify(result, null, 2));