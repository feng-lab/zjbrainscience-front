export default [{
  url: "/api/getDeviceByPage",
  method: "GET",
  response: ({query}) => {
    const { experimentsid } = query;
    return {
      code: 1,
      data: {
        "total|0-100": 2,
        "list|10": [{
          experimentsid,
          "brand|1":["笔记本", "扫描仪", "滤波器"],
          name: "@string('lower', 3, 8)", 
          "purpose|1": ["学习", "娱乐", "研究", "分析"],
          equipmentid: "@increment()",
          index: "@increment()", 
        }]
      }
    }
  }
}, {
  url: "/api/getDeviceById",
  method: "GET",
  response: ({ query })=> {
    const {experimentsid, equipmentid} = query;
    return {
      code: 1,
      data: {
          experimentsid,
          "brand|1":["笔记本", "扫描仪", "滤波器"],
          name: "@string('lower', 3, 8)", 
          "purpose|1": ["学习", "娱乐", "研究", "分析"],
          equipmentid,
          index: "@increment()", 

      }
    }
  }
}, {
  url: "/api/addDevice",
  method: "POST",
  response: ()=> {
    return {
      code: 1,
      message: "新增设备成功"
    }
  }
}, {
  url: "/api/updateDevice",
  method: "POST",
  response: ()=> {
    return {
      code: 1,
      message: "更新设备成功"
    }
  }
}, {
  url: "/api/deleteDevice",
  method: "DELETE",
  response: ()=> {
    return {
      code: 1,
      message: "删除设备成功"
    }
  }
}]