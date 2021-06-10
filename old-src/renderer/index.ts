import { createApp } from 'vue';
import App from '@/renderer/App.vue';
import configFromQueryParams from '@/renderer/config';
import createRouter from '@/renderer/router';
import store from '@/renderer/store';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import '@/renderer/assets/index.css';

const config = configFromQueryParams(
  new URLSearchParams(window.location.search),
);

const router = createRouter(config);

const app = createApp(App, { config });
app.use(Antd);
app.use(store);
app.use(router);
app.mount('#app');
