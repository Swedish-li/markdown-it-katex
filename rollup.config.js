import ts from 'rollup-plugin-typescript2'
import path from 'path'
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser'

const distDir = 'dist'
const pluginName = 'markdown-it-katex'
const globalName = 'markdownItKatex'
const resolveFileName = (type) =>
  path.resolve(__dirname, distDir, `${pluginName}.${type}.js`)

const configArr = []
const plugins = [ts()]
const output = [
  {
    file: resolveFileName('umd'),
    format: 'umd',
    name: globalName,
    globals: {
      katex: 'katex',
    },
    extend: true,
  },
]

if (process.env.NODE_ENV === 'development') {
  plugins.push(
    serve({
      contentBase: ['dist', 'example'],
      verbose: true,
    })
  )
}

if (process.env.NODE_ENV === 'production') {
  output.push(
    {
      file: resolveFileName('esm'),
      format: 'es',
    },
    {
      file: resolveFileName('cjs'),
      format: 'cjs',
      exports: 'auto',
    }
  )
  // UMD Production

  configArr.push({
    input: 'src/index.ts',
    output: {
      file: resolveFileName('umd.min'),
      format: 'umd',
      name: globalName,
      globals: {
        katex: 'katex',
      },
      extend: true,
    },
    external: ['katex'],
    plugins: [...plugins, terser()],
  })
}

configArr.push({
  input: 'src/index.ts',
  output,
  external: ['katex'],
  plugins,
})

export default configArr
