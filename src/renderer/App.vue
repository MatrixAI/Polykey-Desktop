<template>
  <div class="h-screen bg-grey3">
    <Header v-show="authenticated" />
    <div v-if="authenticated">
      <router-view />
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
/**
 * Libs
 */
import { defineComponent, watchEffect, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

/** Store */
import { STATUS, actions } from '@/renderer/store/modules/User';

/** Components */
import Header from '@/renderer/organisms/header/Header.vue';

export default defineComponent({
  components: {
    Header
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    /** Local state */
    const authenticated = ref(false);

    watchEffect(() => {
      /** Watch the status here for redirection */
      const status = store.state.User.status;

      switch (status) {
        case STATUS.PENDING:
          // Do some loader here
          return router.replace('/installation');
          break;
        case STATUS.UNINITIALIZED:
          return router.replace('/selectKeyNode');
          break;
        case STATUS.LOCKED:
          return router.replace('/selectExistingKeyNode');
          break;
        case STATUS.ONLINE:
          authenticated.value = true;
          if (
            router.currentRoute.value.path == '/selectKeyNode' ||
            router.currentRoute.value.path == '/selectExistingKeyNode' ||
            router.currentRoute.value.path == '/installation'
          ) {
            // return router.replace('/gestalt-profile');
            // return router.replace('/identities');
            return router.replace('/vaults');
          }
          break;
        default:
      }
    });

    onMounted(() => {
      /**
       * Check user if isUnlocked if not need to run the polykeyclient
       */
      store.dispatch(actions.CheckUserStatus);
    });

    return {
      authenticated
    };
  }
});
</script>
