<template>
  <div> 
    <el-upload> 
      <el-button type="primary" icon="Upload">{{ $t('button.upload') }}</el-button>
    </el-upload>
    <div class="input-desc" v-if="convertion?.sourceFormatDesc || convertion?.inputExampleImg">
      <p class="input-desc-title">{{ $t('visualization.data.inputDesc')}}</p>
      <p class="input-desc-format">{{ convertion.sourceFormatDesc }}</p>
      <el-image class="input-desc-image" :src="convertion.inputExampleImg" v-if="convertion?.inputExampleImg"/>
    </div>
  </div>
</template>

<script setup>
defineProps({
  convertion: {
    type: Object,
    default: {
      sourceFormatDesc: "",
    }
  } 
})

</script>
<style lang="scss" scoped>
.input-desc {
  background: var(--el-fill-color-darker);
  padding: 8px 16px;
  border-radius: 6px;
  &-title {
    color: var(--el-text-color-secondary);
  }
  &-format {
    color: var(--el-text-color-regular);
  }
  &-image {
    width: 100%;
  }
}
</style>