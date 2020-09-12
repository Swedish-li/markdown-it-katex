import katex from 'katex'
import { Options } from 'markdown-it'
import { RenderRule } from 'markdown-it/lib/renderer'
import PluginOptions from './PluginOptions'

export default (
  pluginOptions: PluginOptions,
  errorHandler: (err: any, latex: string) => string
): RenderRule => {
  const katexOpt = { ...pluginOptions, displayMode: true }
  return (tokens, idx, options: Options, env, self) => {
    const latex = tokens[idx].content + '\n'
    try {
      return `<p>${katex.renderToString(latex, katexOpt)}</p>`
    } catch (error) {
      return errorHandler(error, latex)
    }
  }
}
