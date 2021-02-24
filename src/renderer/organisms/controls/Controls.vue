<template>
  <!-- Controls -->
  <div class="flex justify-between align-middle items-center mt-5">
    <div>
      <ul class="list-none text-sm">
        <li :class="['float-left cursor-pointer', path.match(/vaults/) ? active : inactive ]"
            @click="goto('/vaults')">
          My Vaults
        </li>
        <!-- <li :class="['float-left cursor-pointer border-r border-content2 border-opacity-10 pr-3', path.match(/vaults/) ? active : inactive ]"
            @click="goto('/vaults')">
          My Vaults
        </li> -->
        <!-- <li :class="['float-left cursor-pointer pl-3', path.match(/sharing/) ? active : inactive]"
            @click="goto('/sharing')">
          Shared with Me
        </li> -->
      </ul>
    </div>
    <div class="flex">
      <div class="pr-2"><Search @input="updateFilter" type="large" /></div>
      <CreateVault v-if="path.match(/vaults/)"/>
    </div>
  </div>
</template>
<script>
/** Libs */
import { defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

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
    const router = useRouter();
    const route = useRoute();
    const path = ref(router.currentRoute.value.path);
    const active = 'font-bold text-primary1';
    const inactive = 'text-content2';

    watch(
      () => route.path,
      async newPath => {
        path.value = newPath;
      }
    );

    return {
      path,
      active,
      inactive,
      goto: path => {
        router.replace(path);
      },
      updateFilter(event) {
        store.dispatch(actions.SearchFilter, event.target.value);
      }
    };
  }
});
</script>
