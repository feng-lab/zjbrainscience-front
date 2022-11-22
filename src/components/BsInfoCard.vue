<template>
  <el-card shadow="hover">
    <el-row>
      <el-col :xs="12" :sm="12" :lg="8">
        <div class="icon">
          <bs-icon-img
            :icon="icon"
            :icon-color="iconColor"
            :img-src="imgSrc"
            :size="64"
          />
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="16">
        <div class="title"> {{ title }} </div>
        <div class="info"> {{ info }} </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>

import BsIconImg from "@/components/BsIconImg.vue";

defineProps({
  title: String,
  info: [Number, String],
  icon: String,
  iconColor: String,
  imgSrc: String 
})
</script>

<style scoped lang="scss">
.icon {
  height: 64px;
  margin: 0 auto;
}

.title {
  color: var(--el-text-color-placeholder);
  font-weight: 700;
}

.info {
  font-size: 32px;
}
</style>