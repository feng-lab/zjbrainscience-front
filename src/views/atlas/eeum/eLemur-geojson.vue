<template>
  <div class="bs-elemur-map-container" v-infinite-scroll="loadMore">
    <BsElemurMap v-for="id in mapIdCurrent" :key="id" :id="id + 2" />
  </div>
  <p class="loading" v-if="loading">Loading, please wait ...</p>
  <p v-if="noMore" class="loading">No more</p>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import BsElemurMap from '@/components/bsAtlas/BsElemurMap.vue'

// const mapIdList = ref(
//   Array.from({ length: 10 }, (v, k) => k).map((one) => one + 2)
// )
const mapIdPage = ref(1)
const mapIdTotal = ref(177)
const mapIdCurrent = computed(() => {
  let total = mapIdPage.value * 15
  return total >= mapIdTotal.value ? mapIdTotal.value : total
})
const loading = ref(false)
const noMore = computed(() => mapIdCurrent.value >= mapIdTotal.value)

const loadMore = () => {
  if (loading.value || noMore.value) return
  loading.value = true
  setTimeout(() => {
    mapIdPage.value += 1
    loading.value = false
  }, 2000)
}

onMounted(async () => {})

onUnmounted(async () => {})
</script>

<style scoped lang="scss">
.bs-elemur-map-container {
  display: flex;
  flex-wrap: wrap;
}
.loading {
  height: 50px;
  line-height: 50px;
  color: #fff;
  text-align: center;
  font-size: 16px;
}
</style>
