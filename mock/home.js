import { Random } from "mockjs"
import moment from "moment";

export default [{
  url: "/api/getStatistic",
  method: "get",
  response: () => {
    return {
      code: 0,
      data: {
        "experiments|0-200": 7, //实验数量
        "files|0-300": 8,         //文件数量
        "human|0-20": 7,      //被试数量
        "taskmaster|0-200": 8   //任务数量
      },
      message: "something wrong！"
    }
  }
}, {
  url: "/api/getStatisticWithDataType",
  method: "get",
  response: () => {
    return {
      code: 0,
      data: [{
        name: "EEG",
        "value|0-100": 100
      }, {
        name: "Spike",
        "value|0-200": 50
      }, {
        name: "EOG",
        "value|0-150": 100
      }, {
        name: "iEEG",
        "value|0-50": 47
      }, {
        name: "MP4",
        "value|0-50": 30
      }],
      message: "something wrong！"
    }
  }
}, {
  url: "/api/getStatisticWithSubject",
  method: "get",
  response: () => {
    return {
      code: 0,
      data: [{ 
        type: "男性",
        "30岁以下|1-5": 5,
        "30岁到60岁之间|1-8": 5,
        "60岁以上|3-7":3
      },{
        type: "女性",
        "30岁以下|3-10": 9,
        "30岁到60岁之间|3-10": 5,
        "60岁以上|5-12":7
      }],
      message: "something wrong！"
    }
  }
}, {
  url: "/api/getStatisticWithServer",
  method: "get",
  response: () => {
    return {
      code: 0,
      "data|0-99.2": 60,
    }
  }
}, {
  url: "/api/getStatisticWithData",
  method: "get",
  response: ({ query }) => {
    const { start, end } = query;
    const days = (new Date(end) - new Date(start)) /(3600 * 1000 * 24);
    console.log('days', days)
    return {
      code: 0,
      "data": function () {
        const res = new Array(days);
        for(let i=0;i<days;i++) {
          res[i] = [moment(start, "YYYY-MM-DD").add(i, "days").valueOf(), Random.float(0.1, 100, 2, 2)]
        }
        return res;
      }
    }
  }
}, {
  url: "/api/getStatisticWithSick",
  method: "get",
  response: ({query}) => {
    return {
      code: 0,
      "data":[
        { sick: "癫痫", "单位1|0-29": 107, "单位2|0-30": 133, "单位3|0-40": 93},
        { sick: "睡眠障碍", "单位1|0-29": 107, "单位2|0-30": 133, "单位3|0-40": 93},
        { sick: "老年痴呆", "单位1|0-29": 107, "单位2|0-30": 133, "单位3|0-40": 93},
        { sick: "中风", "单位1|0-29": 107, "单位2|0-30": 133, "单位3|0-40": 93},
        { sick: "其他", "单位1|0-29": 107, "单位2|0-30": 133, "单位3|0-40": 93},
      ],
    }
  }
}]