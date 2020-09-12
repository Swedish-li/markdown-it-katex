import { KatexOptions } from 'katex'

export default interface PluginOptions extends KatexOptions {
  /**
   * Inline rule delimeter, must be single character
   *
   * default value is '$'
   */
  inlineDelimeter: string

  /**
   * inline rule name
   *
   * default value is math_inline
   *
   */
  inlineRuleName: string

  /**
   * block rule delimeter
   *
   * default value is '$$'
   */
  blockDelimeter: string

  /**
   * block rule name
   *
   * default value is math_block
   */
  blockRuleName: string
}
