<template>
<div :style="{ width, height}" class="new-item">
  <el-icon><Plus/></el-icon>
  <div v-if="content" class="content">{{content}}</div>
</div>
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: '400px'
  },
  height: {
    type: String,
    default: '400px'
  },
  content: String
})
</script>
<style lang="scss" scoped>
.new-item {
  background-color: var(--el-fill-color-lighter);
  border: 1px dashed var(--el-border-color-darker);
  border-radius: 6px;
  box-sizing: border-box;
  cursor: pointer;
  vertical-align: top;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  i {
    font-size: 300%;
    color: var(--el-text-color-secondary);
  }

  .content{
    margin-top: 5%;
    color: var(--el-text-color-regular);
    text-align: center;
  }
}
</style>
