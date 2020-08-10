import mdk from './index'
import MarkdownIt from 'markdown-it'

const md = MarkdownIt().use(mdk)
describe('markdown katex render', () => {
  it('Simple inline math', () => {
    const output = md.render(
      `$1+1 = 2$
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Simple block math', () => {
    const output = md.render(
      `$$1+1 = 2$$
`
    )

    expect(output).toMatchSnapshot()
  })

  it('No whitespace before and after is fine', () => {
    const output = md.render(
      `foo$1+1 = 2$bar
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Even when it starts with a negative sign', () => {
    const output = md.render(
      `foo$-1+1 = 2$bar
`
    )

    expect(output).toMatchSnapshot()
  })

  it("Shouldn't render empty content", () => {
    const output = md.render(
      `aaa $$ bbb
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Should require a closing delimiter', () => {
    const output = md.render(
      `aaa $5.99 bbb
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Paragraph break in inline math is not allowed', () => {
    const output = md.render(
      `foo $1+1

= 2$ bar
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Inline math with apparent markup should not be processed', () => {
    const output = md.render(
      `foo $1 *i* 1$ bar
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Block math can be indented up to 3 spaces', () => {
    const output = md.render(
      `   $$
 1+1 = 2
 $$
`
    )

    expect(output).toMatchSnapshot()
  })

  it('But 4 means a code block', () => {
    const output = md.render(
      `    $$
  1+1 = 2
  $$
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Multiline inline math', () => {
    const output = md.render(
      `foo $1 + 1
= 2$ bar
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Multiline display math', () => {
    const output = md.render(
      `$$

1
+ 1

= 2

$$
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Text can immediately follow inline math', () => {
    const output = md.render(
      `$n$-th order
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Display math self-closes at the end of document', () => {
    const output = md.render(
      `$$
1+1 = 2
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Display and inline math can appear in lists', () => {
    const output = md.render(
      `* $1+1 = 2$
* $$
1+1 = 2
$$
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Display math can be written in one line', () => {
    const output = md.render(
      `$$1+1 = 2$$
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Or on multiple lines with expression starting and ending on delimited lines', () => {
    const output = md.render(
      `$$[
[1, 2]
[3, 4]
]$$
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Escaped delimiters should not render math', () => {
    const output = md.render(
      `Foo \$1$ bar
\$\$
1
\$\$
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Numbers can not follow closing inline math', () => {
    const output = md.render(
      `Thus, $20,000 and USD$30,000 won't parse as math.
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Require non whitespace to right of opening inline math', () => {
    const output = md.render(
      `For some Europeans, it is 2$ for a can of soda, not 1$.
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Require non whitespace to left of closing inline math.', () => {
    const output = md.render(
      `I will give you $20 today, if you give me more $ tomorrow.
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Inline blockmath is not (currently) registered.', () => {
    const output = md.render(
      `It's well know that $$1 + 1 = 3$$ for sufficiently large 1.
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Escaped delimiters in math mode', () => {
    const output = md.render(
      `Money adds: $\$X + \$Y = \$Z$.
`
    )

    expect(output).toMatchSnapshot()
  })

  it('Multiple escaped delimiters in math module', () => {
    const output = md.render(
      `Weird-o: $\displaystyle{\begin{pmatrix} \$ & 1\\\$ \end{pmatrix}}$.
`
    )

    expect(output).toMatchSnapshot()
  })
})
