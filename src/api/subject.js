import request from "@/utils/request";

/**
 * 分页获取人类被试列表
 * @param {Object} params - { experiment_id, gender, abo_blood_type, marital_status, is_left_handed, limit, offset }
 * @returns 
 */
export function humanSubjectApi(params) {
  return request({
    url: "/api/getHumanSubjectsByPage",
    method: "GET",
    params 
  })
}

/**
 * 新建人类被试
 * @param {*} data 
 * @returns 
 */
export function newHumanSubjectApi(data) {
  return request({
    url: "/api/createHumanSubject",
    method: "POST",
    data
  })
}

/**
 * 获取人类被试详情
 * @param {*} param0 
 * @returns 
 */
export function humanSubjectDetailApi(user_id) {
  return request({
    url: "/api/getHumanSubjectInfo",
    method: "GET",
    params: { user_id }
  })
}


/**
 * 更新人类被试
 * @param {*} data 
 * @returns 
 */
export function updateHumanSubjectApi(data) {
  return request({
    url: "/api/updateHumanSubject",
    method: "POST",
    data
  })
}

/**
 * 删除人类被试
 * @param {*} experimentsid 
 * @param {*} subjectid 
 * @returns 
 */
export function deleteHumanSubjectApi({ ids: user_ids }) {
  return request({
    url: "/api/deleteHumanSubjects",
    method: "DELETE",
    data: {
      user_ids
    }
  })
}


/**
 * 解除被试与实验之间的关联
 * @param { Array } user_ids   - subject 用户ID列表
 * @param { Number } experiment_id  - 实验ID
 */
export function disassociateSubjectApi({ids: user_ids, experiment_id}) {
  return request({
    url: "/api/deleteHumanSubjectsFromExperiment",
    method: "DELETE",
    data: {
      experiment_id,
      user_ids
    }
  })
}

/**
 * 关联被试到应用
 * @param { Array } user_ids   - subject 用户ID列表
 * @param { Number } experiment_id  - 实验ID
 */
export function associateSubjectApi({ids, experiment_id}) {
  return request({
    url: "/api/addHumanSubjectsInExperiment",
    method: "POST",
    data: {
      experiment_id,
      user_ids: ids
    }
  })
}