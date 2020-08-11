import ts from 'rollup-plugin-typescript2'
import path from 'path'

const resolve = (p) => path.resolve(__dirname, p)
const name = 'markdown-it-katex'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: resolve(`dist/${name}.esm.js`),
      format: 'es',
    },
    {
      file: resolve(`dist/${name}.cjs.js`),
      format: 'cjs',
      exports: 'auto',
    },
    {
      file: resolve(`dist/${name}.umd.js`),
      format: 'umd',
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
