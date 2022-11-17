<template>
  <el-dropdown>
    <el-icon style="font-size: 18px">
      <bs-icon-translate/>
    </el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          v-for="lang in supportLang"
          :key="lang.locale"
          :class="lang.locale === locale ? 'active' : ''"
          @click="setLocale(lang.locale)">{{ lang.desc }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
import BsIconTranslate from './icons/BsIconTranslate.vue';

import useGlobalStore from '@/stores/global';
import { storeToRefs } from 'pinia';

const globalStore = useGlobalStore();
const { locale } = storeToRefs(globalStore);
const { setLocale } = globalStore;

const supportLang = [
  { locale: "zhCn", desc: "简体中文" }, 
  { locale: "en", desc: "English" }
]
</script>
<style lang="scss" scoped>
:deep(.el-dropdown-menu__item.active) {
    background-color: var(--el-color-success-light-9);
    border-color: var(--el-color-success-light-8);
    color: var(--el-color-success);
}
</style>