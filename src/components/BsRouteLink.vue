<template>
  <router-link :to="path" 
    custom 
    v-slot="{navigate}"
    :inheritAttrs="false"
  >
    <el-button @click="navigate" v-bind="$attrs">
      <slot></slot>
    </el-button>
  </router-link>
</template>

<script setup>
defineProps({
  path: String
})
</script>