<template>
  <el-scrollbar 
    class="sidebar aside" 
    :style="{
        width: asideWidth,
        backgroundColor: showDrawer ? '#fff' : '#303133',
        color: showDrawer? '#606266': '#fff'
    }"
  >
    <bs-logo
      img-src="/logo.png"
      :title="isCollapse ? '' : 'Brain Science'"
    />
    <bs-menu
      :menus="menus"
    />
  </el-scrollbar>
</template>
<script setup>
import BsLogo from "@/components/BsLogo.vue";
import BsMenu from "@/components/menu/BsMenu.vue";

import { computed } from "vue";
import menus from "@/router/menu";
import useGlobalStore from "@/stores/global";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();
const { isCollapse, asideWidth, showDrawer } = storeToRefs(globalStore);

</script>
<style scoped lang="scss">
.sidebar {
  position: fixed;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #303133;
  color: #fff;
  :deep(.el-menu) {
    border-right: none;
  }
  :deep(.el-menu-item.is-active) {
    color: #fff;
    background-color: #52c41a;
  }
}
</style>