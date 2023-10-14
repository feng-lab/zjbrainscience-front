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


export function getAtlasInfo(atlas_id) {
  return request({
    url: "/api/getAtlasInfo",
    method: "GET",
    params: {
      atlas_id
    }
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

export function createAtlasRegion(data) {
  return request({
    url: "/api/createAtlasRegion",
    method: "POST",
    data
  })
}

export function deleteAtlasRegion(id) {
  return request({
    url: "/api/deleteAtlasRegion",
    method: "DELETE",
    data: {
      id
    }
  })
}

export function updateAtlasRegion(data) {
  return request({
    url: "/api/updateAtlasRegion",
    method: "POST",
    data
  })
}

export function getAtlasRegionInfo(atlas_id, region_id, id) {
  return request({
    url: "/api/getAtlasRegionInfo",
    method: "GET",
    params: {
      id,
      atlas_id,
      region_id
    }
  })
}

export function getAtlasRegionTrees(atlas_id) {
  return request({
    url: "/api/getAtlasRegionTrees",
    method: "GET",
    params: {
      atlas_id
    }
  })
}

export function createAtlasRegionLink(data) {
  return request({
    url: "/api/createAtlasRegionLink",
    method: "POST",
    data
  })
}

export function getAtlasRegionLinkInfo(atlas_id, link_id, id) {
  return request({
    url: "/api/getAtlasRegionLinkInfo",
    method: "GET",
    params: {
      id,
      atlas_id,
      link_id
    }
  })
}

export function deleteAtlasRegionLink(id) {
  return request({
    url: "/api/deleteAtlasRegionLink",
    method: "DELETE",
    data: {
      id
    }
  })
}
