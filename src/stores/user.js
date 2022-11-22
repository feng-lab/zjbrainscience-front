import { defineStore } from "pinia";
import { loginApi, logoutApi } from "@/api/common.js";
import jsCookie from "js-cookie";
import router from "@/router";
import { ref } from "vue";

const useUserStore = defineStore("user", () => {
  const user = ref({
    name: ""
  });

  const doLogin = async (userForm) => {
    console.log('router', router)
    const res = await loginApi(userForm);
    user.value.name = userForm.username;
    jsCookie.set("username", user.value.name);
    jsCookie.set("access_token", res.access_token);
    jsCookie.set("token_type", res.token_type);
    const { from="/" }= router.currentRoute.value.query;
    console.log('path', from)
    router.push(from);
  }

  const doLogout = async () => {
    user.value.name = "";
    await logoutApi();
    jsCookie.remove("username");
    jsCookie.remove("access_token");
    jsCookie.remove("token_type");
    router.push("/login")
  }

  return {
    user,
    doLogin,
    doLogout
  }
})

export default useUserStore;

