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

/**
 * 
 * @param { Number } file_id 文件ID
 * @returns 
 */
export function neuroSpikeFileInfoApi(file_id) {
  console.log('file_id', file_id)
  return request({
    url: "/api/getNeuralSpikeInfo",
    method: "GET",
    params: {
      file_id
    }
  })
}

/**
 * 
 * @param {Object} data 
 *  {
 *    "file_id": Number,
 *    "window": Number,
 *    "page_index": Number,
 *    "block_index": Number,
 *    "segment_index": Number,
 *    "analog_signal_index": Number,
 *    "channel_indexes": Array<Number>
 *  }
 *  
 * @returns 
 */
export function displayNeuroSpikeFileApi(data) {
  return request({
    url: "/api/displayNeuralSpike",
    method: "POST",
    data
  })

}


export function targetFilesApi() {
  return request({
    url: "/api/getFiles",
    method: "GET",
  })
}