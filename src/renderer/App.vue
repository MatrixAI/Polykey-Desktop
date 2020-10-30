<template>
  <div style="background: LightGrey;">
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
      const userStatus = userStore.state.userStatus
      const isUnlocked = userStore.state.isUnlocked
      if (isUnlocked) {
        return noop()
      }
      switch (userStatus) {
        case 'RegisterNode':
          router.replace('/Configuration/RegisterNode')
          break
        case 'NewNode':
          router.replace('/Configuration/NewKeyNode')
          break
        case 'UnlockNode':
          router.replace('/Configuration/UnlockKeyNode')
          break
        default:
          break
      }
    })
    /**
     * Check user if isUnclocked if not need to run the polykeyclient
     */
    userStore.dispatch('checkUserStatus')
  }
})
</script>
