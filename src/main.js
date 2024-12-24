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

try {
  const authenticated = await keycloak.init({
    onLoad: 'login-required',
  })
  console.log('authenticated---->', authenticated, keycloak)
  if (authenticated) {
    console.log('User is authenticated')
  } else {
    console.log('User is not authenticated')
  }
} catch (error) {
  console.error('Failed to initialize adapter:', error)
}

app.use(pinia);
app.use(i18n);
app.use(router);

app.mount('#app');
