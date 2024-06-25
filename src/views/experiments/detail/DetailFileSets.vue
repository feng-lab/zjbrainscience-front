<template>
  <el-row class="m-b-16" :gutter="16">
    <el-col :lg="6" :xs="24" class="m-b-16">
      <div style="display: flex; justify-content: flex-end">
        <el-form :model="form">
          <el-form-item label="文件夹：">
            <el-input
              v-model="form.directory"
              placeholder="请输入文件夹名称"
              clearable
              style="width: 220px"
            />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          @click="append(selectNodeObj.data)"
          style="margin-left: 10px"
          >新建</el-button
        >
        <!-- <el-button
          type="danger"
          @click="remove(selectNodeObj.node, selectNodeObj.data)"
          >删除</el-button
        > -->
      </div>
      <el-scrollbar height="calc(100vh - 450px)">
        <el-tree
          ref="nodeTreeRef"
          :data="dataSource"
          node-key="id"
          :expand-on-click-node="true"
          highlight-current
          @current-change="currentNodeChange"
          default-expand-all
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <!-- <a @click="append(data)" style="margin-left: 50px"> + </a>
              <a
                style="margin-left: 8px"
                @click="remove(node, data)"
                v-show="data.id !== 1"
              >
                -
              </a> -->
              </span>
            </span>
          </template>
        </el-tree>
      </el-scrollbar>
    </el-col>
    <el-col
      :lg="18"
      :xs="24"
      class="m-b-16"
      style="border-left: solid 1px #ccc"
    >
      <el-card
        :header="cardShow ? $t('file.list') : ''"
        :class="cardShow ? 'text' : 'picture'"
        :shadow="cardShow ? 'always' : 'never'"
        :body-style="cardShow ? {} : { padding: 0 }"
      >
        <el-upload
          ref="uploadRef"
          v-model:file-list="files"
          action="/api/uploadDatasetFile"
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
              v-if="user.access_level > 10"
              @mouseover="showUploadTitle = true"
              @mouseout="showUploadTitle = false"
              style="margin-left: 20px"
            >
              <!-- {{ $t('button.bulkUpload') }} -->
              {{ '文件上传' }}
            </el-button>
          </template>
        </el-upload>
        <el-scrollbar height="calc(100vh - 480px)">
          <div class="picture-item-wrap" v-if="fileList.length">
            <div
              class="picture-item"
              v-for="(item, index) in fileList"
              :key="index"
            >
              <div class="picture-item--thumbnail m-b-8 m-r-8">
                <img :src="getThumbnail(item)" />
              </div>
              <div>
                {{ item.name }}
              </div>

              <span class="picture-item--actions">
                <!-- <span> -->
                <span @click="handleDownload(item)">
                  <!-- <div
                  :href="`/api/downloadDatasetFile?dataset_id=${experiment_id}&path=${
                  path.join('') + item.name }`">
                </div> -->
                  <a :underline="false" :download="item.name" target="_blank">
                    <el-icon><Download /></el-icon>
                  </a>
                </span>
                <span @click="handleDelete(item)"
                  ><el-icon><Delete /></el-icon
                ></span>
              </span>
            </div>
          </div>
          <div class="picture-empty-wrap" v-else>
            <el-empty description="暂无文件" />
          </div>
        </el-scrollbar>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup>
import BsEegDisplay from '@/components/BsEegDisplay.vue'
import BsEegView from '@/views/eeg/BsEegView.vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import { ref, reactive, inject, nextTick, onMounted, computed } from 'vue'
import jsCookie from 'js-cookie'
import Thumbnail from '@/utils/thumbnail'
//import jszip from "jszip";
import { useUtils } from '@/compositions/useUtils'
import { useI18n } from 'vue-i18n'
import { useUpload } from '@/compositions/useUpload'
import { ElMessage } from 'element-plus'
import { filesByPageApi, fileTypesApi } from '@/api/datasetFiles'
import {
  downloadDatasetFileApi,
  getDatasetFilesApi,
  getDatasetDirectoryTreeApi,
  deleteDatasetFileApi,
} from '@/api/datasetManagement'
import { eegDisplayApi } from '@/api/eeg'
import { getFileData, getPreviewUrl } from '@/utils/common'
import BsLoadMore from '@/components/BsLoadMore.vue'
import useUserStore from '@/stores/user'

const access_token = jsCookie.get('access_token')
const token_type = jsCookie.get('token_type')
const experiment_id = inject('exid')
const uploadRef = ref()
// const { files, options } = useUpload(experiment_id)
const files = ref([])
const { user } = useUserStore()
const form = reactive({
  directory: '',
})
// const actionParams = reactive({
//   dataset_id: experiment_id,
//   directory: form.directory || '/',
//   file: files.value,
// })

//const accept = ref();
const showFileSelect = ref(false)
const forSelectFile = ref([])
const selectedFile = ref([])
//const fileType = ref("");
const fileTypeList = ref([])
const i18n = useI18n()
const previewImg = ref(false)
const previewImgFile = ref({
  url: '',
  name: '',
})

const previewJson = ref(false)
const previewJsonFile = ref({
  data: {},
  name: '',
  id: '',
})

const showUploadTitle = ref(false)

const loadMoreRef = ref()

const scrollRef = ref()

const checkAll = ref(false)
const isIndeterminate = ref(false)

const appendNodeFrontend = ref([])
const path = ref([])
const fileList = ref([])
const dataSource = ref([
  {
    id: '/',
    label: '根目录',
    children: [],
  },
])
const nodeTreeRef = ref(null)
const selectNodeObj = reactive({
  data: {},
  node: {},
})
const fullpath = computed(() => path.value.join(''))

const currentNodeChange = async (data, node) => {
  console.log('currentNodeChange--->')
  selectNodeObj.data = data
  selectNodeObj.node = node
  path.value = []
  getTreeFullPath(node)
  if (appendNodeFrontend.value.includes(data.id)) {
    //前端创建的文件夹
    fileList.value = []
    return
  }
  fileList.value = await getDatasetFiles(node, null)
}

const append = (data) => {
  console.log('append--->', dataSource.value)
  if (!form.directory) return false
  const newChild = {
    id: form.directory + '/',
    label: form.directory,
    children: [],
  }
  if (!data.children) {
    data.children = []
  }
  if (data.children.map((one) => one.label).includes(form.directory))
    return ElMessage.warning('请勿重复添加')
  appendNodeFrontend.value.push(form.directory + '/')
  data.children.push(newChild)
  dataSource.value = [...dataSource.value]
  nextTick(() => {
    setCurrentNodeDefault(selectNodeObj.node.data)
  })
}

const remove = (node, data) => {
  const parent = node.parent
  const children = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1)
  dataSource.value = [...dataSource.value]
}

const setCurrentNodeDefault = (node) => {
  nodeTreeRef.value.setCurrentNode(node)
}

// 获取文件存放全路径
const getTreeFullPath = (node) => {
  if (node.data.id) {
    path.value.unshift(node.data.id)
  }
  if (node.parent && node.parent.data.id) {
    getTreeFullPath(node.parent)
  }
}

const loadNode = async (node, resolve) => {
  if (node.isLeaf) return resolve([])
  if (node.level === 0) {
    return resolve([
      {
        id: '/',
        label: '根目录',
      },
    ])
  } else {
    path.value = []
    getTreeFullPath(node)
    getDatasetFiles(node, resolve)
  }
}

const getDatasetFiles = async (node, resolve) => {
  try {
    const res = await getDatasetFilesApi(experiment_id, fullpath.value)
    if (res.length !== 0) {
      // if (resolve) {
      //   const datasetDirectory = res
      //     .filter((one) => one.type === 'directory')
      //     .map((item) => ({
      //       label: item.name,
      //       id: item.name + '/',
      //       children: [],
      //       ...item,
      //     }))
      //   resolve(datasetDirectory)
      // } else {
      //   const datasetFiles = res.filter((one) => one.type === 'file')
      //   return datasetFiles
      // }
      const datasetFiles = res.filter((one) => one.type === 'file')
      return datasetFiles
    } else {
      return []
    }
  } catch (err) {
    console.log(err)
  }
}

const handleDownload = async (item) => {
  let path = fullpath.value + item.name
  const file = await downloadDatasetFileApi(experiment_id, path)
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

const getDatasetDirectoryTree = async () => {
  try {
    const res = await getDatasetDirectoryTreeApi(experiment_id)
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
    })
  } catch (err) {
    console.log(err)
  }
}
const handleSuccess = async (response, uploadFile) => {
  fileList.value = await getDatasetFiles(selectNodeObj.node, null)
  files.value = []
  let index = appendNodeFrontend.value.findIndex(
    (item) => item == selectNodeObj.data.id
  )
  if (index > -1) {
    // 后端添加成功需删除
    appendNodeFrontend.value.splice(index, 1)
  }
  ElMessage.success('上传成功')
}

const handleDelete = async (item) => {
  try {
    const path = fullpath.value + item.name
    await deleteDatasetFileApi(experiment_id, path)
    fileList.value = await getDatasetFiles(selectNodeObj.node, null)
    ElMessage.success('删除成功')
  } catch (err) {
    ElMessage.error('删除出错了')
    console.log(err)
  }
}

onMounted(() => {
  getDatasetDirectoryTree()
})

const handleError = (err) => {
  console.log('handleError------>', err)
}

// const handleChange = (file, fileLists) => {
//   files.value = file.raw
// }
const handleCheckAllChange = (val) => {
  selectedFile.value = val ? forSelectFile.value : []
  isIndeterminate.value = false
}

const handleFileSelectChange = (value) => {
  const checkedCnt = value.length
  const allFileCnt = forSelectFile.value.length
  checkAll.value = checkedCnt === allFileCnt
  isIndeterminate.value = checkedCnt > 0 && checkedCnt < allFileCnt
}

const viewFile = ref()
const viewFileType = ref()
const viewMp4 = ref()

const query = ref({
  experiment_id,
  file_type: '',
})

let timer = null

const cardShow = computed(() => viewFile.value || viewMp4.value)

const handleTypeChange = () => {
  loadMoreRef.value.handleLoadMore()
}

const getFileTypes = async () => {
  fileTypeList.value = await fileTypesApi(experiment_id)
  // fileTypeList.value = [
  //   "7z",
  //   "cnt"
  // ]
}

//const zipTool = new jszip();
const handleClosePreview = (notSupport) => {
  viewFile.value = null
  if (notSupport) {
    ElMessage.error(i18n.t('file.notSupport'))
  }
}

const getThumbnail = (file) => {
  const { name } = file
  const extension = name.split('.').pop().toLowerCase()
  if (['png', 'jpeg', 'gif', 'jpg'].includes(extension)) {
    return Thumbnail['pic']
  }
  return Thumbnail[extension] ?? Thumbnail['unknown']
}

// const handleDelete = async (file) => {
//   await uploadRef.value.handleRemove(file)
//   if (viewFile.value?.id === file.id) {
//     viewFile.value = null
//   }
//   if (viewMp4.value?.id === file.id) {
//     viewMp4.value = null
//   }
//   getFileTypes()
//   if (unCompleted && files.value.length <= 10) {
//     loadMoreRef.value.handleLoadMore(true, 1)
//   }
// }

// const handleSuccess = (response, uploadFile) => {
//   uploadFile.id = response.data
//   if (!timer) {
//     timer = setTimeout(() => {
//       getFileTypes()
//       timer = null
//     }, 500)
//   }
// }
// options['on-success'] = handleSuccess

const handleEEGFileView = (file) => {
  viewFile.value = file.id === viewFile.value?.id ? null : file
}

const viewFileOp = {
  mp4: (file) => {
    viewMp4.value =
      file.id === viewMp4.value?.id
        ? null
        : {
            ...file,
            url: getPreviewUrl(file.id),
          }
    if (viewMp4.value && viewFile.value) {
      nextTick(() => {
        scrollRef.value.setScrollTop(600)
      })
    }
  },
  json: async (file) => {
    let { id, name } = file
    if (id !== previewJsonFile.value.id) {
      let jsonValue = await getFileData(id)
      previewJsonFile.value = {
        data: JSON.parse(JSON.stringify(jsonValue)),
        name,
        id,
      }
    }
    previewJson.value = true
  },
  nev: handleEEGFileView,
  bdf: handleEEGFileView,
  edf: handleEEGFileView,
  png: (file) => {
    const { id, name } = file
    previewImg.value = true
    previewImgFile.value = {
      url: getPreviewUrl(id),
      name,
    }
  },
}

const handlePreview = (file) => {
  let { name } = file
  let [fileName, extension] = name.split('.')
  let [fn, isNev] = fileName.split('.')
  viewFileType.value = (isNev ?? extension).toLowerCase()
  let operation = viewFileOp[viewFileType.value]
  if (operation) {
    operation(file)
  } else {
    ElMessage.error(i18n.t('file.notSupport'))
  }
}

const initSelect = () => {
  selectedFile.value = []
  forSelectFile.value = []
  checkAll.value = false
  isIndeterminate.value = false
}

const handleConfirm = () => {
  selectedFile.value.forEach((file) => {
    file.uid = Date.now()
    uploadRef.value.handleStart(file)
  })
  showFileSelect.value = false
}

// import request from "@/utils/request";
// const filesByPageApi = ({ experiment_id=14, name="", file_type="", offset=0, limit=10 }) => {
//   return request({
//     url: "/api1/getFilesByPage",
//     method: "GET",
//     params: {
//       experiment_id,
//       name,
//       file_type,
//       offset,
//       limit
//     }
//   })
// }
</script>

<style lang="scss" scoped>
.el-card.is-never-shadow.picture {
  border: none;
}
.picture {
  :deep(el-upload) {
    float: right;
  }
  // :deep(.el-upload-list) {
  //   display: inline-flex;
  //   flex-wrap: wrap;
  //   margin: 0;
  //   position: absolute;
  //   left: 0;
  //   top: 88px;
  //   gap: 8px;
  // }
  :deep(.el-card) {
    border: none;
  }

  // :deep(.el-upload-list__item) {
  //   overflow: hidden;
  //   width: 124px;
  //   height: 124px;
  //   box-sizing: border-box;
  // }
  .picture-item-wrap {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
  }
  .picture-empty-wrap {
    display: flex;
    justify-content: center;
  }
  .picture-item {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    &--thumbnail {
      height: 80%;
      img {
        width: 80%;
        height: 80%;
        object-fit: contain;
      }
    }
    &--actions {
      position: absolute;
      width: 80%;
      height: 80%;
      left: 0;
      top: 0;
      cursor: default;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      opacity: 0;
      font-size: 18px;
      background-color: var(--el-overlay-color-lighter);
      transition: opacity var(--el-transition-duration);
      &:hover {
        opacity: 1;
      }
      span {
        a {
          color: #fff;
        }
        cursor: pointer;
        & + span {
          margin-left: 1rem;
        }
      }
    }
  }
}
.text-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media only screen and (max-width: 426px) {
    margin-bottom: 8px;
    width: calc(100vw - 116px);
    flex-direction: column;
    align-items: baseline;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 4px;
    font-size: 0.8em;
    padding: 8px 4px;
  }
  padding: 2px 4px;
  gap: 8px;
  &--name {
    flex: 2;
    cursor: pointer;
  }
  &--percent {
    width: 30%;
    @media only screen and (max-width: 426px) {
      width: 100%;
    }
    margin-right: 16px;
    .el-progress {
      top: -2px;
      right: 0;
      :deep(.el-progress-bar) {
        margin-right: 20px;
        width: 80%;
      }
      :deep(.el-progress__text) {
        top: -4px;
        min-width: 0;
        &:hover {
          display: block;
        }
      }
    }
  }
  &--actions {
    font-size: 0.8rem;
    span {
      cursor: pointer;
      & + span {
        margin-left: 0.5rem;
      }
    }
  }
}

.viewing {
  background-color: var(--el-color-primary-light-9);
}

:deep(.el-upload-list__item:hover .el-progress__text) {
  display: block;
}

.eeg-file-control {
  display: flex;
  align-items: center;
}

.preview {
  text-align: center;
  &-image {
    max-width: 100%;
    object-fit: fill;
  }
}

.bs-upload {
  @media only screen and (max-width: 426px) {
    display: flex;
    flex-direction: column;
    align-items: baseline;
  }
}
</style>
