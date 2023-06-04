import fs from 'node:fs'
import {createHash} from 'node:crypto'

const DEMO_BLOCK_REGEXP = /.md.DemoBlock[a-zA-Z0-9]{8}\.vue$/
let demoBlockObj = {}

function getHash(text: string): string {
  return createHash('sha256').update(text).digest('hex').substring(0, 8)
}

const vueDoc = () => {
  return {
    name: 'vite:vueDoc',
    enforce: 'pre',
    resolveId(id) {
      if (DEMO_BLOCK_REGEXP.test(id)) {
        return id
      }
    },
    load(id: string) {

      if (DEMO_BLOCK_REGEXP.test(id)) {
        // id格式为 xxxx.md.DemoBlockxx.vue
        const idSplit: number = id.lastIndexOf('.vue')
        const blockId: string = id.slice(idSplit - 17, idSplit)
        return demoBlockObj[blockId]
      }
      if (id.endsWith('.md')) {
        let code: string = fs.readFileSync(id, 'utf8')
        const iReg: RegExp = new RegExp('```vue preview[\\s\\S]*?```', 'gi')
        return code.replace(iReg, (regCode: string): string => {
          // regCode正则匹配出来的，带有开始和结束符　```vue previewXXXXX```
          const endIndex: number = regCode.lastIndexOf('```')
          // 去掉开始结束符标识符
          const newCode: string = regCode.slice(14, endIndex)
          const name: string = `DemoBlock${getHash(regCode)}`
          // 将匹配到的内容暂存起来，等会替换为临时组件的内容
          demoBlockObj[name] = newCode
          // 将匹配到的内容换成一个组件，slot.default为临时组件，slot.code原始的代码
          return `<code-preview>
                   <${name}/>
                   <template #code>${encodeURIComponent(newCode)}</template>
                  </code-preview>
<script setup>
import ${name} from "${id}.${name}.vue"
</script>
`
        })
      }
    },
    transform(code,id){
      if(id.endsWith('.md')){
        console.log(code)
      }
    }
  }
}
export default vueDoc
