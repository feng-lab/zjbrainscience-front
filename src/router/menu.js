import BsIconBrain from "@/components/icons/BsIconBrain.vue";
import { markRaw } from "vue";
const menus = [{
  path: "management",
  name: "management",
  component: () => import("@/views/home/Home.vue"),
  meta: {
    icon: "HomeFilled",
    level: 1001//未设置level,即默认最低权限，所有人可见
  }
}, {
  path: "experiments",
  name: "experiments",
  meta: {
    icon: "Notebook",
    level: 1001//level: 10 // 被试以上
  },
  children: [{
    path: "new",
    name: "newExperiment",
    component: () => import("@/views/experiments/forms/FormExperiment.vue"),
    meta: {
      icon: "Plus",
      level: 1001 // 研究员以上
    }
  }, {
    path: "list",
    name: "experimentList",
    component: () => import("@/views/experiments/ExperimentList.vue"),
    meta: {
      icon: "List",
      level: 1001 // 研究员以上
    }
  }, {
    path: "equipment",
    name: "equipmentList",
    props: true,
    component: () => import("@/views/equipment/EquipmentList.vue"),
    meta: {
      icon: "Monitor",
      level: 1001
    }
  }, {
    path: "subject",
    name: "subjectList",
    component: () => import("@/views/subject/SubjectList.vue"),
    meta: {
      icon: "Coin",
      level: 1001
    }
  }]
}, {
  path: "atlas",
  name: "atlas",
  meta: {
    icon: markRaw(BsIconBrain)
  },
  children: [{
    path: "index",
    name: "atlashome",
    component: () => import("@/views/atlas/Home.vue"),
    meta: {
      icon: "HomeFilled",
      level: 1001//未设置level
    }
  }, {
    path: "allen_ccf",
    name: "allen_ccf",
    component: () => import("@/views/atlas/allen_ccf/AllenCCF.vue"),
    meta: {
      icon: "Check",
      level: 1001//未设置level
    }
  }, {
    path: "bn_atlas",
    name: "brainnetome",
    component: () => import("@/views/atlas/brainnetome/Brainnetome.vue"),
    meta: {
      icon: "Check",
      level: 1001//未设置level
    }
  }, {
    path: "macaque_bna",
    name: "macaque",
    meta: {
      icon: "Check",
      level: 1001//未设置level
    },
    redirect: "/atlas/macaque_bna/3d",
    children: [{
      path: "3d",
      name: "macaque_3d",
      component: () => import("@/views/atlas/macaque/3d/Macaque.vue"),
      meta: {
        level: 1001,//未设置
      }
    }, {
      path: "nissl",
      name: "macaque_nissl",
      component: () => import("@/views/atlas/macaque/nissl/Nissl.vue"),
      meta: {
        level: 1001,//未设置
      }
    }, {
      path: "tracer",
      name: "macaque_tracer",
      component: () => import("@/views/atlas/macaque/tracer/Tracer.vue"),
      meta: {
        level: 1001,//未设置
      }
    }]
  },  
  {
    path: "eeum-Lemur",
    name: "eeum-Lemur",
    component: () => import("@/views/atlas/eeum/eeum-Lemur.vue"),
    meta: {
      icon: "Check",
      level: 1
    }
  }, {
    path: "eeum-Lemur-Atlas",
    name: "eeum-Lemur-Atlas",
    component: () => import("@/views/atlas/eeum/eeum-Lemur-Atlas.vue"),
    meta: {
      icon: "Check",
      level: 1
    }
  },
  {
    path: "eeum-JK979",
    name: "eeum-JK979",
    component: () => import("@/views/atlas/eeum/eeum-JK979.vue"),
    meta: {
      icon: "Check",
      level: 1
    }
  }, {
    path: "eeum-JK980",
    name: "eeum-JK980",
    component: () => import("@/views/atlas/eeum/eeum-JK980.vue"),
    meta: {
      icon: "Check",
      level: 1
    }
  }, {
    path: "eeum-eLemur-A2",
    name: "eeum-eLemur-A2",
    component: () => import("@/views/atlas/eeum/eeum-eLemur-A2.vue"),
    meta: {
      icon: "Check",
      level: 1
    }
  },{
    path: "eeum-eLemur-B1",
    name: "eeum-eLemur-B1",
    component: () => import("@/views/atlas/eeum/eeum-eLemur-B1.vue"),
    meta: {
      icon: "Check",
      level: 1
    }
  },{
    path: "eeum-eLemur-B2",
    name: "eeum-eLemur-B2",
    component: () => import("@/views/atlas/eeum/eeum-eLemur-B2.vue"),
    meta: {
      icon: "Check",
      level: 1
    }
  },
  {
    path: "fly",
    name: "fly",
    component: () => import("@/views/atlas/fly/Fly.vue"),
    meta: {
      icon: "Check",
      level: 1001//未设置level
    }
  }, {
    path: "ps_oct",
    name: "psoct",
    component: () => import("@/views/atlas/ps_oct/Psoct.vue"),
    meta: {
      icon: "Check",
      level: 1001//未设置level
    }
  }, {
    path: "lemur",
    name: "lemur",
    component: () => import("@/views/atlas/lemur/Lemur.vue"),
    meta: {
      icon: "Check",
      level: 1001//level: 1000
    }
  }, {
    path: "manage",
    name: "atlasmanage",
    component: () => import("@/views/atlas/Manage.vue"),
    meta: {
      icon: "Setting",
      level: 1001//level: 1000
    }
  }]
}, {
  path: "notification",
  name: "notification",
  component: () => import("@/views/notification/Notification.vue"),
  meta: {
    icon: "Message",
    level: 1001//level: 10
  }
}, {
  path: "password",
  name: "password",
  component: () => import("@/views/password/UserPassword.vue"),
  meta: {
    icon: "Lock",
    level: 1001//未设置level
  }
}, {
  path: "user",
  name: "user",
  component: () => import("@/views/user/User.vue"),
  meta: {
    icon: "User",
    level: 1001//level: 1000 //管理员以上
  }
}]

export default menus;