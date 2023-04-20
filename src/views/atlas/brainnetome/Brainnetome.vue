<template>
  <bs-atlas
    :tree-data="LABEL_TREE"
    :state="STATE"
    title="Brainnetome"
    layer-name="brainnetome"
    site="http://www.brainnetome.org"
  />
</template>

<script setup>
import LABEL_TREE from "./labelTree";
import STATE from "./state";
</script>