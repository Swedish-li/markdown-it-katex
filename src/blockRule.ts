import { RuleBlock } from 'markdown-it/lib/parser_block'
import PluginOptions from './PluginOptions'

export default (pluginsOptions: PluginOptions): RuleBlock => {
  const { blockDelimeter, blockRuleName } = pluginsOptions
  const delimeterLen = blockDelimeter.length

  return (state, start, end, silent) => {
    let firstLine,
      lastLine,
      next,
      lastPos,
      found = false,
      token,
      pos = state.bMarks[start] + state.tShift[start],
      max = state.eMarks[start]

    if (pos + delimeterLen > max) {
      return false
    }
    if (state.src.slice(pos, pos + delimeterLen) !== blockDelimeter) {
      return false
    }

    pos += delimeterLen
    firstLine = state.src.slice(pos, max)

    if (silent) {
      return true
    }
    if (firstLine.trim().slice(-delimeterLen) === blockDelimeter) {
      // Single line expression
      firstLine = firstLine.trim().slice(0, -delimeterLen)
      found = true
    }

    for (next = start; !found; ) {
      next++

      if (next >= end) {
        break
      }

      pos = state.bMarks[next] + state.tShift[next]
      max = state.eMarks[next]

      if (pos < max && state.tShift[next] < state.blkIndent) {
        // non-empty line with negative indent should stop the list:
        break
      }

      if (
        state.src.slice(pos, max).trim().slice(-delimeterLen) === blockDelimeter
      ) {
        lastPos = state.src.slice(0, max).lastIndexOf(blockDelimeter)
        lastLine = state.src.slice(pos, lastPos)
        found = true
      }
    }

    state.line = next + 1

    token = state.push(blockRuleName, 'math', 0)
    token.block = true
    token.content =
      (firstLine && firstLine.trim() ? firstLine + '\n' : '') +
      state.getLines(start + 1, next, state.tShift[start], true) +
      (lastLine && lastLine.trim() ? lastLine : '')
    token.map = [start, state.line]
    token.markup = blockDelimeter
    return true
  }
}
