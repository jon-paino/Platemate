require("dotenv").config({ path: ".env.test" });

module.exports = {
    testEnvironment: "jsdom",
    setupFiles: ["dotenv/config"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    },
  };
  
