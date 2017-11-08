import transform from './transform'
import vueCompiler from './compiler'
import StyleBundler from './StyleBundler'

import {
  camelCase,
  addESLint,
  wrapCSSText,
  wrapScript,
  wrapMarkup,
  wrapVueCompiled,
  wrapModule
} from './util'

const defaults = {
  toggleCode: true,
  vueInjection: '',
  target: 'vue'
}

export default function (source, opts = {}) {
  const config = Object.assign({}, defaults, opts)
  const {
    vueInjection,
    target,
    componentName
  } = config

  const { markup, demos } = transform(source, config)
  const bundler = StyleBundler.from(vueCompiler)
  const tasks = demos.map(({ tag, raw, vue }, index) =>
    vueCompiler
      .compilePromise(vue, tag)
      .then(compiled => wrapVueCompiled({
        tagName: tag,
        compiled
      }))
  )

  return Promise.all(tasks)
    .then(rets => addESLint(rets.join('\n')))
    .then(code => {
      const names = demos.map(({tag}) => {
        return `'${tag}': ${camelCase(tag)}`
      }).join(',\n')
      return Promise.all([
        Promise.resolve({ code, names, vueInjection }),
        bundler.pipe()
      ])
    })
    .then(([obj, css]) => {
      const content = [
        wrapMarkup(markup),
        wrapScript(obj),
        wrapCSSText(css)
      ].join('\n')

      if (!target || target === 'vue') {
        return content
      }

      if (!componentName) {
        throw new Error('[Error] `componentName` must be specified!')
      }

      return vueCompiler
        .compilePromise(content, componentName)
        .then(compiled => wrapModule({
          componentName,
          compiled,
          css
        }))
    })
}
