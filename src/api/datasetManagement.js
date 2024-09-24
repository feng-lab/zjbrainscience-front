import request from "@/utils/request";

/**
 * 新增实验
 * @param { Object } data 
 * @returns 
 */
export function newExApi (data) {
  return request({
    url: "/api/createDataset",
    method: "POST",
    data
  })
}

/**
 * 更新实验
 * @param { Object } data 
 * @returns 
 */
export function updateExApi (data) {
  return request({
    url: "/api/updateDataset",
    method: "POST",
    data
  })
}

/**
 * 删除实验
 * @param { Number } id - 实验ID
 * @returns 
 */
export function deleteExApi (id) {
  return request({
    url: "/api/deleteDataset",
    method: "DELETE",
    data: {
      id
    }
  })
}

/**
 * 分页获取实验列表
 * @param { Object } params 
 * @returns 
 */
export function allExByPageApi (params) {
  return request({
    url: "/api/getDatasetByPage",
    method: "POST",
    params
  })
}

/**
 * 获取实验详情
 * @param {*} dataset_id 
 * @returns 
 */
export function exDetailApi (dataset_id) {
  return request({
    url: "/api/getDatasetInfo",
    method: "POST",
    params: {
      dataset_id
    }
  })
}

/**
 * 上传数据集文件
 * @param { Object } params 
 * @returns 
 */
export function uploadDatasetFileApi (params) {
  return request({
    url: "/api/uploadDatasetFile",
    method: "POST",
    params
  })
}

/**
 * 下载数据集文件
 * @param { Object } params 
 * @returns 
 */
export function downloadDatasetFileApi (dataset_id, path) {
  return request({
    url: "/api/downloadDatasetFile",
    method: "GET",
    responseType: 'blob',
    params: {
      dataset_id,
      path
    }
  })
}

/**
 * 获取数据集文件列表
 * @param { Object } params 
 * @returns 
 */
export function getDatasetFilesApi (dataset_id, directory, file_type) {
  return request({
    url: "/api/listDatasetFiles",
    method: "GET",
    params: {
      dataset_id,
      directory,
      file_type
    }
  })
}

/**
 * 重命名数据集文件
 * @param { Object } params 
 * @returns 
 */
export function renameDatasetFileApi (params) {
  return request({
    url: "/api/renameDatasetFile",
    method: "POST",
    params
  })
}

/**
 * 删除数据集文件
 * @param { Number } dataset_id - 实验ID
 * @returns 
 */
export function deleteDatasetFileApi (dataset_id, path) {
  return request({
    url: "/api/deleteDatasetFile",
    method: "DELETE",
    data: {
      dataset_id,
      path
    }
  })
}

/**
 * 删除数据集文件
 * @param { Number } dataset_id - 实验ID
 * @returns 
 */
export function getDatasetDirectoryTreeApi (dataset_id) {
  return request({
    url: "/api/getDatasetDirectoryTree",
    method: "GET",
    params: {
      dataset_id
    }
  })
}

/**
 * 获取物种名称详情
 * @param { Object } params 
 * @returns 
 */
export function getSpeciesInfoApi (params) {
  return request({
    url: "/api/getSpeciesInfo",
    method: "POST",
    params
  })
}

export function getAllSpeciesInfoApi (params) {
  return request({
    url: '/api/getAllSpeciesInfo',
    method: 'POST',
    params
  })
}

// 获取分组数据集大小，参数search，可选参数值：1、species 按物种查询数据集大小；2、source 按来源查询数据集大小 3、data_type按数据类型查找数据集大小
export function getGroupDatasetSizeApi (search) {
  return request({
    url: `/api/getGroupDatasetSize`,
    method: 'GET',
    params: {
      search
    }
  })
}

export function getDatasetFilesTypeApi (dataset_id, directory) {
  return request({
    url: `/api/getDatasetFilesType`,
    method: 'GET',
    params: {
      dataset_id,
      directory
    }
  })
}
