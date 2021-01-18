<template>
  <div class="flex">
    <!-- div class="w-3/4" -->
    <div class="w-full">
      <Control />
      <div class="h-body">
        <EmptyVault v-show="empty" />
        <div v-show="!empty">
          <div class="mt-5">
            <!-- Breadcrumbs, Filters and Sort To be decided if this is another organism-->
            <Filter />
            <!-- Content -->
            <VaultsList />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/** Libs */
import { defineComponent, ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { toSvg } from 'jdenticon';

/** Components */
import Control from '@/renderer/organisms/controls/Controls.vue';
import EmptyVault from '@/renderer/molecules/empty-vault/EmptyVault.vue';
import VaultsList from '@/renderer/organisms/vaults-list/VaultsList.vue';
import Filter from '@/renderer/molecules/filters/Filter.vue';

/** Store */
import { actions as actionsJobs } from '@/renderer/store/modules/Vaults';

export default defineComponent({
  components: {
    Control,
    Filter,
    EmptyVault,
    VaultsList
  },
  setup() {
    const store = useStore();

    /** local state */
    const empty = ref(true);

    /**
     * Listen:
     * 1. Everytime the vaults list change
     * 2. Show empty component if there are no vaults in the list
     * 3. If not empty the show vaults list component
     */
    watchEffect(() => {
      const vaults = store.state.Vaults.vaultNames;
      if (Object.keys(vaults).length) {
        empty.value = false;
      } else {
        empty.value = true;
      }
    });

    return {
      empty
    };
  }
});
</script>
<style scoped>
.h-body {
  height: calc(100vh - 42px - 75px);
}
</style>
