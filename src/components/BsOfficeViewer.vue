<template>
  <div style="width: 100%; height: 100%; overflow-y: scroll">
    <div id="fileShow" v-show="fileType == 'docx'"></div>
    <div
      v-show="fileType === 'excel'"
      v-html="excel.SheetActiveTable"
      style="padding: 10px 15px"
    ></div>
  </div>
  <!-- <vue-office-excel
      v-if="
        fileType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      "
      :src="src"
      @rendered="rendered"
      style="height: 100%; margin: 0; padding: 0"
    ></vue-office-excel> -->
  <!-- <vue-office-pdf
      v-else-if="fileType === 'application/pdf'"
      :src="src"
      @rendered="rendered"
      style="height: 100%; margin: 0; padding: 0"
    ></vue-office-pdf> -->
  <!-- <vue-office-docx
    v-if="
      fileType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    "
    :src="src"
    ref="docxRef"
    @rendered="rendered"
    style="height: 100%; margin: 0; padding: 0"
  ></vue-office-docx> -->
</template>
<script setup>
import { onMounted, ref, nextTick, reactive, toRefs, watch } from 'vue'
// import VueOfficeExcel from '@vue-office/excel'
// import VueOfficePdf from '@vue-office/pdf'
// import VueOfficeDocx from '@vue-office/docx'
import { renderAsync } from 'docx-preview'
import * as XLSX from 'xlsx'

const props = defineProps({
  fileType: {
    type: String,
    default: '',
  },
  src: Blob,
})

// const rendered = () => {
//   console.log('rendered---->')
// }

const exData = reactive({
  excel: {
    // 数据
    workbook: {},
    // 表名称集合
    sheetNames: [],
    // 激活项
    sheetNameActive: '',
    // 当前激活表格
    SheetActiveTable: '',
  },
})
const { excel } = toRefs(exData)
// 视频预览所需数据
const emptyTips = ref('暂无内容')

const getSheetNameTable = (sheetName) => {
  try {
    // 获取当前工作表的数据
    const worksheet = excel.value.workbook.Sheets[sheetName]
    // 转换为数据  1.json数据有些问题，2.如果是html那么样式需修改
    let htmlData = XLSX.utils.sheet_to_html(worksheet, {
      header: '',
      footer: '',
    })
    htmlData =
      htmlData === ''
        ? htmlData
        : htmlData.replace(
            /<table/,
            '<table class="default-table" border="1px solid #ccc" cellpadding="0" cellspacing="0"'
          )
    // 第一行进行改颜色
    htmlData =
      htmlData === ''
        ? htmlData
        : htmlData.replace(/<tr/, '<tr style="background:#b4c9e8"')
    excel.value.SheetActiveTable = htmlData
  } catch (e) {
    // 如果工作表没有数据则到这里来处理
    excel.value.SheetActiveTable =
      '<h4 style="text-align: center">' + emptyTips.value + '</h4>'
  }
}
const init = () => {
  if (props.fileType === 'excel') {
    const reader = new FileReader()
    reader.readAsArrayBuffer(props.src)
    reader.onload = (e) => {
      var data = new Uint8Array(e.target.result)
      // 这里的data里面的类型和后面的type类型要对应
      var workbook = XLSX.read(data, { type: 'array' })
      const sheetNames = workbook.SheetNames // 工作表名称集合
      excel.value.workbook = workbook
      excel.value.sheetNames = sheetNames
      excel.value.sheetNameActive = sheetNames[0]
      //方法
      getSheetNameTable(sheetNames[0])
    }
  } else {
    const previewContainer = document.getElementById('fileShow')
    renderAsync(props.src, previewContainer)
  }
}

watch()
// () => props.src,
// () => {
//   init()
// }
onMounted(() => {
  init()
})
</script>
<style lang="scss" scoped></style>
