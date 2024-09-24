<template>
  <div class="patient-detail-container">
    <div class="patient-name">
      <div>
        <span>患者名称</span>
        <el-button type="primary" plain size="small" @click="goEdit"
          >编辑</el-button
        >
      </div>
      <el-button type="danger" @click="goBack">返回</el-button>
    </div>
    <div class="patient-detail-wrap">
      <bs-patient-card
        title="一般情况"
        :infoDetail="commonInfo"
      ></bs-patient-card>
      <bs-patient-card
        title="初诊信息"
        :infoDetail="visitInfo"
      ></bs-patient-card>
      <bs-patient-card
        title="治疗详情"
        :infoDetail="healInfo"
      ></bs-patient-card>
      <bs-patient-card
        title="复发、移植、生存信息"
        :infoDetail="otherInfo"
      ></bs-patient-card>
      <bs-patient-card
        title="备注"
        :slot="notesData.length"
        description="暂无备注"
      >
        <template #btn>
          <el-button type="primary" @click="addNotes">添加</el-button>
        </template>
        <template #default>
          <el-table :data="notesData" style="width: 100%" :show-header="false">
            <el-table-column prop="date" label="日期" width="180" />
            <el-table-column prop="content" label="备注内容" />
          </el-table>
        </template>
      </bs-patient-card>
      <bs-patient-card
        title="文件"
        :slot="fileData.length"
        description="暂无文件"
      >
        <template #btn>
          <el-button type="primary" @click="dialogFormVisible = true"
            >上传文件</el-button
          >
        </template>
        <template #default>
          <el-table :data="fileData" style="width: 100%" :show-header="false">
            <el-table-column prop="date" label="文件名称">
              <template #default="scope">
                <div>{{ scope.row.address }}</div>
                <div style="color: #8c8c8c">{{ scope.row.date }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="文件类型" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="预览"
                  placement="top-start"
                >
                  <el-button
                    text
                    @click="previewNotes(scope.$index)"
                    :icon="View"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="删除"
                  placement="top-start"
                >
                  <el-button
                    text
                    @click="delNotes(scope.$index)"
                    :icon="Delete"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </bs-patient-card>
    </div>
  </div>
  <el-dialog v-model="dialogFormVisible" title="上传文件" width="600">
    <el-form :model="form" style="margin-top: 20px">
      <el-form-item label="上传文件：" label-width="140px">
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <el-button type="primary" plain>选择文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="关联到数据集：" label-width="140px">
        <el-select
          v-model="form.region"
          placeholder="请选择"
          style="width: 220px"
        >
          <el-option label="数据集1" value="1" />
          <el-option label="数据集2" value="2" />
        </el-select>
        <el-button type="primary" bg text @click="addDatasets"
          >新建数据集</el-button
        >
        <el-button type="primary" bg text @click="refreshDatasets"
          >刷新</el-button
        >
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogImgVisible" title="文件预览">
    <div style="display: flex; justify-content: center">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { View, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BsPatientCard from '@/components/detail/BsPatientCard.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const commonInfo = ref([
  { label: '性别', value: '女' },
  { label: '出生日期', value: '1933-03-03' },
  { label: '身份证', value: '3333333333333', style: '-width-100' },
  { label: '联系电话', value: '12345678909', style: '-width-100' },
  { label: '住址', value: '省/市/区 详细地址', style: '-width-100' },
  { label: '医院', value: '医院名称12345...' },
  { label: '医生', value: '张茅台' },
  { label: '住院号', value: '12345678', style: '-width-100' },
])

const visitInfo = ref([
  { label: '确诊时间', value: '1933-03-03' },
  { label: '诊断', value: 'sAML' },
  { label: '大分型', value: 'AML M5b' },
  { label: '小分型', value: 'AML M5b' },
  { label: 'WBC', value: '55 x10E9/L' },
  { label: 'Hb', value: '132 g/L' },
  { label: 'PLT', value: '52 x10e9/L' },
  { label: '骨髓形态', value: '63%' },
  { label: 'FCM', value: '77%' },
  { label: '融合基因', value: '做了部分' },
  { label: '基因突变', value: '未测' },
  { label: '染色体', value: '未做' },
])

const healInfo = ref([
  { label: 'C1治疗日期', value: '1933-03-03', style: '-width-100' },
  { label: 'C1治疗方案', value: 'IA' },
  { label: 'C1疗效', value: '3' },
  { label: 'C2治疗日期', value: '1933-03-03', style: '-width-100' },
  { label: 'C2治疗方案', value: 'IA' },
  { label: 'C2疗效', value: '4' },
  { label: '总疗程数', value: '12' },
  { label: '末次化疗', value: '2023-12-12' },
  { label: '末次化疗疾病状态', value: '3', style: '-width-100' },
])

const otherInfo = ref([
  { label: '是否复发', value: '是', style: '-width-100' },
  { label: 'CR1时间', value: '2023-12-12' },
  { label: '第一次复发', value: '2023-12-12' },
  { label: 'CR2时间', value: '2023-12-12' },
  { label: '第二次复发', value: '2023-12-12' },
  { label: 'CR3时间', value: '2023-12-12', style: '-width-100' },
  { label: '是否骨髓移植', value: '是' },
  { label: '移植时间', value: '2023-12-12' },
  { label: '是否死亡', value: '是' },
  { label: '死亡时间', value: '2023-12-12' },
  { label: '末次随访日期', value: '2023-12-12', style: '-width-100' },
])

const notesData = ref([
  {
    date: '2016-05-03',
    content: '这是备注内容',
  },
  {
    date: '2016-05-03',
    content:
      '这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容这是备注内容',
  },
])

const fileData = ref([
  {
    date: '2016-05-03',
    name: '文件类型',
    address: '这是文件名称hhhhhhhh',
  },
])
const dialogFormVisible = ref(false)
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})
const dialogImgVisible = ref(false)
const dialogImageUrl = ref('')

const addNotes = () => {
  router.push({
    path: '/patientinfo',
    query: { id: 1, step: 2, is_therapy: '2' },
  })
}

const delNotes = (index) => {
  ElMessageBox.confirm('删除后无法恢复，确定删除文件？', '提示', {
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

const previewNotes = (uploadFile) => {
  dialogImageUrl.value =
    'https://gips0.baidu.com/it/u=2939907571,3210231540&fm=3039&app=3039&f=JPEG?w=1024&h=1024'
  dialogImgVisible.value = true
}

const addDatasets = () => {
  window.open('/experiments/new')
}

const refreshDatasets = () => {
  ElMessage({
    type: 'success',
    message: '刷新成功',
  })
}

const goEdit = () => {
  router.push('/patientinfo')
}
const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.patient-detail-container {
  background-color: #ffffff;
  padding: 16px;
  .patient-name {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      color: #323233;
      margin-right: 16px;
    }
  }
  .patient-detail-wrap {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
</style>
