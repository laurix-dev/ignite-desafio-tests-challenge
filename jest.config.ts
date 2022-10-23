export default {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
};
