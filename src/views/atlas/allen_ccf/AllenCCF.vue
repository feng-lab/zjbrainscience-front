<template>
  <atlas-base
    :atlas-id="3"
    :neuroglancer-datas="neuroglancerDatas"
  ></atlas-base>
  
</template>
<script setup>
import AtlasBase from '../AtlasBase.vue';

const neuroglancerDatas = [{
  type: "regions",
}, {
  type: "wholeBrain"
}, {
  type: "connectivity",
  connectivityType: "lr",
  defaultHidden: true
}]

</script>