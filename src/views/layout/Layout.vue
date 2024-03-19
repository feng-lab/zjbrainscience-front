<template>
  <div class="bs-layout">
    <el-container v-if="layoutType === 'common'" class="common">
      <!-- <el-aside :width="asideWidth" class="hidden-sm-and-down aside">
        <layout-siderbar/>
      </el-aside>
      <layout-drawer-sidebar/> -->
      <el-container>
        <!-- <el-header class="header" height="64px">
          <layout-header/>
        </el-header> -->
        <el-main class="main">
          <layout-content/>
        </el-main>
      </el-container>
    </el-container>
    <div v-else class="atlas dark"> 
      <!-- <el-button
        class="menu-icon"
        @click="toggleDrawer"
      >
        <template #icon>
          <bs-icon-menu/>
        </template>
      </el-button>
      <layout-drawer-sidebar/> -->
      <router-view/>
    </div>
  </div>
</template>


<script setup>
import LayoutContent from "./LayoutContent.vue";
import LayoutHeader from "./LayoutHeader.vue";
import LayoutSiderbar from "./LayoutSiderbar.vue";
import LayoutDrawerSidebar from "./LayoutDrawerSidebar.vue";
import BsIconMenu from "@/components/icons/BsIconMenu.vue";

import useGlobalStore from "@/stores/global";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { computed, watch } from "vue";

const globalStore = useGlobalStore();
const { toggleDrawer } = globalStore;
const { asideWidth } = storeToRefs(globalStore);

const layoutType = computed(() => {
  const route = useRoute();
  const type = route.fullPath.startsWith("/atlas/") ? "atlas" : "common";
  document.body.className = type === "atlas" ? "dark": "";
  return type;
}) 

//watch(layoutType, (lt) => {
//  document.body.className = lt === "atlas" ? "dark" : "";
//}, {
//  immediate: true
//})

</script>
<style scoped lang="scss">
@import 'element-plus/theme-chalk/display.css';
.bs-layout {
  width: 100%;
  min-height: 100vh;
  :deep(.el-drawer__body) {
    padding: 0;
  }

  .common {
    background-color: #F2F3F5;
    .el-container {
      min-height: 100vh;
    }
    .sidebar {
      background: #303133;
      color: #fff;
      :deep(.el-menu) {
        background-color: #303133;
        .el-menu-item {
          color: #fff;
          &:hover {
            background: rgb(38, 39, 41);
          }
          &.is-active {
            color: #fff;
            background-color: #52c41a;
          }
        }
        .el-sub-menu__title {
          color: #fff;
          background-color: #303133;
        }
      }
    }
    :deep(.el-drawer) {
      background: #fff;
      color: #606266;
      .el-menu-item.is-active {
        color: #fff;
        background-color: #52c41a;
      }
    }
  }

  .atlas {
    background-color: #000;
    min-height: 100vh;
    padding: 0 8px;
    .menu-icon {
      z-index: 10;
      position: absolute;
      top: 22px;
      right: 8px;
      height: 32px;
      width: 28px;
    }
    :deep(.el-drawer) {
      background-color: #141414;
      color: #fff;
      .el-menu-item, .el-sub-menu__title {
        color: #fff;
        background-color: #141414;
      }
      .el-menu-item.is-active {
        color: #1668dc;
        background-color: #111a2c;
      }
    }
  }
}
.header, main {
  padding: 0;
}
.header {
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 99;
}
.main {
  margin: 16px 8px;
}

</style>