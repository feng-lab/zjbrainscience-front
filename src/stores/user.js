import { defineStore } from "pinia";
import { loginApi, logoutApi } from "@/api/common.js";
import { currentUserApi } from "@/api/user";
import jsCookie from "js-cookie";
import router from "@/router";
import { ref } from "vue";
import { ElMessage } from "element-plus";

const useUserStore = defineStore("user", () => {
  const user = ref({
    username: "",
    staff_id: "",
    access_level: 0
  });

  const doLogin = async (userForm) => {
    const res = await loginApi(userForm);
    jsCookie.set("access_token", res.access_token);
    jsCookie.set("token_type", res.token_type);
    const { from="/" }= router.currentRoute.value.query;
    router.push(from);
  }

  const getUserInfo = async () => {
    try {
      user.value = await currentUserApi();
      console.log('after get user info', user.value)
    } catch (e) {
      ElMessage.error("Get current user info failed!");
    }
  }

  const doLogout = async () => {
    user.value = { access_level: 0 };
    await logoutApi();
    jsCookie.remove("access_token");
    jsCookie.remove("token_type");
    router.push("/login")
  }

  return {
    user,
    doLogin,
    doLogout,
    getUserInfo
  }
})

export default useUserStore;

