import request from "@/utils/request"
/**
 * 新增实验范式
 * @param { Array } images - 图片ID列表
 * @param { String } description - 范式描述
 * @param { Number } experiment_id - 实验ID
 * @returns 
 */
export function newParadigmApi({images, description, experiment_id}) {
  return request({
    url: "/api/createParadigm",
    method: "POST",
    data: {
      images,
      description,
      experiment_id
    }
  })
}

/**
 * 
 * 分页获取实验相关的范式
 * @param { Number } experiment_id  - 实验ID 
 * @param { Number } offset         - 分页起始位置
 * @param { Number } limit          - 分页大小
 * @returns 
 */
export function paradigmsByExApi({ experiment_id, offset, limit }) {
  return request({
    url: "/api/getParadigmsByPage",
    method: "GET",
    params: {
      experiment_id,
      offset,
      limit
    }
  })
}

/**
 * 获取实验范式详情
 * @param { Number } paradigm_id - 实验范式ID
 * @returns 
 */
export function paradigmDetailApi(paradigm_id) {
  return request({
    url: "/api/getParadigmInfo",
    method: "GET",
    params: {
      paradigm_id
    }
  })
}

/**
 * 删除实验范式
 * @param {*} id 
 * @returns 
 */
export function deleteParadigmApi(id) {
  return request({
    url: "/api/deleteParadigm",
    method: "DELETE",
    data: {
      id
    }
  })
}