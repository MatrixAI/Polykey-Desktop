import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Vaults from '@renderer/pages/vault/VaultList.vue';
import Vault from '@renderer/pages/vault/Vault.vue';
import Installation from '@renderer/pages/installation/Installation.vue';
import SelectKeyNode from '@renderer/pages/bootstrap/SelectKeyNode.vue';
import SelectExistingKeyNode from '@renderer/pages/bootstrap/SelectExistingKeyNode.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/installation',
    component: Installation
  },
  {
    path: '/selectKeyNode',
    component: SelectKeyNode
  },
  {
    path: '/selectExistingKeyNode',
    component: SelectExistingKeyNode
  },

  // Vaults
  {
    path: '/vaults',
    component: Vaults
  },
  {
    path: '/vaults/:id',
    component: Vault
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
