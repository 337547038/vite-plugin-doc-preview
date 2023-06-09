## Button 按钮

_下方代码块将会被解析为 vue 组件并展示_

```vue preview
<template>
  <div>
    <ak-button>按钮</ak-button>
    <ak-button @click="btnClick">按钮</ak-button>
  </div>
</template>
<script setup>
import {ref} from 'vue'
const btnClick = () => {
  alert('btnClick')
}
</script>
```

```javascript
formData = {
  form:// 表单配置信息
    {
      labelWidth: "160px",
      class: "",
      size: "default",
      name: "form"
    }
}
```

## API

### Button Props

| 参数       | 类型          | 说明         |
| ---------- | ------------- | ----------------------------------------------------------------- |
| type       | String        | 类型，实际是给按钮添加类名，支持`default`、`primary`、`success`、`warning`、`danger`、`text` |
| size       | String        | 大小尺寸，支持 `large`、`normal`、`small`、`mini` 四种尺寸，默认为 `normal`   |
| width      | String        | 按钮宽      |
| round      | boolean/false | 是否圆角按钮  |
| plain      | boolean/false | 是否为朴素按钮  |
| routerTo   | String        | 路由 url，输入为 a 标签时 |
| href       | String        | a 标签链接地址                                                    |
| disabled   | boolean/false | 是否禁用状态                                                      |
| icon       | String        | 前缀 icon                                                         |
| loading    | boolean/false | 是否加载中状态                                                     |
| nativeType | String        | 原生 type 属性，button / submit / reset                           |
| name       | String        | 按钮组时有效，按钮组点击事件时返回当前按钮唯一标识                                   |
| -          | -             | 其它原生属性                                                      |

### Button Event

| 参数  | 说明 |
| ----- | ---- |
| click | -    |

### Button Group

| 参数     | 类型          | 说明                                 |
| -------- | ------------- | ------------------------------------ |
| size     | String        | 大小尺寸，可选 medium / small / mini |
| width    | String        | 按钮宽                               |
| round    | boolean/false | 是否圆角按钮                         |
| disabled | boolean/false | 是否禁用状态                         |

### Button Group Event

| 参数  | 说明 |
| ----- | ---- |
| click | -    |
