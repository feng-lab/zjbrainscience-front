<template>
  <atlas-base
    :atlas-id="4"
    :neuroglancer-datas="neuroglancerDatas"
  />
</template>

<script setup>
import AtlasBase from '../AtlasBase.vue';
const neuroglancerDatas = [{
  type: "regions",
  options: {
    removeOctant: false
  }
}]
</script>