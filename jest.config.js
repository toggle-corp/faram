module.exports = {
    transform: {
        '^.+\\.jsx?$': './babel-transform.js',
    },
    moduleFileExtensions: [
        'js',
        'jsx',
    ],
    moduleDirectories: [
        'node_modules',
        'src',
    ],
};
