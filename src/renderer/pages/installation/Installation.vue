<template>
  <div class="flex flex-col">
    <div class="flex flex-col h-70vh justify-center items-center">
      <div>
        <Logo />
      </div>
      <div class="font-nunito font-bold text-2xl leading-7 tracking-widest my-2">POLYKEY</div>
      <div class="font-nunito opacity-40 text-sm">A one-liner descriptor about the app</div>
    </div>
    <div class="flex flex-col h-30vh justify-center items-center">
      <Console />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Console from '@renderer/molecules/console/Console.vue'
import Logo from '@renderer/assets/logo.svg'

export default defineComponent({
  components: {
    // Logo
    Console,
    Logo
  },
  setup() {
    console.log('awdawd')
    // console.log(Logo)
    return {}
  }
})
</script>
