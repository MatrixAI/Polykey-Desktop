<template>
  <div class="flex px-5">
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
            <VaultsList :vaults="vaults" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/** Libs */
import { defineComponent, ref, reactive, watchEffect, onMounted } from 'vue';
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
    const vaults = ref([]);

    /**
     * Listen:
     * 1. Everytime the vaults list change
     * 2. Show empty component if there are no vaults in the list
     * 3. If not empty the show vaults list component
     */
    watchEffect(() => {
      const storeVaults = store.state.Vaults.vaultNames;
      const searchFilter = store.state.Vaults.searchFilter;

      vaults.value = Object.keys(storeVaults)
        .map(key => {
          let vaultName = storeVaults[key];
          if (vaultName.toUpperCase().match(searchFilter.toUpperCase())) {
            return {
              name: vaultName,
              icon: toSvg(vaultName, 34),
              share1: toSvg(vaultName + 'a', 22),
              share2: toSvg(vaultName + 'b', 22)
            };
          }
        })
        .filter(vault => {
          return !!vault;
        });

      if (Object.keys(vaults.value).length) {
        empty.value = false;
      } else {
        empty.value = true;
      }
    });

    onMounted(() => {
      store.dispatch(actionsJobs.LoadVaultNames);
    });

    return {
      empty,
      vaults
    };
  }
});
</script>
<style scoped>
.h-body {
  height: calc(100vh - 42px - 75px);
}
</style>
