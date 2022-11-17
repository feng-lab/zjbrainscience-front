<template>
  <router-link :to="path" 
    custom 
    v-slot="{navigate}"
  >
    <el-button @click="navigate" :type="type">
      <slot></slot>
    </el-button>
  </router-link>
</template>

<script setup>
defineProps({
  path: String,
  type: String
})
</script>