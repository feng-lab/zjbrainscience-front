<template>
    <atlas-base
      :atlas-id="4"
      :neuroglancer-datas="neuroglancerDatas"
      :chart-datas="chartDatas"
    />
  </template>
  
<script setup>
import AtlasBase from '../AtlasBase.vue';
import axios from "axios";
// import {eeum_neuroglancerDatas} from '@/locals/eeum_neuroglancerDatas';
import { ref } from "vue";
  
const props = defineProps({
   url_: String
})

const neuroglancerDatas = ref({})
const chartDatas = ref({})
const { data: eeum_neuroglancerDatas } = await axios.get(props.url_)
                                .catch(e => { return { data: {} }});

if(eeum_neuroglancerDatas.selectedLayer) {
delete eeum_neuroglancerDatas.selectedLayer
}
if (eeum_neuroglancerDatas.neuroglancerDatas) {
neuroglancerDatas.value = eeum_neuroglancerDatas.neuroglancerDatas
} else {
neuroglancerDatas.value = eeum_neuroglancerDatas
}
if (eeum_neuroglancerDatas.chartDatas) {
chartDatas.value = eeum_neuroglancerDatas.chartDatas
} else {
chartDatas.value = {}
}


</script>