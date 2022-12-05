import { createRouter, createWebHistory } from 'vue-router'
import HomeLayout from "@/views/layout/Layout.vue";
import menus from "./menu";
import jsCookie from "js-cookie";
import { ElMessage } from 'element-plus';
import i18n from '@/locals';
import useUserStore from "@/stores/user";
import { storeToRefs } from 'pinia';

const hasLogined = () => {
  const token = jsCookie.get("access_token");
  return token;
}

const checkedAuth = (to, access_level) => {
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
          path: "403",
          name: "403",
          component: () => import("@/views/error/Error403.vue")
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

router.beforeEach(async (to, from) => {
  if(!hasLogined() && to.name !== "login") {
    console.log("need login")
    ElMessage.error(i18n.global.t("label.needLogin"));
    return { 
      name: "login", 
      query: { 
        from: to.fullPath
      }
    }
  } else if(to.name !== "login") {
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
    const { getUserInfo } = userStore;
    if(!user.username) {
      await getUserInfo();
    }
    const level = to?.meta?.level ?? 0;
    if(level > user.value.access_level) {
      return { name: "403"};
    }
  }
})
export default router
