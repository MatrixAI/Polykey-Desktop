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
import { defineComponent } from 'vue'
import Alert from './components/alerts/Alert.vue'
import AppBar from './components/navigation/AppBar.vue'
import Drawer from './components/navigation/Drawer.vue'
// import Footer from './components/navigation/Footer.vue'
// import NewVault from './components/vaults/NewVault.vue'
// import Login from './components/navigation/Login.vue';

import useModule from '@/store/useModule'

export default defineComponent({
  components: {
    Alert,
    AppBar,
    Drawer
    // Footer
    // Login
  },
  setup() {
    const alertModule = useModule('Alert')
    console.log(alertModule.state)
    alertModule.dispatch('toggle')
  }
})
</script>
