<template>
  <div class="my-queue-container">
    <div class="table-top">
      <el-button class="m-b-8 m-t-4" type="primary" @click="addPatient"
        >添加患者</el-button
      >
      <el-input
        v-model="searchName"
        style="width: 240px; height: 32px"
        placeholder="搜索患者名称"
        :suffix-icon="Search"
      />
    </div>
    <el-table :data="tableData" style="width: 100%">
      <template #empty>
        <el-empty description="暂无患者">
          <template #image>
            <img src="../../assets/img/queue/no_data.png" alt="" />
          </template>
        </el-empty>
      </template>
      <el-table-column prop="name" label="患者名称">
        <template #default="scope">
          <div class="name">
            <div class="icon"></div>
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="hospital" label="医院"></el-table-column>
      <el-table-column prop="sex" label="性别">
        <template #default="scope">
          {{ scope.row.sex === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="age" label="出生日期（年龄)">
        <template #default="scope">
          {{ `${scope.row.born} (${scope.row.age})` }}
        </template>
      </el-table-column>
      <el-table-column prop="addr" label="家庭住址">
        <template #default="scope">
          {{ scope.row.addr }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-button link type="primary" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            :loading="scope.row.loading"
            link
            type="primary"
            @click="handleDetail(scope.row)"
            >详情</el-button
          >
          <el-button
            :loading="scope.row.loading"
            link
            type="primary"
            @click="handleDel(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrap" v-if="total > 0">
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[20, 40, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const searchName = ref('')
const tableData = ref([
  {
    name: '患者1',
    hospital: '浙一',
    sex: 1,
    age: 70,
    born: '1954-12-02',
    addr: '杭州市萧山区',
    id: 1,
  },
  {
    name: '患者2',
    hospital: '浙二',
    sex: 2,
    age: 65,
    born: '1959-09-09',
    addr: '浙江省宁波市镇海区',
    id: 2,
  },
])
const pageSize = ref(20)
const currentPage = ref(1)
const total = ref(2)

const addPatient = () => {
  router.push('patientinfo')
}
const handleEdit = (row) => {
  router.push('patientinfo')
}
const handleDetail = (row) => {
  router.push('patientdetail')
}
const handleDel = (row) => {
  ElMessageBox.confirm('删除后无法恢复，确定删除患者？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}
</script>

<style lang="scss" scoped>
.my-queue-container {
  background-color: #ffffff;
  padding: 16px;
  :deep(.el-table__header) {
    background: #f5f5f5;
  }
  .name {
    display: flex;
    align-items: center;
    .icon {
      width: 32px;
      height: 32px;
      border-radius: 40px;
      background: url('../../assets/img/queue/name_icon.png');
      background-size: cover;
      margin-right: 12px;
    }
  }
}
.table-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.scrollbar-item {
  display: flex;
  align-items: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
.content-wrap {
  position: relative;
  width: 100%;
  overflow-y: auto; /* 允许垂直滚动 */
  .content {
    position: relative;
    padding: 20px;
    z-index: 5; /* 确保内容在遮罩层之下 */
    height: 100%;
  }
}
</style>
