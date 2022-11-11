<template>
  <el-menu
    class="aside"
    router
    :default-active="activeMenu"
    :background-color="showDrawer? '#fff' : '#303133'"
    :text-color="showDrawer ? '#606266' : '#fff'"
    :collapse="isCollapse"
    :collapse-transition="false"
    @select="closeDrawer"
  >
    <MenuContent v-for="menu in menus" :key="menu.path" :menu="menu"/>
  </el-menu>
</template>
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MenuContent from './MenuContent.vue';
import useGlobalStore from "@/stores/global";
import { storeToRefs } from 'pinia';

defineProps({
  menus: Array,
  activeMenu: String
})

const globalStore = useGlobalStore();
const { isCollapse, showDrawer } = storeToRefs(globalStore);
const { toggleDrawer } = globalStore;
const closeDrawer = () => {
  if(showDrawer.value) {
    toggleDrawer();
  }
}
const activeMenu = computed(() => useRoute().path)
</script>