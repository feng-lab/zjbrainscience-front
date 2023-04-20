<template>
  <el-drawer
    v-model="showDrawer"
    direction="ltr"
    :size="240"
    :show-close="false"
    :with-header="false"
    class="drawer-menu"
  >
    <layout-siderbar/>
  </el-drawer>
</template>
<script setup>
import LayoutSiderbar from './LayoutSiderbar.vue';

import useGlobalStore from "@/stores/global";
import { storeToRefs } from "pinia";

const { showDrawer } = storeToRefs(useGlobalStore());
</script>
