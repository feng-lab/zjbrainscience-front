import request from "@/utils/request";

export function createBehavioralDomain(data) {
  return request({
    url: "/api/createBehavioralDomain",
    method: "POST",
    data
  })
}

export function updateBehavioralDomain(data) {
  return request({
    url: "/api/updateAtlasBehavioralDomain",
    method: "POST",
    data
  })

}

export function getBehavioralDomainTrees(atlas_id) {
  return request({
    url: "/api/getAtlasBehavioralDomainTrees",
    method: "GET",
    params: {
      atlas_id
    }
  })
}

export function createRegionBehavioralDomain(data) {
  return request({
    url: "/api/createAtlasRegionBehavioralDomain",
    method: "POST",
    data
  })
}

export function getRegionBehavioralDomain(atlas_id, region_id) {
  return request({
    url: "/api/getAtlasRegionBehavioralDomains",
    method: "GET",
    params: {
      atlas_id,
      region_id
    }
  })
}