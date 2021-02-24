<template>
  <!-- Controls -->
  <div class="flex justify-between align-middle items-center mt-5">
      <!-- Left Header -->
      <div>
        <div class="text-content1 text-xl font-bold">Identities</div>
        <div>Gestalt Identities</div>
      </div>

      <!-- Right header -->
      <div class="flex">
        <!-- <div class="mr-2"><DefaultButton>PING</DefaultButton></div> -->
        <div><PrimaryButton @click="toggleAddKeynode">TRUST AN IDENTITY</PrimaryButton></div>
      </div>
  </div>
</template>
<script>
/** Libs */
import { defineComponent } from 'vue';
import { useStore, ref } from 'vuex';

/** Components */
import Search from '@renderer/molecules/search/Search.vue';
import PrimaryButton from '@renderer/atoms/button/PrimaryButton.vue';
import DefaultButton from '@renderer/atoms/button/DefaultButton.vue';

/** Store */
import { actions } from '@/renderer/store/modules/Gestalt';

export default defineComponent({
  components: {
    Search,
    PrimaryButton,
    DefaultButton
  },
  setup() {
    const store = useStore();

    const toggleAddKeynode = (event) => {
      event.preventDefault();
      console.log('dispatch')
      store.dispatch(actions.ToggleAddKeyNode);
    }

    return {
      toggleAddKeynode,
      updateFilter(event) {
        // Search here for all the gestalt
      }
    };
  }
});
</script>
