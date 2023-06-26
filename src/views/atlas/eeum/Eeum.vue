<template>
  <bs-atlas
    title="Eeum"
    name="eeum"
    site="https://eeum-brain.com"
    :tree-data="LABEL_TREE"
    :atlas-state="atlasState"
    :segment-colors="segmentColors"
  />
</template>

<script setup>
import LABEL_TREE from './labelTree';
import { atlasState, segmentColors } from './propsData';
</script>