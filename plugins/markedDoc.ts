//https://marked.js.org/
import {marked} from 'marked'
import {createHash} from 'node:crypto'
import {markedHighlight} from "marked-highlight";
import hljs from 'highlight.js';

const DEMO_BLOCK_REGEXP = /PreviewComponent[a-zA-Z0-9]{10}\.vue$/

function getHash(text: string): string {
  return createHash('sha256').update(text).digest('hex').substring(0, 10)
}

let previewComponentObj = {}
export default function () {
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
        const name: string = id.replace('./', '').replace('.vue', '')
        return previewComponentObj[name]
      }
    },
    transform(code, id) {
      if (id.endsWith('.md')) {
        console.log('transform', id)
        const renderer = new marked.Renderer()
        const options: any = {
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: false,
          smartLists: true,
          smartypants: false,
          langPrefix: 'language-',
          renderer,
          /*highlight:function (code){
            return hljs.highlightAuto(code).value
          }*/
          /*highlight: (code, lang) => {

            /!*if (lang && hljs.getLanguage(lang)) {
              try {
                return hljs.highlight(lang, code, true).value
              } catch (__) { }
            }*!/
          }*/
        }

        const tokens = marked.lexer(code, options);
        const newCode = marked.parser(tokens)
        marked.use(markedHighlight({
          langPrefix: 'language-',
          highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            //return hljs.highlight(code, {language}).value;
            return '5555'
          }
        }),options);


        //const tokens = marked.lexer(code, options)
        //const newCode = marked.parser(tokens)

        return `<template>${newCode}</template>`
      }
    },
    transform0001(code, id) {
      // if (id.endsWith('.md')) {
      //   let styleHtml: string = ''
      //   let scriptHtml: string = ''
      //   const render=new marked.Renderer()
      //   const options: any = {
      //     gfm: true,
      //     langPrefix: 'language-'
      //   }
      //   const tokens = marked.lexer(code, options);
      //   tokens.forEach((item: any, index: number) => {
      //     const {type, lang, text, block, pre} = item
      //     // 显示预览的代码和组件
      //     if (type === 'code' && lang === 'vue preview') {
      //       const componentName: string = `PreviewComponent${getHash(text)}`
      //       const newItem = {
      //         type: 'html',
      //         text: `<code-preview code="${encodeURIComponent(text)}">
      //                  <${componentName}/>
      //                </code-preview>`
      //       }
      //       tokens.splice(index, 1, newItem)
      //       previewComponentObj[componentName] = text
      //     }
      //     // 页面中的style/script，存在多个时会报错
      //     if (type === 'html' && block && pre) {
      //       // 存在script或style时，替换为空，存在多个时取第一个，暂不作多个合并
      //       const replaceItem = {type: 'space', raw: '\n\n'}
      //       const regScript: RegExp = /<script[^>]*>([^<]|<(?!\/script))*<\/script>/
      //       const regStyle: RegExp = /<style[^>]*>([^<]|<(?!\/style))*<\/style>/
      //       if (regScript.test(text)) {
      //         if (!scriptHtml) {
      //           scriptHtml = text
      //         }
      //         tokens.splice(index, 1, replaceItem)
      //       }
      //       if (regStyle.test(text)) {
      //         if (!styleHtml) {
      //           styleHtml = text
      //         }
      //         tokens.splice(index, 1, replaceItem)
      //       }
      //     }
      //   })
      //   const newCode = marked.parser(tokens)
      //   const componentScript: string[] = []
      //   for (const key in previewComponentObj) {
      //     componentScript.push(`import ${key} from "./${key}.vue"`)
      //   }
      //   if (scriptHtml) {
      //     // 当前带有setup时追加进来，没带时侧添加一个
      //     const iReg: RegExp = new RegExp('(?<=<script)(.*?)(?=>)', 'gi')
      //     const match = scriptHtml.match(iReg)
      //     if (match && match.toString().includes('setup')) {
      //       scriptHtml = scriptHtml.replace('</script>', `${componentScript.join('\n')}\n</script>`)
      //     } else {
      //       let lang: string = ''
      //       try {
      //         lang = ' ' + match.toString().match(/lang="(.*?)"/i)[0]
      //       } catch (e) {
      //       }
      //       scriptHtml += `\n<script setup${lang}>${componentScript.join('\n')}</script>`
      //     }
      //   } else {
      //     scriptHtml = `<script setup>${componentScript.join('\n')}</script>`
      //   }
      //   return `<template><div class="marked-body">${newCode}</div></template>
      //           ${scriptHtml}
      //           ${styleHtml}`
      // }
    }
  }
}
