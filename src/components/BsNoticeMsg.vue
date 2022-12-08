<template>
  <div :class="['the-message', 'p-8', message.status ]"  >
    <el-avatar 
      class="the-message--avatar"
      :icon="message.status === 'read' ? BsIconReaded: BsIconNotRead"
    >
    </el-avatar> 
    <div>
      <div class="the-message--title">
        <span>{{ $t(`notify.type.${message.type}`) }}</span>
      </div>
      <div class="the-message--body">
        <span v-if="message.type === 'text'"> {{ message.content }} </span>
        <span v-if="message.type === 'task_step_status'">
          {{ $t(`notify.content.${message.type}`, {
            name: message.content.task_name,
            id: message.content.task_id,
            status: STEP_INFO[message.content.task_status].status
          })}}
          {{ $t("label.clickToDetail")}}
        </span>
      </div>
      <div class="the-message--time">
        {{ message.create_at }}
      </div>
    </div>
  </div>
</template>
<script setup>
import BsIconReaded from "@/components/icons/BsIconReaded.vue";
import BsIconNotRead from "@/components/icons/BsIconNotRead.vue";
import { STEP_INFO } from "@/utils/common";

defineProps({
  message: Object
})
</script>
<style lang="scss" scoped>
.the-message {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
  color: var(--el-text-color-regular);
  &--title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--el-text-color-primary);
    font-weight: bold;
  }
  &--time, &--body {
    zoom: 0.9;
  }
  &--avatar {
    background-color: var(--el-color-primary);
  }
}

.read {
  color: var(--el-text-color-secondary);
  .the-message--title {
    color: var(--el-text-color-secondary);
  }
  .the-message--avatar {
    background-color: var(--el-text-color-secondary);
  }
}
</style>