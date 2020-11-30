import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Vaults from '@/components/vaults/Vaults.vue'
import NewVault from '@/components/vaults/NewVault.vue'
import NewSecret from '@/components/vaults/secrets/NewSecret.vue'
import VaultInformation from '@/components/vaults/VaultInformation.vue'
import SecretInformation from '@/components/vaults/secrets/SecretInformation.vue'

import Social from '@/components/social/Social.vue'
import AddPeer from '@/components/social/AddPeer.vue'

import Keys from '@/components/keys/Keys.vue'
import NewKey from '@/components/keys/NewKey.vue'

import Configuration from '@/components/configuration/Configuration.vue'
import NewKeyNode from '@/components/configuration/NewKeyNode.vue'
import UnlockKeyNode from '@/components/configuration/UnlockKeyNode.vue'
import RegisterNode from '@/components/configuration/RegisterNode.vue'

import Bootstrap from '@/pages/bootstrap/Bootstrap.vue'
import Installation from '@/pages/installation/Installation.vue'
import SelectKeyNode from '@/pages/bootstrap/SelectKeyNode.vue'
import SelectExistingKeyNode from '@/pages/bootstrap/SelectExistingKeyNode.vue'
import CreatePassword from '@/pages/bootstrap/CreatePassword.vue'
import RecoveryCode from '@/pages/bootstrap/ReoveryCode.vue'
import ConfirmCode from '@/pages/bootstrap/ConfirmCode.vue'
import Congratulations from '@/pages/bootstrap/Congratulations.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/Bootstrap',
    component: Bootstrap
  },
  {
    path: '/Installation',
    component: Installation
  },
  {
    path: '/SelectKeyNode',
    component: SelectKeyNode
  },
  {
    path: '/SelectExistingKeyNode',
    component: SelectExistingKeyNode
  },
  {
    path: '/CreatePassword',
    component: CreatePassword
  },
  {
    path: '/RecoveryCode',
    component: RecoveryCode
  },
  {
    path: '/ConfirmCode',
    component: ConfirmCode
  },
  {
    path: '/Congratulations',
    component: Congratulations
  },

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

  // Secrets
  {
    path: '/Vaults/SecretInformation',
    component: SecretInformation
  },
  // Social
  {
    path: '/Social',
    component: Social
  },
  {
    path: '/Social/AddPeer',
    component: AddPeer
  },
  // Keys
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
  },
  {
    path: '/Configuration/UnlockKeyNode',
    component: UnlockKeyNode
  },
  {
    path: '/Configuration/RegisterNode',
    component: RegisterNode
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
