import request from "@/utils/request";

/**
 * 新增实验
 * @param { Object } data 
 * @returns 
 */
export function newExApi(data) {
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
export function updateExApi(data) {
  return request({
    url: "/api/updateDataset",
    method: "POST",
    data
  })
}

/**
 * 删除实验
 * @param { Number } dataset_id - 实验ID
 * @returns 
 */
export function deleteExApi(dataset_id) {
  return request({
    url: "/api/deleteDataset",
    method: "DELETE",
    data: {
      dataset_id
    }
  })
}

/**
 * 分页获取实验列表
 * @param { Object } params 
 * @returns 
 */
export function allExByPageApi(params) {
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
export function exDetailApi(dataset_id) {
  return request({
    url: "/api/getDatasetInfo",
    method: "POST",
    params: {
      dataset_id
    }
  })
}