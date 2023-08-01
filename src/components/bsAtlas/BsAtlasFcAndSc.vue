<template>
  <div class="atlas-widget m-b-16" style="overflow: hidden">
    <bs-charts
      chart-type="graph"
      width="100%"
      height="100%"
      :option="chart_option"
      :series="chart_series"
    />
  </div>
</template>
<script setup>
import { computed } from 'vue';
import BsCharts from '../charts/BsCharts.vue';

const props = defineProps({
  data: {
    type: Array,
    default: []
  },
  links: {
    type: Array,
    default: [] 
  },
  categories: {
    type: Array,
    default: []
  },
  type: String
})

console.log(props)

const chart_option = computed(() => ({
  darkMode: true,
  legend: {
    show: false
  },
  title: {
    text: props.type === "FC" ? "Functional Connectivity" : "Structural Connectivity",
    left: "center",
    textStyle: {
      color: "#1668dc"
    },
    subtextStyle: {
      color: "#b7dcfa"
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
}))

const chart_series = computed(() => ({
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
        fontSize: 8
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
  links: props.links,
  categories: props.categories
}))

const handleSelect = (id, name) => {
  chart_option.value.title.subtext = `Brain Region: ${name}(ID: ${id})`;
}

defineExpose({
  handleSelect
})


</script>