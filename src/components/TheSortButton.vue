<template>
  <el-button :class="[order, 'sort-button']" >
    {{ text }}
    <span class="sort-icon">
      <el-icon class="asce-icon"><CaretTop /></el-icon>
      <el-icon class="desc-icon"><CaretBottom/></el-icon>
    </span>
  </el-button>
</template>
<script setup>

const props=defineProps({
  text: "",
  order: ""
})

console.log('props', props)

</script>

<style lang="scss" scoped>
.sort-button:focus {
  color: var(--el-button-text-color);
  background-color: var(--el-button-bg-color);
  border-color: var(--el-button-border-color);
}

.sort-icon {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  margin-left: 8px;
  .desc-icon {
    bottom: 3px;
  }
  .asce-icon {
    top: 4px;
  }
}
.desc .el-icon.desc-icon, .asce .el-icon.asce-icon {
  color: var(--el-color-primary);
}
</style>
