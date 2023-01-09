import request from "@/utils/request";

/**
 * 获取当前实验已有的文件类型
 * @param {Number} experiment_id - 实验ID
 * @returns 
 */
export function fileTypesApi(experiment_id) {
  return request({
    url: "/api/getFileTypes",
    method: "GET",
    params: { experiment_id }
  })
}


/**
 * 分页获取文件列表 
 * @param {Number} experiment_id - 实验ID
 * @param {String} name          - 文件名
 * @param {String} file_type     - 文件类型
 * @param {Number} offset        - 分页起始位置
 * @param {Number} limit         - 分页大小
 * @returns 
 */
export function filesByPageApi({ experiment_id, name="", file_type="", offset=0, limit=10 }) {
  return request({
    url: "/api/getFilesByPage",
    method: "GET",
    params: {
      experiment_id,
      name,
      file_type,
      offset,
      limit
    }
  })
}

/**
 * 删除文件
 * @param {Number} id - 文件ID
 * @returns 
 */
export function deleteFileApi(id) {
  return request({
    url: "/api/deleteFile",
    method: "DELETE",
    data: {
      id
    }
  })
}


export function targetFilesApi() {
  return request({
    url: "/api/getFiles",
    method: "GET",
  })
}