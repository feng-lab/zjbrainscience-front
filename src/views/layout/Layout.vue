<template>
  <div class="common-layout">
    <el-container>
      <el-aside :width="asideWidth" class="hidden-sm-and-down aside">
        <LayoutSiderbar/>
      </el-aside>
      <el-drawer 
        v-model="showDrawer"
        direction="ltr"
        :size="240"
        :show-close="false"
        :with-header="false"
      >
        <LayoutSiderbar/>
      </el-drawer>
      <el-container>
        <el-header class="header" height="64px">
          <LayoutHeader/>
        </el-header>
        <el-main class="main">
          <LayoutContent/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script setup>
import LayoutContent from "./LayoutContent.vue";
import LayoutHeader from "./LayoutHeader.vue";
import LayoutSiderbar from "./LayoutSiderbar.vue";
import useGlobalStore from "@/stores/global";
import { storeToRefs } from "pinia";
const globalStore = useGlobalStore();
const { isCollapse, asideWidth, showDrawer } = storeToRefs(globalStore);

</script>
<style scoped lang="scss">
@import 'element-plus/theme-chalk/display.css';
.common-layout {
  width: 100%;
  min-height: 100vh;
  background-color: #F2F3F5;

  .el-container {
    min-height: 100vh;
  }

  :deep(.el-drawer__body) {
    padding: 0;
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