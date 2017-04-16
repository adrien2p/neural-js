import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';

import { eslintConfig } from './config/config';

export default {
    moduleId: 'neural-js',
    moduleName: 'neural-js',
    entry: 'src/neural-js.js',
    dest: 'dist/neural-js.js',
    format: 'umd',
    plugins: [
        eslint(eslintConfig),
        resolve()
    ],
    external: [{ uuid: 'uuid' }]
};