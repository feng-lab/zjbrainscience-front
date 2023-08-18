import request from "@/utils/request";

/**
 * 新建脑图谱数据集
 * @param { Object } data 
 * @returns 
 */
export function createAtlas(data) {
  return request({
    url: "/api/createAtlas",
    method: "POST",
    data
  })
}

/**
 * 分页获取脑图谱数据集
 * @param { Object } params 
 */

export function getAtlasByPage(params) {
  return request({
    url: "/api/getAtlasesByPage",
    method: "GET",
    params
  })
}