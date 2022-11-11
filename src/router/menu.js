const menus = [{
  path: "management",
  name: "management",
  component: () => import("@/views/home/Home.vue"),
  meta: {
    title: "首页",
    icon: "HomeFilled",
  }
}, {
  path: "experiments",
  name: "experiments",
  component: () => import("@/views/experiments/Experiments.vue"),
  meta: {
    title: "实验数据",
    icon: "Notebook"
  }
}, {
  path: "task",
  name: "task",
  component: () => import("@/views/task/Task.vue"),
  meta: {
    title: "任务列表",
    icon: "List"
  }
}, {
  path: "search",
  name: "search",
  component: () => import("@/views/search/Search.vue"),
  meta: {
    title: "信号检索",
    icon: "Aim"
  }
}]

export default menus;