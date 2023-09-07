import { createRouter, createWebHistory } from 'vue-router'
import HomeLayout from "@/views/layout/Layout.vue";
import menus from "./menu";
import jsCookie from "js-cookie";
import { ElMessage } from 'element-plus';
import i18n from '@/locals';
import useUserStore from "@/stores/user";
import { storeToRefs } from 'pinia';
import { useMediaQuery } from "@/compositions/useMediaQuery";

const hasLogined = () => {
  const token = jsCookie.get("access_token");
  return token;
}

const checkedAuth = (to, access_level) => {
}

const checkBrowserSupport = () => {
  const supportBrowser = [
    ["Chrome",  51],
    ["Firefox", 46],
    ["Safari", 15]
  ]

  const { userAgent } = navigator;
  let support = false;

  for(let [browser, version] of supportBrowser) {
    const reg = new RegExp(`${browser}\\/([\\d.]+)`);
    const cv = userAgent.match(reg);
    if(!cv) continue;
    const currVersion = Number(cv[1].split('.')[0]);
    if(currVersion >= version) {
      support = true;
      break;
    }
  }

  return support;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      //redirect: "/management",
      redirect: "/experiments/list",
      component: HomeLayout,
      children: [
        ...menus,
        {
          path: "experiments/edit/:experiment_id",
          name: "experiments-edit",
          component: () => import("@/views/experiments/forms/FormExperiment.vue"),
          meta: {
            level: 100
          },
          props: true
        },
        {
          path: "experiments/detail/:experiment_id",
          name: "experiments-detail",
          meta: {
            level: 10
          },
          component: () => import("@/views/experiments/ExperimentsDetail.vue"),
          props: true,
          children: [{
            path: "",
            name: "default",
            redirect: {name: "paradigm"}
          }, {
            path: "paradigm",
            name: "paradigm",
            component: () => import("@/views/experiments/detail/DetailParadigm.vue")
          }, {
            path: "file",
            name: "file",
            component: () => import("@/views/experiments/detail/DetailFiles.vue")
          }, {
            path: "subject",
            name: "subject",
            component: () => import("@/views/subject/SubjectList.vue")
          }, {
            path: "equipment",
            name: "equipment",
            component: () => import("@/views/equipment/EquipmentList.vue")
          }, {
            path: "assistant",
            name: "assistant",
            component: () => import("@/views/experiments/detail/DetailAssistants.vue")
          }]
        },
        {
          path: "task/:taskid",
          name: "task-detail",
          component: () => import("@/views/task/TaskDetail.vue"),
          meta: {
            level: 100
          },
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
        }, 
        {
          path: "atlas/notSupport",
          name: "atlasNotSupport",
          component: () => import("@/views/atlas/AtlasNotSupport.vue")
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login.vue')
    },
    /*
    {
      path: "/:patchMatch(.*)*",
      redirect: "/404"
    }
    */
  ]
})

router.beforeEach(async (to, from) => {
  if(to.path.startsWith("/atlas/") && to.name !== "atlasNotSupport") {
    const { screenSizeComparison } = useMediaQuery();
    const screenSupport = screenSizeComparison('width', 'min', 1024);
    if(!screenSupport || !checkBrowserSupport()) {
      return { name: "atlasNotSupport"};
    }
  }
  if(!hasLogined() && to.name !== "login") {
    ElMessage.error(i18n.global.t("label.needLogin"));
    return { 
      name: "login", 
      query: { 
        from: to.fullPath
      }
    }
  } else if(to.name !== "login") {
    const userStore = useUserStore();
    const { user }  = storeToRefs(userStore);
    const { getUserInfo } = userStore;
    if(!user.value.username) {
      await getUserInfo();
    }
    const level = to?.meta?.level ?? 0;
    if(level > user.value.access_level) {
      if(from.path === "/" || from.name === "login") {
        return { name: "atlashome" };
      }
      return { name: "403"};
    }
  }
})
export default router
