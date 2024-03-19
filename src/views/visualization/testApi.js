export const atlasDetailApi = (id) => {
  return new Promise((resolve) => {
    setTimeout(resolve, 100, {
      id: 1,
      name: "macaque_bna",
      title: "Macaque",
      specy: "Macaque",
      url: "http://xxx.com", //可为空字符串
      isPublic: false,
      creator: "吴雯",
      creatorId: "002373",
      createTime: "2023-10-31 14:33:33",
      owner: ["root"],
      rootPath: "http://127.0.0.1/atlasd/google_precomputed_format/macaque_bna",
      team: "zhejiang Lab",
      teamLeader: "Feng",
      subpages: [{
        id: 1,
        name: "default",
        title: "3D Atlas",  
      }, {
        id: 2,
        name: "nissl",
        title: "Nissl",
      }, {
        id: 3,
        name: "tracer",
        title: "Tracer"
      }]
    })
  })
}

export const subpageDetailApi = (id) => {
  return new Promise(resolve => {
    setTimeout(resolve, 100, {
      id: 1,
      name: "default",
      title: "3D Atlas",
      atlasId: 1,
      order: 1,
      resolution: "200_200_200",
      datas: [{
        id: 1,
	      name: "regions",
      	label: "Brain Regions",
      	downloadable: false,
      	shader: "",
      	options: {},
      	regionRelated: true,
      	visible: true,
 	     	type: "regions",
        conversionId: 1,
      	url: "",
        subpageId: 1
	    },{
      	id: 2,
      	name: "template",
      	label: "Template",
 	     	type: "image",
 	     	downloadable: true,
      	shader: "xxxx",
      	options: {},
      	regionRelated: false,
      	visible: true,
      	//url: "http://10.11.140.35:2000/atlas_data/bn_atlas/bn_atlas_bigbrain",
        url: "",
        subpageId: 1
	    }],
      referenceData: [{
        id: 2,
        name: "bn_atlas_whole",
        label: "Whole Brain",
        type: "wholeBrain",
        downloadable: true,
        shader: "xxxx",
        options: {},
        regionRelated: false,
        visible: true,
        subpageId: 2,
        path: "http://10.11.140.35:2000/atlas_data/macaque_bna/macaque_bna_whole",
      }],
      neuroDataLayout: "4panel"
    })
  })
}