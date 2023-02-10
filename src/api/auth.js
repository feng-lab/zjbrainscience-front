import request from "@/utils/request";

/**
 * 用户登陆
 * @param {Object} data - 用户名、密码
 * @returns 
 */
export function loginApi(data) {
  return request({
    url: "/api/login",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: {
      grant_type: "password",
      ...data
    }
  });
}

/**
 * 用户登出
 * @returns 
 */
export function logoutApi() {
  return request({
    url: "/api/logout",
    method: "POST",
  });
}
