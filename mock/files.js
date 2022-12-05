export default [{
  url: "/api/getDocType",
  method: "GET",
  response: () => {
    return {
      code: 0,
      data: ["MP4", "BDF", "EEG"]
    }
  }
}, {
  url: "/api/getDocByPage",
  method: "GET",
  response: ({query}) => {
    const { docType } = query;
    return {
      code: 0,
      data: function() {
        if(docType !== "ALL") {
          return [{
            fileid: 0, 
            name: "1." + docType.toLowerCase()
        }];
        } else {
          return [{
            fileid: 0,
            name: "1.mp4"
          }, {
            fileid: 1,
            name: "1.bdf"
          }, {
            fileid: 2,
            name: "1.txt"
          }]
        }
      }
    }
  }
}, {
  url: "/api/getFiles",
  method: "GET",
  response: () => {
    return {
      code: 0,
      "data|8-12": [{
        "experimentsid":/ATPX\d{4}/,
		    "filename":"data" + "@increment()",
		    "filetype":"bdf",
		    "fileid":"@increment()",
		    "isoriginal":true,
		    "fileindex": "@increment()",
		    "filevolume":0
      }]
    }
  }
}, {
  url: "/api/deleteDoc",
  method: "DELETE",
  response: () => {
    return {
      code: 0,
      message: ""
    }
  }
}]

