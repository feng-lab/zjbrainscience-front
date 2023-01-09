import request from "@/utils/request";

/**
 * 新增实验
 * @param { Object } data 
 * @returns 
 */
export function newExApi(data) {
  return request({
    url: "/api/createExperiment",
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
    url: "/api/updateExperiment",
    method: "POST",
    data
  })
}

/**
 * 删除实验
 * @param { Number } id - 实验ID
 * @returns 
 */
export function deleteExApi(id) {
  return request({
    url: "/api/deleteExperiment",
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
export function allExByPageApi(params) {
  return request({
    url: "/api/getExperimentsByPage",
    method: "GET",
    params
  })
}

/**
 * 获取实验详情
 * @param {*} experiment_id 
 * @returns 
 */
export function exDetailApi(experiment_id) {
  return request({
    url: "/api/getExperimentInfo",
    method: "GET",
    params: {
      experiment_id
    }
  })
}

/**
 * 添加实验助手
 * @param { Number } experiment_id - 实验ID
 * @param { Array<Number> } assistant_ids - 实验助手ID列表
 * @returns 
 */
export function addExAssistantApi({ experiment_id, assistant_ids }) {
  return request({
    url: "/api/addExperimentAssistants",
    method: "POST",
    data: {
      experiment_id,
      assistant_ids
    }
  })
}

/**
 * 删除实验助手
 * @param { Number } experiment_id - 实验ID
 * @param { Array<Number> } assistant_ids - 实验助手ID列表
 * @returns 
 */
export function deleteExAssistantApi({ experiment_id, assistant_ids }) {
  return request({
    url: "/api/deleteExperimentAssistants",
    method: "DELETE",
    data: {
      experiment_id,
      assistant_ids
    }
  })
}