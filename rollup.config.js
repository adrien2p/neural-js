import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

import { eslintConfig } from './config/config';

export default {
    moduleId: 'neural-js',
    moduleName: 'neural-js',
    entry: 'src/neural-js.js',
    dest: 'dist/neural-js.js',
    format: 'umd',
    plugins: [
        eslint(eslintConfig),
        babel({
            exclude: 'node_modules/**'
        }),
        resolve()
    ],
    external: [{
        uuid: 'uuid'
    }]
};