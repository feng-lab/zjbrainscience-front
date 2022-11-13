<template>
  <el-sub-menu v-if="menu?.children?.length">
    <template #title>
      <MenuIcon :meta="menu.meta"/>
      <span class="">{{ $t(`menus.${menu.name}`) }}</span>
    </template>
    <MenuContent v-for="child in menu.children" :key="child.path" :menu="child" :parentPath="menu.path"/>
  </el-sub-menu>
  <el-menu-item :index="index" v-else>
      <MenuIcon :meta="menu.meta"/>
      <template #title>
        <span>{{ $t(`menus.${menu.name}`) }}</span>
      </template>
  </el-menu-item>
</template>

<script setup>
import { computed } from "vue";
import MenuIcon from "./MenuIcon.vue";
const props = defineProps({
  menu: Object,
  parentPath: String
})

const index = computed(() => {
  const { menu, parentPath="" } = props;
  return `${parentPath}/${menu.path}`;
})

</script>