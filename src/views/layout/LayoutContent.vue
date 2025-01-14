<template>
  <div class="content">
    <!-- <el-alert
      type="warning"
      show-icon
      v-if="!user.last_logout_time"
      class="m-b-8"
      :closable="true"
    >
      <template #title>
        <span class="m-b-8">{{ $t('elmessage.updatePassword') }}</span>
        <el-link href="/password" type="primary" style="margin-top: -3px">
          {{ $t('button.changePassword') }}</el-link
        >
      </template>
    </el-alert> -->
    <router-view />
  </div>
</template>
<script setup>
import useUserStore from '@/stores/user'

const { user } = useUserStore()
</script>
<style scoped>
.content {
  /* min-height: 100%; */
  padding: 0 8px;
}
:deep(.el-alert__content) {
  width: 100%;
}
:deep(.el-alert__close-btn) {
  position: absolute;
  right: 0;
  top: 3px;
}
</style>
