import mdk from '../src/index'
import MarkdownIt from 'markdown-it'

const md = MarkdownIt().use(mdk)
describe('markdown katex render', () => {
  it('Simple inline math', () => {
    const output = md.render('$1+1 = 2$')

    expect(output).toMatchSnapshot()
  })

  it('Simple block math', () => {
    const output = md.render('$$1+1 = 2$$')

    expect(output).toMatchSnapshot()
  })

  it('No whitespace before and after is fine', () => {
    const output = md.render('foo$1+1 = 2$bar')

    expect(output).toMatchSnapshot()
  })

  it('Even when it starts with a negative sign', () => {
    const output = md.render('foo$-1+1 = 2$bar')

    expect(output).toMatchSnapshot()
  })

  it("Shouldn't render empty content", () => {
    const output = md.render('aaa $$ bbb')

    expect(output).toMatchSnapshot()
  })

  it('Should require a closing delimiter', () => {
    const output = md.render('aaa $5.99 bbb')

    expect(output).toMatchSnapshot()
  })

  it('Paragraph break in inline math is not allowed', () => {
    const output = md.render('foo $1+1' + '\n\n' + '= 2$ bar')

    expect(output).toMatchSnapshot()
  })

  it('Inline math with apparent markup should not be processed', () => {
    const output = md.render('foo $1 *i* 1$ bar')

    expect(output).toMatchSnapshot()
  })

  it('Block math can be indented up to 3 spaces', () => {
    // prettier-ignore
    const output = md.render(
      '   $$\n' + 
      '   1+1 = 2\n' + 
      '   $$\n')

    expect(output).toMatchSnapshot()
  })

  it('But 4 means a code block', () => {
    // prettier-ignore
    const output = md.render(
      '    $$\n' + 
      '    1+1 = 2\n' + 
      '    $$\n'
    )

    expect(output).toMatchSnapshot()
  })

  it('Multiline inline math', () => {
    const output = md.render('foo $1 + 1\n' + '= 2$ bar')

    expect(output).toMatchSnapshot()
  })

  it('Multiline display math', () => {
    // prettier-ignore
    const output = md.render(
      '$$\n' + 
      '\n' + 
      '1\n' + 
      '+ 1\n' + 
      '\n' + 
      '= 2\n' + 
      '\n' + 
      '$$\n'
    )

    expect(output).toMatchSnapshot()
  })

  it('Text can immediately follow inline math', () => {
    const output = md.render('$n$-th order')

    expect(output).toMatchSnapshot()
  })

  it('Display math self-closes at the end of document', () => {
    const output = md.render('$$\n' + '1+1 = 2\n')

    expect(output).toMatchSnapshot()
  })

  it('Display and inline math can appear in lists', () => {
    // prettier-ignore
    const output = md.render(
      '* $1+1 = 2$\n' +
      '* $$\n' +
      '1+1 = 2\n' +
      '$$\n'
    )

    expect(output).toMatchSnapshot()
  })

  it('Display math can be written in one line', () => {
    const output = md.render('$$1+1 = 2$$')

    expect(output).toMatchSnapshot()
  })

  it('Or on multiple lines with expression starting and ending on delimited lines', () => {
    // prettier-ignore
    const output = md.render(
      '$$[\n' + 
      '[1, 2]\n' +
      '[3, 4]\n' + 
      ']$$\n'
    )

    expect(output).toMatchSnapshot()
  })

  it('Escaped delimiters should not render math', () => {
    // prettier-ignore
    const output = md.render(
      'Foo \\$1$ bar\n' +
      '\\$\\$\n' + 
      '1\n' + 
      '\\$\\$\n'
    )

    expect(output).toMatchSnapshot()
  })

  it('Numbers can not follow closing inline math', () => {
    const output = md.render(
      "Thus, $20,000 and USD$30,000 won't parse as math."
    )

    expect(output).toMatchSnapshot()
  })

  it('Require non whitespace to right of opening inline math', () => {
    const output = md.render(
      'For some Europeans, it is 2$ for a can of soda, not 1$.'
    )

    expect(output).toMatchSnapshot()
  })

  it('Require non whitespace to left of closing inline math.', () => {
    const output = md.render(
      'I will give you $20 today, if you give me more $ tomorrow.'
    )

    expect(output).toMatchSnapshot()
  })

  it('Inline blockmath is not (currently) registered.', () => {
    const output = md.render(
      "It's well know that $$1 + 1 = 3$$ for sufficiently large 1."
    )

    expect(output).toMatchSnapshot()
  })

  it('Escaped delimiters in math mode', () => {
    const output = md.render('Money adds: $\\$X + \\$Y = \\$Z$.\n')

    expect(output).toMatchSnapshot()
  })

  it('Multiple escaped delimiters in math module', () => {
    const output = md.render(
      'Weird-o: $\\displaystyle{\\begin{pmatrix} \\$ & 1\\\\\\$ \\end{pmatrix}}$.'
    )

    expect(output).toMatchSnapshot()
  })

  it('should call console.error with option throwOnError is true', () => {
    const logFn = jest.fn()
    console.error = logFn

    const mdShowErr = MarkdownIt('default', {
      throwOnError: true,
    } as MarkdownIt.Options).use(mdk)

    mdShowErr.render('$\\atopwithdelims a b c d e$')
    expect(logFn).toHaveBeenCalledTimes(1)

    mdShowErr.render('$$\\atopwithdelims a b c \n ssbs$$')
    expect(logFn).toHaveBeenCalledTimes(2)
  })

  it('should not call console.error with option throwOnError is false', () => {
    const logFn = jest.fn()
    console.error = logFn

    const mdShowErr = MarkdownIt('default', {
      throwOnError: false,
    } as MarkdownIt.Options).use(mdk)

    mdShowErr.render('$\\atopwithdelims a b c d e$')
    expect(logFn).not.toBeCalled()

    mdShowErr.render('$$\\atopwithdelims a b c \n ssbs$$')
    expect(logFn).not.toBeCalled()
  })
})
