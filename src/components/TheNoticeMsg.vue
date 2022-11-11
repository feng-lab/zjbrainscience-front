<template>
  <div :class="['the-message', 'p-8', { readed: message.status }]"  >
    <el-avatar 
      class="the-message--avatar"
      :icon="message.status ? IconReaded: IconNotRead"
    >
    </el-avatar> 
    <div>
      <div class="the-message--title">
        <span>{{ $t("msgTitle", { id: message.taskid }) }}</span>
      </div>
      <div class="the-message--body">
        <span :class="message.status ? '': 'not-read'">{{ $t("msg", { name: message.taskname, status: message.taskstatus } ) }}</span>
      </div>
      <div class="the-message--time">
        {{ message.time }}
      </div>
    </div>
  </div>
</template>
<script setup>
import IconReaded from "@/components/icons/IconReaded.vue";
import IconNotRead from "@/components/icons/IconNotRead.vue";
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

.readed {
  color: var(--el-text-color-secondary);
  .the-message--title {
    color: var(--el-text-color-secondary);
  }
  .the-message--avatar {
    background-color: var(--el-text-color-secondary);
  }
}
</style>