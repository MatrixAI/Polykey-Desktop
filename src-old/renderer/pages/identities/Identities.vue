<template>
  <div class="flex">
    <div
      :class="[
        'h-body-drawer overflow-y-scroll px-5 transition-width duration-300 ease-in-out',
        showDrawer || pullVaultDrawer ? 'w-2/3' : 'w-full'
      ]"
    >
      <SharingControls />
      <div v-if="!expandSearchBar" class="h-full mt-8">
        <SharingHeader />
        <!-- Gestalt identities -->
        <template v-for="gestalt in gestalts" :key="gestalt.id">
          <Gestalt :gestalt="gestalt" />
        </template>
      </div>
      <div v-else class="flex flex-col">
        <div class="mt-5 mb-3">Search results:</div>
        <div v-if="!foundDI.length">No match</div>
        <template v-for="di in foundDI" :key="di">
          <div class="flex justify-between items-center">
            <div class="flex items-center mb-3">
              <Github class="mr-2 h-8 border-2 p-1" />
              <span>{{ di }}</span>
            </div>
            <div><PrimaryButton @click="addIdentity(di, $event)">ADD IDENTITY</PrimaryButton></div>
          </div>
        </template>
      </div>
    </div>
    <div
      :class="[
        'transition-width duration-300 ease-in-out bg-content2 bg-opacity-10',
        showDrawer || pullVaultDrawer ? 'w-1/3' : 'w-0'
      ]"
    >
      <AddKeynode v-if="showDrawer" />
      <PullVault v-if="pullVaultDrawer" />
    </div>
  </div>
</template>
<script>
/** Libs */
import PolykeyClient from '@/renderer/resources/client';
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

/** Components */
import SharingControls from '@/renderer/organisms/sharing-controls/SharingControls.vue';
import SharingHeader from '@/renderer/organisms/sharing-header/SharingHeader.vue';
import AddKeynode from '@/renderer/organisms/add-keynode/AddKeynode.vue';
import Gestalt from '@/renderer/organisms/gestalt/Gestalt.vue';
import PullVault from '@/renderer/organisms/gestalt/PullVault.vue';
import DefaultButton from '@/renderer/atoms/button/DefaultButton.vue';
import PrimaryButton from '@/renderer/atoms/button/PrimaryButton.vue';

/** Assets */
import Github from '@/renderer/assets/github.svg';

/** Store */
import { actions } from '@/renderer/store/modules/Gestalt';

export default defineComponent({
  components: {
    SharingControls,
    SharingHeader,
    AddKeynode,
    Gestalt,
    PullVault,
    Github,
    DefaultButton,
    PrimaryButton
  },
  setup() {
    const store = useStore();
    const showDrawer = computed(() => store.state.Gestalt.addKeynodeDrawer);
    const pullVaultDrawer = computed(() => store.state.Gestalt.pullVaultDrawer);
    const expandSearchBar = computed(() => store.state.Gestalt.searchMode);
    const gestalts = computed(() => store.state.Gestalt.gestalts);
    const foundDI = computed(() => store.state.Gestalt.foundDI);

    onMounted(() => {
      store.dispatch(actions.GetGestalts);
    });

    return {
      gestalts,
      showDrawer,
      pullVaultDrawer,
      expandSearchBar,
      foundDI,
      addIdentity: async ( key, event ) => {
        try {
          await PolykeyClient.GestaltsSetIdentity({s: key});
          store.dispatch(actions.SearchMode, false);
          store.dispatch(actions.GetGestalts);
        } catch (e) {
          console.log(e);
        }
      }
    };
  }
});
</script>
<style scoped>
.h-body-drawer {
  height: calc(100vh - 42px);
}
</style>
