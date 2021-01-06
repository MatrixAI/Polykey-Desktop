<template>
  <div class="flex justify-between align-middle items-center shadow-p1 h-header font-opensans">
    <!-- Left -->
    <div class="flex">
      <div class="flex items-center justify-between w-12 mx-5">
        <Action />
        <Action />
        <Action />
      </div>
      <div class="flex items-center">
        <Navigation />
      </div>
    </div>
    <!-- Right -->
    <div class="flex">
      <div class="flex cursor-pointer items-center border-r h-header border-content2 border-opacity-10 pr-3">
        <Search />
      </div>
      <div class="flex cursor-pointer items-center border-r h-header border-content2 border-opacity-10 px-3">
        <Notification />
      </div>
      <div class="flex cursor-pointer items-center border-r h-header border-content2 border-opacity-10 px-3">
        <Setting />
      </div>
      <div class="flex items-center h-header px-3">
        <Profile />
      </div>
    </div>
  </div>
</template>
<script>
import Action from '@/renderer/assets/action.svg'
import Navigation from '@/renderer/molecules/navigation/Navigation.vue'
import Search from '@/renderer/molecules/search/Search.vue'
import Notification from '@/renderer/molecules/notification/Notification.vue'
import Setting from '@/renderer/molecules/setting/Setting.vue'
import Profile from '@/renderer/molecules/profile/Profile.vue'

import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    Navigation,
    Search,
    Action,
    Notification,
    Setting,
    Profile
  }
})
</script>
