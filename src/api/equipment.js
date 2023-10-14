import request from "@/utils/request";

/**
 * 新建设备
 * @param {Object} data - { brand, name, purpose} 
 * @returns 
 */
export function newEquipmentApi(data) {
  return request({
    url: "/api/createDevice",
    method: "POST",
    data
  })
}

/**
 * 分页获取设备列表
 * @param {Object} params - 查询参数 {experiment_id, offset, limit, brand, name}
 * @returns 
 */
export function equipmentsApi(params) {
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
export function equipmentDetailApi(device_id) {
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
export function updateEquipmentApi(data) {
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
export function deleteEquipmentApi({ ids: device_ids }) {
  return request({
    url: "/api/deleteDevices",
    method: "DELETE",
    data: {
      device_ids
    }
  })
}


/**
 * 解除设备与实验的关联
 * @param {*} ids 
 * @param {Number} experiment_id 
 */
export function disassociateEquipmentApi({ ids: device_ids, experiment_id }) {
  return request({
    url: "/api/deleteDevicesFromExperiment",
    method: "DELETE",
    data: {
      device_ids,
      experiment_id
    }
  })
}

/**
 * 关联设备到实验
 * @param {*} ids 
 * @param {Number} experiment_id - 实验ID
 */
export function associateEquipmentApi({ ids: device_ids, experiment_id }) {
  return request({
    url: "/api/addDevicesInExperiment",
    method: "POST",
    data: {
      device_ids,
      experiment_id
    }
  })
}