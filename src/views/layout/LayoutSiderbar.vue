<template>
  <el-scrollbar 
    class="sidebar aside" 
    :style="{
        width: asideWidth,
        backgroundColor: showDrawer ? '#fff' : '#303133',
        color: showDrawer? '#606266': '#fff'
    }"
  >
    <TheLogo
      imgSrc="/logo.png"
      :title="isCollapse ? '' : 'Brain Science'"
    />
    <TheMenu
      :menus="menus"
    />
  </el-scrollbar>
</template>
<script setup>
import TheLogo from "@/components/TheLogo.vue";
import TheMenu from "@/components/menu/TheMenu.vue";
import menus from "@/router/menu";
import useGlobalStore from "@/stores/global";
import { storeToRefs } from "pinia";
import { computed } from "vue";

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