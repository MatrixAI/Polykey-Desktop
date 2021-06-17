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
<!--        <Search />-->
      </div>
      <div class="flex cursor-pointer items-center border-r h-header border-content2 border-opacity-10 px-3">
        <Notification />
      </div>
      <div class="flex cursor-pointer items-center border-r h-header border-content2 border-opacity-10 px-3">
        <Setting />
      </div>
      <div class="flex items-center h-header px-3">
        <Profile @click="toggleOpen" :profileOpen="profileOpen" />
        <div class="relative">
          <div
            :class="[
              profileOpen ? show : hide,
              'transition duration-500 ease-in-out absolute rounded-md right-0 top-7 bg-white shadow-p2 text-content6 font-bold'
            ]"
          >
            <a class="block pt-3 pb-2 px-4" @click="goToVault('/gestalt-profile')">Gestalt&nbsp;Profile</a>
            <a class="block py-1 px-4">Settings</a>
            <a class="block pt-2 pb-3 px-4">Logout</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/** Libs */
import { useRouter } from 'vue-router';
import { defineComponent, ref } from 'vue';

/** Components */
import Action from '@/renderer/assets/action.svg';
import Navigation from '@/renderer/molecules/navigation/Navigation.vue';
import Search from '@/renderer/molecules/search/Search.vue';
import Notification from '@/renderer/molecules/notification/Notification.vue';
import Setting from '@/renderer/molecules/setting/Setting.vue';
import Profile from '@/renderer/molecules/profile/Profile.vue';

export default defineComponent({
  components: {
    Navigation,
    Search,
    Action,
    Notification,
    Setting,
    Profile
  },
  setup() {
    const router = useRouter();
    const profileOpen = ref(false);

    const hide = 'transform opacity-0 scale-95 -z-10';
    const show = 'transform opacity-100 scale-100 z-10';

    const toggleOpen = () => {
      profileOpen.value = !profileOpen.value;
    };

    return {
      hide,
      show,
      toggleOpen,
      profileOpen,
      goToVault: (path) => {
        toggleOpen();
        return router.replace(path);
      }
    };
  }
});
</script>
