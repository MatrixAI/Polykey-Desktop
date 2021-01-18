<template>
  <div class="mt-3">
    <div class="flex bg-grey6 font-bold text-content2 py-3 px-3">
      <div class="w-1/12"><CheckBox /></div>
      <div class="w-4/12">Vault</div>
      <div class="w-1/12">Files</div>
      <div class="w-1/12">History</div>
      <div class="w-2/12">Shared with</div>
      <div class="w-2/12">Date Created</div>
      <div class="w-1/12 text-right">Actions</div>
    </div>

    <!-- Sample Content -->
    <div v-for="vault in vaultList" class="flex py-4 pl-3 border-b border-content4 border-opacity-50">
      <div class="w-1/12 flex items-center"><CheckBox /></div>
      <div class="w-4/12 flex">
        <div class="flex items-center">
          <div v-html="vault.icon" class="mr-1"></div>
        </div>
        <div class="flex flex-col cursor-pointer" @click="goToVault(vault.name)">
          <div class="text-primary1 font-bold opacity-90 mr-3">{{ vault.name }}</div>
          <div class="text-content1 text-xxs flex">
            <div class="font-bold">You&nbsp;</div>
            <div>commited 2 days</div>
          </div>
        </div>
      </div>
      <div class="w-1/12 flex items-center">3</div>
      <div class="w-1/12 flex items-center">5</div>
      <div class="w-2/12 flex items-center">
        <div v-html="vault.share1" class="mr-1 border border-content4"></div>
        <div v-html="vault.share2" class="mr-1 border border-content4"></div>
        +22
      </div>
      <div class="w-2/12 flex items-center">25/11/2020 11:30AM</div>
      <div class="w-1/12 flex flex-row justify-end items-center">
        <Download class="mr-2" />
        <Copy class="mr-2" />
        <More />
      </div>
    </div>

    <div>Pagination</div>
  </div>
</template>
<script>
/** Libs */
import { toSvg } from 'jdenticon';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { defineComponent, ref, watchEffect, onMounted } from 'vue';

/** Components */
import Control from '@/renderer/organisms/controls/Controls.vue';

/** Store */
import { actions as actionsJobs } from '@/renderer/store/modules/Vaults';

/** Assets */
import CheckBox from '@/renderer/assets/checkbox.svg';
import Download from '@/renderer/assets/download.svg';
import Copy from '@/renderer/assets/copy.svg';
import More from '@/renderer/assets/more.svg';

export default defineComponent({
  components: {
    CheckBox,
    Download,
    Copy,
    More
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    /** local state */
    const vaultList = ref([]);

    /**
     * Listen:
     * 1. Everytime there are changes in the store for vaults list
     * 2. Everytime there is search filter
     */
    watchEffect(() => {
      const vaults = store.state.Vaults.vaultNames;
      const searchFilter = store.state.Vaults.searchFilter;

      vaultList.value = Object.keys(vaults)
        .map(key => {
          let vaultName = vaults[key];
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
    });

    /**
     * Upon mounted get all the list of vaults
     */
    onMounted(() => {
      store.dispatch(actionsJobs.LoadVaultNames);
    });

    return {
      vaultList,
      goToVault: vault => {
        store.dispatch(actionsJobs.SelectVault, vault);
        return router.replace('/vaults/' + vault);
      }
    };
  }
});
</script>
