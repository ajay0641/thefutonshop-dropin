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
    '!./src/**/*.stories.tsx',
    '!./src/**/*.mdx',
    '!./src/docs/**',
    '!./src/data/fixtures/**',
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
