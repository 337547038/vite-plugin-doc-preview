# Vite-Plugin-Markdown-Preview

Markdown代码文档预览插件，可将md文档转换为vue并实现预览功能，支持高亮代码显示

插件依懒于`vite-plugin-md`和`prismjs`

## 示例

https://337547038.github.io/vite-plugin-doc-preview/

## 使用
```shell

 1.安装两个所需依懒包
 
 `yarn add vite-plugin-md prismjs --dev`
 
 2.vite.config.ts引入
 
 import Markdown from 'vite-plugin-md'
 import VitePluginDoc from "./plugins/doc"
 
 plugins: [
    vue({include: [/\.vue$/, /\.md$/]}),
    Markdown(),
    VitePluginDoc()
  ]
  
  3.main.ts注册预览组件
  
  import CodePreview from './components/codePreview.vue'
  const app = createApp(App)
  app.component('CodePreview', CodePreview)

```
