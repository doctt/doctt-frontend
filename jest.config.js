module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "^Models/(.*)$": "<rootDir>/src/app/models/$1",
    "^Services/(.*)$": "<rootDir>/src/app/services/$1",
    "^Resources/(.*)$": "<rootDir>/resources/$1",
    "^Components/(.*)$": "<rootDir>/src/app/shared/components/$1",
    "^Directives/(.*)$": "<rootDir>/src/app/directives/$1",
  },
  "setupFilesAfterEnv": [
    "<rootDir>/src/setupJest.ts"
  ]
};