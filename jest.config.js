module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.module.ts', '!src/index.ts'],
  coverageDirectory: 'coverage',
  verbose: true
};
