#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { VirusScanner } from '../service/virusScanner';

/**
 * Command Line Virus Scanner
 * Usage: npm run scan <file-path>
 * Example: npm run scan ./test.txt
 */

class VirusScannerCLI {
  private virusScanner: VirusScanner;

  constructor() {
    this.virusScanner = new VirusScanner();
  }

  async scanFile(filePath: string): Promise<void> {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Error: File '${filePath}' does not exist.`);
        process.exit(1);
      }

      // Get file stats
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) {
        console.error(`❌ Error: '${filePath}' is not a file.`);
        process.exit(1);
      }

      console.log(`🔍 Scanning file: ${filePath}`);
      console.log(`📁 File size: ${stats.size} bytes`);
      console.log(`📅 Modified: ${stats.mtime.toISOString()}`);
      console.log('─'.repeat(50));

      // Create read stream
      const fileStream = fs.createReadStream(filePath);
      
      // Scan the file
      const startTime = Date.now();
      const result = await this.virusScanner.scanStream(fileStream);
      const scanTime = Date.now() - startTime;

      // Display results
      console.log('📊 Scan Results:');
      console.log('─'.repeat(50));
      
      if (result.isInfected) {
        console.log('🚨 VIRUS DETECTED!');
        console.log(`🔴 Status: INFECTED`);
        console.log(`🦠 Signature: ${result.signature || 'Unknown threat'}`);
        console.log(`📝 Raw Response: ${result.raw}`);
        console.log('');
        console.log('💡 Recommendation: Delete this file immediately!');
        console.log('   Run: rm "' + filePath + '"');
      } else {
        console.log('✅ CLEAN FILE');
        console.log(`🟢 Status: SAFE`);
        console.log(`🔍 Scanned: ${result.signature || 'No threats found'}`);
        console.log(`📝 Raw Response: ${result.raw}`);
      }

      console.log('');
      console.log(`⏱️  Scan completed in ${scanTime}ms`);
      console.log(`📈 Performance: ${(stats.size / scanTime).toFixed(2)} bytes/ms`);

    } catch (error) {
      console.error('❌ Error during scan:', error);
      process.exit(1);
    }
  }

  async scanDirectory(dirPath: string): Promise<void> {
    try {
      if (!fs.existsSync(dirPath)) {
        console.error(`❌ Error: Directory '${dirPath}' does not exist.`);
        process.exit(1);
      }

      const stats = fs.statSync(dirPath);
      if (!stats.isDirectory()) {
        console.error(`❌ Error: '${dirPath}' is not a directory.`);
        process.exit(1);
      }

      console.log(`🔍 Scanning directory: ${dirPath}`);
      console.log('─'.repeat(50));

      const files = this.getAllFiles(dirPath);
      let infectedCount = 0;
      let cleanCount = 0;
      let errorCount = 0;

      for (const file of files) {
        try {
          console.log(`\n📄 Scanning: ${file}`);
          const fileStream = fs.createReadStream(file);
          const result = await this.virusScanner.scanStream(fileStream);
          
          if (result.isInfected) {
            console.log(`🚨 INFECTED: ${result.signature}`);
            infectedCount++;
          } else {
            console.log(`✅ CLEAN`);
            cleanCount++;
          }
        } catch (error) {
          console.log(`❌ ERROR: ${error}`);
          errorCount++;
        }
      }

      console.log('\n' + '─'.repeat(50));
      console.log('📊 Directory Scan Summary:');
      console.log(`✅ Clean files: ${cleanCount}`);
      console.log(`🚨 Infected files: ${infectedCount}`);
      console.log(`❌ Errors: ${errorCount}`);
      console.log(`📁 Total files: ${files.length}`);

    } catch (error) {
      console.error('❌ Error during directory scan:', error);
      process.exit(1);
    }
  }

  private getAllFiles(dirPath: string): string[] {
    const files: string[] = [];
    
    const scanDir = (currentPath: string) => {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          scanDir(fullPath);
        } else if (stats.isFile()) {
          files.push(fullPath);
        }
      }
    };

    scanDir(dirPath);
    return files;
  }

  showHelp(): void {
    console.log('🦠 Virus Scanner CLI');
    console.log('─'.repeat(50));
    console.log('Usage:');
    console.log('  npm run scan <file-path>     - Scan a single file');
    console.log('  npm run scan <directory>     - Scan all files in directory');
    console.log('  npm run scan --help          - Show this help');
    console.log('');
    console.log('Examples:');
    console.log('  npm run scan ./test.txt');
    console.log('  npm run scan ./uploads');
    console.log('  npm run scan ./src');
    console.log('');
    console.log('Supported file types:');
    console.log('  - Text files (.txt, .md, .json, .js, .ts)');
    console.log('  - Image files (.jpg, .png, .gif, .bmp)');
    console.log('  - Document files (.pdf, .doc, .docx)');
    console.log('  - Archive files (.zip, .rar, .tar)');
    console.log('  - And more...');
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    const cli = new VirusScannerCLI();
    cli.showHelp();
    return;
  }

  const targetPath = args[0];
  const cli = new VirusScannerCLI();

  try {
    const stats = fs.statSync(targetPath);
    if (stats.isDirectory()) {
      await cli.scanDirectory(targetPath);
    } else {
      await cli.scanFile(targetPath);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the CLI
if (require.main === module) {
  main().catch(console.error);
}

export { VirusScannerCLI };
