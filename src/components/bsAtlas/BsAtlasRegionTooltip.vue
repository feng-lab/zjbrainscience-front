<template>
  <div class="atlas-widget atlas-info">
    <h2>Brain Region</h2>
    <p class="icon-label"><bs-icon-img icon="Memo"/><strong>ID</strong></p>
    <p class="description">{{segmentId}}</p>
    <div v-for="key in ['Acronym', 'Description', 'Lobe', 'Gyrus']" :key="key">
      <template v-if="segmentInfo[key]">
        <p class="icon-label"><bs-icon-img icon="Memo"/><strong>{{key}}</strong></p>
        <p class="description">{{segmentInfo[key]}}</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import BsIconImg from "../BsIconImg.vue";

const props=defineProps({
  segmentId: String,
  segmentInfo: Object 
})
console.log('tooltip', props)

</script>

<style lang="scss" scoped>
.description{
  color: #fff;
}
</style>