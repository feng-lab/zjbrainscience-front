import request from "@/utils/request";

/**
 * 新建设备
 * @param {Object} data - {experiment_id, brand, name, purpose} 
 * @returns 
 */
export function newDeviceApi(data) {
  return request({
    url: "/api/createDevice",
    method: "POST",
    data
  })
}

/**
 * 分页获取设备列表
 * @param {Object} params - 查询参数 {experiment_id, offset, limit}
 * @returns 
 */
export function devicesApi(params) {
  return request({
    url: "/api/getDevicesByPage",
    method: "GET",
    params
  })
}

/**
 * 获取设备详情
 * @param {Number} device_id - 设备ID
 * @returns 
 */
export function deviceDetailApi(device_id) {
  return request({
    url: "/api/getDeviceInfo",
    method: "GET",
    params: {
      device_id
    }
  })
}


/**
 * 更新设备信息
 * @param {Object} data - 设备参数{id, experiment_id, brand, name, purpose, index}
 * @returns 
 */
export function updateDeviceApi(data) {
  return request({
    url: "/api/updateDevice",
    method: "POST",
    data
  })
}

/**
 * 删除设备
 * @param {Number} id - 设备ID 
 * @returns 
 */
export function deleteDeviceApi(id) {
  return request({
    url: "/api/deleteDevice",
    method: "DELETE",
    data: {
      id
    }
  })
}


/**
 * 接触设备与实验的关联
 * @param {*} ids 
 * @param {Number} experiment_id 
 */
export function disassociateDeviceApi(ids, experiment_id) {
  //TODO
}

/**
 * 关联设备到实验
 * @param {*} ids 
 * @param {Number} experiment_id - 实验ID
 */
export function associateDeviceApi(ids, experiment_id) {
  //TODO
}