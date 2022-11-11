<template>
  <TheErrorPage
    code="404"
    info="抱歉，您当前访问的页面不存在！"
    :imgSrc="ImgSrc"
  />
</template>
<script setup>
import TheErrorPage from '@/components/TheErrorPage.vue';
import ImgSrc from "@/assets/img/404.svg";
</script>