<template>
  <el-row class="m-b-16" v-if="buttonList?.length">
    <el-col :span=24>
      <el-button 
        v-for="btn in buttonList" 
        :key="btn.text"
        @click="btn.onClick"
        :icon="btn.icon"
        :type="btn.type"
      >
        {{ btn.text }}
      </el-button>
    </el-col>
  </el-row>
  <el-table
    style="width: 100%"
    :data="tableData"
    :header-cell-style="{
      backgroundColor: '#fafafa'
    }"
    border
  >
    <el-table-column
      v-for="col in columns"
      :key="col.prop"
      :prop="col.prop"
      :label="col.label"
      align="center"
      v-bind="col.elColProps"
    >
      <template #default="{ row, column }">
        <span v-if="!col.slot">{{ row[column.property] }}</span>
        <slot :name="col.slot" :row="row" v-else></slot>
      </template>
    </el-table-column>
  </el-table>
  <div class="m-t-16">
    <el-pagination 
      class="right"
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :total="totalRecord"
      layout="total, sizes, prev, pager, next"
      :page-sizes="[10, 20, 50, 100, 150, 200]"
      @size-change="getRemoteData"
      @current-change="getRemoteData"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  columns: {
    type: Array ,
    required: true
  },
  buttonList: Array,
  data: Array,
  fetchMethod: Function,
  refresh: Number,
  pageSize: Number,
  query: Object
})

const totalRecord = ref(props?.data?.length ?? 0);
const currentPage = ref(1);
const pageSize = ref(props.pageSize ?? 10);

const tableData = ref(props.data ?? []);

if(props.fetchMethod) {
  onMounted(() => {
    getRemoteData();
  })
}

const getRemoteData = async () => {
  const { total, list } = await props.fetchMethod({
    ...props.query,
    limit: pageSize.value,
    offset: ( currentPage.value - 1 ) * pageSize.value
  });
  totalRecord.value = total;
  tableData.value = list;
}

const reload = () => {
  getRemoteData();
}

defineExpose({
  reload: getRemoteData
});

</script>
<style lang="scss" scoped>
.table-header {
  .el-table th.el-table__cell {
    background-color: var(--el-fill-color-light);
  }
}

</style>> 