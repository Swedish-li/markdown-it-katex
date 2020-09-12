import MarkdownIt from 'markdown-it'
import PluginOptions from './PluginOptions'
import inlineRule from './inlineRule'
import blockRule from './blockRule'
import inlineRenderer from './inlineRenderer'
import blockRenderer from './blockRenderer'

const defalutPluginOptions: PluginOptions = {
  inlineDelimeter: '$',
  inlineRuleName: 'math_inline',
  blockDelimeter: '$$',
  blockRuleName: 'math_block',
}

export default function (md: MarkdownIt, opt: Partial<PluginOptions> = {}) {
  const options = { ...defalutPluginOptions, ...opt }

  if (options.inlineDelimeter.length !== 1) {
    throw Error('inline delimeter must be single character!')
  }

  const errorHandler = (error: any, latex: string) => {
    console.error(error)
    return md.utils.escapeHtml(latex)
  }

  md.inline.ruler.after('escape', 'math_inline', inlineRule(options))
  md.block.ruler.after('blockquote', 'math_block', blockRule(options), {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  })
  md.renderer.rules.math_inline = inlineRenderer(options, errorHandler)
  md.renderer.rules.math_block = blockRenderer(options, errorHandler)
}
