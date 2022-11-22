import request from "@/utils/request";

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

export function logoutApi() {
  return request({
    url: "/api/logout",
    method: "POST",
  });
}

export function unReadMsgApi(account) {
  return request({
    url: "/api/getNotReadMsg",
    method: "POST",
    params: {
      account
    }
  })
}

export function allMsgApi(account, offset, limit) {
  return request({
    url: "/api/getAllMsg",
    method: "GET",
    params: {
      account,
      offset,
      limit
    }
  })
}

export function markMsgApi(account, ids) {
  return request({
    url: "/api/markMsg",
    method: "POST",
    data: {
      account,
      ids
    }
  })
}