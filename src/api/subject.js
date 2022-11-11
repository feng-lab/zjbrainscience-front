import request from "@/utils/request";

export function humanSubjectApi({ experimentsid, offset, limit }) {
  return request({
    url: "/api/getHumanSubjectByPage",
    method: "GET",
    params: {
      experimentsid,
      offset,
      limit
    }
  })
}

export function newHumanSubjectApi(data) {
  return request({
    url: "/api/addHumanSubject",
    method: "POST",
    data
  })
}

export function humanSubjectDetailApi({ experimentsid, subjectid }) {
  return request({
    url: "/api/getHumanSubjectByID",
    method: "GET",
    params: {
      experimentsid,
      subjectid
    }
  })
}


export function updateHumanSubjectApi(data) {
  return request({
    url: "/api/updateHumanSubject",
    method: "POST",
    data
  })
}

export function delHumanSubjectApi(experimentsid, subjectid) {
  return request({
    url: "/api/deleteHumanSubject",
    method: "DELETE",
    data: {
      experimentsid,
      subjectid
    }
  })
}