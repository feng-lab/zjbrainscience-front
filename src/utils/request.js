import axios from "axios";
import jsCookie from "js-cookie";
import { ElMessage } from "element-plus";
import router from "@/router";
import i18n from "@/locals";
console.log('i18n', i18n)



const request = axios.create({
  //baseURL: import.meta.env.VITE_APP_API,
  timeout: 6000,
  withCredentials: true
});

const errorMsg = {
  "404": "当前请求接口不存在!",
  "502": "后端服务器异常!"
}



request.interceptors.request.use(config => {
  const { url } = config;
  if(url !== "/api/login") {
    config.headers["X-CSRFToken"] = jsCookie.get("csrftoken")
  }
  return config;
})

request.interceptors.response.use(response => {
  const { code, message, data="" } = response.data;
  console.log(code, message, data)
  if(code === 0) {
    ElMessage.error(message);
    return Promise.reject(response);
  } else if(code === 2) {
    //会话过期
    const { fullPath, name } = router.currentRoute.value;
    if(name !== "login") {
      ElMessage.warning(i18n.global.t("sessionExpire"));
      router.push({
        name: "login",
        query: {
          from : fullPath
        }
      })
    }
    return Promise.reject(response);
  } else {
    return Promise.resolve(data);
  }
}, error => {
  const { status, statusText, config } = error.response;
  const msg = i18n.global.t(`netErrMsg.${status}`) ?? i18n.global.t("netErrMsg.default");
  ElMessage.error(`${status}!\t ${config.url}, ${msg}`)
  return Promise.reject(error);
})



export default request;