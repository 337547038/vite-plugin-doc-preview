# vite-plugin-doc-preview

基于 `vue3`、`vite`、`marked` 的 markdown 代码块预览插件。

`vite-plugin-doc-preview` 能将 markdown 文档中带有如 `preview` 指定标识的 vue 代码块替换为 vue 组件，同时支持高亮代码。

## 示例

https://337547038.github.io/vite-plugin-doc-preview/

## 安装使用

安装依赖

```shell
npm install vite-plugin-doc-preview
# or
pnpm install vite-plugin-doc-preview
# or
yarn install vite-plugin-doc-preview
```

## 在 Vite 中使用

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import MarkedPreview from 'vite-plugin-doc-preview'

export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    MarkedPreview()
    // 可根据需要设置参数，可选
    /*MarkedPreview({
      marked:{}, // marked转换options，可参考https://marked.js.org/
      component:false // 是否自定义预览组件，默认false
      previewId:'vue preview' // 预览标识，默认vue preview
    })*/
  ]
})
```

## 引入样式

在适当组件页面引入高亮样式，如 `main.ts`　中。其他主题风格可参考 `highlight.js` 引入对应主题

```ts
import "vite-plugin-doc-preview/style/style.css"
```

## 代码预览标识

给需要预览的 vue 代码块加上指定标识，如 `preview` 。其他标识可在`vite.config.ts`配置中修改

如 `test.md` 文件内容为：

````markdown
_下方代码块将会被解析为 vue 组件并展示_

```vue preview
<template>{{value}}</template>
<script setup>
 import {ref} from 'vue'
 const value = ref('hello 我是vue模板')
</script>
```
````

## 路由配置
```ts
 [
  {
    path: '/',
    name: '/md',
    component: () => import('./views/README.md')
  }
]
```

## 自定义预览组件

如果默认的样式不能满足需求，可以全局注册一个 `CodePreview` 组件来代替默认组件。

设定自定义预览组件时

```ts
//1. vite.confit.ts中配置：
MarkedPreview({component:true})  // 传入参数，表示为自定义预览组件

//2.　main.ts中
import CodePreview from 'xxxxx'
app.component('CodePreview', CodePreview)　//　注册自己的自定义好的预览组件
```

`CodePreview` 需要按约定支持如下 `props` 和 `slot`

- props
  - `code` string 代码块的原始代码，代码已经`encodeURIComponent`处理
- slot
  - `default` 代码块生成的 vue 组件
  - `code` 代码块经过高亮转换的 html 

