<template>
  <bs-error-page
    code="404"
    :info="$t('errorPage.notFound')"
    :img-src="ImgSrc"
  />
</template>
<script setup>
import BsErrorPage from '@/components/BsErrorPage.vue';
import ImgSrc from "@/assets/img/404.svg";
</script>