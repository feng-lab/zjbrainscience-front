<template>
  <div class="between-flex"> 
    <span class="item-label"> {{ title }} </span>
    <el-slider 
      :min="rangeOptions.min" 
      :max="rangeOptions.max" 
      :step="rangeOptions.step" 
      v-model="rangeValue"
      show-input
      :show-input-controls="false"
      input-size="small"
      class="bs-atlas-slider"
      @input="handleValueChanged"
    />
  </div>
  
</template>
<script setup>
import { computed, nextTick, onMounted, onUpdated, ref } from "vue";

const props = defineProps({
  title: String, 
  trackableValueApi: Function,
  trackableLayerApi: Function,
  rangeOptions: {
    type: Object,
    default: {
      min: 0,
      max: 1,
      step: 0.01
    }
  }
});


const rangeValue = ref();


const getTrackableValue = () => {
  const layer = props.trackableLayerApi();
  console.log('layer', layer)
  const trackableValue = props.trackableValueApi(layer);
  return trackableValue;
}

onMounted(() => {
  rangeValue.value = getTrackableValue().value;
})

onUpdated(() => {
  rangeValue.value = getTrackableValue().value;
})

const handleValueChanged = (val) => {
  getTrackableValue().value = val;
}

</script>
<style lang="scss" scoped>

.item-label {
  width: 60%;
  color: var(--el-color-primary);
}
</style>