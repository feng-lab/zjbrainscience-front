<template>
  <bs-error-page
    code="404"
    info="抱歉，您当前访问的页面不存在！"
    :img-src="ImgSrc"
  />
</template>
<script setup>
import BsErrorPage from '@/components/BsErrorPage.vue';
import ImgSrc from "@/assets/img/404.svg";
</script>