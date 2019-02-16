module.exports = function config(api) {
    api.cache(true);

    return {
        presets: [
            ['@babel/preset-env', { modules: false, debug: true }],
            '@babel/preset-react',
        ],
        plugins: [
            ['@babel/plugin-transform-runtime', { regenerator: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-export-default-from',
        ],
        env: {
            test: {
                plugins: ['transform-es2015-modules-commonjs'],
            },
        },
    };
};
