import { RuleInline } from 'markdown-it/lib/parser_inline'
import StateInline from 'markdown-it/lib/rules_inline/state_inline'
import Token from 'markdown-it/lib/token'
import PluginOptions from './PluginOptions'

// Test if potential opening or closing delimiter
// Assumes that there is a "$" at state.src[pos]

const isValidDelim = (state: StateInline, pos: number) => {
  let prevChar: number,
    nextChar: number,
    can_open = true,
    can_close = true
  const max = state.posMax
  prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1
  nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1

  // Check non-whitespace conditions for opening and closing, and
  // check that closing delimeter isn't followed by a number
  if (
    prevChar === 0x20 /* " " */ ||
    prevChar === 0x09 /* \t */ ||
    (nextChar >= 0x30 /* "0" */ && nextChar <= 0x39) /* "9" */
  ) {
    can_close = false
  }
  if (nextChar === 0x20 /* " " */ || nextChar === 0x09 /* \t */) {
    can_open = false
  }

  return {
    can_open,
    can_close,
  }
}

export default (pluginOptions: PluginOptions): RuleInline => {
  const { inlineDelimeter, inlineRuleName } = pluginOptions
  return (state, silent) => {
    if (state.src[state.pos] !== inlineDelimeter) return false

    if (!isValidDelim(state, state.pos).can_open) {
      if (!silent) {
        state.pending += inlineDelimeter
      }
      state.pos += 1
      return true
    }
    let start: number, match: number, token: Token, pos: number
    // First check for and bypass all properly escaped delimiters
    // This loop will assume that the first leading backtick can not
    // be the first character in state.src, which is known since
    // we have found an opening delimiter already.
    start = state.pos + 1
    match = start
    while ((match = state.src.indexOf(inlineDelimeter, match)) !== -1) {
      // Found potential $, look for escapes, pos will point to
      // first non escape when complete
      pos = match - 1
      while (state.src[pos] === '\\') {
        pos -= 1
      }

      // Even number of escapes, potential closing delimiter found
      if ((match - pos) % 2 == 1) {
        break
      }
      match += 1
    }

    // No closing delimter found.  Consume $ and continue.
    if (match === -1) {
      if (!silent) {
        state.pending += inlineDelimeter
      }
      state.pos = start
      return true
    }

    // Check if we have empty content, ie: $$.  Do not parse.
    if (match - start === 0) {
      if (!silent) {
        state.pending += `${inlineDelimeter}${inlineDelimeter}`
      }
      state.pos = start + 1
      return true
    }

    // Check for valid closing delimiter
    if (!isValidDelim(state, match).can_close) {
      if (!silent) {
        state.pending += inlineDelimeter
      }
      state.pos = start
      return true
    }

    if (!silent) {
      token = state.push(inlineRuleName, 'math', 0)
      token.markup = inlineDelimeter
      token.content = state.src.slice(start, match)
    }

    state.pos = match + 1
    return true
  }
}
