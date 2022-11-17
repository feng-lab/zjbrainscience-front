<template>
  <el-dialog 
    v-model="visible" 
    append-to-body
    @close="handleClose"
    :title="$t('label.targetFile')"
  >
    <el-scrollbar height="400px">
    <el-table :data="source" ref="tableRef">
      <el-table-column type="selection"></el-table-column>
      <el-table-column property="filename" :label="$t('file.name')" />
      <el-table-column property="filetype" :label="$t('file.type')" />
      <el-table-column
        property="experimentsid"
        :label="$t('file.experiment')"
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
  visible: Boolean,
  source: Array,
  selectFile: Array,
});


const emits = defineEmits(["update:selectFile", "update:visible"]);

const tableRef = ref();

const handleClose = () => {
    emits("update:visible", false);
}

const handleSubmit = () => {
    emits("update:selectFile", tableRef.value.getSelectionRows());
    emits("update:visible", false);
}

const clearSelect = () => {
  console.log('clear select', tableRef)
  if(tableRef.value) {
    tableRef.value.clearSelection();
  }
}

defineExpose({
  clearSelect
})
</script>