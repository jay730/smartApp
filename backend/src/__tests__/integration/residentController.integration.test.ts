// Mock the virus scanner in the controller
jest.mock('../../service/virusScanner', () => ({
  VirusScanner: class MockVirusScanner {
    async scanStream(stream: any) {
      return new Promise((resolve) => {
        let content = '';
        stream.on('data', (chunk: any) => {
          content += chunk.toString();
        });
        stream.on('end', () => {
          const isInfected = content.toUpperCase().includes('VIRUS_TEST') || 
                            content.toUpperCase().includes('MALICIOUS_CONTENT') ||
                            content.includes('X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*');
          resolve({
            raw: isInfected ? 'stream: MOCK-VIRUS-SIGNATURE FOUND' : 'stream: OK',
            isInfected,
            signature: isInfected ? 'MOCK-VIRUS-SIGNATURE' : undefined
          });
        });
      });
    }
  }
}));

import request from 'supertest';
import express from 'express';
import { createResidentController } from '../../controller/resident/residentController';

// Create a test app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock multer middleware
const mockMulter = {
  any: () => (req: any, res: any, next: any) => {
    // Ensure req.body exists
    if (!req.body) req.body = {};
    req.files = req.body.files || [];
    next();
  }
};

jest.mock('../../middleware/uploadMiddleware', () => mockMulter);

// Add the route for testing
app.post('/residents', (req, res, next) => {
  createResidentController(req, res).catch(next);
});

describe('Resident Controller Integration Tests', () => {
  describe('POST /residents', () => {
    it('should create a resident with clean files', async () => {
      const cleanFileContent = 'This is a clean file.';
      const mockFile = {
        originalname: 'clean.txt',
        buffer: Buffer.from(cleanFileContent),
        filename: 'clean_123.txt'
      };

      const response = await request(app)
        .post('/residents')
        .field('name', 'John Doe')
        .field('dateOfBirth', '1990-05-15')
        .field('roomNumber', '101')
        .attach('files', Buffer.from(cleanFileContent), 'clean.txt');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('John Doe');
      expect(response.body.dateOfBirth).toBe('1990-05-15');
      expect(response.body.roomNumber).toBe('101');
    });

    it('should reject resident creation with infected files', async () => {
      const infectedFileContent = 'This file contains VIRUS_TEST content.';

      const response = await request(app)
        .post('/residents')
        .field('name', 'John Doe')
        .field('dateOfBirth', '1990-05-15')
        .field('roomNumber', '101')
        .attach('files', Buffer.from(infectedFileContent), 'virus.txt');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('infected with MOCK-VIRUS-SIGNATURE');
    });

    it('should reject resident creation with EICAR test file', async () => {
      const eicarContent = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';

      const response = await request(app)
        .post('/residents')
        .field('name', 'John Doe')
        .field('dateOfBirth', '1990-05-15')
        .field('roomNumber', '101')
        .attach('files', Buffer.from(eicarContent), 'eicar.txt');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('infected with MOCK-VIRUS-SIGNATURE');
    });

    it('should require name, dateOfBirth, and roomNumber', async () => {
      const response = await request(app)
        .post('/residents')
        .field('name', 'John Doe')
        // Missing dateOfBirth and roomNumber

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Name, DOB, and room number are required');
    });

    it('should handle multiple files with mixed content', async () => {
      const cleanContent = 'This is a clean file.';
      const infectedContent = 'This file has MALICIOUS_CONTENT.';

      const response = await request(app)
        .post('/residents')
        .field('name', 'John Doe')
        .field('dateOfBirth', '1990-05-15')
        .field('roomNumber', '101')
        .attach('files', Buffer.from(cleanContent), 'clean.txt')
        .attach('files', Buffer.from(infectedContent), 'infected.txt');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('infected with MOCK-VIRUS-SIGNATURE');
    });
  });
});
