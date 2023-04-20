<template>
  <bs-atlas
    :tree-data="LABEL_TREE"
    :state="STATE"
    title="Allen CCF"
    layer-name="allen_ccf"
    site="https://atlas.brain-map.org"
  />
</template>

<script setup>
import LABEL_TREE from './labelTree';
import STATE from './state';
</script>