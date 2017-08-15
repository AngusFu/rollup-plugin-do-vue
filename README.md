# md2vue

**NOT DONE YET.**

Transform markdown document to vue component.

## API

```javascript
const md2vue = require('md2vue')

// `vueInjection` is the stuffs you want to add to
// the Vue component's `export default {}` block
const vueInjection = `
head() {
  return '测试'
},
layout: 'component'
`
md2vue(markdown, { vueInjection }).then(content => {
  require('fs').writeFileSync('./dest.vue', content)
})
```


The output could be like this:

```html
<template>
  <article class="markdown-body">
    // ...
    <VueDemo0></VueDemo0>
    // ...
  </article>
</template>
<script>
const VueDemo0 = .... 
// ...
export default {
  components: { VueDemo0 },
+ head() {
+   return '测试'
+ },
+ layout: 'component'
}
</script>
```
