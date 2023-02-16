import request from "@/utils/request";

/**
 * 获取实验的所有助手
 * @param { Number } experiment_id - 实验ID
 * @returns 
 */
export function getAssistantsApi(experiment_id) {
  return request({
    url: "/api/getExperimentAssistants",
    method: "GET",
    params: {
      experiment_id
    }
  })
}

/**
 * 新增实验助手
 * @param { Number } experiment_id        - 实验ID
 * @param { Array<Number> } assistant_ids - 助手ID列表
 * @returns 
 */
export function newAssistantsApi({ experiment_id, assistant_ids }) {
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
 * @param { Number } experiment_id        - 实验ID
 * @param { Array<Number> } assistant_ids - 助手ID列表
 * @returns 
 */
export function deleteAssistantsApi({ experiment_id, ids: assistant_ids }) {
  return request({
    url: "/api/deleteExperimentAssistants",
    method: "DELETE",
    data: {
      experiment_id,
      assistant_ids
    }
  })
}