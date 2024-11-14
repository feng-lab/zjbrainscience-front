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
        clearable
        @clear="searchPatient"
      >
        <template #suffix>
          <el-icon style="cursor: pointer" @click="searchPatient"
            ><Search
          /></el-icon>
        </template>
      </el-input>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <template #empty>
        <el-empty description="暂无患者">
          <template #image>
            <img src="../../assets/img/queue/no_data.png" alt="" />
          </template>
        </el-empty>
      </template>
      <el-table-column prop="patient_name" label="患者名称">
        <template #default="scope">
          <div class="name">
            <div class="icon"></div>
            {{ scope.row.patient_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="hospital" label="医院"></el-table-column>
      <el-table-column prop="gender" label="性别" width="100">
        <template #default="scope">
          {{ scope.row.gender === 'male' ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="age" label="出生日期（年龄)">
        <template #default="{ row }">
          {{
            row.date_birth
              ? `${row.date_birth} (${getAge(row.date_birth)})`
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="addr" label="家庭住址区县">
        <template #default="scope">
          {{ scope.row.family_address_city }}
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getCohortPatientByPageApi,
  deleteCohortPatientApi,
} from '@/api/patient.js'

const router = useRouter()
const route = useRoute()
const searchName = ref('')
const tableData = ref([
  // {
  //   name: '患者1',
  //   hospital: '浙一',
  //   sex: 1,
  //   age: 70,
  //   born: '1954-12-02',
  //   addr: '杭州市萧山区',
  //   id: 1,
  // },
])
const pageSize = ref(20)
const currentPage = ref(1)
const total = ref(2)

const getCohortPatientByPage = async () => {
  try {
    const params = {
      domain_id: 1,
      patient_name: searchName.value,
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value,
      include_deleted: false,
    }
    const { items, total: totalNum } = await getCohortPatientByPageApi(params)
    tableData.value = items || []
    total.value = totalNum || 0
  } catch (err) {
    console.log(err)
  }
}

const deleteCohortPatient = async (id) => {
  try {
    await deleteCohortPatientApi(id)
    ElMessage.success('删除成功')
    searchPatient()
  } catch (err) {
    console.log(err)
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  getCohortPatientByPage()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  getCohortPatientByPage()
}

const searchPatient = () => {
  currentPage.value = 1
  getCohortPatientByPage()
}

onMounted(() => {
  const { page } = route.query
  currentPage.value = +page || currentPage.value
  getCohortPatientByPage(+page)
})

const getAge = (birth) => {
  if (birth) {
    let birthStr = new Date(birth).getTime()
    let now = new Date().getTime()
    let hours = (now - birthStr) / (3600 * 1000)
    let year = Math.floor(hours / (24 * 365))
    return year
  } else {
    return null
  }
}

const addPatient = () => {
  router.push('patientinfo')
}

const handleEdit = (row) => {
  router.push({
    path: 'patientinfo',
    query: { id: row.id, page: currentPage.value },
  })
}

const handleDetail = (row) => {
  router.push({
    path: 'patientdetail',
    query: { id: row.id, page: currentPage.value },
  })
}

const handleDel = (row) => {
  ElMessageBox.confirm('删除后无法恢复，确定删除患者？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteCohortPatient(row.id)
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
