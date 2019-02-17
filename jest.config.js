module.exports = {
    roots: [
        '<rootDir>/src',
    ],
    collectCoverageFrom: [
        '**/*.{js,jsx}',
        '!**/node_modules/**',
    ],
    transform: {
        '^.+\\.jsx?$': './babel-transform.js',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$',
    moduleFileExtensions: [
        'js',
        'jsx',
    ],
};
