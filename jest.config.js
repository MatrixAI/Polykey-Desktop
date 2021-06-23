const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

const transformIgnorePatterns = [
  '/dist/',
  // Ignore modules without es dir.
  // Update: @babel/runtime should also be transformed
  // 'node_modules/(?!.*(@babel|lodash-es))',
  'node_modules/(?!@ant-design/icons-vue|@ant-design/icons-svg|lodash-es)/',
];

module.exports = {
  verbose: true,
  roots: ['<rootDir>/tests'],
  testMatch: ['**/?(*.)+(spec|test|unit.test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
    "^.+\\.svg$": "jest-transform-stub"
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'ts'],
  setupFiles: ['<rootDir>/tests/setup.ts'],
  globalSetup: '<rootDir>/tests/globalSetup.ts',
  globalTeardown: '<rootDir>/tests/globalTeardown.ts',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),
  transformIgnorePatterns,
};
