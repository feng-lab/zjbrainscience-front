<template>
  <el-sub-menu v-if="menu?.children?.length">
    <template #title>
      <bs-icon-img v-if="menu?.meta?.icon" :icon="menu.meta.icon"/>
      <span class="">{{ $t(`menus.${menu.name}`) }}</span>
    </template>
    <bs-menu-content v-for="child in menu.children" :key="child.path" :menu="child" :parent-path="menu.path"/>
  </el-sub-menu>
  <el-menu-item :index="index" v-else>
      <bs-icon-img v-if="menu?.meta?.icon" :icon="menu.meta.icon"/>
      <template #title>
        <span>{{ $t(`menus.${menu.name}`) }}</span>
      </template>
  </el-menu-item>
</template>

<script setup>
import BsIconImg from "@/components/BsIconImg.vue";

import { computed } from "vue";

const props = defineProps({
  menu: Object,
  parentPath: String
})

const index = computed(() => {
  const { menu, parentPath="" } = props;
  return `${parentPath}/${menu.path}`;
})

</script>