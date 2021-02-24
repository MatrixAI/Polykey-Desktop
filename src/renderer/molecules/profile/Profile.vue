<template>
  <div class="flex items-center mr-1">
    <!-- This will be derived from public key -->
    <div v-html="identity" class="cursor-pointer mr-1 rounded-md border border-content4"></div>
    <CarretDown v-if="!profileOpen" class="cursor-pointer" />
    <CarretUp v-else class="cursor-pointer" />
  </div>
</template>
<script>
import { toSvg } from 'jdenticon';
import CarretDown from '@renderer/assets/carret-down.svg';
import CarretUp from '@renderer/assets/carret-up.svg';
import { defineComponent, toRefs, computed } from 'vue';

export default defineComponent({
  components: {
    CarretDown,
    CarretUp
  },
  props: {
    profileOpen: {
      type: Boolean
    }
  },
  setup(props) {
    const profile = computed(() => store.state.User.localPeerInfo);
    const { profileOpen } = toRefs(props);

    return {
      profileOpen,
      identity: toSvg(profile.peerId, 29)
    };
  }
});
</script>
