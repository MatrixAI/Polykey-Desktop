<template>
  <!-- Controls -->
  <div class="flex justify-between align-middle items-center mt-5">
    <div v-if="!expandSearchBar">
      <ul class="list-none text-sm">
        <li class="float-left cursor-pointer font-bold text-primary1 border-opacity-10 pr-3">
          Gestalt
        </li>
        <!-- <li class="float-left cursor-pointer text-content2 pl-3">Keynodes</li> -->
      </ul>
    </div>
    <div :class="['flex flex-col', expandSearchBar ? 'w-full' : '']">
      <div class="pr-2 w-full flex items-center">
        <Search @click="expandSearch" @input="updateFilter" v-on:keyup.enter="search" type="large" full />
        <div v-if="expandSearchBar" class="px-3 primary2 text-primary2 font-bold cursor-pointer" @click="closeSearch">
          Close&nbsp;search
        </div>
      </div>

      <div v-if="expandSearchBar" class="flex items-center mt-2">
        <div class="text-xs text-gray font-bold mr-3">Search through:</div>
        <div>
          <div class="flex items-center border-1 border-content3 bg-content4 p-1">
            <Github class="mx-2 h-4"/>
            <span class="text-sm text-content1 pr-2">Github</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
/** Libs */
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';

/** Components */
import Search from '@/renderer/molecules/search/Search.vue';

/** Store */
import { actions } from '@/renderer/store/modules/Gestalt';

/** Assets */
import Github from '@/renderer/assets/github.svg';

export default defineComponent({
  components: {
    Search,
    Github
  },
  setup() {
    const store = useStore();
    const searchFilter = ref('');
    const expandSearchBar = computed(() => store.state.Gestalt.searchMode);

    return {
      expandSearchBar,
      search: () => {
        store.dispatch(actions.SearchDI, searchFilter.value);
      },
      closeSearch: () => {
        store.dispatch(actions.SearchMode, false);
      },
      expandSearch: () => {
        store.dispatch(actions.SearchMode, true);
      },
      updateFilter(event) {
        searchFilter.value = event.target.value
      }
    };
  }
});
</script>
