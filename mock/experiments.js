export default [{
  url: "/api/addExperiments",
  method: "post",
  response: () => {
    return {
      code: 0,
      data: /ATPX\d{4}/, 
      message: ""
    }
  }
}, {
  url: "/api/deleteExperiments",
  method: "DELETE",
  response: () => {
    return {
      code: 0,
      message: ""
    }
  }
}, {
  url: "/api/getExperimentsByPage",
  method: "get",
  response: ({query}) => {
    const { search } = query;
    return {
      code: 0,
      "data|5-10": [{
        "experimentsid": /ATPX\d{4}/, 
        "projectid|0-100": 0, 
        "experimentstype|1": ["MI", "SSVEP", "NeuronSpike", "P300", "Others"], 
        "experimentalparadigm": "", 
        "noninvasiveflag|1": ["0", "1"], 
        "startdate": "2022-01-" + "@datetime('dd HH:mm:ss')", 
        "enddate": "2022-09-" + "@datetime('dd HH:mm:ss')", 
        "durationdays": null, 
        "numberofsubjects|0-500": 1, 
        "subjectstype": "@pick(['人类', '猕猴', '猪', '犬', '其他'])",
        "neuronsource":null, 
        "stimulationtype":null, 
        "location":"浙江省杭州市余杭区之江实验室" + "@integer(1,8)" + "号楼",
        "mainoperator": "GXY", 
        //"description": "这里是实验描述 " + "@string('lower', 20, 30)",
        "description": "description the experiment " ,
        "mainoperatorid": "1",
        "assistant1": null, 
        "assistant1id":null,
        "assistant2": null,
        "assistant2id": null, 
        "assistant3": null, 
        "assistant3id": null, 
        "numberofsessions|1-10": 5, 
        "numberoftrails|1-100":58, 
        "datapath": /\/data\/ATPX\d{4}/, 
        "shared|1":["1", "0"],
        "experimenttitle":"@string('lower', 2, 4)" + search + "@string('lower', 1, 3)" 
      }]
    }
  }
}, {
  url: "/api/getExperimentsById",
  method: "GET",
  response: ({query}) => {
    const { experimentsid } = query;
    return {
      code: 0,
      data: {
        "experimentsid": experimentsid,
        "projectid|0-100": 0, 
        "experimentstype|1": ["MI", "SSVEP", "NeuronSpike", "P300", "Others"], 
        "experimentalparadigm": "", 
        "noninvasiveflag|1": ["0", "1"], 
        "startdate": "2022-01-" + "@datetime('dd HH:mm:ss')", 
        "enddate": "2022-09-" + "@datetime('dd HH:mm:ss')", 
        //"description": experimentsid + "\'s description" + "@string('lower', 5,8)",
        "description": "This is a experiment!",
        "durationdays": null, 
        "numberofsubjects|0-500": 1, 
        "subjectstype": "@pick(['Human', 'Macaque', 'Puppy', 'Swine', 'Other'])",
        "neuronsource":null, 
        "stimulationtype":null, 
        "location": "Zhe Jiang Lab ", 
        "mainoperator": "GXY", 
        "mainoperatorid": "1",
        "assistant1": null, 
        "assistant1id":null,
        "assistant2": null,
        "assistant2id": null, 
        "assistant3": null, 
        "assistant3id": null, 
        "numberofsessions|1-10": 5, 
        "numberoftrails|1-100":58, 
        "datapath": "/data/" + experimentsid,
        "shared|1":["1", "0"],
        //"experimenttitle": experimentsid + "的实验标题" + "@string('lower', 5,8)", 
        "experimenttitle": "Experiment " + experimentsid
        
      }
    }
  }
}, {
  url: "/api/addParadigms",
  method: "POST",
  response: () => {
    return {
      code: 0,
      message: "添加成功"
    }
  }
}, {
  url: "/api/getParadigms",
  method: "GET",
  response: () => {
    return {
      code: 0,
      "data|0-3": [{
        id: "@increment()",
        "imgUrl|1-3": ["/testdata/" + "@integer(1,3)" + ".png"],
        desc: "paradigms description " + "@string('number', 3)"
      }] 
    }
  }
}, {
  url: "/api/getParadigmById",
  method: "GET",
  response: () => {
    return {
      code: 0,
      data: {
        id: "@increment()",
        "imgUrl|1-3": ["/testdata/" + "@integer(1,3)" + ".png"],
        desc: "paradigms description " + "@string('number', 3)"
      } 
    }
  }
}, {
  url: "/api/deleteParadigms",
  method: "DELETE",
  response: () => {
    return {
      code: 0,
      message: "删除成功"
    }
  }
}]