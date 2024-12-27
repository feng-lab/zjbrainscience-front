import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import i18n from "@/locals";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import 'element-plus/theme-chalk/display.css';
import './assets/css/main.scss';
import './assets/css/dark.scss';
import Keycloak from 'keycloak-js'
import jsCookie from "js-cookie";

const pinia = createPinia();
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

const keycloak = new Keycloak({
  url: 'http://10.15.56.125:8080',
  realm: 'Test',
  grantType: 'confidential',
  accessType: 'public',
  clientId: 'dataplatform',
  // clientSecret: '7mWu8qjE8Ywcd2dUCOZfk348JAkINeBf',
})

const redirectUrl = 'http://10.15.56.125:8080/realms/Test/protocol/openid-connect/auth?client_id=dataplatform&redirect_uri=http%3A%2F%2Flocalhost%3A8090%2Fexperiments%2Flist&state=724444be-d63a-4fe7-98e5-037c68e83949&response_mode=fragment&response_type=code&scope=openid&nonce=3c8f25c3-a68d-4277-9ef8-5822a4e7d667&code_challenge=_7oR8U-4xEva3Hu8VccCiHk_SgAHbjvySyDsmc6ZtuE&code_challenge_method=S256'
try {
  const authenticated = await keycloak.init({
    onLoad: 'login-required',
  })
  // const authenticated = false
  console.log('authenticated---->', authenticated, keycloak)
  if (authenticated) {
    console.log('User is authenticated')
    jsCookie.set("access_token", keycloak.token);
    jsCookie.set("token_type", keycloak.tokenParsed.typ);
    const { from = "/" } = router.currentRoute.value.query;
    router.push(from);
  } else {
    console.log('User is not authenticated')
    window.location.href = redirectUrl
  }
} catch (error) {
  console.error('Failed to initialize adapter:', error)
  window.location.href = redirectUrl
}

app.use(pinia);
app.use(i18n);
app.use(router);

app.mount('#app');
