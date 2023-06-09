//https://marked.js.org/
import {marked} from 'marked'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import hljs from 'highlight.js'

const DEMO_BLOCK_REGEXP: RegExp = /VirtualComponent[a-zA-Z0-9]{8}\.vue$/

function getHash(text: string): string {
  return 'VirtualComponent' + crypto.createHash('sha256').update(text).digest('hex').substring(0, 8)
}

const getHighlightCode = (text: string, lang: string, optThemes: string) => {
  let newText
  try {
    newText = hljs.highlight(text, {language: lang}).value
  } catch (e) {
    newText = hljs.highlight(text, {language: 'xml'}).value
  }
  return `<pre class="language-${lang} ${optThemes}"><code class="hljs">${newText}</code></pre>`
}
let previewComponentObj = {}

interface OptConfig {
  marked?: any // marked相关配置
  themes?: string　//　高亮主题
  component?: boolean　//　是否自定义预览组件默认false
  previewId?: string // 预览标识
}

export default function (opt: OptConfig) {
  const optMarked = opt?.marked || {}
  const optThemes: string = opt?.themes || 'github-dark'
  const previewId: string = opt?.previewId || 'vue preview'
  return {
    name: 'vite:vueDocPreview',
    enforce: 'pre',
    resolveId(id) {
      if (DEMO_BLOCK_REGEXP.test(id)) {
        return id
      }
    },
    load(id: string) {
      if (DEMO_BLOCK_REGEXP.test(id)) {
        const name: string = id.replace('./', '').replace('.vue', '')
        return previewComponentObj[name]
      }
    },
    transform(code, id) {
      if (id.endsWith('.md')) {
        let styleHtml: string = ''
        let scriptHtml: string = ''
        const options: any = {
          gfm: true,
          ...optMarked
          //langPrefix: 'language-'
        }
        // 这个方法存在两个问题
        //　1.要使用marked.parse(code)才有效，使用marked.parser(tokens)无效
        //　2.热更新时频繁会出现卡死，还会对已高亮的代码多次高亮从而显示高亮标签
        /*marked.use(markedHighlight({
          langPrefix: 'hljs language-',
          highlight(code, lang) {
            console.log(code)
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
          }
        }));*/
        let newItem: any = {}
        const tokens = marked.lexer(code, options)
        tokens.forEach((item: any, index: number) => {
          const {type, lang, text, block} = item
          // 显示预览的代码和组件
          if (type === 'code' && lang === previewId) {
            const componentName: string = getHash(text)
            newItem = {
              type: 'html',
              text: `<code-preview code="${encodeURIComponent(text)}">
                       <${componentName}/>
                       <template #code>${getHighlightCode(text, 'xml', optThemes)}</template>
                     </code-preview>`
            }
            tokens.splice(index, 1, newItem)
            previewComponentObj[componentName] = text
          } else if (type === 'html' && block) {
            // 存在script或style时，替换为空，存在多个时取第一个，暂不作多个合并
            newItem = {type: 'space', text: '\n\n'}
            const regScript: RegExp = /<script[^>]*>([^<]|<(?!\/script))*<\/script>/
            const regStyle: RegExp = /<style[^>]*>([^<]|<(?!\/style))*<\/style>/
            if (regScript.test(text)) {
              if (!scriptHtml) {
                scriptHtml = text
              }
              tokens.splice(index, 1, newItem)
            }
            if (regStyle.test(text)) {
              if (!styleHtml) {
                styleHtml = text
              }
              tokens.splice(index, 1, newItem)
            }
          } else if (type === 'code') {
            // 代码高亮处理
            tokens.splice(index, 1, {
              type: 'html',
              text: getHighlightCode(text, lang, optThemes)
            } as any)
          }
        })
        const newCode = marked.parser(tokens)
        const componentScript: string[] = [
          `import hljs from 'highlight.js'`,
          `import "highlight.js/styles/${optThemes}.css"`
        ]
        // 预览组件
        if (!opt?.component) {
          // 自定组件时则不导入预设的预览组件
          const pcText = fs.readFileSync(path.resolve(__dirname, '../component/codePreview.vue'), 'utf8')
          const pcName: string = getHash(pcText)
          previewComponentObj[pcName] = pcText
          componentScript.push(`import CodePreview from "./${pcName}.vue"`)
        }
        for (const key in previewComponentObj) {
          componentScript.push(`import ${key} from "./${key}.vue"`)
        }
        // 将需预览的转为虚拟组件并自定指令用于其他代码的高亮
        const scriptAppend: string = `${componentScript.join('\n')}\n`
        if (scriptHtml) {
          // 当前带有setup时追加进来，没带时则添加一个
          const iReg: RegExp = new RegExp('(?<=<script)(.*?)(?=>)', 'gi')
          const match = scriptHtml.match(iReg)
          // @ts-ignore
          if (match && match.toString().includes('setup')) {
            scriptHtml = scriptHtml.replace('</script>', `${scriptAppend}</script>`)
          } else {
            // 存在script脚本没有setup时，则多添加一个带setup的script
            let lang: string = ''
            try {
              lang = ' ' + match.toString().match(/lang="(.*?)"/i)[0]
            } catch (e) {
            }
            scriptHtml += `\n<script setup${lang}>${scriptAppend}</script>`
          }
        } else {
          scriptHtml = `<script setup>${scriptAppend}</script>`
        }
        return `<template><div class="marked-body">${newCode}</div></template>\n
                ${scriptHtml}\n
                ${styleHtml}`
      }
    },
    handleHotUpdate() {
    }
  }
}
