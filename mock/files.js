export default [{
  url: "/api/getDocType",
  method: "GET",
  response: () => {
    return {
      code: 1,
      data: ["MP4", "BDF", "EEG"]
    }
  }
}, {
  url: "/api/getDocByPage",
  method: "GET",
  response: ({query}) => {
    const { docType } = query;
    return {
      code: 1,
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
  url: "/api/deleteDoc",
  method: "DELETE",
  response: () => {
    return {
      code: 1,
      message: ""
    }
  }
}]

