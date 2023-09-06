import request from "@/utils/request";

export function createParadigmClass(data) {
  return request({
    url: "/api/createParadigmClass",
    method: "POST",
    data
  })
}

export function getParadigmClassTrees(atlas_id) {
  return request({
    url: "/api/getParadigmClassTrees",
    method: "GET",
    params: {
      atlas_id
    }
  })
}

export function createRegionParadigmClass(data) {
  return request({
    url: "/api/createAtlasRegionParadigmClass",
    method: "POST",
    data
  })
}

export function getRegionParadigmClass(atlas_id, region_id) {
  return request({
    url: "/api/getAtlasRegionParadigmClasses",
    method: "GET",
    params: {
      atlas_id,
      region_id
    }
  })

}

