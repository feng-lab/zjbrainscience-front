import request from "@/utils/request";

export function newExApi(data) {
  return request({
    url: "/api/addExperiments",
    method: "POST",
    data
  })
}

export function allExByPageApi(params) {
  return request({
    url: "/api/getExperimentsByPage",
    method: "GET",
    params
  })
}

export function exByIdApi(experimentsid) {
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

export function paradigmByIdApi(experimentsid, id) {
  return request({
    url: "/api/getParadigmById",
    method: "GET",
    params: {
      experimentsid,
      id
    }
  })
}

export function delParadigmApi(experimentsid, id) {
  return request({
    url: "/api/deleteParadigms",
    method: "DELETE",
    params: {
      experimentsid,
      id
    }
  })
}
