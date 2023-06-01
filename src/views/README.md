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
