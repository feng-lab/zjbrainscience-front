import { defineStore } from "pinia";
import { loginApi, logoutApi } from "@/api/auth.js";
import { currentUserApi } from "@/api/user";
import jsCookie from "js-cookie";
import router from "@/router";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useUtils } from "@/compositions/useUtils";
import i18n from "@/locals";

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
    } catch (e) {
      ElMessage.error(i18n.global.t("elmessage.getUserInfoFail"));
    }
  }

  const doLogout = async (deleteUser=false) => {
    const username = deleteUser ? "" : user.value.username;
    console.log('username', username, "deleteUser", deleteUser)
    user.value = { 
      access_level: 0 ,
      username,
    };
    console.log('user', user.value)
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

