<template>
  <el-row style="height: 100%">
    <el-col :span="6" style="border-right: 2px solid #ebedf0; padding: 12px">
      <el-scrollbar height="calc(100vh - 390px)">
        <!-- <p v-for="item in 20" :key="item" class="scrollbar-item">
          第一层级（{{ item }}）
        </p> -->
        <el-tree
          ref="nodeTreeRef"
          :data="dataSource"
          node-key="id"
          :expand-on-click-node="true"
          highlight-current
          @current-change="currentNodeChange"
          :load="loadNode"
          lazy
        >
          <!-- default-expand-all -->
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </el-scrollbar>
    </el-col>
    <el-col :span="18" style="padding: 12px">
      <div class="table-top">
        <el-upload
          v-if="user.access_level >= 100"
          ref="uploadRef"
          v-model:file-list="files"
          action="/api/uploadDatasetFileOss"
          :data="{
            dataset_id: experiment_id,
            directory: path.join('') || '/',
            file: files,
          }"
          :class="['bs-upload']"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-change="handleChange"
          :headers="{
            Authorization: `${token_type} ${access_token}`,
          }"
          :limit="999"
          :multiple="true"
          :show-file-list="false"
        >
          <template #trigger>
            <el-button
              class="m-b-8 m-t-4"
              type="primary"
              icon="Upload"
              style="margin-left: 20px"
            >
              {{ '上传文件' }}
            </el-button>
          </template>
        </el-upload>
        <div v-else class="m-b-8 m-t-4" style="height: 32px"></div>
        <el-select
          v-model="selectType"
          class="select-wrap"
          placeholder="请选择文件格式"
          @change="selectChange"
          clearable
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-table
        :data="currentFileList"
        style="width: 100%; height: calc(100vh - 500px)"
        v-loading="tbLoading"
        element-loading-text="加载中..."
      >
        <el-table-column prop="name" label="文件名称" />
        <el-table-column prop="size" label="文件大小">
          <template #default="scope">
            {{ getSize(scope.row.size) }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="文件格式">
          <template #default="scope">
            {{ getFileType(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="目录类型">
          <template #default="scope">
            {{ scope.row.type === 'file' ? '文件' : '文件夹' }}
          </template>
        </el-table-column>
        <el-table-column prop="last_modified" label="更新时间">
          <template #default="scope">
            {{
              moment(new Date(scope.row.last_modified)).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <!-- <el-button
              v-if="user.access_level >= 100 && scope.row.type === 'file'"
              link
              type="primary"
              size="small"
              @click="handleDownload(scope.row)"
              >下载</el-button
            > -->
            <el-button
              v-if="viewShow(scope.row) && user.access_level >= 10"
              :loading="scope.row.loading"
              link
              type="primary"
              size="small"
              @click="handleView(scope.row)"
              >预览</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
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
    </el-col>
  </el-row>
  <el-dialog
    v-model="dialogVisible"
    title="预览"
    width="60%"
    align-center
    destroy-on-close
    style="max-height: 100%; overflow-y: scroll"
  >
    <div class="content-wrap">
      <!-- <div class="mask"></div> -->
      <!-- <img v-if="true" :src="newImgsrc" /> -->
      <!-- <div class="content"> -->
      <el-image
        v-if="isImageType"
        :src="fileSrc"
        :preview-src-list="[fileSrc]"
        fit="cover"
        title="点击可放大预览"
      />
      <bs-office-viewer
        v-else-if="isDocxType || isExcelType"
        :src="fileSrc"
        :fileType="isDocxType ? 'docx' : 'excel'"
      ></bs-office-viewer>
      <iframe
        v-else-if="isIframeType"
        :src="fileSrc + '#toolbar=0'"
        :type="fileType"
        width="100%"
        height="700"
        id="iframeContent"
        oncontextmenu="return false;"
        onselectstart="return false;"
      ></iframe>
      <video controls v-else-if="isVideoType" width="100%">
        <source :src="fileSrc" :type="fileType" />
      </video>
      <!-- </div> -->
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick, reactive, computed } from 'vue'
import {
  getDatasetDirectoryTreeOssApi,
  getDatasetFilesTypeOssApi,
  listDatasetFilesOssApi,
  downloadDatasetFileOssApi,
} from '@/api/datasetOss'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import jsCookie from 'js-cookie'
import BsOfficeViewer from '@/components/BsOfficeViewer.vue'
import moment from 'moment'
import useUserStore from '@/stores/user'
import Tiff from 'tiff.js'
import axios from 'axios'

const { user } = useUserStore()
const access_token = jsCookie.get('access_token')
const token_type = jsCookie.get('token_type')
const selectType = ref('')
const route = useRoute()
const experiment_id = route.params.experiment_id
const nodeTreeRef = ref(null)
const dataSource = ref([
  {
    id: '/',
    label: '根目录',
    children: [],
  },
])
const files = ref([])
const fileList = ref([])
const selectNodeObj = reactive({
  data: {},
  node: {},
})
const path = ref([])
const fullpath = computed(() => path.value.join(''))
const fileSrc = ref(null)
const fileType = ref(null)
const dialogVisible = ref(false)
const viewTypeList = [
  'json',
  'pdf',
  'xlsx',
  'docx',
  'csv',
  'txt',
  'mp4',
  'avi',
  'webm',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'bmp',
  'gif',
  'h5ad',
  'tif',
  'tiff',
]
const isImageType = computed(() => {
  return /^image\//.test(fileType.value)
})
const isVideoType = computed(() => {
  return /^video\//.test(fileType.value)
})
const isIframeType = computed(() => {
  return [
    'application/json',
    'text/plain',
    'application/pdf',
    'application/h5ad',
  ].includes(fileType.value)
})
const isDocxType = computed(() => {
  return (
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ===
    fileType.value
  )
})
const isExcelType = computed(() => {
  return [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ].includes(fileType.value)
})

const typeOptions = ref([])
const pageSize = ref(20)
const currentPage = ref(1)
const currentFileList = ref([])
const total = ref(0)
const newImgsrc = ref(null)
const tbLoading = ref(false)

onMounted(() => {
  // getDatasetDirectoryTree()
  // window.addEventListener('scroll', (e) => {
  //   return true
  // })
})

const viewShow = (row) => {
  let nameArr = row.name.split('.')
  if (nameArr.length) {
    return viewTypeList.includes(nameArr.slice(-1)[0])
  }
  return false
}

const getSize = (size) => {
  if (size === null) return '--'
  if (size > 1024 && size <= 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  } else if (size > 1024 * 1024 && size <= 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)} MB`
  } else if (size > 1024 * 1024 * 1024 && size <= 1024 * 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`
  }
  return `${size.toFixed(1)} bp`
}

const formatTreeData = (data) => {
  data = data.map((item) => {
    return {
      id: item.name + '/',
      label: item.name,
      children: item.dirs ? formatTreeData(item.dirs) : item.dirs,
    }
  })
  return data
}

// 同步文件树，弃用
const getDatasetDirectoryTree = async () => {
  try {
    const res = await getDatasetDirectoryTreeOssApi(experiment_id)
    const newTree = [
      {
        id: '/',
        label: '根目录',
        children: [],
      },
    ]
    newTree[0].children = formatTreeData(res)
    dataSource.value = newTree
    nextTick(() => {
      setCurrentNodeDefault({ id: '/' })
      getDatasetFilesType()
    })
  } catch (err) {
    nextTick(() => {
      setCurrentNodeDefault({ id: '/' })
      getDatasetFilesType()
    })
  }
}

const loadNode = async (node, resolve) => {
  if (node.level === 0) {
    resolve([
      {
        id: '/',
        label: '根目录',
        children: [],
      },
    ])
    nextTick(() => {
      setCurrentNodeDefault({ id: '/' })
      getDatasetFilesType()
    })
    return
  } else {
    getTreeFullPath(node)
    const res = await listDatasetFilesOssApi(experiment_id, fullpath.value, '')
    let data = []
    if (res.length !== 0) {
      data = res[1]
        .filter((one) => one.type === 'directory')
        .map((item) => ({
          id: item.name + '/',
          label: item.name,
        }))
    }
    resolve(data)
  }
}

// 获取文件列表
const getDatasetFiles = async () => {
  try {
    tbLoading.value = true
    const res = await listDatasetFilesOssApi(
      experiment_id,
      fullpath.value,
      selectType.value
    )
    if (res.length !== 0) {
      fileList.value = res[1]
        ? res[1].map((item) => ({
            ...item,
            loading: false,
          }))
        : []
      total.value = res[0] ? res[0].counts : 0
      getCurrentFileList()
    } else {
      fileList.value = []
      total.value = 0
    }
    tbLoading.value = false
  } catch (err) {
    console.log(err)
    tbLoading.value = false
  }
}

// 获取文件格式下拉菜单
const getDatasetFilesType = async () => {
  try {
    const res = await getDatasetFilesTypeOssApi(experiment_id, fullpath.value)
    typeOptions.value = res
      ? res.map((one) => ({ label: one, value: one }))
      : []
  } catch (err) {
    console.log(err)
  }
}

const selectChange = () => {
  currentPage.value = 1
  getDatasetFiles()
}

const currentNodeChange = (data, node) => {
  selectNodeObj.data = data
  selectNodeObj.node = node
  getTreeFullPath(node)
  getDatasetFiles()
}

// 获取文件存放全路径
const getTreeFullPath = (node) => {
  path.value = []
  formatTreeFullPath(node)
}

// 格式化文件存放全路径path数组
const formatTreeFullPath = (node) => {
  if (node.data.id) {
    path.value.unshift(node.data.id)
  }
  if (node.parent && node.parent.data.id) {
    formatTreeFullPath(node.parent)
  }
}

const setCurrentNodeDefault = (node) => {
  nodeTreeRef.value.setCurrentNode(node)
}

const handleSuccess = (response, uploadFile) => {
  getDatasetFiles(selectNodeObj.node, null)
  files.value = []
  ElMessage.success('上传成功')
}

const handleError = (err) => {
  console.log('handleError------>', err)
}

const handleChange = (err) => {
  console.log('handleChange------>', err)
}

const handleSizeChange = (val) => {
  currentPage.value = 1
  pageSize.value = val
  getCurrentFileList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getCurrentFileList()
}

// 前端分页
const getCurrentFileList = () => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  currentFileList.value = fileList.value.slice(start, end)
}

// 文件下载
const handleDownload = async (item) => {
  let path = fullpath.value + item.name
  const file = await downloadDatasetFileOssApi(experiment_id, path)
  const blob = new Blob([file.data], {
    type: file.headers['Content-Type'],
  })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.download = file.config ? file.config.params.path.slice(1) : 'undefined'
  link.style.display = 'none'
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 获取文件格式
const getFileType = (row) => {
  return row.name
    ? row.name.split('.').length > 1
      ? row.name.split('.').slice(-1)[0]
      : '--'
    : '--'
}

// tiff文件格式转换
const formartTiffFile = (url) => {
  // const url = '../../../src/assets/img/queue/nb.tiff'
  return axios
    .get(url, {
      responseType: 'arraybuffer',
    })
    .then((response) => {
      const tiff = new window.Tiff({ buffer: response.data })
      const imgData = tiff.toDataURL()
      return imgData
    })
}

// 点击预览
const handleView = async (item) => {
  fileType.value = null
  fileSrc.value = null
  item.loading = true
  let path = fullpath.value + item.name
  try {
    if (getFileType(item) === 'h5ad') {
      fileType.value = 'application/h5ad'
      let url = `http://${window.location.hostname}:3003?id=${experiment_id}&path=${path}`
      fileSrc.value = url
    } else {
      const file = await downloadDatasetFileOssApi(experiment_id, path)
      const blob = new Blob([file.data], {
        type: file.headers['Content-Type'],
      })
      const url = window.URL.createObjectURL(blob)
      if (['tif', 'tiff'].includes(getFileType(item))) {
        fileType.value = 'image/tif'
        fileSrc.value = await formartTiffFile(url)
      } else {
        fileType.value = file.data ? file.data.type : null
        if (isDocxType.value || isExcelType.value) {
          fileSrc.value = blob
        } else if (isImageType.value || isVideoType.value) {
          fileSrc.value = url
        } else {
          const reader = new FileReader()
          reader.readAsArrayBuffer(blob)
          reader.onload = function () {
            fileSrc.value = window.URL.createObjectURL(
              new Blob([reader.result], {
                type: fileType.value,
              })
            )
          }
        }
      }
    }
    item.loading = false
    dialogVisible.value = true
  } catch (e) {
    item.loading = false
  }
}
</script>

<style lang="scss" scoped>
.table-top {
  display: flex;
  justify-content: space-between;
  .select-wrap {
    width: 250px;
  }
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
  // height: 100%;
  // max-height: 600px; /* 根据需要调整高度 */
  overflow-y: auto; /* 允许垂直滚动 */
  // display: flex;
  // justify-content: center;
  // .mask {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   background-color: rgba(0, 0, 0, 0.5); /* 黑色半透明遮罩 */
  //   z-index: 10; /* 确保遮罩层在内容之上 */
  // }
  .content {
    position: relative;
    padding: 20px;
    z-index: 5; /* 确保内容在遮罩层之下 */
    height: 100%;
  }
  // iframe {
  //   :deep(body) {
  //     background-color: #ffff00;
  //     user-select: none;
  //     -webkit-user-select: none;
  //   }
  // }
}
// .content-wrap::before {
//   content: '';
//   position: absolute;
//   top: 0;
//   bottom: 0;
//   left: 0;
//   right: 0;
//   height: 100%;
//   width: calc(100% - 20px);
//   z-index: 1;
//   background-color: #ffff00;
// }
.iframe-wrap {
  background-color: #ff00ff;
}
</style>
