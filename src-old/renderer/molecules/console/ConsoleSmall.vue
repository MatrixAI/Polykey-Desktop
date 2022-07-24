<template>
  <div class="w-1/3 flex flex-col items-center bg-grey7 p-8">
    <div class="mt-5 mb-8"><Logo /></div>
    <div class="bg-grey8 bg-opacity-10 w-full p-5 text-primary4 text-xs font-robotomono">
      <p v-for="event in events">{{ event.action }} <span>{{ event.name }}...</span></p>
    </div>
  </div>
</template>

<script lang="ts">
/** Libs */
import { defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";

/** Store */
// import { actions } from '@/renderer/store/modules/Nodes';


/** Assets */
import Logo from "@/renderer/assets/logo2.svg";

export default defineComponent({
  components: {
    Logo,
  },

  setup() {
    const store = useStore();
    const events = ref([]);

    watchEffect(() => {
      const storeEvents =  store.state.Bootstrap.events;
      console.log(storeEvents);
      events.value = storeEvents;
    });

    return {
      events,
    };
  }
});
</script>
