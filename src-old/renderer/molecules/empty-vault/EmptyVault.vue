<template>
  <div class="flex flex-col justify-center items-center h-body">
    <Bulb class="mb-2" />
    <p class="text-center">To store your secrets in your <br />Keynode, start by creating a vault.</p>
  </div>
</template>
<script>
import Bulb from '@/renderer/assets/bulb.svg';
import { defineComponent } from 'vue';
export default defineComponent({
  components: {
    Bulb
  }
});
</script>
