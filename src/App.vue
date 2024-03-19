<template>
  <el-config-provider 
    :button="config"
    :locale="elLocal"
  >
    <RouterView />
  </el-config-provider>
</template>

<script setup>
import { computed, reactive } from "vue";
import { RouterView } from "vue-router";
import useGlobalStore from "@/stores/global";
import { storeToRefs } from "pinia";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";

const { locale } = storeToRefs(useGlobalStore());
const elLocal = computed(() => {
  return locale.value === "zhCn" ? zhCn : en;
})
const config = computed(() => {
  return locale.value === "zhCn" ? {
    autoInsertSpace: true,
  }: null;
})
</script>
