<template>
  <el-row class="error-page main-content" align="middle">
    <el-col :span="12" class="error-page--img">
      <img :src="imgSrc" class="right"/>
    </el-col>
    <el-col :span="12" class="error-page--desc">
      <div class="error-page--desc--code">{{ code }}!</div>
      <div class="error-page--desc--info">{{ info }}</div>
      <div>
        <el-button type="primary" @click="backToHome">{{ $t("button.backHome") }}</el-button>
      </div>
    </el-col>
  </el-row>
</template>
<script setup>
import { useUtils } from '@/compositions/useUtils';

const props = defineProps({
  code: String,
  info: String,
  imgSrc: String
});

const { backToHome } = useUtils();

</script>
<style scoped lang="scss">
.error-page {
  background-color: #fff;
  &--desc {
    &--code {
      color: #b1b3b8;
      font-size: 150px;
    }
    &--info {
      margin: 24px 0;
    }
  }
}
</style>