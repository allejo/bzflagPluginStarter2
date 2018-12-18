module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: [
        "/node_modules/",

        // Skip any files starting with a lowercase letter
        "__tests__/[a-z].*\.ts"
    ],
};
