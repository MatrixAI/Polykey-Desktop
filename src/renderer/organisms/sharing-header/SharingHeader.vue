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
        <!-- <div class="mr-2" @click="ping"><DefaultButton>PING</DefaultButton></div> -->
        <div><PrimaryButton @click="toggleAddKeynode">TRUST AN IDENTITY</PrimaryButton></div>
      </div>
  </div>
</template>
<script>
/** Libs */
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { useStore, ref } from 'vuex';

/** Components */
import Search from '@/renderer/molecules/search/Search.vue';
import PrimaryButton from '@/renderer/atoms/button/PrimaryButton.vue';
import DefaultButton from '@/renderer/atoms/button/DefaultButton.vue';
import Shake from '@/renderer/assets/shake.svg';

/** Store */
import { actions } from '@/renderer/store/modules/Gestalt';

export default defineComponent({
  components: {
    Search,
    PrimaryButton,
    DefaultButton,
    Shake
  },
  setup() {
    const store = useStore();
    let interval;

    const toggleAddKeynode = (event) => {
      event.preventDefault();
      store.dispatch(actions.ToggleAddKeyNode);
    }

    const ping = () => {
      store.dispatch(actions.PingNodes);
    }

    onMounted(()=>{
      interval = setInterval(()=>{
        store.dispatch(actions.PingNodes);
      },2000)
    })

    onBeforeUnmount(()=>{
      clearInterval(interval)
    })

    return {
      toggleAddKeynode,
      ping,
      updateFilter(event) {
        // Search here for all the gestalt
      }
    };
  }
});
</script>
