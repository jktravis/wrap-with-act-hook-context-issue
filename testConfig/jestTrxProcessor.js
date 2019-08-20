const builder = require("jest-trx-results-processor");

const processor = builder({
  outputFile: "./build/jestResults.trx" // this defaults to "test-results.trx"
});

module.exports = processor;
