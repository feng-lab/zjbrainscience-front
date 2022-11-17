<template>
  <tr>
    <td class="m-r-8">
      <div class="cell-item">
        <bs-icon-img :icon="icon" :icon-color="iconColor" class="m-r-4"/>
        {{ label }}
      </div>
    </td>
    <td> <slot></slot> </td>
  </tr>
</template>
<script setup>
import BsIconImg from "@/components/BsIconImg.vue";

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