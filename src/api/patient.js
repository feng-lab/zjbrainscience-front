import request from "@/utils/request";

/**
 * 新增队列患者表
 * @param { Object } data 
 * @returns 
 */
export function createCohortPatientApi (data) {
  return request({
    url: "/api/createCohortPatient",
    method: "POST",
    data
  })
}

/**
 * 获取病人信息列表
 * @param { Object } data 
 * @returns 
 */
export function getCohortPatientByPageApi (params) {
  return request({
    url: "/api/getCohortPatientByPage",
    method: "POST",
    params
  })
}

/**
 * 获取病人信息详情
 * @param { Object } data 
 * @returns 
 */
export function getCohortPatientInfoApi (params) {
  return request({
    url: "/api/getCohortPatientInfo",
    method: "POST",
    params
  })
}

/**
 * 更新病人信息
 * @param { Object } data 
 * @returns 
 */
export function updateCohortPatientApi (data) {
  return request({
    url: "/api/updateCohortPatient",
    method: "POST",
    data
  })
}

/**
 * 删除病人信息
 * @param { Number } id
 * @returns 
 */
export function deleteCohortPatientApi (id) {
  return request({
    url: "/api/deleteCohortPatient",
    method: "DELETE",
    data: {
      id
    }
  })
}

/**
 * 创建患者表单数据初诊部分----------------------------------------------------
 * @param { Object } data 
 * @returns 
 */
export function createPatientFormDataApi (data) {
  return request({
    url: "/api/createPatientFormData",
    method: "POST",
    data
  })
}

/**
 * 获取患者表单数据详情初诊部分
 * @param { Object } data 
 * @returns 
 */
export function getPatientFormDataInfoApi (params) {
  return request({
    url: "/api/getPatientFormDataInfo",
    method: "POST",
    params
  })
}

/**
 * 更新患者表单数据初诊部分
 * @param { Object } data 
 * @returns 
 */
export function updatePatientFormDataApi (data) {
  return request({
    url: "/api/updatePatientFormData",
    method: "POST",
    data
  })
}

/**
 * 获取数据集列表
 * @param { Object } data 
 * @returns 
 */
export function getPatientFormDataApi (params) {
  return request({
    url: "/api/getPatientFormData",
    method: "POST",
    params
  })
}

/**
 * 删除患者表单数据初诊部分
 * @param { Number } id
 * @returns 
 */
export function deletePatientFormDataApi (id) {
  return request({
    url: "/api/deletePatientFormData",
    method: "DELETE",
    data: {
      id
    }
  })
}

/**
 * 创建队列患者C治疗信息表-------------------------------
 * @param { Object } data 
 * @returns 
 */
export function createPatientCTherapyDetailApi (data) {
  return request({
    url: "/api/createPatientCTherapyDetail",
    method: "POST",
    data
  })
}

/**
 * 获取患者C治疗信息列表
 * @param { Object } data 
 * @returns 
 */
export function getPatientCTherapyDetailByPageApi (params) {
  return request({
    url: "/api/getPatientCTherapyDetailByPage",
    method: "POST",
    params
  })
}

/**
 * 获取患者C治疗信息
 * @param { Object } data 
 * @returns 
 */
export function getPatientCTherapyDetailInfoApi (data) {
  return request({
    url: "/api/getPatientCTherapyDetailInfo",
    method: "POST",
    data
  })
}

/**
 * 更新患者C治疗信息
 * @param { Object } data 
 * @returns 
 */
export function updatePatientCTherapyDetailApi (params, data) {
  return request({
    url: "/api/updatePatientCTherapyDetail",
    method: "POST",
    params,
    data,
  })
}

/**
 * 删除患者患者C治疗信息
 * @param { Number } id
 * @returns 
 */
export function deletePatientCTherapyDetailApi (id) {
  return request({
    url: "/api/deletePatientCTherapyDetail",
    method: "DELETE",
    data: {
      id
    }
  })
}

/**
 * 创建患者备注信息-----------------------------------------------------
 * @param { Object } data 
 * @returns 
 */
export function createPatientMemoApi (data) {
  return request({
    url: "/api/createPatientMemo",
    method: "POST",
    data
  })
}

/**
 * 获取患者备注列表
 * @param { Object } data 
 * @returns 
 */
export function getPatientMemoByPageApi (params) {
  return request({
    url: "/api/getPatientMemoByPage",
    method: "POST",
    params
  })
}

/**
 * 获取患者表单备注
 * @param { Object } data 
 * @returns 
 */
export function getPatientMemoInfoApi (data) {
  return request({
    url: "/api/getPatientMemoInfo",
    method: "POST",
    data
  })
}

/**
 * 更新患者表单备注
 * @param { Object } data 
 * @returns 
 */
export function updatePatientMemoApi (params, data) {
  return request({
    url: "/api/updatePatientMemo",
    method: "POST",
    params,
    data
  })
}

/**
 * 删除患者患者C治疗信息
 * @param { Number } id
 * @returns 
 */
export function deletePatientMemoApi (id) {
  return request({
    url: "/api/deletePatientMemo",
    method: "DELETE",
    data: {
      id
    }
  })
}

/**
 * 上传病人文件
 * @param { Object } data 
 * @returns 
 */
export function uploadCohortPatientFileApi (data) {
  return request({
    url: "/api/uploadCohortPatientFile",
    method: "POST",
    data
  })
}

/**
 * 下载病人文件
 * @param { Number }
 * @returns 
 */
export function downloadCohortPatientFileApi (params) {
  return request({
    url: "/api/downloadCohortPatientFile",
    method: "GET",
    responseType: 'blob',
    params
  })
}

/**
 * 获取病人文件列表
 * @param { Number } 
 * @returns 
 */
export function listCohortPatientFilesApi (params) {
  return request({
    url: "/api/listCohortPatientFiles",
    method: "GET",
    params
  })
}

/**
 * 删除病人文件
 * @param { Number } id
 * @returns 
 */
export function deleteCohortPatientFileApi (id) {
  return request({
    url: "/api/deleteCohortPatientFile",
    method: "DELETE",
    data: {
      id
    }
  })
}

/**
 * 获取省市信息
 * @param { Number } 
 * @returns 
 */
export function getProvinceCityApi (params) {
  return request({
    url: "/api/getProvinceCity",
    method: "GET",
    params
  })
}
