import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Vaults from '@pages/vault/VaultList.vue';
import Vault from '@pages/vault/Vault.vue';
import SharedWithMe from '@pages/vault/SharedVaultList.vue';
import Installation from '@pages/installation/Installation.vue';
import SelectKeyNode from '@pages/bootstrap/SelectKeyNode.vue';
import SelectExistingKeyNode from '@pages/bootstrap/SelectExistingKeyNode.vue';
import Identities from '@pages/identities/Identities.vue';
import GestaltProfile from '@pages/gestalt/GestaltProfile.vue';

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
  },
  // Sharing
  {
    path: '/sharing',
    component: SharedWithMe
  },

  // Identities
  {
    path: '/identities',
    component: Identities
  },

  /** Gestalt Profile */
  {
    path: '/gestalt-profile',
    component: GestaltProfile
  },
  {
    path: '/gestalt-profile/:id',
    component: GestaltProfile
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
