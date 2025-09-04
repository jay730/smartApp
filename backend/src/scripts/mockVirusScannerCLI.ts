#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

/**
 * Mock Virus Scanner CLI for Testing
 * This simulates virus scanning without requiring ClamAV
 * Usage: npm run scan:mock <file-path>
 */

interface MockScanResult {
  raw: string;
  isInfected: boolean;
  signature?: string;
}

class MockVirusScanner {
  private knownThreats: string[] = [
    'EICAR-Test-File',
    'malware',
    'virus',
    'trojan',
    'backdoor',
    'keylogger',
    'spyware'
  ];

  async scanFile(filePath: string): Promise<MockScanResult> {
    return new Promise((resolve) => {
      // Simulate scan delay
      setTimeout(() => {
        const content = fs.readFileSync(filePath, 'utf8').toLowerCase();
        
        // Check for known threat patterns
        const foundThreat = this.knownThreats.find(threat => 
          content.includes(threat.toLowerCase())
        );

        if (foundThreat) {
          resolve({
            raw: `FOUND: ${foundThreat.toUpperCase()}`,
            isInfected: true,
            signature: foundThreat.toUpperCase()
          });
        } else {
          resolve({
            raw: 'OK',
            isInfected: false,
            signature: 'Clean'
          });
        }
      }, Math.random() * 1000 + 500); // Random delay 500-1500ms
    });
  }
}

class MockVirusScannerCLI {
  private mockScanner: MockVirusScanner;

  constructor() {
    this.mockScanner = new MockVirusScanner();
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

      console.log(`🔍 [MOCK] Scanning file: ${filePath}`);
      console.log(`📁 File size: ${stats.size} bytes`);
      console.log(`📅 Modified: ${stats.mtime.toISOString()}`);
      console.log('─'.repeat(50));

      // Scan the file
      const startTime = Date.now();
      const result = await this.mockScanner.scanFile(filePath);
      const scanTime = Date.now() - startTime;

      // Display results
      console.log('📊 Mock Scan Results:');
      console.log('─'.repeat(50));
      
      if (result.isInfected) {
        console.log('🚨 VIRUS DETECTED!');
        console.log(`🔴 Status: INFECTED`);
        console.log(`🦠 Signature: ${result.signature}`);
        console.log(`📝 Raw Response: ${result.raw}`);
        console.log('');
        console.log('💡 Recommendation: Delete this file immediately!');
        console.log('   Run: rm "' + filePath + '"');
      } else {
        console.log('✅ CLEAN FILE');
        console.log(`🟢 Status: SAFE`);
        console.log(`🔍 Scanned: ${result.signature}`);
        console.log(`📝 Raw Response: ${result.raw}`);
      }

      console.log('');
      console.log(`⏱️  Scan completed in ${scanTime}ms`);
      console.log(`📈 Performance: ${(stats.size / scanTime).toFixed(2)} bytes/ms`);
      console.log('');
      console.log('ℹ️  Note: This is a MOCK scanner for testing purposes');
      console.log('   To use real ClamAV, install and run: npm run scan <file>');

    } catch (error) {
      console.error('❌ Error during scan:', error);
      process.exit(1);
    }
  }

  showHelp(): void {
    console.log('🦠 Mock Virus Scanner CLI (for testing)');
    console.log('─'.repeat(50));
    console.log('Usage:');
    console.log('  npm run scan:mock <file-path>  - Mock scan a single file');
    console.log('  npm run scan:mock --help       - Show this help');
    console.log('');
    console.log('Examples:');
    console.log('  npm run scan:mock ./test.txt');
    console.log('  npm run scan:mock ./uploads/file.jpg');
    console.log('');
    console.log('Mock Threats Detected:');
    console.log('  - EICAR-Test-File');
    console.log('  - malware, virus, trojan');
    console.log('  - backdoor, keylogger, spyware');
    console.log('');
    console.log('To test with a "virus":');
    console.log('  echo "This file contains malware" > test-virus.txt');
    console.log('  npm run scan:mock ./test-virus.txt');
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    const cli = new MockVirusScannerCLI();
    cli.showHelp();
    return;
  }

  const targetPath = args[0];
  const cli = new MockVirusScannerCLI();

  try {
    await cli.scanFile(targetPath);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the CLI
if (require.main === module) {
  main().catch(console.error);
}

export { MockVirusScannerCLI };
