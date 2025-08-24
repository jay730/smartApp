import { Readable } from "stream";

// Mock Virus Scanner for testing
export interface ScanResult {
  raw: string;
  isInfected: boolean;
  signature?: string;
}

export class MockVirusScanner {
  async scanStream(fileStream: Readable): Promise<ScanResult> {
    return new Promise<ScanResult>((resolve) => {
      let fileContent = '';
      
      fileStream.on('data', (chunk) => {
        fileContent += chunk.toString();
      });
      
      fileStream.on('end', () => {
        // Mock virus detection logic
        const isInfected = this.detectMockVirus(fileContent);
        const signature = isInfected ? 'MOCK-VIRUS-SIGNATURE' : undefined;
        
        resolve({
          raw: isInfected ? 'stream: MOCK-VIRUS-SIGNATURE FOUND' : 'stream: OK',
          isInfected,
          signature
        });
      });
      
      fileStream.on('error', () => {
        resolve({
          raw: 'stream: ERROR',
          isInfected: false
        });
      });
    });
  }
  
  private detectMockVirus(content: string): boolean {
    // Mock virus detection - looks for specific test patterns
    const virusPatterns = [
      'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*',
      'VIRUS_TEST',
      'MALICIOUS_CONTENT',
      'TEST_VIRUS_SIGNATURE'
    ];
    
    return virusPatterns.some(pattern => 
      content.toUpperCase().includes(pattern.toUpperCase())
    );
  }
}

// Unit Tests for Mock Virus Scanner
describe('MockVirusScanner', () => {
  let scanner: MockVirusScanner;

  beforeEach(() => {
    scanner = new MockVirusScanner();
  });

  describe('scanStream', () => {
    it('should detect clean files as safe', async () => {
      const cleanContent = 'This is a clean file with no malicious content.';
      const stream = Readable.from([cleanContent]);

      const result = await scanner.scanStream(stream);

      expect(result.isInfected).toBe(false);
      expect(result.raw).toBe('stream: OK');
      expect(result.signature).toBeUndefined();
    });

    it('should detect VIRUS_TEST pattern as infected', async () => {
      const infectedContent = 'This file contains VIRUS_TEST content.';
      const stream = Readable.from([infectedContent]);

      const result = await scanner.scanStream(stream);

      expect(result.isInfected).toBe(true);
      expect(result.raw).toBe('stream: MOCK-VIRUS-SIGNATURE FOUND');
      expect(result.signature).toBe('MOCK-VIRUS-SIGNATURE');
    });

    it('should detect EICAR test pattern as infected', async () => {
      const eicarContent = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';
      const stream = Readable.from([eicarContent]);

      const result = await scanner.scanStream(stream);

      expect(result.isInfected).toBe(true);
      expect(result.raw).toBe('stream: MOCK-VIRUS-SIGNATURE FOUND');
      expect(result.signature).toBe('MOCK-VIRUS-SIGNATURE');
    });

    it('should detect MALICIOUS_CONTENT pattern as infected', async () => {
      const maliciousContent = 'This file has MALICIOUS_CONTENT in it.';
      const stream = Readable.from([maliciousContent]);

      const result = await scanner.scanStream(stream);

      expect(result.isInfected).toBe(true);
      expect(result.signature).toBe('MOCK-VIRUS-SIGNATURE');
    });

    it('should handle case-insensitive detection', async () => {
      const infectedContent = 'This file has virus_test in lowercase.';
      const stream = Readable.from([infectedContent]);

      const result = await scanner.scanStream(stream);

      expect(result.isInfected).toBe(true);
      expect(result.signature).toBe('MOCK-VIRUS-SIGNATURE');
    });

    it('should handle stream errors gracefully', async () => {
      const errorStream = new Readable();
      errorStream._read = () => {
        errorStream.emit('error', new Error('Stream error'));
      };

      const result = await scanner.scanStream(errorStream);

      expect(result.isInfected).toBe(false);
      expect(result.raw).toBe('stream: ERROR');
    });
  });
});
