
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  "verbose": true,
  "roots": [
    "<rootDir>/tests"
  ],
  "testMatch": [
    "**/?(*.)+(spec|test|unit.test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.vue$": "vue-jest",
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'ts'],
  setupFiles: [
    "<rootDir>/tests/setup.ts"
  ],
  globalSetup: "<rootDir>/tests/globalSetup.ts",
  globalTeardown: "<rootDir>/tests/globalTeardown.ts",
  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths,
    { prefix: "<rootDir>/src/" }
  )
};
