<template>
  <div class="atlas-widget bdchart">
    <bs-charts 
      chart-type="sunburst" 
      width="100%" 
      height="230px"
      :data="pcfTree"
      :option="chart_option"
      :series="chart_series"
    />
  </div>
  
</template>

<script setup>
import BsCharts from "@/components/charts/BsCharts.vue";
import { ref } from "vue";

const props = defineProps({
  pcfTree: Array,
  pcfTooltipInfo: Object,
  dataMap: Object
})


let indices = {};

const handleBdfTooltip = ({ name, data, marker}) => {
  let value = indices[name];
  let info = props.pcfTooltipInfo[name] ?? "";
  let str = `<h3 style='margin-bottom: 8px'>${name}</h3>`
  if(!name) return "Paradigm Class";
  if(value) {
    str += marker + `<span style='margin-left: 2px;color: #d32029;font-size:1.2rem;font-weight:Bold'>${value}</span><br/>`
  }
  if(info) {
    str += marker + `<span style='margin-left: 2px'><strong>Description:</strong> ${info}</span>`
  }
  return str;
}

const chart_option=ref({
  darkMode:true,
  title: {
    text: "Paradigm Class",
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
    formatter: handleBdfTooltip ,
    textStyle: {
      color: "#fff"
    },
    extraCssText: "width: 280px; white-space: normal",
  }
})
const chart_series=ref({
  label: { show: false},
  silent: false,
  center: ["50%", "60%"],
  radius: ["60%", "75%"],
  itemStyle: {
    color: "#15325b",
    borderColor: "#111a2c",
    borderWidth: 2,
    borderRadius: 7
  },
  selectedMode: false,
  select: {
    itemStyle: {
      color: '#8dc5f8'
    }
  }
})

const handleSelect = (id, name) => {
  let selectedMap = {};
  indices = props.dataMap[id];
  Object.keys(indices).forEach(x => {
    selectedMap[x] = true;
  })
  chart_series.value.selectedMap = selectedMap;
  chart_option.value.title.subtext = `Brain Region : ${name}(ID: ${id})`;
}

defineExpose({
  handleSelect
})

</script>

<style lang="scss" scoped>
.bdchart {
  //position: absolute;
  //bottom: 10px;
  //left: 385px;
  z-index: 99;
  overflow: hidden;
}

</style>