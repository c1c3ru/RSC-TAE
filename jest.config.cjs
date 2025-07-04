module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.js"]
}; 