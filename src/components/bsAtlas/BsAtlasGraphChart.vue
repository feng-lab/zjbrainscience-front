<template>
  <div style="overflow: hidden">
    <bs-charts
      chart-type="graph"
      width="100%"
      height="300px"
      :option="chart_option"
      :series="chart_series"
    />
  </div>
</template>
<script setup>
import { getAtlasInfo } from '@/api/atlas';
import axios from 'axios';
import { ref, watch } from 'vue';
import BsCharts from '../charts/BsCharts.vue';
import { useBsAtlasBaseUrl } from '@/compositions/bsAtlas/useBsAtlas';

const props = defineProps({
  atlasId: Number,
  data: {
    type: Array,
    default: []
  },
  categories: {
    type: Array,
    default: []
  },
  linkDataDir: String
})

const chart_option = ref({
  darkMode: true,
  legend: {
    show: false
  },
  title: {
    text: "",
    left: "center",
    textStyle: {
      color: "#1668dc",
      fontSize: 14,
      fontWeight: "normal"
    }
  },
  tooltip: {
    confine: true,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderColor: "#15325b",
    textStyle: {
      color: "#fff"
    }
  },
})

const chart_series = ref({
  center: ["50%", "45%"],
  zoom: 0.8,
  layout: "circular",
  symbolSize: 6, 
  circular: { "rotateLabel": true },
  force: {
      repulsion: 50,
      edgeLength: 50,
      gravity: 0.2
  },
  label: {
      show: true,
      position: "right",
      margin: 8,
      textStyle: {
        fontSize: 7
      }
  },
  lineStyle: {
      show: true,
      curveness: 0.3,
      type: "solid",
      color: "source"
  },
  roam: true,
  draggable: false,
  focusNodeAdjacency: true,
  edgeLabel: {
      show: false,
      position: "top",
      margin: 8
  },
  edgeSymbol: [
      null,
      null
  ],
  edgeSymbolSize: 10,
  data: props.data.map(node => ({...node, tooltip: {show: false}})),
  categories: props.categories
})

const handleSelect = async (id, name) => {
  const { name:atlasName }= await getAtlasInfo(props.atlasId);
  const { baseUrl } = useBsAtlasBaseUrl(atlasName);
  const linkDataPath = `${baseUrl}/${atlasName}_${props.linkDataDir}`;
  const { data } = await axios.get(`${linkDataPath}/${name}_data.json`);
  const { links=[] } = data;
  chart_series.value.links = links;
  chart_option.value.title.text = `Brain Region: ${name}(ID: ${id})`;
}

watch(props, (newProp) => {
  chart_series.value = {
    ...chart_series.value,
    data: newProp.data.map(node => ({...node, tooltip: {show: false}})),
    links: newProp.links,
    categories: newProp.categories
  }
}, {
  deep: true,
  immediate: true
})

defineExpose({
  handleSelect
})


</script>