## Button 按钮

_12下方代码块将会被解析为 vue 组件并展示_

```vue preview
<template>
  <div>
    <ak-button>按钮</ak-button>
    <ak-button @click="btnClick">按钮12345678910118</ak-button>
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
  const ab='ffff'
const a=function (){}
```
<div>abc</div>

```html

<ak-form :formData="formData">f</ak-form>
```


```javascript
formData = {
  list: [
    {
      name: "input1660637151831di", // 表单元素唯一标识
      type: "input", // 表单元素类型
      control: // 当前控件类型的所有`props`参数，详见`element-plus`对应的`props`参数
        {
          modelValue: ""
        },
      config: // 其他一些扩展配置信息
        {
          linkKey: true, // 开启联动
          linkValue: "$.name===1", // 联动表达式，即当表单中字段标识为`name`的控件值为`1`时，当前控件才显示
          editDisabled: true // 编辑状态下禁用，即表单部分字段只能添加，不允许编辑时可使用此设置
        },
      customRules: [], // 使用快速方法添加的校验规则，会自动合并到`item.rules`
      item:// 组件el-form-item的参数配置
        {
          label: "单行文本",
          rules: [] // 校验规则
        }
    },
    {
      name: "select1660637154631",
      type: "select",
      control:
        {
          modelValue: "",
          appendToBody: true
        },
      options: [// 单选多选下拉的`option`选项数据
        {
          label: "标签1",
          value: "value1"
        },
        {
          label: "标签2",
          value: "value2"
        }],
      config:
        {
          optionsType:0, // 0固定选项　1数据源　2字典
          optioinsFun:'', //　接口url、方法名、字典key
          method: "get", // optionsType=1时的数据请求方式，默认post
          value:'', // 指定value的属性,仅optionsType＝1有效
          label:'', // 指定label的属性,仅optionsType＝1有效
          debug:true // optionsType＝1时会将请求结束保存在sessionStorage,减少不必要的请求，debug=true时不保存方便调试
        },
      item:
        {
          label: "下拉选择框"
        }
    }],
  form:// 表单配置信息
    {
      labelWidth: "",
      class: "",
      size: "default",
      name: "form1660637148435"
    },
  config: {
    addUrl: "", // 表单提交保存接口url
    editUrl: "", // 表单修改保存接口url
    requestUrl: "", // 获取表单初始数据url
    style: '', // 表单css样式，相当于scope
    hideField: [], // 使用v-if隐藏的字段，用于交互。仅在导出vue时可通过自定义方法修改，组件需设置name值
    addLoad: false // 新增表单时是否从接口加载默认数据
  },
  events: { // 同props事件
    beforeRequest: (data, route) => {
      return data
    },
    afterResponse: (res) => {
      return res
    },
    // afterResponse:'formatTest', // 也可以是字符串，将执行/utils/formatResutl里的方法，值为方法里的key
    beforeSubmit: (data, route) => {
      return data
    },
    afterSubmit: (type,res) => {
      // type=success/fail
      console.log(res)
    },
    change: (name, model) => {
      // name当前组件的name,model当前表单的值
      return model
    }
  }
}
```
## API

### Button Props

| 参数       | 类型                | 说明         |
| ---------- |-------------------| ----------------------------------------------------------------- |
| type       | String            | 类型，实际是给按钮添加类名，支持`default`、`primary`、`success`、`warning`、`danger`、`text` |
| size       | String            | 大小尺寸，支持 `large`、`normal`、`small`、`mini` 四种尺寸，默认为 `normal`   |
| width      | String            | 按钮宽      |
| round      | boolean/false     | 是否圆角按钮  |
| plain      | boolean/false     | 是否为朴素按钮  |
| routerTo   | String            | 路由 url，输入为 a 标签时 |
| href       | String            | a 标签链接地址                                                    |
| disabled   | boolean/false     | 是否禁用状态                                                      |
| icon       | String            | 前缀 icon                                                         |
| loading    | boolean/false     | 是否加载中状态                                                     |
| nativeType | String            | 原生 type 属性，button / submit / reset                           |
| name       | String            | 按钮组时有效，按钮组点击事件时返回当前按钮唯一标识                                   |
| -          | -                 | 其它原生属性                                                      |
