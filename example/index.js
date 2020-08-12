// console.warn(markdownit)
// console.warn(katex)

function debounce(callback, debounceTime) {
  let timeout
  return function () {
    let _self = this
    let args = Array.prototype.slice.call(arguments)
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(function () {
      callback.apply(_self, args)
    }, debounceTime)
  }
}

var md = markdownit({
  throwOnError: true,
})

md.use(markdownItKatex)

var output = document.getElementById('output')
var input = document.getElementById('input')

function renderLatex() {
  output.innerHTML = md.render(input.value)
}
var debounceRenderLatex = debounce(renderLatex, 200)

renderLatex()

input.addEventListener('input', function (e) {
  debounceRenderLatex()
})
