import request from "@/utils/request";

export function deviceApi({ experimentsid, offset, limit }) {
  return request({
    url: "/api/getDeviceByPage",
    method: "GET",
    params: {
      experimentsid,
      offset,
      limit
    }
  })
}

export function deviceDetailApi({ experimentsid, equipmentid }) {
  return request({
    url: "/api/getDeviceById",
    method: "GET",
    params: {
      experimentsid,
      equipmentid
    }
  })
}

export function newDeviceApi(data) {
  return request({
    url: "/api/addDevice",
    method: "POST",
    data
  })
}

export function updateDeviceApi(data) {
  return request({
    url: "/api/updateDevice",
    method: "POST",
    data
  })
}

export function deleteDeviceApi({ experimentsid, equipmentid }) {
  return request({
    url: "/api/deleteDevice",
    method: "DELETE",
    data: {
      experimentsid,
      equipmentid
    }
  })
}