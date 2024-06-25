<template>
  <el-row style="height: 100%">
    <el-col :span="6" style="border-right: 2px solid #ebedf0; padding: 12px">
      <el-scrollbar height="400px">
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
          default-expand-all
        >
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
              style="margin-left: 20px"
            >
              {{ '上传文件' }}
            </el-button>
          </template>
        </el-upload>
        <el-select
          v-model="selectType"
          class="select-wrap"
          placeholder="Select"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-table :data="fileList" style="width: 100%">
        <el-table-column prop="name" label="文件名称" />
        <el-table-column prop="size" label="文件大小" />
        <el-table-column prop="type" label="文件类型" />
        <el-table-column prop="last_modified" label="更新时间" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleDownload(scope.row)"
              >下载</el-button
            >
            <el-button link type="primary" size="small">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          v-model:currentPage="currentPage4"
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
</template>

<script setup>
import { ref, onMounted, nextTick, reactive, computed } from 'vue'
import {
  downloadDatasetFileApi,
  getDatasetFilesApi,
  getDatasetDirectoryTreeApi,
  deleteDatasetFileApi,
} from '@/api/datasetManagement'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import jsCookie from 'js-cookie'

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

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
const pageSize = ref(20)
const total = ref(0)

onMounted(() => {
  getDatasetDirectoryTree()
})

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
    console.log('experiment_id--->', experiment_id)
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

const getDatasetFiles = async (node, resolve) => {
  try {
    const res = await getDatasetFilesApi(experiment_id, fullpath.value)
    if (res.length !== 0) {
      const datasetFiles = res.filter((one) => one.type === 'file')
      return datasetFiles
    } else {
      return []
    }
  } catch (err) {
    console.log(err)
  }
}

const currentNodeChange = async (data, node) => {
  console.log('currentNodeChange--->')
  selectNodeObj.data = data
  selectNodeObj.node = node
  path.value = []
  getTreeFullPath(node)
  fileList.value = await getDatasetFiles(node, null)
  total.value = fileList.value.length
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

const setCurrentNodeDefault = (node) => {
  nodeTreeRef.value.setCurrentNode(node)
}

const handleSuccess = async (response, uploadFile) => {
  console.log('handleSuccess------>', response)
  fileList.value = await getDatasetFiles(selectNodeObj.node, null)
  files.value = []
  ElMessage.success('上传成功')
}

const handleError = (err) => {
  console.log('handleError------>', err)
}

const handleChange = (err) => {
  console.log('handleChange------>', err)
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
</style>
