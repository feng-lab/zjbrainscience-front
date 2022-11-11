export default [{
  url: "/api/getHumanSubjectByPage",
  method: "GET",
  response: () => {
    return {
      code: 1,
      data: {
        "total|0-100": 1,
        "list|10": [{
          subjectid: "@increment()",
          "gender|1": ["女", "男"],
          birthdate: "@datetime('yyyy-MM-dd HH:mm:ss')", //日期返回格式YYYY-MM-DD HH:mm:SS
          "education|1": ["小学", "初中", "高中", "本科", "硕士", "博士"],
          "occupation|1": ["学生", "工人", "教师", "工程师"],
          "marriagestatus|1": ["否", "是"], 
          "abobloodtype|1": ["A", "B", "AB", "O", "其他"], 
          "left_handflag|1": ["否", "是"], 
          deathdate: "@datetime('yyyy-MM-dd HH:mm:ss')",
          cellphonenumber: "1" + "@string('number', 10)", 
          email: "@email()",
          address: "@county(true)"
        }]  
      }
    }
  }
}, {
  url: "/api/getHumanSubjectByID",
  method: "GET",
  response: ({ query }) => {
    const { subjectid } = query;
    return {
      code: 1,
      data: {
          subjectid,
          "gender|1": ["女", "男"],
          birthdate: "@datetime('yyyy-MM-dd HH:mm:ss')", //日期返回格式YYYY-MM-DD HH:mm:SS
          "education|1": ["小学", "初中", "高中", "本科", "硕士", "博士"],
          "occupation|1": ["学生", "工人", "教师", "工程师"],
          "marriagestatus|1": ["否", "是"], 
          "abobloodtype|1": ["A", "B", "AB", "O", "其他"], 
          "left_handflag|1": ["否", "是"], 
          deathdate: "@datetime('yyyy-MM-dd HH:mm:ss')",
          cellphonenumber: "1" + "@string('number', 10)", 
          email: "@email()",
          address: "@county(true)"
      }
    }
  }
}, {
  url: "/api/addHumanSubject",
  method: "POST",
  response: () => {
    return {
      code: 1,
      message: "新增人类被试成功"
    }
  }
}, {
  url: "/api/updateHumanSubject",
  method: "POST",
  response: () => {
    return {
      code: 1,
      message: "更新人类被试成功"
    }
  }
}, {
  url: "/api/deleteHumanSubject",
  method: "Delete",
  response: () => {
    return {
      code: 1,
      message: "删除人类被试成功"
    }
  }
}]