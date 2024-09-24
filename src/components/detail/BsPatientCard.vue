<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <span class="title">{{ title || '--' }}</span>
        <div class="button">
          <slot name="btn"></slot>
        </div>
      </div>
    </template>
    <div class="card-content" v-if="infoDetail && infoDetail.length">
      <div
        v-for="(item, index) in infoDetail"
        :key="index"
        :class="item.style ? 'item' + item.style : 'item'"
      >
        {{ item.label }}：{{ item.value || '--' }}
      </div>
    </div>
    <div class="slot-content" v-if="slot">
      <slot> </slot>
    </div>
    <el-empty v-if="!infoDetail && !slot" :description="description">
      <template #image>
        <img src="../../assets/img/queue/no_file.png" alt="" />
      </template>
    </el-empty>
  </el-card>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  infoDetail: Array,
  slot: {
    type: Boolean,
    default: false,
  },
  btnName: String,
})
</script>

<style lang="scss" scoped>
.box-card {
  width: calc(33% - 5px);
  border-radius: 12px;
  margin-bottom: 16px;
  .card-header {
    display: inline-block;
    width: calc(100% - 16px);
    .title {
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 600;
      line-height: 22px;
      color: #323233;
    }
    .button {
      float: right;
    }
  }
  .card-content {
    display: flex;
    flex-wrap: wrap;
  }
  .item {
    width: 50%;
    font-family: PingFang SC;
    font-size: 14px;
    line-height: 20px;
    color: #323233;
    margin-bottom: 8px;
  }
  .item-width-100 {
    width: 100%;
    font-family: PingFang SC;
    font-size: 14px;
    line-height: 20px;
    color: #323233;
    margin-bottom: 8px;
  }
  :deep(.el-card__header) {
    border-bottom: none;
  }
}
</style>
