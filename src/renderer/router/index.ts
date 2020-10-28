import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw
} from 'vue-router'
import Vaults from '@/components/vaults/Vaults.vue'
import NewVault from '@/components/vaults/NewVault.vue'
import NewSecret from '@/components/vaults/secrets/NewSecret.vue'
import VaultInformation from '@/components/vaults/VaultInformation.vue'

import Social from '@/components/social/Social.vue'

import Keys from '@/components/keys/Keys.vue'
import NewKey from '@/components/keys/NewKey.vue'

import Configuration from '@/components/configuration/Configuration.vue'
import NewKeyNode from '@/components/configuration/NewKeyNode.vue'

const routes: Array<RouteRecordRaw> = [
  // Vaults
  {
    path: '/Vaults',
    component: Vaults
  },
  {
    path: '/VaultInformation',
    name: 'VaultInformation',
    component: VaultInformation
  },
  {
    path: '/Vaults/NewSecret',
    component: NewSecret
  },
  {
    path: '/Vaults/NewVault',
    component: NewVault
  },
  // // Social
  {
    path: '/Social',
    component: Social
  },
  // // Keys
  {
    path: '/Keys',
    component: Keys
  },
  {
    path: '/Keys/NewKey',
    component: NewKey
  },
  // Configuration
  {
    path: '/Configuration',
    component: Configuration
  },
  {
    path: '/Configuration/NewKeyNode',
    component: NewKeyNode
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// router.replace('Configuration')

export default router
