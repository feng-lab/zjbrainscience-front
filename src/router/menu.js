import BsIconBrain from "@/components/icons/BsIconBrain.vue";
import { markRaw } from "vue";
const menus = [{
  path: "management",
  name: "management",
  component: () => import("@/views/home/Home.vue"),
  meta: {
    icon: "HomeFilled",
    level: 1001
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
      icon: "List",
      level: 1
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
    icon: markRaw(BsIconBrain),
    level: 1001
  },
  children: [{
    path: "index",
    name: "atlashome",
    component: () => import("@/views/atlas/Home.vue"),
    meta: {
      icon: "HomeFilled",
      level: 1001
    }
  }, {
    path: "allen_ccf",
    name: "allen_ccf",
    component: () => import("@/views/atlas/allen_ccf/AllenCCF.vue"),
    meta: {
      icon: "Check",
      level: 1001
    }
  }, {
    path: "bn_atlas",
    name: "brainnetome",
    component: () => import("@/views/atlas/brainnetome/Brainnetome.vue"),
    meta: {
      icon: "Check",
      level: 1001
    }
  }, {
    path: "macaque_bna",
    name: "macaque",
    meta: {
      icon: "Check",
      level: 1001
    },
    redirect: "/atlas/macaque_bna/3d",
    children: [{
      path: "3d",
      name: "macaque_3d",
      component: () => import("@/views/atlas/macaque/3d/Macaque.vue"),
      meta: {
        level: 1001
      }
    }, {
      path: "nissl",
      name: "macaque_nissl",
      component: () => import("@/views/atlas/macaque/nissl/Nissl.vue"),
      meta: {
        level: 1001
      }
    }, {
      path: "tracer",
      name: "macaque_tracer",
      component: () => import("@/views/atlas/macaque/tracer/Tracer.vue"),
      meta: {
        level: 1001
      }
    }]
  }, {
    path: "eeum",
    name: "eeum",
    component: () => import("@/views/atlas/eeum/Eeum.vue"),
    meta: {
      icon: "Check",
      level: 1001
    }
  }, {
    path: "fly",
    name: "fly",
    component: () => import("@/views/atlas/fly/Fly.vue"),
    meta: {
      icon: "Check",
      level: 1001
    }
  }, {
    path: "ps_oct",
    name: "psoct",
    component: () => import("@/views/atlas/ps_oct/Psoct.vue"),
    meta: {
      icon: "Check",
      level: 1001
    }
  }, {
    path: "lemur",
    name: "lemur",
    component: () => import("@/views/atlas/lemur/Lemur.vue"),
    meta: {
      icon: "Check",
      level: 1001
    }
  }, {
    path: "manage",
    name: "atlasmanage",
    component: () => import("@/views/atlas/Manage.vue"),
    meta: {
      icon: "Setting",
      level: 1001
    }
  }]
}, {
  path: "notification",
  name: "notification",
  component: () => import("@/views/notification/Notification.vue"),
  meta: {
    icon: "Message",
    level: 1001
  }
}, {
  path: "password",
  name: "password",
  component: () => import("@/views/password/UserPassword.vue"),
  meta: {
    icon: "Lock",
    level: 1
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