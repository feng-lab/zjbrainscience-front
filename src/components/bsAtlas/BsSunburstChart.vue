<template>
  <div class="bdchart">
    <bs-charts 
      chart-type="sunburst" 
      width="100%" 
      height="200px"
      :data="sunburstTree"
      :option="chart_option"
      :series="chart_series"
    />
  </div>
  
</template>

<script setup>
import BsCharts from "@/components/charts/BsCharts.vue";
import { onMounted, ref } from "vue";

const props = defineProps({
  atlasId: Number,
  title: String,
  fetchTreeApi: Function,
  fetchDetailApi: Function,
  graphRadius: {
    type: Array,
    default: ["30%", "75%"]
  }
})

const sunburstTree = ref([]);

let regionInfo = {};

onMounted(async () => {
  const { fetchTreeApi, atlasId } = props;
  sunburstTree.value = await fetchTreeApi(atlasId);
})

const tooltipFormatter = ({ name, data, marker}) => {
  let str = `<h3 style='margin-bottom: 8px'>${name}</h3>`
  const value = regionInfo[name];
  const { description } = data; 
  if(!name) return  props.title;
  if(value) {
    str += marker + `<span style='margin-left: 2px;color: #d32029;font-size:1.2rem;font-weight:Bold'>${value}</span><br/>`
  }
  if(description) {
    str += marker + `<span style='margin-left: 2px'><strong>Description:</strong> ${description}</span>`
  }
  return str;
}


const chart_option=ref({
  darkMode:true,
  title: {
    text: "",
    left: "center",
    textStyle: {
      color: "#1668dc",
      fontSize: 14,
      fontWeight: "normal"
    },
  }, 
  tooltip: {
    confine: true,
    backgroundColor: 'rgba(0,0,0,0.7)',
    formatter: tooltipFormatter,
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
  radius: props.graphRadius,
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

const handleSelect = async (id, name) => {
  const { atlasId, fetchDetailApi } = props;
  let selectedMap = {};
  regionInfo = await fetchDetailApi(atlasId, id);
  Object.keys(regionInfo).forEach(x => {
    selectedMap[x] = true;
  })
  chart_series.value.selectedMap = selectedMap;
  chart_option.value.title.text = `Brain Region : ${name}(ID:${id})`;
}

defineExpose({
  handleSelect
})

</script>

<style lang="scss" scoped>
.bdchart {
  //position: absolute;
  //bottom: 10px;
  //left: 20px;
  z-index: 99;
  overflow: hidden;
}

</style>