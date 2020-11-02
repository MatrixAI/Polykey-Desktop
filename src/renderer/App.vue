<template>
  <div class="bg-purple-400 h-screen">
    <div class="demo-container">
      <Alert />
      <!-- Drawer -->
      <Drawer />
      <!-- Content -->
      <div class="content">
        <!-- App bar -->
        <AppBar />
        <!-- App content -->
        <div class="app-content">
          <router-view />
        </div>
      </div>
    </div>
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
    Alert,
    AppBar,
    Drawer
  },
  setup() {
    const router = useRouter()
    const userStore = useModule('User')
    watchEffect(() => {
      /** Watch the status here for redirection */
      const isUnlocked = userStore.state.isUnlocked
      const isInitialized = userStore.state.isInitialized
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
