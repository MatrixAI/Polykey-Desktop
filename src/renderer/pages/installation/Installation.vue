<template>
  <div class="flex flex-col bg-grey7">
    <div class="flex flex-col h-70vh justify-center items-center">
      <div>
        <Logo />
      </div>
    </div>
    <div class="flex flex-col h-30vh justify-center items-center">
      <Console />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Console from '@renderer/molecules/console/Console.vue';
import Logo from '@renderer/assets/logo.svg';

export default defineComponent({
  components: {
    Console,
    Logo
  }
});
</script>
