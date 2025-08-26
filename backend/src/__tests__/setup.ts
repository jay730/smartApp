// Test setup file
import dotenv from 'dotenv';

// Load environment variables for tests
dotenv.config({ path: '.env.test' });

// Global test timeout
jest.setTimeout(10000);

