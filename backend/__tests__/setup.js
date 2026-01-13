// Test setup file
require('dotenv').config();

// Mock console.log in tests to reduce noise
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

// Global test timeout
jest.setTimeout(30000);
