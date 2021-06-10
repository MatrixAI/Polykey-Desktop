import type { Config } from '@/renderer/config';

import * as vueRouter from 'vue-router';
import Home from '@/renderer/pages/Home.vue';

function createRouter(config: Config) {
  const routes = [
    {
      path: '/',
      component: Home,
    },
  ];
  const router = vueRouter.createRouter({
    history: vueRouter.createWebHistory(config.BASE_PATH),
    routes,
  });
  return router;
}

export default createRouter;
