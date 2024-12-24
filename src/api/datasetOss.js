import request from "@/utils/request";

/**
 * 创建oss数据集
 * @param { Object } data 
 * @returns 
 */
export function createDatasetOssApi (data) {
  return request({
    url: "/api/createDatasetOss",
    method: "POST",
    data
  })
}

/**
 * 获取oss单个数据集大小
 * @param { Object } data 
 * @returns 
 */
export function getDatasetSizeOssApi (dataset_id, from_table) {
  return request({
    url: "/api/getDatasetSizeOss",
    method: "GET",
    params: {
      dataset_id,
      from_table
    }
  })
}

/**
 * 从表获取oss单个数据集大小--速度更快
 * @param { Object } data 
 * @returns 
 */
// export function getDatasetSizeOssTableApi (dataset_id) {
//   return request({
//     url: "/api/getDatasetSizeOssTable",
//     method: "GET",
//     params: {
//       dataset_id
//     }
//   })
// }

/**
 * 获取oss所有数据集大小
 * @param { Object } data 
 * @returns 
 */
export function getAllDatasetSizeOssApi (from_table) {
  return request({
    url: "/api/getAllDatasetSizeOss",
    method: "GET",
    params: {
      from_table
    }
  })
}

/**
 * 从表里获取oss所有数据集大小--速度更快
 * @param { Object } data 
 * @returns 
 */
// export function getAllDatasetSizeOssTableApi () {
//   return request({
//     url: "/api/getAllDatasetSizeOssTable",
//     method: "GET",
//     params: {}
//   })
// }

/**
 * 获取oss分组数据集大小
 * @param { Object } data 
 * @returns 
 */
export function getGroupDatasetSizeOssApi (params) {
  return request({
    url: "/api/getGroupDatasetSizeOss",
    method: "GET",
    params
  })
}

/**
 * 从表中获取oss分组数据集大小
 * @param { Object } data 
 * @returns 
 */
// export function getGroupDatasetSizeOssTableApi (search) {
//   return request({
//     url: "/api/getGroupDatasetSizeOssTable",
//     method: "GET",
//     params: {
//       search
//     }
//   })
// }

/**
 * 获取oss数据收集信息
 * @param { Object } data 
 * @returns 
 */
export function getDatasetCollectionInfoOssApi (from_table, is_order, offset, limit, include_deleted) {
  return request({
    url: "/api/getDatasetCollectionInfoOss",
    method: "GET",
    params: {
      from_table,
      is_order,
      offset,
      limit,
      include_deleted
    }
  })
}

/**
 * 从表里获取oss数据收集信息
 * @param { Object } data 
 * @returns 
 */
// export function getDatasetCollectionInfoOssTableApi (is_order, offset, limit, include_deleted) {
//   return request({
//     url: "/api/getDatasetCollectionInfoOssTable",
//     method: "GET",
//     params: {
//       is_order,
//       offset,
//       limit,
//       include_deleted
//     }
//   })
// }

/**
 * 上传oss数据集文件
 * @param { Object } data 
 * @returns 
 */
export function uploadDatasetFileOssApi (data) {
  return request({
    url: "/api/uploadDatasetFileOss",
    method: "POST",
    data
  })
}

/**
 * 获取oss数据集文件列表
 * @param { Object } data 
 * @returns 
 */
export function listDatasetFilesOssApi (dataset_id, directory, file_type) {
  return request({
    url: "/api/listDatasetFilesOss",
    method: "GET",
    params: {
      dataset_id,
      directory,
      file_type
    }
  })
}

/**
 * 下载oss数据集文件
 * @param { Object } data 
 * @returns 
 */
export function downloadDatasetFileOssApi (dataset_id, path) {
  return request({
    url: "/api/downloadDatasetFileOss",
    method: "GET",
    responseType: 'blob',
    params: {
      dataset_id,
      path
    }
  })
}

/**
 * 重命名oss数据集文件
 * @param { Object } data 
 * @returns 
 */
export function renameDatasetFileOssApi (data) {
  return request({
    url: "/api/renameDatasetFileOss",
    method: "POST",
    data
  })
}

/**
 * 删除数据集文件
 * @param { Number } dataset_id - 实验ID
 * @returns 
 */
export function deleteDatasetFileOssApi (dataset_id, path) {
  return request({
    url: "/api/deleteDatasetFileOss",
    method: "DELETE",
    data: {
      dataset_id,
      path
    }
  })
}

/**
 * 获取oss数据集文件树（仅包括文件夹）
 * @param { Object } data 
 * @returns 
 */
export function getDatasetDirectoryTreeOssApi (dataset_id) {
  return request({
    url: "/api/getDatasetDirectoryTreeOss",
    method: "GET",
    params: {
      dataset_id,
    }
  })
}

/**
 * 获取oss数据集文件类型
 * @param { Object } data 
 * @returns 
 */
export function getDatasetFilesTypeOssApi (dataset_id, directory) {
  return request({
    url: "/api/getDatasetFilesTypeOss",
    method: "GET",
    params: {
      dataset_id,
      directory
    }
  })
}
