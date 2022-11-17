<template>
  <el-result 
    :title="$t('task.stepResult.1.title')" 
    :sub-title="$t('task.stepResult.1.subTitle')" 
  >
    <template #icon>
      <el-image :src="processImg" style="height: 250px" />
    </template>
  </el-result>
</template>
<script setup>
import processImg from "@/assets/img/taskResultProcess.svg";
</script>