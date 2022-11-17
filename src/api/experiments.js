import request from "@/utils/request";

export function newExApi(data) {
  return request({
    url: "/api/addExperiments",
    method: "POST",
    data
  })
}

export function deleteExApi(experimentsid) {
  return request({
    url: "/api/deleteExperiments",
    method: "DELETE",
    data: {
      experimentsid
    }
  })
}

export function allExByPageApi(params) {
  return request({
    url: "/api/getExperimentsByPage",
    method: "GET",
    params
  })
}

export function exDetailApi(experimentsid) {
  return request({
    url: "/api/getExperimentsById",
    method: "GET",
    params: {
      experimentsid
    }
  })
}

export function newParadigmApi(imgUrl, desc, experimentsid) {
  return request({
    url: "/api/addParadigms",
    method: "POST",
    data: {
      imgUrl,
      desc,
      experimentsid
    }
  })
}

export function paradigmsByExApi(experimentsid) {
  return request({
    url: "/api/getParadigms",
    method: "GET",
    params: {
      experimentsid
    }
  })
}

export function paradigmDetailApi(experimentsid, id) {
  return request({
    url: "/api/getParadigmById",
    method: "GET",
    params: {
      experimentsid,
      id
    }
  })
}

export function deleteParadigmApi(experimentsid, id) {
  return request({
    url: "/api/deleteParadigms",
    method: "DELETE",
    params: {
      experimentsid,
      id
    }
  })
}
