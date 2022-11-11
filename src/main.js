import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import i18n from "@/locals";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import './assets/css/main.scss';
import 'element-plus/theme-chalk/display.css';

const pinia = createPinia();
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(router);
app.use(pinia);
app.use(i18n);

app.mount('#app');
