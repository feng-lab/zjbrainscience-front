import BsIconBrain from "@/components/icons/BsIconBrain.vue";
import { markRaw } from "vue";
const menus = [{
  path: "management",
  name: "management",
  component: () => import("@/views/home/Home.vue"),
  meta: {
    icon: "HomeFilled",
    //未设置level,即默认最低权限，所有人可见
  }
}, {
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
    level: 1000 //研究员以上
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
    icon: markRaw(BsIconBrain)
  },
  children: [{
    path: "index",
    name: "atlashome",
    component: () => import("@/views/atlas/Home.vue"),
    meta: {
      icon: "HomeFilled",
    }
  }, {
    path: "allen_ccf",
    name: "allen_ccf",
    component: () => import("@/views/atlas/allen_ccf/AllenCCF.vue"),
    meta: {
      icon: "Check"
    }
  }, {
    path: "bn_atlas",
    name: "brainnetome",
    component: () => import("@/views/atlas/brainnetome/Brainnetome.vue"),
    meta: {
      icon: "Check"
    }
  }, {
    path: "macaque_bna",
    name: "macaque",
    meta: {
      icon: "Check"
    },
    redirect: "/atlas/macaque_bna/3d",
    children: [{
      path: "3d",
      name: "macaque_3d",
      component: () => import("@/views/atlas/macaque/3d/Macaque.vue") 
    }, {
      path: "nissl",
      name: "macaque_nissl",
      component: () => import("@/views/atlas/macaque/nissl/Nissl.vue") 
    }, {
      path: "tracer",
      name: "macaque_tracer",
      component: () => import("@/views/atlas/macaque/tracer/Tracer.vue") 
    }]
  }, {
    path: "eeum",
    name: "eeum",
    component: () => import("@/views/atlas/eeum/Eeum.vue"),
    meta: {
      icon: "Check"
    }
  }, {
    path: "fly",
    name: "fly",
    component: () => import("@/views/atlas/fly/Fly.vue"),
    meta: {
      icon: "Check"
    }
  }, {
    path: "ps_oct",
    name: "psoct",
    component: () => import("@/views/atlas/ps_oct/Psoct.vue"),
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
  }, {
    path: "manage",
    name: "atlasmanage",
    component: () => import("@/views/atlas/Manage.vue"),
    meta: {
      icon: "Setting",
      level: 1000
    }
  }]
}, {
  /*
  path: "visualize",
  name: "visualize",
  meta: {
    icon: markRaw(BsIconBrain)
  },
  children: [{
    path: "workplace",
    name: "workplace",
    component: () => import("@/views/visualization/VisualWorkplace.vue")
  }]
}, {
  */
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