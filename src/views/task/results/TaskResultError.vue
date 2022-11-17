<template>
  <el-result 
    :title="$t('task.stepResult.0.title')" 
    :sub-title="$t('task.stepResult.0.subTitle')" 
  >
    <template #icon>
      <el-image :src="errorImg" style="height: 200px" />
    </template>
  </el-result>
</template>
<script setup>
import errorImg from "@/assets/img/taskResultError.svg";
</script>