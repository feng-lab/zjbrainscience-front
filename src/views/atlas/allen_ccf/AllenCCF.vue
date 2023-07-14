<template>
  <bs-atlas
    title="Allen CCF"
    name="allen_ccf"
    site="https://atlas.brain-map.org"
    whole-segment-id="997"
    :tree-data="LABEL_TREE"
    :atlas-state="atlasState"
    :plugins="{
      connectivity: 'lr' 
    }"
    :connectivity-edges="connectivityEdges"
    :connectivity-endpoints="connectivityEndpoints"
    :remove-octant="true"
  />
</template>

<script setup>
import LABEL_TREE from './labelTree';
import { atlasState, segmentColors, connectivityEdges, connectivityEndpoints } from './propsData';

</script>