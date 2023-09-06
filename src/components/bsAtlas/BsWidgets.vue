<template>
  <div class="bs-atlas-widgets"> 
    <slot name="header">
      <div class="header"> 
        <div class="between-flex">
          <h2 v-if="header">{{ header }}</h2>
          <slot name="extra">
            <el-tooltip content="Close" v-if="showClose">
              <el-icon @click="emits('close')" style="cursor: pointer"><Close/></el-icon>
            </el-tooltip>
          </slot>
        </div>
      </div>
    </slot>
    <div class="m-t-8 bs-atlas-widgets-body">
      <slot/>
    </div>
  </div>
</template>

<script setup>
defineProps({
  header: String,
  showClose: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(["close"])
</script>

<style lang="scss" scoped>
.bs-atlas-widgets {
  display: flex;
  flex-direction: column;
  background-color: #141414;
  color: rgba(229, 224, 216, 0.85);
  padding: 8px;
  .header h2::before {
    content: "";
    border-left: 5px solid #1668dc;
    margin-right: 8px;
  }

  &-body {
    overflow: auto;
    overflow-x: hidden;
    flex: 1;
  }

}
</style>