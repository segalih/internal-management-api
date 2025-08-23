/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest', // agar bisa jalan di TypeScript
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@database/(.*)$': '<rootDir>/src/database/$1',
    '^@helper/(.*)$': '<rootDir>/src/helper/$1',
    '^@service/(.*)$': '<rootDir>/src/service/$1',
    '^@resource/(.*)$': '<rootDir>/src/resource/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
  },
  testMatch: ['**/__tests__/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts', '!src/**/index.ts'],
  coverageDirectory: 'coverage',
  verbose: true,

  // 🔑 Tambahan untuk migrasi & teardown
  globalSetup: '<rootDir>/jest.global-setup.ts',
  globalTeardown: '<rootDir>/jest.global-teardown.ts',
};
