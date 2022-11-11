<template>
  <tr>
    <td class="m-r-8">
      <div class="cell-item">
        <el-icon :color="iconColor" class="m-r-4">
          <component :is="icon"/>
        </el-icon>
        {{ label }}
      </div>
    </td>
    <td> <slot></slot> </td>
  </tr>
</template>
<script setup>
defineProps({
  label: String,
  icon: String,
  iconColor: String
})
</script>

<style lang="scss" scoped>
.cell-item {
  display: flex;
  align-items: center;
  min-width: 100px;
}
td +td {
  padding-left: 8px;
}
</style>