import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Vaults from '@renderer/components/vaults/Vaults.vue'
import NewVault from '@renderer/components/vaults/NewVault.vue'
import NewSecret from '@renderer/components/vaults/secrets/NewSecret.vue'
import VaultInformation from '@renderer/components/vaults/VaultInformation.vue'
import SecretInformation from '@renderer/components/vaults/secrets/SecretInformation.vue'

import Social from '@renderer/components/social/Social.vue'
import AddPeer from '@renderer/components/social/AddPeer.vue'

import Keys from '@renderer/components/keys/Keys.vue'
import NewKey from '@renderer/components/keys/NewKey.vue'

import Configuration from '@renderer/components/configuration/Configuration.vue'
import NewKeyNode from '@renderer/components/configuration/NewKeyNode.vue'
import UnlockKeyNode from '@renderer/components/configuration/UnlockKeyNode.vue'
import RegisterNode from '@renderer/components/configuration/RegisterNode.vue'

import Bootstrap from '@renderer/pages/bootstrap/Bootstrap.vue'
import Installation from '@renderer/pages/installation/Installation.vue'
import SelectKeyNode from '@renderer/pages/bootstrap/SelectKeyNode.vue'
import SelectExistingKeyNode from '@renderer/pages/bootstrap/SelectExistingKeyNode.vue'
import CreatePassword from '@renderer/pages/bootstrap/CreatePassword.vue'
import RecoveryCode from '@renderer/pages/bootstrap/ReoveryCode.vue'
import ConfirmCode from '@renderer/pages/bootstrap/ConfirmCode.vue'
import Congratulations from '@renderer/pages/bootstrap/Congratulations.vue'

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
