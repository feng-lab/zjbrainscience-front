<template>
  <div class="patient-detail-container">
    <div class="patient-name">
      <div>
        <span>{{ patientName || '--' }}</span>
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
            <el-table-column prop="gmt_modified" label="日期" width="180" />
            <el-table-column prop="memo" label="备注内容" />
          </el-table>
        </template>
      </bs-patient-card>
      <bs-patient-card
        title="文件"
        :slot="fileData.length"
        description="暂无文件"
      >
        <!-- <template #btn>
          <el-button type="primary" @click="dialogFormVisible = true"
            >上传文件</el-button
          >
        </template> -->
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
          action="/api/uploadCohortPatientFile"
          multiple
          :data="{
            cohort_patient_id: editId,
            directory: '/',
          }"
          :headers="{
            Authorization: `${token_type} ${access_token}`,
          }"
          :on-success="handleSuccess"
          :limit="99"
          :on-exceed="handleExceed"
          :show-file-list="true"
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
          <el-option
            :label="item.description"
            :value="item.id"
            v-for="item in datasetsOptions"
          />
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
import {
  getCohortPatientInfoApi,
  getPatientFormDataInfoApi,
  getPatientFormDataApi,
  getPatientCTherapyDetailByPageApi,
  getPatientCTherapyDetailInfoApi,
  getPatientMemoByPageApi,
  uploadCohortPatientFileApi,
  listCohortPatientFilesApi,
} from '@/api/patient.js'
import { allExByPageApi } from '@/api/datasetManagement'
import jsCookie from 'js-cookie'
import {
  diagnoseOptions,
  fusionOptions,
  mutationOptions,
  chromosomeOptions,
  chemotherapyOptions,
  commonInfoInit,
  visitInfoInit,
  healInfoInit,
  otherInfoInit,
} from './dict.js'

const access_token = jsCookie.get('access_token')
const token_type = jsCookie.get('token_type')
const router = useRouter()
const route = useRoute()
const commonInfo = ref(commonInfoInit)
const visitInfo = ref(visitInfoInit)
const healInfo = ref(healInfoInit)
const otherInfo = ref(otherInfoInit)

const notesData = ref([])

const fileData = ref([
  // {
  //   date: '2016-05-03',
  //   name: '文件类型',
  //   address: '这是文件名称hhhhhhhh',
  // },
])
const datasetsOptions = ref([])
const dialogFormVisible = ref(false)
const dialogImgVisible = ref(false)
const dialogImageUrl = ref('')
const editId = ref(null)
const patientName = ref('')

const dataFormat = (options, value) => {
  let obj = options.find((item) => item.value === value) || {}
  return obj['label'] || '--'
}

// 获取病人基本信息
const getCohortPatientInfo = async () => {
  try {
    const data = await getCohortPatientInfoApi({
      cohort_patient_id: editId.value,
    })
    patientName.value = data['patient_name']
    commonInfo.value = commonInfo.value.map((one) => {
      let value = data[one.key]
      if (one.key === 'gender') {
        value = value === 'male' ? '男' : '女'
      }
      return {
        ...one,
        value: value,
      }
    })
  } catch (err) {
    console.log(err)
  }
}

// 获取初诊信息
const getPatientFormDataInfo = async () => {
  try {
    const data = await getPatientFormDataInfoApi({
      patient_id: editId.value,
    })
    visitInfo.value = visitInfo.value.map((one) => {
      let value = data[one.key]
      switch (one.key) {
        case 'diagnose':
          value = dataFormat(diagnoseOptions, value)
          break
        case 'fusion':
          value = dataFormat(fusionOptions, value)
          break
        case 'mutation':
          value = dataFormat(mutationOptions, value)
          break
        case 'chromosome':
          value = dataFormat(chromosomeOptions, value)
          break
        default:
          value
      }
      return {
        ...one,
        value: value,
      }
    })
    healInfo.value = healInfo.value.map((one) => {
      return {
        ...one,
        value: data[one.key],
      }
    })
    otherInfo.value = otherInfo.value.map((one) => {
      let value = data[one.key]
      if (['is_relapse', 'is_transplant', 'is_death'].includes(one.key)) {
        value = value ? '是' : '否'
      }
      return {
        ...one,
        value: value,
      }
    })
  } catch (err) {
    console.log(err)
  }
}

// 获取疗程信息
const getPatientCTherapyDetailByPage = async () => {
  try {
    const data = await getPatientCTherapyDetailByPageApi({
      patient_id: editId.value,
      offset: 0,
      limit: 1000,
      include_deleted: false,
    })
    let cData =
      data.items.length &&
      data.items
        .sort((a, b) => a.c_index - b.c_index)
        .map((one) => {
          let arr = []
          let index = one.c_index
          let obj1 = {
            label: `C${index}治疗日期`,
            value: one.c_date,
            key: 'c_date',
          }
          let obj2 = {
            label: `C${index}治疗方案`,
            value: one.c_detail,
            key: 'c_detail',
          }
          let obj3 = {
            label: `C${index}疗效`,
            value: one.c_effects,
            key: 'c_effects',
          }
          let obj4 = {
            label: `C${index}MRD`,
            value: one.c_mrd,
            key: 'c_mrd',
          }
          arr.push(obj1)
          arr.push(obj2)
          arr.push(obj3)
          arr.push(obj4)
          return arr
        })
    healInfo.value = cData.flat().concat(healInfo.value)
  } catch (err) {
    console.log(err)
    return false
  }
}

// 获取备注信息
const getPatientMemoByPage = async () => {
  try {
    const data = await getPatientMemoByPageApi({
      patient_id: editId.value,
      offset: 0,
      limit: 1000,
      include_deleted: false,
    })
    notesData.value = data.items || []
  } catch (err) {
    console.log(err)
    return false
  }
}

// 获取数据集列表
const getAllExByPage = async () => {
  try {
    const res = await allExByPageApi({
      offset: 0,
      limit: 10000,
    })
    datasetsOptions.value = res.items || []
  } catch (err) {
    console.log(err)
  }
}

// 获取病人文件列表
const listCohortPatientFiles = async () => {
  try {
    const data = await listCohortPatientFilesApi({
      cohort_patient_id: editId.value,
      directory: '/',
      file_type: 1000,
    })
    fileData.value = data || []
  } catch (err) {
    console.log(err)
    return false
  }
}

const handleSuccess = (response, uploadFile) => {
  ElMessage.success('上传成功')
}

onMounted(() => {
  editId.value = route.query.id
  getCohortPatientInfo()
  getPatientFormDataInfo()
  getPatientMemoByPage()
  getAllExByPage()
  getPatientCTherapyDetailByPage()
})

const addNotes = () => {
  router.push({
    path: '/patientinfo',
    query: { id: 1, step: 2, is_therapy: true },
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
  dialogImageUrl.value = ''
  dialogImgVisible.value = true
}

const addDatasets = () => {
  window.open('/experiments/new')
}

const refreshDatasets = async () => {
  await getAllExByPage()
  ElMessage({
    type: 'success',
    message: '刷新成功',
  })
}

const goEdit = () => {
  router.push({ path: '/patientinfo', query: { id: editId.value } })
}
const goBack = () => {
  const { page } = route.query
  router.push({ path: 'myqueue', query: { page } })
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
