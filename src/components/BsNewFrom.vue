<template>
  <el-popover
    ref="newFromRef"
    trigger="click"
    :width="300"
    virtual-triggering
  >
    <div class="m-b-8">
      <el-button type="primary" size="large" class="btn" plain @click="handleSelect">
          <bs-icon-img icon="top-left" :size="16" class="m-r-4"/>
          <span>{{ selectText }}</span>
      </el-button>
    </div>
    <div>
      <el-button type="primary" size="large" class="btn" plain @click="handleNew">
          <bs-icon-img icon="plus" :size="16" class="m-r-4"/>
          <span>{{ addText }}</span>
      </el-button>
    </div>
  </el-popover>
</template>
<script setup>
import BsIconImg from './BsIconImg.vue';
import { ref } from "vue";
defineProps({
  selectText: String,
  addText: String
})

const newFromRef = ref();
const visible = ref(false);

const emits = defineEmits(["newFromAdd", "newFromSelect"]);

const handleNew = () => {
  emits("newFromAdd");
}

const handleSelect = () => {
  emits("newFromSelect");
}

</script>
<style lang="scss" scoped>
.btn {
  width: 100%;
}

</style>