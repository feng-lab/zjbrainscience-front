import request from "@/utils/request";

export function docTypeApi() {
  return request({
    url: "/api/getDocType",
    method: "GET"
  })
}

export function docByPageApi(experimentsid, docType, offset, limit) {
  return request({
    url: "/api/getDocByPage",
    method: "GET",
    params: {
      experimentsid,
      docType,
      offset,
      limit
    }
  })
}

export function deleteDocApi(experimentsid, fileid) {
  return request({
    url: "/api/deleteDoc",
    method: "DELETE",
    data: {
      experimentsid,
      fileid
    }
  })
}


export function targetFilesApi() {
  return request({
    url: "/api/getFiles",
    method: "GET",
  })
}