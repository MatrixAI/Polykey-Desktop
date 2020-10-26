<template>
  <div style='background: LightGrey;'>
    <div>
      <!-- <Login /> -->
        <Alert />
        <Drawer />
        <AppBar />
        <router-view />
        <!-- <Footer /> -->
    </div>
  </div>
</template>

<script lang='ts'>
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

export default defineComponent({
  components: {
    Alert,
    AppBar,
    Drawer
    // Footer
    // Login
  }
})
</script>
