<template>
  <!-- Controls -->
  <div class="flex justify-between align-middle items-center mt-5">
    <div>
      <ul class="list-none text-sm">
        <li class="float-left cursor-pointer font-bold text-primary1 border-r border-content2 border-opacity-10 pr-3">
          My Vaults
        </li>
        <li class="float-left cursor-pointer text-content2 pl-3">Shared with Me</li>
      </ul>
    </div>
    <div class="flex">
      <div class="pr-2"><Search @input="updateFilter" type="large" /></div>
      <CreateVault />
    </div>
  </div>
</template>
<script>
/** Libs */
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

/** Components */
import Search from '@renderer/molecules/search/Search.vue';
import CreateVault from '@renderer/molecules/create-vault/CreateVault.vue';

/** Store */
import { actions } from '@renderer/store/modules/Vaults';

export default defineComponent({
  components: {
    Search,
    CreateVault
  },
  setup() {
    const store = useStore();

    return {
      updateFilter(event) {
        store.dispatch(actions.SearchFilter, event.target.value);
      }
    };
  }
});
</script>
