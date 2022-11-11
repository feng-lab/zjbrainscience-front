<template>
  <template v-if="meta?.icon">
    <el-icon><component :is="meta.icon"/></el-icon>
  </template>
</template>
<script setup>
defineProps({
  meta: Object
})
</script>