import babel from 'rollup-plugin-babel';
import localResolve from 'rollup-plugin-local-resolve';
import pkg from './package.json';

const external = Object.keys(pkg.peerDependencies || {});
const allExternal = external.concat(Object.keys(pkg.dependencies || {}));

const makeExternalPredicate = (externalArr) => {
    if (externalArr.length === 0) {
        return () => false;
    }
    const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
    return id => pattern.test(id);
};

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
    external: makeExternalPredicate(allExternal),
    plugins: [
        localResolve(),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
        }),
    ],
};
