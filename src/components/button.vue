<template>
  <button>
    <slot></slot>
  </button>
</template>
<script lang="ts" setup>

</script>

<style lang="scss" scoped>
button {
  background-color: #67c23a;
  border:           1px solid #67c23a;
  border-radius:    3px;
  color:            #fff;
  cursor:           pointer;
  font-size:        14px;
  height:           40px;
  width:            98px;
  + button {margin-left: 10px}
}
</style>
