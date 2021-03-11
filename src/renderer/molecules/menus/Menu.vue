<template>
  <div class="relative">
    <More class="cursor-pointer" @click="showMenus"/>
    <div v-if="show" class="absolute right-0 top-30 bg-white rounded-md pl-4 pr-10 py-4 shadow-md">
      <ul class="list-none font-bold text-content2">
        <li class="cursor-pointer mb-2" @click="open">Open</li>
        <li class="cursor-pointer mb-2">Rename</li>
        <li class="cursor-pointer mb-2">Share</li>
        <li class="cursor-pointer text-sematic1" @click="deleteVault">Delete</li>
      </ul>
    </div>
  </div>
</template>
<script>
/** Libs */
import { defineComponent, ref } from 'vue';

/** Assets */
import More from '@/renderer/assets/more.svg';

export default defineComponent({
  components: {
    More
  },
  props: {
    open : {
      type: Function
    },
    delete: {
      type: Function
    }
  },
  setup(props) {
    const show = ref(false)

    return {
      show,
      open : () => {
        props.open();
        show.value = false;
      },
      deleteVault : () => {
        props.delete();
        show.value = false;
      },
      showMenus: () =>{
        show.value = !show.value;
      }
    };
  }
});
</script>
