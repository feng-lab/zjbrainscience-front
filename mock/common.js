export default [{
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
      code: 1,
      message: "登出错误"
    }
  }
}, {
  url: "/api/getNotReadMsg",
  method: "POST",
  response: () => {
    return {
      code: 1,
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
      code: 1,
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
      code: 1,
      "data|1": ["", "2,4"]
    }
  }
}] 