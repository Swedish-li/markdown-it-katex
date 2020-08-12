
// copy from Markdown-it
const HTML_ESCAPE_TEST_RE = /[&<>"]/
const HTML_ESCAPE_REPLACE_RE = /[&<>"]/g

type UnsafeChar = '&' | '<' | '>' | '"'

const HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
}

function replaceUnsafeChar(ch: string) {
  return HTML_REPLACEMENTS[ch as UnsafeChar]
}

export function escapeHtml(str: string) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar)
  }
  return str
}
