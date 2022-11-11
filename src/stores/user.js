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
    await loginApi(userForm);
    user.value.name = userForm.account;
    jsCookie.set("account", user.value.name);
    const path = router.currentRoute.value.query.from;
    router.push(path ?? "/")
  }

  const doLogout = async () => {
    const account = user.value.name;
    user.value.name = "";
    jsCookie.remove("account");
    router.push("/login")
    await logoutApi(account);
  }

  return {
    user,
    doLogin,
    doLogout
  }
})

export default useUserStore;

