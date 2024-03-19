<template>
  <el-dialog 
    append-to-body
    @close="handleClose"
    :title="$t('label.targetFile')"
  >
    <el-scrollbar height="400px">
    <el-table 
      :row-style="{cursor: 'pointer'}"
      :data="source" ref="tableRef"
      :highlight-current-row="!multiple"
      @current-change="handleCurrentChange"
    >
      <el-table-column align="center" type="selection" v-if="multiple"></el-table-column>
      <el-table-column align="center" property="name" :label="$t('file.name')" />
      <el-table-column align="center" property="file_type" :label="$t('file.type')" />
      <el-table-column
        align="center"
        property="experiment_id"
        :label="$t('file.experiment')+ 'ID'"
      />
    </el-table>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t("button.cancel") }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ $t("button.submit") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  source: Array,
  selectFiles: Array,
  selectFile: String,
  multiple: {
    type: Boolean,
    default: false
  }
});



const emits = defineEmits([
  "update:selectFiles", 
  "update:selectFile", 
]);

const tableRef = ref();
const currentRow = ref();


const handleSubmit = () => {
  props.multiple ? 
    emits("update:selectFiles", tableRef.value.getSelectionRows()) 
    : emits("update:selectFile", currentRow.value)
  emits("update:modelValue", false);
}

const clearSelect = () => {
  if(tableRef.value) {
    tableRef.value.clearSelection();
  }
}

const handleClose = () => {
  emits("update:modelValue", false);
}

const handleCurrentChange = (val) => {
  currentRow.value = val;
}

defineExpose({
  clearSelect
})
</script>