import fs from 'node:fs';
import path from 'node:path';

const targetDir = '/Users/andreanezat/oracle-backend';
const srcDir = path.join(targetDir, 'src');

interface VerificationResult {
    exists: boolean;
    lastModified?: Date;
    recentlyModified?: boolean;
    filesStatus?: Array<{
        file: string;
        exists: boolean;
    }>;
    srcContents?: {
        directories: string[];
        files: string[];
    };
    error?: string;
}

function verifyTransfer(): VerificationResult {
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
        const srcDirs = srcFiles.filter(file => fs.statSync(path.join(srcDir, file)).isDirectory());
        const srcFilesList = srcFiles.filter(file => fs.statSync(path.join(srcDir, file)).isFile());

        console.log('\n=== Transfer Verification Results ===');
        console.log(`Target Directory: ${targetDir}`);
        console.log(`Last Modified: ${lastModified.toLocaleString()}`);
        console.log(`Minutes Since Last Modification: ${diffMinutes.toFixed(2)}`);

        console.log('\nRoot File Status:');
        filesStatus.forEach(({ file, exists }) => {
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
        const error = err as Error;
        console.log('\n❌ Transfer Verification Failed');
        console.log(`Error: ${error.message}`);
        return {
            exists: false,
            error: error.message
        };
    }
}

const result = verifyTransfer();
console.log('\nDetailed Results:', JSON.stringify(result, null, 2));