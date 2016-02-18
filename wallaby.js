module.exports = () => {
  return {
    files: [
      '*.js',
      'wassup-trello.js'
    ],
    tests: [
      'tests/*-tests.js'
    ],
    env: {
      type: "node"
    },
    debug: true,
    testFramework: "mocha"
  };
};
