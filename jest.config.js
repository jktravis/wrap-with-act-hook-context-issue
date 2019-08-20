module.exports = {
  setupFiles: [
    "./testConfig/test-shim.js",
    "jest-canvas-mock",
    "./testConfig/mockSignalR.js",
    "./testConfig/test-setup.js",
  ],
  setupFilesAfterEnv: ["@testing-library/react/cleanup-after-each", "@testing-library/jest-dom/extend-expect"],
  snapshotSerializers: ["jest-emotion"],
  transform: {
    "^.+\\.tsx?$": "babel-jest",
    "^.+\\.jsx?$": "babel-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "/build/", "/Scripts/Definitions", "/cypress/"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  transformIgnorePatterns: ["node_modules/(?!(ol|geodesy)/)"],
  moduleNameMapper: {
    "^(Controllers|Api|Utilities)/(.*)$": "<rootDir>Scripts/$1/$2",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  coverageReporters: ["text", "text-summary", "html"],
  coverageDirectory: "testConfig/coverageReport",
  collectCoverageFrom: ["**/Scripts/{App,Controllers,Utilities,Localization,EntryPoints}/**/*.{ts,tsx}"],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};
