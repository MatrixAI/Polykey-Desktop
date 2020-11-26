<template>
  <div class="h-screen">
    <router-view />
  </div>
</template>

<script lang="ts">
/**
 * Chore:
 * 1. Login not used yet
 */
import { defineComponent, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import Alert from './components/alerts/Alert.vue'
import AppBar from './components/navigation/AppBar.vue'
import Drawer from './components/navigation/Drawer.vue'

import useModule from '@/store/useModule'

const noop = () => {}

export default defineComponent({
  components: {
    // Alert,
    // AppBar,
    // Drawer
  },
  setup() {
    const router = useRouter()
    const userStore = useModule('User')
    watchEffect(() => {
      /** Watch the status here for redirection */
      const isUnlocked = userStore.state.isUnlocked
      const isInitialized = userStore.state.isInitialized
      console.log(userStore.state.step)
      if (userStore.state.step === 1) {
        return router.replace('/Installation')
      }

      if (userStore.state.step === 2) {
        return router.replace('/SelectKeyNode')
      }

      if (userStore.state.step === 3) {
        return router.replace('/SelectExistingKeyNode')
      }

      if (userStore.state.step === 4) {
        return router.replace('/CreatePassword')
      }

      if (isUnlocked && isInitialized) {
        /** Reroute on vaults by default */
        const path = router.currentRoute.value.path
        if (path.includes('NewKeyNode') || path.includes('RegisterNode')) {
          router.replace('/Vaults')
        }
        return noop()
      } else if (!isInitialized) {
        router.replace('/Configuration/NewKeyNode')
      } else {
        router.replace('/Configuration/RegisterNode')
      }
    })
    /**
     * Check user if isUnlocked if not need to run the polykeyclient
     */
    userStore.dispatch('checkUserStatus')
  }
})
</script>
