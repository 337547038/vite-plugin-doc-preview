//https://marked.js.org/
import {marked} from 'marked'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import hljs from 'highlight.js'

const DEMO_BLOCK_REGEXP: RegExp = /Virtual[a-zA-Z0-9]{8}\.vue$/


function getHash(text: string): string {
  return 'Virtual' + crypto.createHash('sha256').update(text).digest('hex').substring(0, 8)
}

const getHighlightCode = (text: string, lang: string) => {
  let newText
  try {
    newText = hljs.highlight(text, {language: lang}).value
  } catch (e) {
    newText = hljs.highlight(text, {language: 'xml'}).value
  }
  // 模板中存在{{}}时也会被赋值不能显示代码，这里转换下
  newText = newText.replace(/{{/g, '&#123;&#123;').replace(/}}/g, '&#125;&#125;')
  return `<pre class="language-${lang}"><code class="hljs">${newText}</code></pre>`
}

interface OptConfig {
  marked?: any // marked相关配置
  themes?: string　//　高亮主题
  component?: boolean　//　是否自定义预览组件默认false
  previewId?: string // 预览标识
}

export default function (opt: OptConfig) {
  const optMarked = opt?.marked || {}
  const previewId: string = opt?.previewId || 'vue preview'
  let previewComponentObj = {}
  let codePreviewPath: string = ''
  return {
    name: 'vite:vueDocPreview',
    enforce: 'pre',
    configResolved(cfg) {
      // 用于开发测试
      //console.log('cfg', cfg.root)
      //root = cfg.root
      codePreviewPath = path.resolve(cfg.root, "./packages/component/codePreview.vue")
    },
    resolveId(id) {
      if (DEMO_BLOCK_REGEXP.test(id)) {
        return id
      }
    },
    load(id: string) {
      /*if (id.endsWith(".md")) {
        // 每个md文件先清空上次的，要不会越积越多。这里清空打包时会有问题
        previewComponentObj = {}
      }*/
      if (DEMO_BLOCK_REGEXP.test(id)) {
        const basename: string = path.basename(id, '.vue') ///xxxx.md.xxx形式。正则将xxxx.md.过滤
        const name: string = basename.replace(/^.*?\.md\./g, '')
        // 使用完后删除。暂不清楚哪个周期里可以清空这值
        setTimeout(()=>{
          delete previewComponentObj[name]
        })
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

        //return `<template>${marked.parse(code, options)}</template>`


        let newItem: any = {}
        const previewObj = {}　//　多定义一个，
        const tokens = marked.lexer(code, options)
        tokens.forEach((item: any, index: number) => {
          const {type, lang, text, block} = item
          // 显示预览的代码和组件
          if (type === 'code' && lang === previewId) {
            const componentName: string = getHash(text)
            newItem = {
              type: 'html',
              text: `<code-preview code="">
                       <${componentName}/>
                       <template #code>${getHighlightCode(text, 'xml')}</template>
                     </code-preview>`
            }
            tokens.splice(index, 1, newItem)
            previewComponentObj[componentName] = text
            previewObj[componentName] = text
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
              text: getHighlightCode(text, lang)
            } as any)
          }
        })
        const newCode = marked.parser(tokens)
        const componentScript: string[] = []
        // 预览组件
        if (!opt?.component) {
          // 自定组件时则不导入预设的预览组件，开发测试可用，从npm安装时路径codePreviewPath是不存在的
          //　加入try方便开发调试
          try {
            const pcText: string = fs.readFileSync(codePreviewPath, 'utf8')
            const pcName: string = getHash(pcText)
            previewComponentObj[pcName] = pcText
            componentScript.push(`import CodePreview from "./${pcName}.vue"`)
          } catch (e) {
            // 发npm后使用这路径
            componentScript.push(`import CodePreview from "vite-plugin-doc-preview/component"`)
          }
        }
        //　previewObj确定import进来都是当前页面的。previewComponentObj如不清空会是全部
        for (const key in previewObj) {
          componentScript.push(`import ${key} from "${id}.${key}.vue"`)
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
    closeBundle() {
      previewComponentObj={}
    }
  }
}
