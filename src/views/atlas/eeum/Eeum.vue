<template>
  <bs-atlas
    :tree-data="LABEL_TREE"
    :state="STATE"
    title="Eeum"
    layer-name="eeum"
    default-visible="all"
    site="https://eeum-brain.com"
  />
</template>

<script setup>
import LABEL_TREE from './labelTree';
import STATE from './state';
</script>