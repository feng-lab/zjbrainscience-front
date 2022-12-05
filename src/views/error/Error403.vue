<template>
  <bs-error-page
    code="403"
    :info="$t('errorPage.noAuth')"
    :img-src="ImgSrc"
  />
</template>
<script setup>
import BsErrorPage from '@/components/BsErrorPage.vue';
import ImgSrc from "@/assets/img/403.svg";
</script>