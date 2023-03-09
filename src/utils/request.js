import axios from "axios";
import jsCookie from "js-cookie";
import { ElMessage } from "element-plus";
import router from "@/router";
import i18n from "@/locals";



const request = axios.create({
  //baseURL: import.meta.env.VITE_APP_API,
  timeout: 6000,
  withCredentials: true
});

const codeObj = {
  "1": { type: "error"},
  "2": { type: "error", msg: i18n.global.t("httpErrorMsg.expire")},
  "3": { type: "warning", msg: i18n.global.t("httpErrorMsg.relogin")},
}

const errorHandle = {
  "401": (error) => {
    const { code, message } = error;
    const { type, msg=message } = codeObj[code]

    ElMessage({
      type, 
      message: msg
    });
    const { fullPath, name } = router.currentRoute.value;
    if(name !== "login" && code !== 1) {
      router.push({
        name: "login",
        query: {
          from : fullPath
        }
      })
    }
  },
  "400": () => {
    ElMessage.error(
      i18n.global.t("httpErrorMsg.paramsErr")
    )
  }
}



request.interceptors.request.use(config => {
  const { url } = config;
  if(url !== "/api/login") {
    const access_token = jsCookie.get("access_token");
    const token_type = jsCookie.get("token_type");
    config.headers["Authorization"] = `${token_type} ${access_token}`;
  }
  return config;
})

request.interceptors.response.use(response => {
  const { url } = response.config;
  if(url === "/api/login") {
    return Promise.resolve(response.data);
  } else {
    const { code, message, data="" } = response.data;
    if(code) {
      //后端处理失败
      ElMessage.error(message);
      return Promise.reject(response);
    } else {
      //后端处理成功
      return Promise.resolve(data);
    }
  }
}, error => {
  const { status, statusText, config, data } = error.response;
  if(errorHandle[status]) {
    errorHandle[status](data);
  } else {
    ElMessage.error(`${status}!\t ${config.url}, ${statusText}`)
  }
  return Promise.reject(error);
})



export default request;