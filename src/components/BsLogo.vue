<template>
  <div class="logo">
    <a @click="backToHome">
      <img :src="imgSrc"/>
      <h1>{{ title }}</h1>
    </a>
  </div>
</template>
<script setup>
import { useUtils } from '@/compositions/useUtils';

defineProps({
  "imgSrc": String,
  "title": String
});
const { backToHome } = useUtils();
</script>
<style scoped lang="scss">
.logo {
  cursor: pointer;
  height: 64px;
  line-height: 64px;
  padding: 16px 20px;
  display: flex;
  position: relative;
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    min-height: 32px;
    text-decoration: none;
    img {
      display: inline-block;
      height: 100%;
    }
    h1 {
      display: inline-block;
      height: 32px;
      line-height: 32px;
      margin-left: 10px;
      font-size: 1.5em;
    }
  }
}
</style>