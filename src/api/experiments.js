import request from "@/utils/request";

export function newExApi(data) {
  return request({
    url: "/api/createExperiment",
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

export function exDetailApi(experiment_id) {
  return request({
    url: "/api/getExperimentInfo",
    method: "GET",
    params: {
      experiment_id
    }
  })
}
