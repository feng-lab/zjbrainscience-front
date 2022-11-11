import request from "@/utils/request";

export function targetFilesApi() {
  return request({
    url: "/api/getFiles",
    method: "GET",
  })
}

export function taskByPageApi(params) {
  return request({
    url: "/api/getTaskByPage",
    method: "GET",
    params
  })
}

export function newTaskApi(data) {
  return request({
    url: "/api/addTask",
    method: "POST",
    data
  })
}

export function delTask(taskid) {
  return request({
    url: "/api/deleteTask",
    method: "DELETE",
    data: {
      taskid
    }
  })
}

export function taskDetailApi(taskid) {
  return request({
    url: "/api/getTaskByID",
    method: "GET",
    params: {
      taskid
    }
  })
}

export function taskStepsApi(taskid) {
  return request({
    url: "/api/getTaskStepsByID",
    method: "GET",
    params: {
      taskid
    }
  })
}

export function filterResultApi({ taskid, operationid}) {
  return request({
    url: "/api/getFilterStepResultByID",
    method: "GET",
    params: {
      taskid,
      operationid
    }
  })
}

export function analysisResultApi({ taskid, operationid }) {
  return request({
    url: "/api/getAnalysisStepResultByID",
    method: "GET",
    params: {
      taskid,
      operationid
    }
  })
}
