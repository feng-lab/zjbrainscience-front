<template>
  <bs-widgets header="Render Data">
    <div v-for="layer in neuroglancerDatas" :key="layer.name"> 
      <span>{{ layer.label }}</span>
      <el-select></el-select>

    </div>

  </bs-widgets>
</template>
<script setup>
import BsWidgets from '@/components/bsAtlas/BsWidgets.vue';

</script>

