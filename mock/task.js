import { Random } from "mockjs"
import moment from "moment";
export default [{
  url: "/api/getTaskByPage",
  method: "GET",
  response: () => {
    return {
      code: 1,
      "data|10-30": [{
        experimentsid: "", 
        taskname: "task" + "@string('lower', 3)", 
        "tasktype|1": ["预处理", "数据分析", "预处理/数据分析"], 
        "taskid|5": /\d{3,8}\-/,
        description:"this task description " + "@string('lower', 5)" , 
        starttime: "2022-01-" + "@datetime('dd HH:mm:ss')",
        endtime: "2022-08-" + "@datetime('dd HH:mm:ss')",
        "status|1": ["0", "1", "2"],
        creator:"", 
        staffid:"", 
        id: "@increment()"
      }]
    }
  }
}, {
  url: "/api/addTask",
  method: "POST",
  response: () => {
    return {
      code: 1,
      message: "新增任务成功"
    }
  }
}, {
  url: "/api/deleteTask",
  method: "DELETE",
  response: () => {
    return {
      code: 1,
      message: "删除任务成功"
    }
  }
}, {
  url: "/api/getTaskByID",
  method: "GET",
  response: ({query}) => {
    const { taskid } = query
    return {
      code: 1,
      data: {
        master: {
          experimentsid: "", 
          taskname: "task" + "@string('lower', 3)", 
          "tasktype|1": ["预处理", "数据分析", "预处理/数据分析"],
          taskid,
          description:"this task description " + "@string('lower', 5)" , 
          starttime: "2022-01-" + "@datetime('dd HH:mm:ss')",
          endtime: "2022-08-" + "@datetime('dd HH:mm:ss')",
          "status|1": ["0", "1", "2"],
          creator:"", 
          staffid:"", 
          id: "@increment()",
          filename: ["data0.bdf", "data1.bdf", "data2.bdf"],
          size: 8
        },
        "stepList|2-3": [{
          taskid,
        	"operationid": "@increment()",
        	"operationname|1": ["低通滤波", "高通滤波", "带通滤波", "带阻滤波"],
        	"operationtype": "预处理",
        	"parameters": "111",
        	executeindex: "@increment()",
        	"status|1": ["0", "1", "2"],
        	"starttime": "2022-06-30 14:44:01",
        	"endtime": null,
        	"statusdescriptions": "",
        	"id": null
        }, {
          taskid,
        	"operationid": "@increment()",
        	"operationname|1": ["Basic plot", "PSD", "Topomap", "Time-frequency"],
        	"operationtype": "数据分析",
        	"parameters": "111",
        	executeindex: "@increment()",
        	"status|1": ["0", "1", "2"],
        	"starttime": "2022-06-30 14:44:01",
        	"endtime": null,
        	"statusdescriptions": "",
        	"id": null
        }]
      }
    }
  }
}, {
  url: "/api/getTaskStepsByID",
  method: "GET",
  response: ({ query }) => {
    const { taskid } = query;
    return {
      code: 1,
      "data|2-5": [{
        taskid,
        "operationid": "@increment()",
        "operationname|+1": ["低通滤波", "高通滤波", "数据分析"],
        "operationtype|+1": ["预处理", "预处理", "数据分析"],
        "parameters": "@string('number', 3)",
        "executeindex": "@increment()",
        "status|1": ["0", "1", "2" ],
        starttime: "2022-01-" + "@datetime('dd HH:mm:ss')",
        endtime: "2022-08-" + "@datetime('dd HH:mm:ss')",
        "statusdescriptions": "",
        "id": "@increment()"
      }]
    }
  }
}, {
  url: "/api/getFilterStepResultByID",
  method: "GET",
  response: () => {
    return {
      code: 1,
      data: function() {
        let res = [];
        let now = new Date();
        for(let i=0; i< 200;i++) {
          res[i] = [moment(now, "YYYY-MM-DD").add(i, "days").valueOf(), Random.float(0.1, 100, 2, 2)]
        }
        return res;
      }
    }
  }
}, {
  url: "/api/getAnalysisStepResultByID",
  method: "GET", 
  response: () => {
    return {
      code: 1,
      data: "/testdata/1.png"
    }
  }
}]