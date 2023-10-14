import request from "@/utils/request";

/**
 * 发送消息通知 
 * @param {String} type - 通知类型 
 * @param {Number} receiver - 通知接收者ID
 * @param {String} content - 通知内容
 * @param {String} create_at - 通知发送时间
 * @returns 
 */
export function sendNotifyApi({type, receiver, content, create_at}) {
  return request({
    url: "/api/sendNotification",
    method: "POST",
    data: {
      type,
      receiver,
      content,
      create_at
    }
  })
}

/**
 * 获取未读通知总数
 * @returns 
 */
export function unReadNotifyCountApi() {
  return request({
    url: "/api/getUnreadNotificationCount",
    method: "GET"
  })
}

/**
 * 获取未读通知
 * @param {Number} count - 获取消息数量上限
 * @returns 
 */
export function unReadNotifyListApi(count) {
  return request({
    url: "/api/getRecentUnreadNotifications",
    method: "GET",
    params: {
      count
    }
  })
}

/**
 * 分页获取通知
 * @param {Number} offset - 偏移
 * @param {Number} limit - 每页大小
 * @returns 
 */
export function notifyByPageApi(data) {
  return request({
    url: "/api/getNotificationsByPage",
    method: "GET",
    params: data
  })
}

/**
 * 标记通知已读 
 * @param {Boolean} is_all - 是否标记所有未读通知为已读
 * @param {Array} notification_ids - 需要标记的通知ID列表
 * @returns 
 */
export function markToRead({is_all=false, notification_ids=[]}) {
  return request({
    url: "/api/markNotificationsAsRead",
    method: "POST",
    data: {
      is_all,
      notification_ids
    }
  })

}