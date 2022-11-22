import { createRouter, createWebHistory } from 'vue-router'
import HomeLayout from "@/views/layout/Layout.vue";
import menus from "./menu";
import jsCookie from "js-cookie";

const hasLogined = () => {
  const username = jsCookie.get("username");
  return username;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: "/management",
      component: HomeLayout,
      children: [
        ...menus,
        {
          path: "experiments/:experimentid",
          name: "experiments-detail",
          component: () => import("@/views/experiments/ExperimentsDetail.vue"),
          props: true
        },
        {
          path: "task/:taskid",
          name: "task-detail",
          component: () => import("@/views/task/TaskDetail.vue"),
          props: true
        },
        {
          path: "404",
          name: "404",
          component: () => import("@/views/error/Error404.vue")
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login.vue')
    },
    {
      path: "/:patchMatch(.*)*",
      redirect: "/404"
    }
  ]
})

router.beforeEach((to, from) => {
  if(!hasLogined() && to.name !== "login") {
    return { 
      name: "login", 
      query: { 
        from: to.fullPath
      }
    }
  }
})
export default router
