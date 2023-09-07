<template>
  <bs-widgets header="Brain Region Info" class="region-tooltip">
    <p class="icon-label region-property"><bs-icon-img icon="Memo"/><strong>ID</strong></p>
    <p class="m-b-8">{{focusRegion.region_id}}</p>
    <div v-for="key in ['acronym', 'description', 'lobe', 'gyrus']" :key="key">
      <template v-if="focusRegion[key]">
        <p class="icon-label region-property">
          <bs-icon-img icon="Memo"/>
          {{key}}
          <strong>{{key.charAt(0).toUpperCase() + key.slice(1)}}</strong>
        </p>
        <p class="m-b-8">{{focusRegion[key]}}</p>
      </template> 
    </div>
  </bs-widgets>
</template>

<script setup>
import BsIconImg from "../BsIconImg.vue";
import BsWidgets from "./BsWidgets.vue";

defineProps({
  focusRegion: Object 
})


</script>

<style lang="scss" scoped>
.region-property{
  color: #1668dc;
}
.region-tooltip {
  z-index: 199;
}
</style>