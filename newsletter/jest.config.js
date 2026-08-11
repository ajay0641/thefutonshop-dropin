const baseConfig = require('@adobe-commerce/elsie/config/jest');

module.exports = {
  ...baseConfig,

  setupFiles: [
    ...baseConfig.setupFiles,
    '<rootDir>/tests/__mocks__/browserMocks.ts',
  ],

  collectCoverageFrom: [
    ...baseConfig.collectCoverageFrom,
    '!./src/**/index.ts',
    '!./src/**/*.d.ts',
    '!./src/data/**',
  ],

  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
