// rollup.config.ts
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import dts from 'rollup-plugin-dts'
import { defineConfig } from 'rollup'
import { createRequire } from 'module'

const require = createRequire(import.meta.url),
    pkg = require('./package.json'),
    banner = `/*!
  * ${pkg.name} ${pkg.version}
  * (c) ${new Date().getFullYear()} ${pkg.author}
  * @license MIT
  */`

export default defineConfig([
    {
        input: './lib/main.ts',
        external: Object.keys(pkg.dependencies || {}),
        output: [
            {
                file: 'dist/index.js',
                format: 'cjs',
                banner,
            },
        ],
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
            replace({
                'preventAssignment': true,
                'process.env.VERSION': JSON.stringify(pkg.version),
            }),
        ],
    },
    {
        input: './lib/main.ts',
        output: [
            {
                file: pkg.types,
                format: 'es',
            },
        ],
        plugins: [dts()],
    },
])