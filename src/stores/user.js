import { defineStore } from "pinia";
import { loginApi, logoutApi } from "@/api/auth.js";
import { currentUserApi } from "@/api/user";
import jsCookie from "js-cookie";
import router from "@/router";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import i18n from "@/locals";
import { decodePwd, encodePwd } from "@/utils/password";

const useUserStore = defineStore("user", () => {
  const user = ref({
    username: "",
    staff_id: "",
    access_level: 0
  });

  const doLogin = async (userForm) => {
    const { password } = userForm;
    const pwd = encodePwd(password);
    const res = await loginApi({
      ...userForm,
      password: pwd
    });
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
    const staff_id = deleteUser ? "" : user.value.staff_id;
    user.value = { 
      access_level: 0 ,
      staff_id
    };
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

