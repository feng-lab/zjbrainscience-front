<template>
  <el-menu
    class="aside"
    router
    :default-active="activeMenu"
    :collapse="isCollapse"
    :collapse-transition="false"
    @select="closeDrawer"
  >
    <bs-menu-content v-for="menu in menus" :key="menu.path" :menu="menu"/>
  </el-menu>
</template>

<script setup>
import BsMenuContent from './BsMenuContent.vue';

import { watchEffect, ref } from 'vue';
import { useRoute } from 'vue-router';
import useGlobalStore from "@/stores/global";
import { storeToRefs } from 'pinia';


defineProps({
  menus: Array
})

const globalStore = useGlobalStore();
const { isCollapse, showDrawer } = storeToRefs(globalStore);
const { toggleDrawer } = globalStore;

const closeDrawer = () => {
  if(showDrawer.value) {
    toggleDrawer();
  }
}

const activeMenu = ref()
const route = useRoute()
watchEffect(() => {
  activeMenu.value = route.path
})


</script>