import babel from 'rollup-plugin-babel';
import localResolve from 'rollup-plugin-local-resolve';
import pkg from './package.json';

console.warn([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
]);

export default {
    input: 'src/index.js',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
        },
        {
            file: pkg.module,
            format: 'es',
            exports: 'named',
        },
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
        localResolve(),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
        }),
    ],
};
