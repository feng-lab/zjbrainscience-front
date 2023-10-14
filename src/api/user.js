import request from "@/utils/request";
import { Vue } from "vue-demi";

/**
 * 创建用户
 * @param {String} username     - 用户名 
 * @param {String} password     - 用户密码
 * @param {String} staff_id     - 员工号 
 * @param {String} access_level - 用户等级
 * @returns 
 */
export function newUserApi({ username, password, staff_id, access_level, account_type }) {
  return request({
    url: "/api/createUser",
    method: "POST",
    data: {
      username,
      password,
      staff_id,
      access_level,
      account_type
    }
  })
}

/**
 *  获取当前用户信息 
 */
export function currentUserApi() {
  return request({
    url: "/api/getCurrentUserInfo",
    method: "GET",
  })
}

/**
 * 根据用户ID返回用户信息
 * @param {Number} id - 用户ID
 * @returns 
 */
export function userInfoApi(id) {
  return request({
    url: "/api/getUserInfo",
    method: "GET",
    params: { id }
  })
}

/**
 * 获取用户信息列表
 */
export function getUserApi(params) {
  return request({
    url: "/api/getUsersByPage",
    method: "GET",
    params
  })

}

/**
 * 删除指定用户
 * @param {Number} id - 用户ID
 * @returns 
 */
export function deleteUserApi(id) {
  return request({
    url: "/api/deleteUser",
    method: "DELETE",
    data: {
      id 
    }
  })
}

/**
 * 修改用户权限
 * @param {Number} id - 用户ID 
 * @param {Number} access_level - 用户目标权限
 * @returns 
 */
export function updateUserRoleApi({ id, access_level }) {
  return request({
    url: "/api/updateUserAccessLevel",
    method: "POST",
    data: {
      id,
      access_level
    }
  })
}

/**
 * 修改用户密码
 * @param {String} old_password - 旧密码
 * @param {String} new_password - 新密码
 * @returns 
 */
export function updatePasswordApi({ old_password, new_password }) {
  return request({
    url: "/api/updatePassword",
    method: "POST",
    data: {
      old_password,
      new_password
    }
  })
}
