// rollup.config.js
// import json from '@rollup/plugin-json';
import ts from 'rollup-plugin-typescript2'
import path from 'path'

// const srcDir = path.resolve(__dirname, 'src')
const resolve = (p) => path.resolve(__dirname, p)
const name = 'markdown-it-katex'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: resolve(`dist/${name}.esm.js`),
      format: `es`,
    },
    {
      file: resolve(`dist/${name}.cjs.js`),
      format: `cjs`,
      exports: 'auto',
    },
    {
      file: resolve(`dist/${name}.js`),
      format: `iife`,
      name,
      globals: {
        katex: 'katex',
      },
      extend: true,
    },
  ],
  external: ['katex'],
  plugins: [ts()],
}
