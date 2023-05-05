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
import type { PropType } from "vue";
/**
 * Libs
 */
import { defineComponent, onMounted, ref, watchEffect, nextTick } from "vue";
import type { Config } from "@/renderer/config";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

/** Store */
import { actions, STATUS } from "@/renderer/store/modules/Agent";

/** Components */
import Header from "@/renderer/organisms/header/Header.vue";

export default defineComponent({
  components: {
    Header,
  },
  props: {
    config: {
      type: Object as PropType<Config>,
      required: true,
    },
  },
  setup(props) {
    console.log('Renderer Config', props.config);

    const store = useStore();
    const router = useRouter();

    /** Local state */
    const authenticated = ref(false);

    watchEffect(() => {
      /** Watch the status here for redirection */
      const status = store.state.Agent.status;

      console.log("watching, found: ", status);
      switch (status) {
        case STATUS.PENDING:
          // Do some loader here
          return router.replace('/installation');
          break;
        case STATUS.UNINITIALIZED:
          return router.replace('/selectKeyNode');
          break;
        case STATUS.INITIALIZED:
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

    onMounted(async () => {
      /**
       * Check user if isUnlocked if not need to run the polykeyclient
       */
      // await store.dispatch(actions.SetKeynodePath, './tmp/keynode'); //FIXME default path.
      await store.dispatch(actions.CheckAgentStatus);
    });

    return {
      authenticated,
    };
  },
});
</script>
