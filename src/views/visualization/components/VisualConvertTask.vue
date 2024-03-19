<template>
  <div class="convert-task">
    <div class="convert-task-id">{{ task.id }}</div>
    <div class="convert-task-name">{{ task.data_name}}</div>
    <div class="convert-task-status"> 
      <el-tag :type="typeTags[task?.status].type" :class="{'el-tag--blue': task?.status === 'running'}" >
        <span class="icon-label">
          <bs-icon-img :icon="typeTags[task.status].icon" :class="{'is-loading': task.status === 'running' }"/>
          <span>{{ task.status}}</span>
        </span>
      </el-tag>
    </div>
    <div class="convert-task-time">{{ task.createTime }}</div>
    <div class="convert-task-actions"> 
      <el-button link size="small" type="primary">{{ $t('button.detail')}}</el-button>
      <el-button link size="small" type="primary" v-if="task.status === 'failed' || task.status === 'canceled' ">{{ $t('button.retry')}}</el-button>
      <el-button link size="small" type="primary" v-if="task.status === 'pending' || task.status === 'running' ">{{ $t('button.cancel')}}</el-button>
    </div>

  </div>
</template>
<script setup>
import BsIconHourGlassProcess from '@/components/icons/BsIconHourGlassProcess.vue';
import BsIconImg from '@/components/BsIconImg.vue';
defineProps({
  task: Object
})

const typeTags = {
  pending: { type: "info", icon: BsIconHourGlassProcess},
  running: { type: "", icon: "Loading"},
  success: { type: "success", icon: "CircleCheckFilled"},
  failed: { type: "danger", icon: "CircleCloseFilled"},
  canceled: { type: "warning", icon: "RemoveFilled"}
}


</script>
<style lang="scss">
.convert-task {
  display: flex;
  align-items: center;
  &-id {
    width: 5%;
    text-align: center;
    border-radius: 50%;
    background: var(--el-text-color-regular);
    color: white;
  }
  &-name {
    margin-left: 3%;
    width: 22%;
  }
  &-status {
    width: 20%;
  }
  &-time {
    width: 32%;
  }
  &-actions {
    width: 18%;
    text-align: end;
  }
  border-bottom: 1px solid #efefef;
  height: 60px;
}
</style>