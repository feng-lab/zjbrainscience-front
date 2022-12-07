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
      :menus="authMenus"
    />
  </el-scrollbar>
</template>
<script setup>
import BsLogo from "@/components/BsLogo.vue";
import BsMenu from "@/components/menu/BsMenu.vue";

import { computed, ref } from "vue";
import menus from "@/router/menu";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import useMediaQuery from "@/stores/mediaQuery";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();
const userStore = useUserStore();
const { isCollapse, asideWidth, showDrawer } = storeToRefs(globalStore);
const { breakpoint } = storeToRefs(useMediaQuery());

const { user } = storeToRefs(userStore);

const authMenus = ref([]);


const isShow = (menu) => {
  const menuLevel = menu?.meta?.level ?? 0;
  return menuLevel <= user.value.access_level; 
}

const filterMenus = (ms) => {
  let res = [];
  ms.forEach(menu => {
    if(menu.children) {
      res.push({
        ...menu,
        children: filterMenus(menu.children)
      })
    } else if(isShow(menu)) {
      res.push(menu);
    }
  })
  return res;
}

authMenus.value = filterMenus(menus);

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