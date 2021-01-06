<template>
  <div class="h-screen bg-grey3">
    <Header />
    <div class="px-5">
      <router-view />
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
import Header from '@renderer/organisms/header/Header.vue'
import useModule from '@renderer/store/useModule'

const noop = () => {}

export default defineComponent({
  components: {
    Header
  },
  setup() {
    const router = useRouter()
    const userStore = useModule('User')
    watchEffect(() => {
      /** Watch the status here for redirection */
      const isUnlocked = userStore.state.isUnlocked
      const isInitialized = userStore.state.isInitialized
      console.log(userStore.state.step)

      switch (userStore.state.step) {
        case 1:
          return router.replace('/Installation')
        case 2:
          return router.replace('/SelectKeyNode')
        case 3:
          return router.replace('/SelectExistingKeyNode')
        case 4:
          return router.replace('/CreatePassword')
        case 5:
          return router.replace('/RecoveryCode')
        case 6:
          return router.replace('/ConfirmCode')
        case 7:
          return router.replace('/Congratulations')
        case 8:
          return router.replace('/Vaults')
        case 99:
          return router.replace('/AtomicDesign')
        default:
          break
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
