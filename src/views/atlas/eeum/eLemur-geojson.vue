<template>
  <div>
    <div class="map-config-wrap">
      <el-switch
        v-model="isSingle"
        active-text="Single"
        inactive-color="#fff"
        @change="switchChange"
      />
      <div>
        High: <el-color-picker v-model="colorHigh" /> Medium:
        <el-color-picker v-model="colorMiddle" /> Low:
        <el-color-picker v-model="colorLow" />
        <el-button
          type="primary"
          size="small"
          @click="colorChange"
          style="margin-left: 10px"
          >confirm</el-button
        >
      </div>
    </div>
    <div
      class="bs-elemur-map-container"
      v-infinite-scroll="loadMore"
      :infinite-scroll-distance="30"
      v-if="!isConfig"
    >
      <BsElemurMap
        v-for="id in mapIdCurrent"
        :key="id"
        :id="id + 2"
        :single="isSingle"
        :color="[colorLow, colorMiddle, colorHigh]"
      />
    </div>
    <p class="loading" v-if="loading">Loading, please wait ...</p>
    <p v-if="noMore" class="loading">No more</p>
  </div>
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
  let total = mapIdPage.value * 10
  return total >= mapIdTotal.value ? mapIdTotal.value : total
})
const loading = ref(false)
const noMore = computed(() => mapIdCurrent.value >= mapIdTotal.value)
const isSingle = ref(false)
const isConfig = ref(false)
const colorHigh = ref('#a50026')
const colorMiddle = ref('#ffffbf')
const colorLow = ref('#313695')

const loadMore = () => {
  if (loading.value || noMore.value) return
  loading.value = true
  setTimeout(() => {
    mapIdPage.value += 1
    loading.value = false
  }, 2000)
}

const switchChange = () => {
  mapIdPage.value = 1
  resetConfig()
}

const colorChange = () => {
  mapIdPage.value = 1
  resetConfig()
}

const resetConfig = () => {
  isConfig.value = true
  setTimeout(() => {
    isConfig.value = false
  }, 100)
}

onMounted(async () => {})

onUnmounted(async () => {})
</script>

<style scoped lang="scss">
.bs-elemur-map-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  // position: relative;
}
.map-config-wrap {
  height: 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0px 20px;
  margin-bottom: 20px;
}
.loading {
  height: 50px;
  line-height: 50px;
  color: #fff;
  text-align: center;
  font-size: 16px;
}
:deep(.el-switch__label) {
  color: #fff;
}
</style>
