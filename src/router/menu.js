const menus = [{
  /*
  path: "management",
  name: "management",
  component: () => import("@/views/home/Home.vue"),
  meta: {
    icon: "HomeFilled",
    //未设置level,即默认最低权限，所有人可见
  }
}, {
  */
  path: "experiments",
  name: "experiments",
  meta: {
    icon: "Notebook",
    level: 10 // 被试以上
  },
  children: [{
    path: "new",
    name: "newExperiment",
    component: () => import("@/views/experiments/forms/FormExperiment.vue"),
    meta: {
      icon: "Plus",
      level: 100 // 研究员以上
    }
  }, {
    path: "list",
    name: "experimentList",
    component: () => import("@/views/experiments/ExperimentList.vue"),
    meta: {
      icon: "List"
    }
  }, {
    path: "equipment",
    name: "equipmentList",
    props: true,
    component: () => import("@/views/equipment/EquipmentList.vue"),
    meta: {
      icon: "Monitor",
      level: 100
    }
  }, {
    path: "subject",
    name: "subjectList",
    component: () => import("@/views/subject/SubjectList.vue"),
    meta: {
      icon: "Coin",
      level: 100
    }
  }]
}, {
  /*
  path: "task",
  name: "task",
  component: () => import("@/views/task/Task.vue"),
  meta: {
    icon: "List",
    level: 100 //研究员以上
  }
}, {
  path: "search",
  name: "search",
  component: () => import("@/views/search/Search.vue"),
  meta: {
    icon: "Aim",
    level: 100 //研究员以上
  },
}, {
  */
  path: "atlas",
  name: "atlas",
  meta: {
    icon: "Aim",
  },
  children: [{
    path: "allen_ccf",
    name: "allen_ccf",
    component: () => import("@/views/atlas/allen_ccf/AllenCCF.vue"),
    meta: {
      icon: "Check"
    }
  }, {
    path: "brainnetome",
    name: "brainnetome",
    component: () => import("@/views/atlas/brainnetome/Brainnetome.vue"),
    meta: {
      icon: "Check"
    }
  }, {
    path: "macaque",
    name: "macaque",
    meta: {
      icon: "Check"
    },
    children: [{
      path: "macaque_3d",
      name: "macaque_3d",
      component: () => import("@/views/atlas/macaque/3d/Macaque.vue") 
    }, {
      path: "macaque_nissl",
      name: "macaque_nissl",
      component: () => import("@/views/atlas/macaque/nissl/Nissl.vue") 
    }, {
      path: "macaque_tracer",
      name: "macaque_tracer",
      component: () => import("@/views/atlas/macaque/tracer/Tracer.vue") 
    }]
  }, {
    path: "eeum",
    path: "eeum",
    name: "eeum",
    component: () => import("@/views/atlas/eeum/Eeum.vue"),
    meta: {
      icon: "Check"
    }
  }, {
    path: "lemur",
    name: "lemur",
    component: () => import("@/views/atlas/lemur/Lemur.vue"),
    meta: {
      icon: "Check",
      level: 1000
    }
  }]
}, {
  path: "notification",
  name: "notification",
  component: () => import("@/views/notification/Notification.vue"),
  meta: {
    icon: "Message",
    level: 10
  }
}, {
  path: "password",
  name: "password",
  component: () => import("@/views/password/UserPassword.vue"),
  meta: {
    icon: "Lock"
  }
}, {
  path: "user",
  name: "user",
  component: () => import("@/views/user/User.vue"),
  meta: {
    icon: "User",
    level: 1000 //管理员以上
  }
}]

export default menus;