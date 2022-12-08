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
  component: () => import("@/views/experiments/Experiments.vue"),
  meta: {
    icon: "Notebook",
    level: 10 // 被试以上
  }
}, {
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
  path: "notification",
  name: "notification",
  component: () => import("@/views/notification/Notification.vue"),
  meta: {
    icon: "Message"
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