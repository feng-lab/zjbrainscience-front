import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import i18n from "@/locals";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import 'element-plus/theme-chalk/display.css';
import './assets/css/main.scss';

const pinia = createPinia();
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(pinia);
app.use(i18n);
app.use(router);

app.mount('#app');
