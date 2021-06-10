import { createApp } from 'vue';
import configFromQueryParams from '@/renderer/config';
import createRouter from '@/renderer/router';
import store from '@/renderer/store';
import App from '@/renderer/App.vue';
import '@/renderer/index.css';

console.log(
  '👋 This message is being logged by "renderer.js", included via webpack',
);

const config = configFromQueryParams(
  new URLSearchParams(window.location.search),
);

const router = createRouter(config);

const app = createApp(App, { config });
app.use(store);
app.use(router);
app.mount('#root');
