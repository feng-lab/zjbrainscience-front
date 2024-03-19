<template>
  <div class="index">
    <Suspense>
      <template #default>
        <A :url_="'https://eeum-brain.com/static/neuroglancer_data/JK979_PV_VGluT2_NeuN/base.json'" />
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
const A = defineAsyncComponent(() =>
  import('@/views/atlas/all/all.vue')
)
// 注意：同一个组件例如A组件，只能用一种引入方式，要么 defineAsyncComponent，要么import，
//不能不同父组件一个import一个defineAsyncComponent，否则打包时粘包


</script >