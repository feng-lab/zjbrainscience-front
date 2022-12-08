export default [{
  /*
  url: "/api/login",
  method: "post",
  response: () => {
    return {
      "code|0-1": 0,
      message: "用户名或密码错误！"
    }
  }
}, {
  url: "/api/logout",
  method: "get",
  response: () => {
    return {
      code: 0,
      message: "登出错误"
    }
  }
}, {
  */
  url: "/api/getNotReadMsg",
  method: "POST",
  response: () => {
    return {
      code: 0,
      "data|0-10": [{
        "id|0-100": 0,
        status: 0,
        time: "@datetime('yyyy-MM-dd HH:mm:ss')",
        "taskid|5": /\d{3,8}\-/,
        taskname: "@string('lower', 5,10)",
        "taskstatus|1": ["0", "1"]
      }]
    }
  }
}, {
  url: "/api/getAllMsg",
  method: "GET",
  response: () => {
    return {
      code: 0,
      "data|20": [{
        "id|0-100": 0,
        "status|0-1": 0,
        time: "@datetime('yyyy-MM-dd HH:mm:ss')",
        "taskid|5": /\d{3,8}\-/,
        taskname: "@string('lower', 5,10)",
        "taskstatus|1": ["0", "1"]
      }]
    }
  }
}, {
  url: "/api/markMsg",
  method: "POST",
  response: () => {
    return {
      code: 0,
      "data|1": ["", "2,4"]
    }
  }
}, {
  url: "/api/getUnreadNotifyCount",
  method: "GET",
  response: () => {
    return {
      code: 0,
      "data|0-120": 0,
    }
  }
}, {
  url: "/api/getRecentUnreadNotifications",
  method: "GET",
  response: () => {
    return {
      code: 0,
      "data|10": [{
        "type|1": ["text", "task_step_status"],
        "creator": "@integer",
        "receiver": "@integer",
        "create_at": "2022-07-12 " + "@time('HH:mm:ss')",
        "status": "unread",
        "content": {"task_id": "@increment", "task_name": "task_" + "@string('lower', 3)", "task_status": "@integer(0,1)"},
        "id": "@integer",
        "gmt_create": "@date",
        "gmt_modified": "@date",
        "is_deleted": false
      }]
    }
  }
}, {
  url: "/api/getNotificationsByPage",
  method: "GET",
  response: () => {
    return {
      code: 0,
      data: {
        "total|0-300": 0,
        "items|10": [{
          "type|1": ["text", "task_step_status"],
          "creator": "@integer(0, 30)",
          "receiver": "@integer",
          "create_at": "2022-07-12 " + "@time('HH:mm:ss')",
          "status|1": ["unread", "read"],
          "content": {"task_id": "@increment", "task_name": "task_" + "@string('lower', 3)", "task_status": "@integer(0,1)"},
          "id": "@integer(0, 50)",
          "gmt_create": "@date",
          "gmt_modified": "@date",
          "is_deleted": false
        }]
      }
    }
  }
}] 